sap.ui.define([
    "com/geonosis/shop/e/shop/geonosis/controller/BaseController",
    "com/geonosis/shop/e/shop/geonosis/model/products",
    "sap/m/MessageToast",
    "com/geonosis/shop/e/shop/geonosis/model/Cart",
    "sap/ui/model/json/JSONModel",
  ], (BaseController, products, MessageToast, Cart, JSONModel) => {
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
        
        const productData = oProductModel.getProperty("/product");
        
        // Asegurarse de que existe mainImage e image
        const mainImage = productData.mainImage;
        const imageArray = productData.image || [];

        // Evitar duplicar si mainImage ya está en el array
        const allImages = imageArray.includes(mainImage)
            ? imageArray
            : [mainImage, ...imageArray];

        // Setear en el modelo
        oProductModel.setProperty("/product/allImages", allImages);

      },


      onBuyNowPress: function () {
        const oProductModel = this.getView().getModel("product");
        const oProductData = oProductModel.getProperty("/product");
        let iQuantity = this.byId("stepQty").getValue();

        if (oProductData.stock >= iQuantity) {
          oProductData.stock -= iQuantity;
          oProductModel.setProperty("/product", oProductData);

          MessageToast.show("¡La compra ha sido realizada con éxito!");
        } else {
          MessageToast.show("¡Producto sin stock!");
        }
      },

      onAddCartPress: function (oEvent) {
        let iQuantity = this.byId("stepQty").getValue()
        
        //TODO: obtener desde un input la cantidad de productos y enviarla como parametro al agregar al carrito
        Cart.addToCart(this.getResourceBundle(),this.getModel("product"),this.getComponentModel("cart"),iQuantity);
      },

      // Método para abrir el diálogo con la imagen ampliada
      onOpenImageZoom: function (oEvent) {
          
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