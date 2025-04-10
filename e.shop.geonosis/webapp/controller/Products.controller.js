sap.ui.define([
    "com/geonosis/shop/e/shop/geonosis/controller/BaseController",
    "com/geonosis/shop/e/shop/geonosis/model/products",
    "sap/ui/model/Filter",
	  "sap/ui/model/FilterOperator"
  ], (BaseController, products, Filter, FilterOperator) => {
    "use strict";
  
    return BaseController.extend("com.geonosis.shop.e.shop.geonosis.controller.Products", {
      onInit: function() {

        let oRouter = this.getRouter();
			  oRouter.getRoute("Products").attachPatternMatched(this._onObjectMatched, this);
    

        let oProductsModel = products.createProductsModel(this.getOwnerComponent());
        this.getView().setModel(oProductsModel, "products");
      },

      _onObjectMatched: function (oEvent) {
        let oArgs = oEvent.getParameter("arguments");

        let sSubcategoryId = decodeURIComponent(oArgs.subcategory); // ← nombre del segmento en el manifest

        let oFilteredProducts = products.createFilteredProductsModel(this.getOwnerComponent(),sSubcategoryId);

        this.setModel(oFilteredProducts, "filteredProducts");

      }

    });
  });