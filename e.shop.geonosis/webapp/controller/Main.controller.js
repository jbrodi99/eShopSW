sap.ui.define([
    "com/geonosis/shop/e/shop/geonosis/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "com/geonosis/shop/e/shop/geonosis/model/products"
], (BaseController, JSONModel, Fragment, products) => {
    "use strict";

    return BaseController.extend("com.geonosis.shop.e.shop.geonosis.controller.Main", {
        onInit() {
          const oDataImgs = {
            images: [
              { src: "../assets/images/banner-1-sw.png" },
              { src: "../assets/images/banner-2-sw.png" },
              { src: "../assets/images/banner-3-sw.png" }
            ]
          };

          const oModelImgs = new JSONModel(oDataImgs);
          this.setModel(oModelImgs, "view");

          const sInitialMedia = sap.ui.Device.media.getCurrentRange("Std").name; // "Phone", "Tablet", "Desktop"
          const iItemsPerPage = sInitialMedia === "Desktop" ? 4 :
                                sInitialMedia === "Tablet" ? 2 : 1;
          
          const oSettingsModel = new JSONModel({
            carouselItemsPerPage: iItemsPerPage
          });
          this.setModel(oSettingsModel, "settings");

          sap.ui.Device.media.attachHandler((oEvent) => {
            const sMedia = oEvent.name; // "Phone", "Tablet", "Desktop"
            const iNewItems = sMedia === "Desktop" ? 4 :
                              sMedia === "Tablet"  ? 2 : 1;
        
            this.getModel("settings").setProperty("/carouselItemsPerPage", iNewItems);
          });

          let oProductModel = products.createProductsModel(this.getOwnerComponent());
          let oFeactureProductsModel = products.createFeactureProductsModel(this.getOwnerComponent());
          let oTopSellingByCategorie = products.createTopSellingByCategoryModel(this.getOwnerComponent());
          
          this.setModel(oProductModel, "productsModel");
          this.setModel(oFeactureProductsModel, "feactureProductsModel");
          this.setModel(oTopSellingByCategorie, "topSellingByCategoryModel");
          
      

          // let oView = this.getView();

          // this._updatePageIndicators(oView);
          this._loadFeatureProductCards();
          this._loadCategoryProductCards();
          this._loadAllProducts();

       
        },

        _loadFeatureProductCards: async function () {
          const oView = this.getView();
          const oCarousel = oView.byId("carousel-feature-products");
    
          // Obtener productos del modelo
          const aProducts = oView.getModel("feactureProductsModel").getProperty("/products");
    
          for (const oProduct of aProducts) {
            const oFragment = await Fragment.load({
              name: "com.geonosis.shop.e.shop.geonosis.view.fragments.ProductCard",
              type: "XML",
              controller: this
            });
    
            // Crear modelo individual con alias "model"
            const oProductModel = new JSONModel(oProduct);
            oFragment.setModel(oProductModel, "model");


    
            // Agregar al carousel
            oCarousel.addPage(oFragment);
          }
        },

        _loadCategoryProductCards: async function () {
          const oView = this.getView();
          const oVBox = oView.byId("category-panels");
          const aPanels = oVBox.getItems();
        
          for (let i = 0; i < aPanels.length; i++) {
            const oPanel = aPanels[i];
            const oContext = oPanel.getBindingContext("topSellingByCategoryModel");
            const aTopProducts = oContext.getProperty("topProducts");
        
            const oCarousel = oPanel.getContent()[0]; // Primer y único contenido: el carousel
        
            for (const oProduct of aTopProducts) {
              const oFragment = await Fragment.load({
                name: "com.geonosis.shop.e.shop.geonosis.view.fragments.ProductCard",
                type: "XML",
                controller: this
              });
        
              const oModel = new JSONModel(oProduct);
              oFragment.setModel(oModel, "model"); // Usamos alias 'model'
        
              oCarousel.addPage(oFragment);
            }
          }
        },

        _loadAllProducts: async function () {
          const oView = this.getView();
          const oCarousel = oView.byId("carousel-card-item");
        
          // Limpiar páginas anteriores (opcional si se recarga varias veces)
          oCarousel.removeAllPages();
        
          // Obtener productos del modelo
          const aProducts = oView.getModel("productsModel").getProperty("/products");
        
          for (const oProduct of aProducts) {
            const oFragment = await Fragment.load({
              name: "com.geonosis.shop.e.shop.geonosis.view.fragments.ProductCard",
              type: "XML",
              controller: this
            });
        
            // Asignar modelo individual con alias "model"
            const oProductModel = new JSONModel(oProduct);
            oFragment.setModel(oProductModel, "model");
        
            // Agregar el fragmento al carousel
            oCarousel.addPage(oFragment);
          }
        }

    });
});