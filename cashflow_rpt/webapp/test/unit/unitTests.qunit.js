/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"cashflow/cashflow_rpt/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
