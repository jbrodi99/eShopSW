sap.ui.define([
    "sap/ui/core/UIComponent",
    "com/geonosis/shop/e/shop/geonosis/model/models",
    "com/geonosis/shop/e/shop/geonosis/model/products"
], (UIComponent, models, products) => {
    "use strict";

    return UIComponent.extend("com.geonosis.shop.e.shop.geonosis.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");
         
            this.setModel(models.createResponsiveModel(this), "settingsResponsive");
            
            this.getModel("catalog").attachRequestCompleted(() => {
                this.setModel(products.createProductsModel(this, "products"), "products");
            });

            // this.setModel(products.createProductsModel(this, "products"));

            // enable routing
            this.getRouter().initialize();
        }
    });
});