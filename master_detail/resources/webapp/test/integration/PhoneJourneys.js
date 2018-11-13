jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

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
		"lines/test/integration/NavigationJourneyPhone",
		"lines/test/integration/NotFoundJourneyPhone",
		"lines/test/integration/BusyJourneyPhone"
	], function () {
		QUnit.start();
	});
});