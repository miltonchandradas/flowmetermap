sap.ui.define([
	"sap/ui/test/Opa5",
	"com/aqua/h2oflowmetermap/localService/mockserver"
], function (Opa5, mockserver) {
	"use strict";

	return Opa5.extend("com.aqua.h2oflowmetermap.test.integration.arrangements.Startup", {

		iStartMyApp: function (oOptionsParameter) {
			var oOptions = oOptionsParameter || {};

			// start the app with a minimal delay to make tests fast but still async to discover basic timing issues
			oOptions.delay = oOptions.delay || 50;

			// configure mock server with the current options
			var oMockServerInitialized = mockserver.init(oOptions);

			this.iWaitForPromise(oMockServerInitialized);

			// start the app UI component
			this.iStartMyUIComponent({
				componentConfig: {
					name: "com.aqua.h2oflowmetermap",
					async: true
				},
				hash: oOptions.hash,
				autoWait: oOptions.autoWait
			});
		}
	});
});
