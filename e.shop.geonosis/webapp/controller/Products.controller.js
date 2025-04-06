sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/geonosis/shop/e/shop/geonosis/model/products"
  ], (Controller, products) => {
    "use strict";
  
    return Controller.extend("com.geonosis.shop.e.shop.geonosis.controller.Products", {
      onInit: function() {
        // this.getOwnerComponent().getRouter().getRoute("products").attachPatternMatched(this._onRouteMatched, this);
        // console.log("cargue la ruta");
        let oProductsModel = products.createProductsModel(this.getOwnerComponent());
        this.getView().setModel(oProductsModel, "products");
      }


      
      // _onRouteMatched: function (oEvent) {
      //   const subcategoryId = oEvent.getParameter("arguments").subcategoryId;
      
      //   const oProductsModel = products.createFilteredProductsModel(this.getOwnerComponent(), subcategoryId);
      
      //   this.getView().setModel(oProductsModel, "products");
      // }
    });
  });