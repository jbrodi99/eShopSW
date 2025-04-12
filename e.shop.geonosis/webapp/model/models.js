sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
],
    function (JSONModel, Device) {
        "use strict";

        return {            
            /**
             * Provides runtime information for the device the UI5 app is running on as a JSONModel.
             * @returns {sap.ui.model.json.JSONModel} The device model.
             */
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },

            createResponsiveModel: function (oComponent) {
                let sInitialMedia = sap.ui.Device.media.getCurrentRange("Std").name;
                let iItemsPerPage = sInitialMedia === "Desktop" ? 4 :
                                    sInitialMedia === "Tablet" ? 2 : 1;
                                    
                let oSettingsModel = new JSONModel({
                    carouselItemsPerPage: iItemsPerPage
                    });
                
                this.onMediaChange(function (oEvent) {
                    const sMedia = oEvent.name; 
                    const iNewItems = sMedia === "Desktop" ? 4 :
                                      sMedia === "Tablet"  ? 2 : 1;
                                      
                    oComponent.getModel("settingsResponsive").setProperty("/carouselItemsPerPage", iNewItems);
                });

                oSettingsModel.setDefaultBindingMode("OneWay");
                return oSettingsModel;
            },

            onMediaChange: function (fnCallback) {
                Device.media.attachHandler(fnCallback);
            }

        
        };

    });