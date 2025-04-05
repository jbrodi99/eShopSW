sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "com/geonosis/shop/e/shop/geonosis/model/products"
], (Controller, JSONModel, products) => {
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

          let oProductModel = products.createProductsModel(this.getOwnerComponent());
          let oFeactureProductsModel = products.createFeactureProductsModel(this.getOwnerComponent());
          let oTopSellingByCategorie = products.createTopSellingByCategoryModel(this.getOwnerComponent());

          this.getView().setModel(oProductModel, "productsModel");
          this.getView().setModel(oFeactureProductsModel, "feactureProductsModel");
          this.getView().setModel(oTopSellingByCategorie, "topSellingByCategoryModel");

          let oView = this.getView();

          this._updatePageIndicators(oView);
        },

        _updatePageIndicators: (oView) => {
          let oCarousel = oView.byId("carousel-card-item");
          let oLayout = oCarousel.getCustomLayout();
          let oIndicatorBox = oView.byId("carousel-page-indicator");
      
          // Obtener cantidad de productos y calcular páginas
          let oModel = oView.getModel("productsModel");
          let aProducts = oModel.getProperty("/products");
          let iPages = Math.ceil(aProducts.length / oLayout.getVisiblePagesCount());
          
          // Limpiar indicadores previos
          oIndicatorBox.removeAllItems();
      
          // Crear indicadores dinámicamente
          for (let i = 0; i < iPages - 1; i++) {
              let oIcon = new sap.ui.core.Icon({
                  src: "sap-icon://circle-task-2",
                  size: "0.75rem",
                  color: i === 0 ? "#0070f2" : "#bfbfbf"  // Azul para la página activa
              }).addStyleClass("carousel-indicator");
              
              oIndicatorBox.addItem(oIcon);
          }
      },

      onCarouselNavigate: function (oEvent) {
        let oCarousel = oEvent.getSource();
        let oLayout = oCarousel.getCustomLayout();
        let oIndicatorBox = this.getView().byId("carousel-page-indicator");
    
        const n = oLayout.getVisiblePagesCount(); // Número de productos por "página"
        const aPages = oCarousel.getPages();
        const iTotalItems = aPages.length;
    
        // 🔹 Obtener el índice del producto actual
        const sCurrentPageId = oCarousel.getActivePage();
        let iCurrentIndex = aPages.findIndex(page => page.getId() === sCurrentPageId);
    
        // 🔹 Calcular el índice de la "página" actual
        let iCurrentPage = Math.floor(iCurrentIndex / n);
    
        // 🔹 Actualizar indicadores
        let aIcons = oIndicatorBox.getItems();
        aIcons.forEach((oIcon, index) => {
            oIcon.setColor(index === iCurrentPage ? "#0070f2" : "#bfbfbf");
        });
    }
    });
});