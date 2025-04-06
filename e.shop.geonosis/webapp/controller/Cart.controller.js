sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/geonosis/shop/e/shop/geonosis/model/products",
     "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
  ], (Controller, products,JSONModel, Device) => {
    "use strict";
  
    return Controller.extend("com.geonosis.shop.e.shop.geonosis.controller.Cart", {
      onInit: function() {
        let oProductsModel = products.createProductsModel(this.getOwnerComponent());
        this.getView().setModel(oProductsModel, "products");

        let sGridLayout;
      
        if (Device.system.desktop) {
          sGridLayout = "2fr 1fr"; // Dos columnas
        } else {
          sGridLayout = "1fr"; // Una sola columna en dispositivos móviles o tablets
        }
        
        console.log(sGridLayout);
        var oLayoutModel = new JSONModel({
          gridTemplateColumns: sGridLayout
        });
  
        // Asignar el modelo a la vista
        this.getView().setModel(oLayoutModel, "layoutModel");
      }
    });
  });