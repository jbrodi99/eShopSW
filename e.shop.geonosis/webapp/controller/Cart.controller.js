sap.ui.define([
    "com/geonosis/shop/e/shop/geonosis/controller/BaseController"
  ], (BaseController) => {
    "use strict";
  
    return BaseController.extend("com.geonosis.shop.e.shop.geonosis.controller.Cart", {
      onInit: function() {

        this.loadHeader(this.getView().getViewName(), "cart-header-container");

        let oView = this.getView();
        let oScrollContainer = oView.byId("myScrollContainer");
        oScrollContainer.addStyleClass("stickyBottom");

        //TODO: Mejorar esta abstraccion
        this.setModel(this.getComponentModel("cart"), "cart");
        
        const oRouter = this.getOwnerComponent().getRouter();
        const oTarget = oRouter.getTarget("TargetCart");
    
        oTarget.attachDisplay(this._onDisplay, this);
      },

      _onDisplay: function () {
          const oCartModel = this.getView().getModel("cart");

          oCartModel.refresh(true);
      },

      onDeleteCartPress: function (oEvent) {
        console.log("TODO: eliminar");
      }

      
    });
  });