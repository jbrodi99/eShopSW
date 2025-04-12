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
          this._initializeBase();

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
        

        // _loadCategoryProductCards: async function () {
        //   const oView = this.getView();
        //   const oVBox = oView.byId("category-panels");
        //   const aPanels = oVBox.getItems();
        
        //   for (let i = 0; i < aPanels.length; i++) {
        //     const oPanel = aPanels[i];
        //     const oContext = oPanel.getBindingContext("topSellingByCategoryModel");
        //     const aTopProducts = oContext.getProperty("topProducts");
        
        //     const oCarousel = oPanel.getContent()[0]; // Primer y único contenido: el carousel
        
        //     for (const oProduct of aTopProducts) {
        //       const oFragment = await Fragment.load({
        //         name: "com.geonosis.shop.e.shop.geonosis.view.fragments.ProductCard",
        //         type: "XML",
        //         controller: this
        //       });
        
        //       const oModel = new JSONModel(oProduct);
        //       oFragment.setModel(oModel, "model"); // Usamos alias 'model'
        
        //       oCarousel.addPage(oFragment);
        //     }
        //   }
        // },

        // _loadAllProducts: async function () {
        //   const oView = this.getView();
        //   const oCarousel = oView.byId("carousel-card-item");
        
        //   // Limpiar páginas anteriores (opcional si se recarga varias veces)
        //   oCarousel.removeAllPages();
        
        //   // Obtener productos del modelo
        //   const aProducts = oView.getModel("productsModel").getProperty("/products");
        
        //   for (const oProduct of aProducts) {
        //     const oFragment = await Fragment.load({
        //       name: "com.geonosis.shop.e.shop.geonosis.view.fragments.ProductCard",
        //       type: "XML",
        //       controller: this
        //     });
        
        //     // Asignar modelo individual con alias "model"
        //     const oProductModel = new JSONModel(oProduct);
        //     oFragment.setModel(oProductModel, "model");
        
        //     // Agregar el fragmento al carousel
        //     oCarousel.addPage(oFragment);
        //   }
        // },

        onTestPress: function () {
          this.getRouter().navTo("Test");
        }

    });
});