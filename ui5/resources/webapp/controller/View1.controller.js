sap.ui.define(["sap/ui/core/mvc/Controller"], function(Controller) {
	"use strict";
	return Controller.extend("sandbox.ui5.controller.View1", {
		/**
		 *@memberOf sandbox.ui5.controller.View1
		 */
		onInit: function() {
			console.log("INITING");
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData({
				appName: "Demo Application",
				test2: "application"
			});
			this.getView().setModel(oModel, "appModel");
			// This model 
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData({
				fileName: "",
				text: "",
				cleanText:"",
				lines: [],
				cleanLines: []
			});
			this.getView().setModel(oModel, "currentFileModel");
			var oModel = new sap.ui.model.odata.v2.ODataModel("/xsodata/lines.xsodata/");
			this.getView().setModel(oModel, "lineModel");
			var oTable = this.getView().byId("sTable");
			oTable.setModel(oModel);
		},
		onAfterRendering: function() {
			console.log("done rendering.");
		},
		action: function(oEvent) {
			var that = this;
			var actionParameters = JSON.parse(oEvent.getSource().data("wiring").replace(/'/g, "\""));
			var eventType = oEvent.getId();
			var aTargets = actionParameters[eventType].targets || [];
			aTargets.forEach(function(oTarget) {
				var oControl = that.byId(oTarget.id);
				if (oControl) {
					var oParams = {};
					for (var prop in oTarget.parameters) {
						oParams[prop] = oEvent.getParameter(oTarget.parameters[prop]);
					}
					oControl[oTarget.action](oParams);
				}
			});
			var oNavigation = actionParameters[eventType].navigation;
			if (oNavigation) {
				var oParams = {};
				(oNavigation.keys || []).forEach(function(prop) {
					oParams[prop.name] = encodeURIComponent(JSON.stringify({
						value: oEvent.getSource().getBindingContext(oNavigation.model).getProperty(prop.name),
						type: prop.type
					}));
				});
				if (Object.getOwnPropertyNames(oParams).length !== 0) {
					this.getOwnerComponent().getRouter().navTo(oNavigation.routeName, oParams);
				} else {
					this.getOwnerComponent().getRouter().navTo(oNavigation.routeName);
				}
			}
		},
		/**
		 *@memberOf sandbox.ui5.controller.View1
		 */
		copyButton: function() {
			var txt = this.getView().byId("ocrText").getText();
			navigator.clipboard.writeText(txt).then(function() {
				console.log('Async: Copying to clipboard was successful!');
				sap.m.MessageToast.show("Text copied to clipboard.", {});
			}, function(err) {
				console.error('Async: Could not copy text: ', err);
			});
		},
		uploadFile: function(oEvent) {
			// Collect input data
			var fileUploader = this.getView().byId("fileUploader");
			var busyIndicator = this.getView().byId("busyIndicator");
			var textPanel = this.getView().byId("textPanel");
			var tablePanel = this.getView().byId("tablePanel");
			var settingsPanel = this.getView().byId("settingsPanel");
			var txtButton = this.getView().byId("txtButton");
			var xmlButton = this.getView().byId("xmlButton");
			var pageSegModeBox = this.getView().byId("pageSegModeBox");
			var modelTypeBox = this.getView().byId("modelTypeBox");
			var output_type;
			var ocrText = this.getView().byId("ocrText");
			if (txtButton.getSelected()) {
				output_type = "txt";
			} else {
				output_type = "xml";
			}
			if (!fileUploader.getValue()) {
				sap.m.MessageToast.show("Choose a file first");
				return;
			}
			var that = this;

			//Create options as per api
			var options = {
				"lang": "en",
				"outputType": output_type,
				"pageSegMode": pageSegModeBox.getSelectedKey(),
				"modelType": modelTypeBox.getSelectedKey()
			};
			var optionsStringy = JSON.stringify(options);
			// Collect uploaded file
			var domRef = fileUploader.getFocusDomRef();
			var file = domRef.files[0];
			var fileName = file.name;
			// Add to the currentFileModel
			var oModel = this.getView().getModel("currentFileModel");
			oModel.setProperty('/fileName', fileName);
			oModel.refresh();
			// Create FormData and append required data
			var formData = new FormData();
			formData.append("files", file, fileName);
			formData.append("options", optionsStringy);
			ocrText.setText("");
			settingsPanel.setExpanded(false);
			busyIndicator.setVisible(true);
			textPanel.setExpanded(true);
			textPanel.setBusy(true);
			tablePanel.setBusy(true);
			console.log("[INFO] Calling ocr api with options...");
			$.ajax({
				url: 'https://sandbox.api.sap.com/ml/ocr/ocr/',
				timeout: 360000,
				headers: {
					'apiKey': 'QEkc0UduJQtxhBA3oVAdbpzCda0qFPSe',
					'Accept': 'application/json'
				},
				'Accept': 'application/json',
				type: 'post',
				contentType: false,
				processData: false,
				// formData:form,
				data: formData,
				success: (data) => {
					console.log("[INFO] OCR Successful.");
					var textRes = data['predictions'][0];
					oModel.setProperty('/text', textRes);
					var lines = textRes.split("\n");
					// Push empty and filled lines
					for (var i = 0; i < lines.length; i++) {
						oModel.getProperty('/lines').push(lines[i]);
					}
					var cleanedArr = this.cleanLines(lines);
					var cleanString = "";
					// Push only non-empty lines
					for (var i = 0; i < cleanedArr.length; i++) {
						cleanString += cleanedArr[i] + '\n';
						oModel.getProperty('/cleanLines').push(cleanedArr[i]);
					}
					oModel.setProperty('/cleanText', cleanString);
					console.log("[INFO] Deleting line table...");
					$.ajax({
						url: '/node/ocr/line/',
						timeout: 360000,
						type: 'delete',
						data: {
							fileName: oModel.getProperty('/fileName')
						},
						success: () => {
							this.getView().getModel('lineModel').refresh();
							console.log("[INFO] Line model refreshed.");
							console.log("[INFO] Inserting page to table...");
							var newData = {
								fileName: oModel.getProperty('/fileName'),
								text: cleanString
							};
							// Insert to Page table (Filename, text)
							$.ajax({
								url: '/node/ocr/page/',
								type: 'post',
								data: newData,
								success: (data) => {
									console.log("[INFO] Successfully inserted page.");
								},
								error: (err) => {
									console.log("[ERROR] Inserting page: ", err);
								}
							});
							console.log("[INFO] Inserting lines to table...");
							for (var i = 0; i < cleanedArr.length; i++) {
								var newData = {
									fileName: oModel.getProperty('/fileName'),
									pageNum: '1',
									lineNum: i,
									line: cleanedArr[i]
								};
								$.ajax({
									url: '/node/ocr/line/',
									timeout: 3600,
									type: 'post',
									data: newData,
									success: (data) => {
										this.getView().getModel('lineModel').refresh();
									},
									error: (err) => {
										console.log("[ERROR] Inserting line:", err);
									}
								});
							}
						},
						error: (err) => {
							console.log("[ERROR] Deleting table:", err);
						}
					});
					
					// Update UI, refresh models
					oModel.refresh();
					this.getView().getModel('lineModel').refresh();
					console.log(oModel);
					ocrText.setText(cleanString);
					ocrText.setVisible(true);
					busyIndicator.setVisible(false);
					textPanel.setBusy(false);
					tablePanel.setBusy(false);
				},
				error: (err) => {
					console.log("[ERROR] Calling OCR API: ", err);
				}
			});
		},

		cleanLines: function(lines) {
			var cleaned = "";
			var cleaned = [];
			for (var i = 0; i < lines.length; i++) {
				if (lines[i].replace(/\s/g, "").length > 0) {
					cleaned.push(lines[i]);
				}
			}
			return cleaned;
		}
	});
});