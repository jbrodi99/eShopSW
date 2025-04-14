sap.ui.define([
    "com/geonosis/shop/e/shop/geonosis/controller/BaseController",
    "com/geonosis/shop/e/shop/geonosis/model/products",
    "sap/m/MessageToast",
    "com/geonosis/shop/e/shop/geonosis/model/Cart",
  ], (BaseController, products, MessageToast, Cart) => {
    "use strict";
  
    return BaseController.extend("com.geonosis.shop.e.shop.geonosis.controller.Detail", {
      onInit: function() {

        this.loadHeader(this.getView().getViewName(), "detail-header-container");

        this.getRouteFor("Detail").attachPatternMatched(this._onObjectMatched,this);

      },

      _onObjectMatched: function (oEvent) {
        let oArgs = oEvent.getParameter("arguments");

        let sSearchQuery = decodeURIComponent(oArgs.query); 

        let oProductModel = products.getById(this.getOwnerComponent(), sSearchQuery);

        this.setModel(oProductModel, "product");
      },

      onBuyNowPress: function () {
        MessageToast.show("Se compra ah sido realizada con exito!");
      },

      onAddCartPress: function (oEvent) {
        //TODO: obtener desde un input la cantidad de productos y enviarla como parametro al agregar al carrito
        Cart.addToCart(this.getResourceBundle(),this.getModel("product"),this.getComponentModel("catalog"));
      },

      // Método para abrir el diálogo con la imagen ampliada
      onOpenImageZoom: function (oEvent) {
          let oView = this.getView();
          
          // Cargar el fragment de manera lazy
          if (!this._pZoomDialog) {
              console.log("intente");
              this._pZoomDialog = this.loadFragment({
                  name: "com.geonosis.shop.e.shop.geonosis.view.fragments.ImageZoomDialog"
              }).then(function (oDialog) {
                  return oDialog;
              });
          }
          
          this._pZoomDialog.then(function (oDialog) {
              oDialog.open();
          });
      },

      onCloseImageZoom: function () {
        this.byId("imageZoomDialog").close();
      },

      onNavTo: function (oEvent) {
        let query = oEvent.getSource().getText();
        this.onSearchNavigation(query);
      },

      onNavToHome: function () {
        this.onBackHome();
      }
    });
  });