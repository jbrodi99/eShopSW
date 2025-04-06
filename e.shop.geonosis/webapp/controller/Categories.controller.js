sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/geonosis/shop/e/shop/geonosis/model/categories"
  ], (Controller, categories) => {
    "use strict";
  
    return Controller.extend("com.geonosis.shop.e.shop.geonosis.controller.Categories", {
        onInit() {
            let oCategories = categories.createCategoriesModel(this.getOwnerComponent());
            this.getView().setModel(oCategories, "categoryAndSubcategorieModel");
        },

        onSubcategoryPress: function(oEvent) {
          let oRouter = this.getOwnerComponent().getRouter();
        
          let oBindingContext = oEvent.getSource().getBindingContext("categoryAndSubcategorieModel");
          let sCategoryName = oBindingContext.getProperty("id"); // nombre de la subcategoría
        
          // Navegar a la vista "Products", pasando la subcategoría como parámetro
          oRouter.navTo("products", {
            subcategory: encodeURIComponent(sCategoryName)
          });
        }
    });
  });