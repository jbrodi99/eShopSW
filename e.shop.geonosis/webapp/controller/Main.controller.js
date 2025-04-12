sap.ui.define([
    "com/geonosis/shop/e/shop/geonosis/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (BaseController, JSONModel, Fragment, Filter, FilterOperator ) => {
    "use strict";

    return BaseController.extend("com.geonosis.shop.e.shop.geonosis.controller.Main", {
        onInit() {
          // this._initializeBase();

          this.loadHeader(this.getView().getViewName(), "headerContainer");

          this._loadItems();
        },

        _loadItems: async function () {
          let aTypes = ["Favorited", "Viewed", "Promoted"];
          let oView = this.getView();
          let oFeatured = this.getComponentModel("featured").getProperty("/featured");
          let aProducts = this.getComponentModel("products").getProperty("/products");
        
          for (let sType of aTypes) {
            
            let oCarousel = oView.byId(sType);
        
            if (!oCarousel) {
              console.warn(`Carousel con ID '${sType}' no encontrado`);
              continue;
            }
        
           
            let aProductIds = oFeatured
              .filter(p => p.Type === sType)
              .map(p => p.ProductId);
        
            
            let aFilteredProducts = aProducts.filter(p => aProductIds.includes(p.id));
        
            
            for (let oProduct of aFilteredProducts) {
              let oFragment = await this.loadFragment({
                name: "com.geonosis.shop.e.shop.geonosis.view.fragments.ProductCard",
              });
        
              let oProductModel = new JSONModel(oProduct);
              oFragment.setModel(oProductModel, "model");
        
              oCarousel.addPage(oFragment);
            }
          }
        },
        
        onTestPress: function () {
          this.getRouter().navTo("Test");
        }

    });
});