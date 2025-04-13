sap.ui.define([
    "com/geonosis/shop/e/shop/geonosis/controller/BaseController",
    "com/geonosis/shop/e/shop/geonosis/model/products",
     "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
  ], (BaseController, products,JSONModel, Device) => {
    "use strict";
  
    return BaseController.extend("com.geonosis.shop.e.shop.geonosis.controller.Cart", {
      onInit: function() {

        

        const oTargets = this.getOwnerComponent().getRouter().getTargets();
     
        oTargets.getTarget("TargetCart").attachDisplay(function (oEvent) {
          this._onViewDisplayed(); 
        }, this);


        let oProductsModel = products.createProductsModel(this.getOwnerComponent());
        this.getView().setModel(oProductsModel, "products");

        let sDirection;

        let oView = this.getView();
        let oScrollContainer = oView.byId("myScrollContainer");
      
        if (Device.system.desktop) {
          sDirection = "Row"; 
          oScrollContainer.addStyleClass("stickyTop");
        } else {
          sDirection = "Column";
          oScrollContainer.addStyleClass("stickyBottom");
        }
        
        let oLayoutModel = new JSONModel({
          flexDirection: sDirection,
          growLeft: Device.system.desktop ? 6 : 1,
          growRight: Device.system.desktop ? 4 : 1,
        });
  
        
        this.getView().setModel(oLayoutModel, "layoutModel");
      },

      _onViewDisplayed: function (oEvent) {
        
        if(!this.getOwnerComponent()._oHeaderFragment){
          Fragment.load({
            name: "com.geonosis.shop.e.shop.geonosis.view.fragments.Header",
            controller: this
          }).then(function (oFragment) {
            
            this.getOwnerComponent()._oHeaderFragment = oFragment;
            this.getView().addDependent(oFragment);

            this.getView().byId("headerContainer").addContent(oFragment);
          }.bind(this));
        }else{

          const oFragment = this.getOwnerComponent()._oHeaderFragment;
        
          this.getView().addDependent(oFragment);
          this.getView().byId("cart-header-container").addContent(oFragment);
          
        }
      }
    });
  });