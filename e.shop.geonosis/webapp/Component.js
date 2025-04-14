sap.ui.define([
    "sap/ui/core/UIComponent",
    "com/geonosis/shop/e/shop/geonosis/model/models",
    "com/geonosis/shop/e/shop/geonosis/model/products",
    "com/geonosis/shop/e/shop/geonosis/model/Cart"
], (UIComponent, models, products, Cart) => {
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

            this.getModel("catalog").attachRequestCompleted(() => {
                this.setModel(Cart.createCartModel(this.getModel("catalog").getProperty("/cart")), "cart");
            });

            // enable routing
            this.getRouter().initialize();
        }
    });
});