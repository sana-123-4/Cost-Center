/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"costglrpt/cost_gl_report/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
