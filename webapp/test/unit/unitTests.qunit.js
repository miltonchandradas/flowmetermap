/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comaqua/h2oflowmetermap/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
