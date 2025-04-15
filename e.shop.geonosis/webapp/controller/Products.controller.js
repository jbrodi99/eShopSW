sap.ui.define([
    "com/geonosis/shop/e/shop/geonosis/controller/BaseController",
    "com/geonosis/shop/e/shop/geonosis/model/products",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
  ], (BaseController, products, Fragment, JSONModel, ) => {
    "use strict";
  
    return BaseController.extend("com.geonosis.shop.e.shop.geonosis.controller.Products", {
      onInit: function() {

        this.loadHeader(this.getView().getViewName(), "headerProdContainer");

        this.setModel(this.getComponentModel("products"),"filteredProducts");
        
			  this.getRouteFor("Products").attachPatternMatched(this._onObjectMatched, this);
      },

      _onObjectMatched: function (oEvent) {
        
        let oArgs = oEvent.getParameter("arguments");

        let sSearchQuery = decodeURIComponent(oArgs.query); 
        
        
        let oFilteredProducts = products.getFilteredProducts(this.getOwnerComponent(),sSearchQuery);
 
        let aFilteredProducts = oFilteredProducts.getProperty("/products");
        
        let iTotalStock = aFilteredProducts.reduce(function (sum, product) {
          return sum + (product.stock || 0);
        }, 0);
        
        oFilteredProducts.setProperty("/subcategory", sSearchQuery.toUpperCase());
        oFilteredProducts.setProperty("/totalStock", iTotalStock);
        
        this.setModel(oFilteredProducts, "filteredProducts");

        this._loadFilteredProductCards();
      },

      _loadFilteredProductCards: async function () {
        const oView = this.getView();
        const oGridList = oView.byId("gridList");
      
        oGridList.removeAllItems();
      
        const aProducts = oView.getModel("filteredProducts").getProperty("/products");
      
        for (const oProduct of aProducts) {
          const oFragment = await Fragment.load({
            name: "com.geonosis.shop.e.shop.geonosis.view.fragments.ProductCard",
            type: "XML",
            controller: this
          });
      
          const oProductModel = new JSONModel(oProduct);
          oFragment.setModel(oProductModel, "model");
      
          const oGridListItem = new sap.f.GridListItem({
            content: [oFragment]
          });
      
          oGridListItem.addStyleClass("myGridItemFixedHeight");
          oGridList.addItem(oGridListItem);
        }
      },


      onSortPress: function () {
        this._bSortAscending = !this._bSortAscending;

        const oModel = this.getView().getModel("filteredProducts");
        let aProducts = oModel.getProperty("/products") || [];
      
        aProducts.sort((a, b) => {
          return this._bSortAscending 
            ? a.price - b.price 
            : b.price - a.price;
        });
      
        oModel.setProperty("/products", aProducts);

        this._loadFilteredProductCards();
      },

      onResetPress: function () {
        const oModel = this.getView().getModel("filteredProducts");
        const aOriginal = oModel.getProperty("/_originalProducts");
      
        if (aOriginal) {
          oModel.setProperty("/products", [...aOriginal]);

          this._loadFilteredProductCards();
        }
      }
    });
  });