sap.ui.define([
    "com/geonosis/shop/e/shop/geonosis/controller/BaseController",
    "com/geonosis/shop/e/shop/geonosis/model/products",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
  ], (BaseController, products, Fragment, JSONModel) => {
    "use strict";
  
    return BaseController.extend("com.geonosis.shop.e.shop.geonosis.controller.Products", {
      onInit: function() {

        let oRouter = this.getRouter();
			  oRouter.getRoute("Products").attachPatternMatched(this._onObjectMatched, this);

      },

      _onObjectMatched: function (oEvent) {
        let oArgs = oEvent.getParameter("arguments");

        let sSubcategoryId = decodeURIComponent(oArgs.subcategory); // ← nombre del segmento en el manifest

        let oFilteredProducts = products.createFilteredProductsModel(this.getOwnerComponent(),sSubcategoryId);

        this.setModel(oFilteredProducts, "filteredProducts");

        this._loadFilteredProductCards();
      },

      _loadFilteredProductCards: async function () {
        const oView = this.getView();
        const oGridList = oView.byId("gridList");
      
        // Limpiar items existentes si es necesario
        oGridList.removeAllItems();
      
        // Obtener productos del modelo con alias filteredProducts
        const aProducts = oView.getModel("filteredProducts").getProperty("/products");
      
        for (const oProduct of aProducts) {
          const oFragment = await Fragment.load({
            name: "com.geonosis.shop.e.shop.geonosis.view.fragments.ProductCard",
            type: "XML",
            controller: this
          });
      
          // Crear modelo individual con alias "model"
          const oProductModel = new JSONModel(oProduct);
          oFragment.setModel(oProductModel, "model");
      
          // Crear un GridListItem para envolver el fragment
          const oGridListItem = new sap.f.GridListItem({
            content: [oFragment]
          });
      

          oGridListItem.addStyleClass("myGridItemFixedHeight");
          oGridList.addItem(oGridListItem);
        }
      }

    });
  });