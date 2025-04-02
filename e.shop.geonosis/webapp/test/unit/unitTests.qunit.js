/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/geonosis/shop/e/shop/geonosis/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
