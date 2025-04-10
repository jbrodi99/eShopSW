sap.ui.define([
    "com/geonosis/shop/e/shop/geonosis/controller/BaseController",
    "com/geonosis/shop/e/shop/geonosis/model/products",
     "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
  ], (BaseController, products,JSONModel, Device) => {
    "use strict";
  
    return BaseController.extend("com.geonosis.shop.e.shop.geonosis.controller.Cart", {
      onInit: function() {
        let oProductsModel = products.createProductsModel(this.getOwnerComponent());
        this.getView().setModel(oProductsModel, "products");

        let sDirection;

        let oView = this.getView();
        let oScrollContainer = oView.byId("myScrollContainer");
      
        if (Device.system.desktop) {
          sDirection = "Row"; // Dos columnas
          oScrollContainer.addStyleClass("stickyTop");
        } else {
          sDirection = "Column"; // Una sola columna en dispositivos móviles o tablets
          oScrollContainer.addStyleClass("stickyBottom");
        }
        
        let oLayoutModel = new JSONModel({
          flexDirection: sDirection,
          growLeft: Device.system.desktop ? 6 : 1,
          growRight: Device.system.desktop ? 4 : 1,
        });
  
        // Asignar el modelo a la vista
        this.getView().setModel(oLayoutModel, "layoutModel");
      }
    });
  });