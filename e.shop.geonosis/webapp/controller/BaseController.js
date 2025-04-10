sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
  ], function(Controller, Fragment) {
    "use strict";
  
    return Controller.extend("com.geonosis.shop.e.shop.geonosis.controller.BaseController", {
      
      // Acceso rápido al router
      getRouter: function () {
        return this.getOwnerComponent().getRouter();
      },
  
      // Acceso a un modelo por nombre
      getModel: function (sName) {
        return this.getView().getModel(sName);
      },
  
      // Setear un modelo a la vista
      setModel: function (oModel, sName) {
        return this.getView().setModel(oModel, sName);
      },
  
      // Acceso al ResourceBundle (i18n)
      getResourceBundle: function () {
        return this.getOwnerComponent().getModel("i18n").getResourceBundle();
      },
  
      // Navegación con historial
      onNavBack: function () {
        let oHistory = sap.ui.core.routing.History.getInstance();
        let sPreviousHash = oHistory.getPreviousHash();
  
        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          this.getRouter().navTo("RouteMain", {}, true);
        }
      },

      onCartPress: function () {
        let oRouter = this.getRouter();
        oRouter.navTo("Cart");
      },

      onSubcategoryNavigation: function (oEvent) {
        let oItem = oEvent.getSource();
        let oRouter = this.getRouter();
        let oContext = oItem.getBindingContext("catalog");
        let sSubcategoryId = oContext.getProperty("id");
  
        oRouter.navTo("Products", {
          subcategory: encodeURIComponent(sSubcategoryId)
        });
      },

      onOpenMenu: function (oEvent) {
        if (!this._pMenu) {
          Fragment.load({
            name: "com.geonosis.shop.e.shop.geonosis.view.fragments.Menu",
            controller: this
          }).then(function (oMenu) {
            this._pMenu = oMenu;
            this.getView().addDependent(oMenu);
            oMenu.openBy(oEvent.getSource());
          }.bind(this));
        } else {
          this._pMenu.openBy(oEvent.getSource());
        }
      }
  
    });
  });
  