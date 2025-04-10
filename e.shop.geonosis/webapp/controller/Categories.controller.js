sap.ui.define([
    "com/geonosis/shop/e/shop/geonosis/controller/BaseController",
    "com/geonosis/shop/e/shop/geonosis/model/categories"
  ], (BaseController, categories) => {
    "use strict";
  
    return BaseController.extend("com.geonosis.shop.e.shop.geonosis.controller.Categories", {
        onInit() {
            let oCategories = categories.createCategoriesModel(this.getOwnerComponent());
            this.getView().setModel(oCategories, "categoryAndSubcategorieModel");
        },

        onSubcategoryPress: function(oEvent) {
          // let oRouter = this.getOwnerComponent().getRouter();
        
          // let oBindingContext = oEvent.getSource().getBindingContext("categoryAndSubcategorieModel");
          // let sCategoryName = oBindingContext.getProperty("id"); // nombre de la subcategoría
        
          // // Navegar a la vista "Products", pasando la subcategoría como parámetro
          // oRouter.navTo("products", {
          //   subcategory: encodeURIComponent(sCategoryName)
          // });
        }
    });
  });