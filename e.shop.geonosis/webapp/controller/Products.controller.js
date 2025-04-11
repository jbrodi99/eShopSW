sap.ui.define([
    "com/geonosis/shop/e/shop/geonosis/controller/BaseController",
    "com/geonosis/shop/e/shop/geonosis/model/products",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
  ], (BaseController, products, Fragment, JSONModel) => {
    "use strict";
  
    return BaseController.extend("com.geonosis.shop.e.shop.geonosis.controller.Products", {
      onInit: function() {
        this._initializeBase();

        const oTargets = this.getOwnerComponent().getRouter().getTargets();
        console.log(oTargets);
        oTargets.getTarget("TargetProducts").attachDisplay(function (oEvent) {
          this._onViewDisplayed();
        }, this);

      //   if(!this.getOwnerComponent()._oHeaderFragment){
      //   if (this._oHeaderFragment) {
      //     this._oHeaderFragment.destroy(true);
      //   }
      //   Fragment.load({
      //     name: "com.geonosis.shop.e.shop.geonosis.view.fragments.Header",
      //     controller: this
      //   }).then(function (oFragment) {
          
      //     this.getOwnerComponent()._oHeaderFragment = oFragment;
      //     this.getView().addDependent(oFragment);

      //     this.getView().byId("headerProdContainer").addContent(oFragment);
      //   }.bind(this));
      // }else{
      //   // Fragment ya existe, lo reusamos
      //     const oFragment = this.getOwnerComponent()._oHeaderFragment;

      //     this.getView().addDependent(oFragment);
      //     this.getView().byId("headerProdContainer").addContent(oFragment);
      //   }


        let oRouter = this.getRouter();
			  oRouter.getRoute("Products").attachPatternMatched(this._onObjectMatched, this);

      },

      _onViewDisplayed() {
        if(!this.getOwnerComponent()._oHeaderFragment){
          if (this._oHeaderFragment) {
            this._oHeaderFragment.destroy(true);
          }
          Fragment.load({
            name: "com.geonosis.shop.e.shop.geonosis.view.fragments.Header",
            controller: this
          }).then(function (oFragment) {
            
            this.getOwnerComponent()._oHeaderFragment = oFragment;
            this.getView().addDependent(oFragment);
  
            this.getView().byId("headerProdContainer").addContent(oFragment);
          }.bind(this));
        }else{
          // Fragment ya existe, lo reusamos
            const oFragment = this.getOwnerComponent()._oHeaderFragment;
  
            this.getView().addDependent(oFragment);
            this.getView().byId("headerProdContainer").addContent(oFragment);
          }
      },

      onFilterPress: function (oEvent) {
        
      },

      _onObjectMatched: function (oEvent) {
        let oArgs = oEvent.getParameter("arguments");

        let sSubcategoryId = decodeURIComponent(oArgs.subcategory); // ← nombre del segmento en el manifest

        
        let oFilteredProducts = products.createFilteredProductsModel(this.getOwnerComponent(),sSubcategoryId);
        
        
        let aFilteredProducts = oFilteredProducts.getProperty("/products");
        
        let iTotalStock = aFilteredProducts.reduce(function (sum, product) {
          return sum + (product.stock || 0);
        }, 0);
        
        oFilteredProducts.setProperty("/subcategory", sSubcategoryId.toUpperCase());
        oFilteredProducts.setProperty("/totalStock", iTotalStock);
        
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