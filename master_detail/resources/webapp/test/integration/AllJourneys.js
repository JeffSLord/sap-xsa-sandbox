jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 LINES in the list

sap.ui.require([
	"sap/ui/test/Opa5",
	"lines/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"lines/test/integration/pages/App",
	"lines/test/integration/pages/Browser",
	"lines/test/integration/pages/Master",
	"lines/test/integration/pages/Detail",
	"lines/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "lines.view."
	});

	sap.ui.require([
		"lines/test/integration/MasterJourney",
		"lines/test/integration/NavigationJourney",
		"lines/test/integration/NotFoundJourney",
		"lines/test/integration/BusyJourney",
		"lines/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});