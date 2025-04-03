sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("com.geonosis.shop.e.shop.geonosis.controller.Main", {
        onInit() {
          const oDataImgs = {
            images: [
              { src: "../assets/images/banner-1-sw.png" },
              { src: "../assets/images/banner-2-sw.png" },
              { src: "../assets/images/banner-3-sw.png" }
            ]
          };

          const oModelImgs = new JSONModel(oDataImgs);
          this.getView().setModel(oModelImgs, "view");

          const oCatalogModel = this.getOwnerComponent().getModel("catalog");
          const oCatalogData = oCatalogModel ? oCatalogModel.getData() : { catalog: { categories: [] } };
          
          const aProducts = this._extraxtProducts(oCatalogData.catalog.categories);

          const oProductModel = new JSONModel ({products: aProducts});

          this.getView().setModel(oProductModel, "productsModel");

        },

        _extraxtProducts: (aCategories) => {
          return aCategories.reduce((aProducts, category) => {
            category.subcategories.forEach(subCategory => {
              aProducts.push(...subCategory.products);
            });
            return aProducts;
          }, []);
        }
    });
});