sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MenuItem",
  "sap/m/Menu",
  "com/geonosis/shop/e/shop/geonosis/model/Cart",
  "sap/m/MessageToast"

], function(Controller, MenuItem, Menu, Cart, MessageToast) {
  "use strict";
  
  return Controller.extend("com.geonosis.shop.e.shop.geonosis.controller.BaseController", {

      getRouter: function () {
        return this.getOwnerComponent().getRouter();
      },

      getRouteFor: function (sRoute) {
        return this.getRouter().getRoute(sRoute);
      },
  
      getModel: function (sName) {
        return this.getView().getModel(sName);
      },

      getComponentModel: function (sName) {
        return this.getOwnerComponent().getModel(sName);
      },

      setModel: function (oModel, sName) {
        return this.getView().setModel(oModel, sName);
      },

      setComponentModel: function (oModel, sName) {
        return this.getOwnerComponent().setModel(oModel, sName);
      },
  
      getResourceBundle: function () {
        return this.getOwnerComponent().getModel("i18n").getResourceBundle();
      },
  
      onNavBack: function () {
        let oHistory = sap.ui.core.routing.History.getInstance();
        let sPreviousHash = oHistory.getPreviousHash();
  
        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          this.getRouter().navTo("RouteMain", {}, true);
        }
      },

      onBackHome: function () {
        this.getRouter().navTo("RouteMain", {}, true);
      },

      //Fragment Header Methods

      onCartPress: function () {
        this.getRouter().navTo("Cart");
      },

      onSearchNavigation: function (sSearchQuery) {
        let oRouter = this.getRouter();

        oRouter.navTo("Products", {
          query: encodeURIComponent(sSearchQuery)
        });
      },

      onOpenMenu: function (oEvent) {
        const sCurrentMedia = sap.ui.Device.media.getCurrentRange("Std").name;
        const bIsMobile = sCurrentMedia === "Phone" || sCurrentMedia === "Tablet";
        
        let sPath = "MenuDesktop";
      
        if (bIsMobile) {
          sPath = "MenuMobile";
        } 
        
        this.loadMenu(sPath, oEvent);
      },

      onCategoryMenuPress: function (oEvent) {

        const oItem = oEvent.getSource();
        const oContext = oItem.getBindingContext("catalog");
        const aSubcategories = oContext.getProperty("subcategories");
        const oMenu = oItem.getParent();

       
        if (aSubcategories && aSubcategories.length > 0) {
          let aItems = [];

          aItems.push(new MenuItem({
            text: "← Volver a categorías",
            icon: "sap-icon://nav-back",
            press: () => this.loadMenu("MenuMobile", oEvent) 
          }));


          aSubcategories.forEach(sub => {
            aItems.push(new MenuItem({
              text: sub.name,
              icon: "sap-icon://product",
              press: () => {
                this.onSearchNavigation(sub.id);
                oMenu.close(); 
              }
            }));
          });
      

          const oOldMenu = oItem.getParent();
          oOldMenu.close();

          const oSubMenu = new Menu({
            items: aItems
          });

          oSubMenu.openBy(oItem);
        }
      },

      onSubcategoryMenuPress: function (oEvent) {
        let oItem = oEvent.getSource();
        let oContext = oItem.getBindingContext("catalog");
        let sSubcategoryId = oContext.getProperty("id");
        
        this.onSearchNavigation(sSubcategoryId);
      },
      
      onHamburgerPress: function (oEvent) {

        let sPath = "HamburgerMenu";
        
        this.loadMenu(sPath, oEvent);
      },


      loadHeader: function (sView, sContainer) {
        
        this.loadFragment({
          name: "com.geonosis.shop.e.shop.geonosis.view.fragments.Header",
          id: sView
        }).then(function(oFragment) {
          this.getView().byId(sContainer).addContent(oFragment);
        }.bind(this));
      },

      loadMenu: function (sMenu, oEvent) {
        let sPath = "com.geonosis.shop.e.shop.geonosis.view.fragments." + sMenu;
        let sUniqueId = sPath + "-" + Date.now();
        
        this.loadFragment({
          name: sPath,
          id: sUniqueId
        }).then(function (oFragment) {
          oFragment.openBy(oEvent.getSource());
        }.bind(this));
      },

      onSearch: function (oEvent) {
        let oSearchField = oEvent.getSource();
        let sSearchQuery = oSearchField.getValue();

        this.onSearchNavigation(sSearchQuery);

        oSearchField.setValue("");
      },

      onProductPress: function (oEvent) {
        const oItem = oEvent.getSource();
        const oModel = oItem.getModel("model");
        
        if (oModel) {
          let oData = oModel.getData();
          let sQuery = oData.id;

          
          this.getRouter().navTo("Detail", {
            query: encodeURIComponent(sQuery)
          });
        }
      },

      onCardCartPress: function (oEvent) {
        console.log(oEvent.getSource().getModel("model"));
        Cart.addToCart(this.getResourceBundle(),oEvent.getSource().getModel("model"),this.getComponentModel("cart"));
      },

      onFavoritPress: function (oEvent) {
        const oButton = oEvent.getSource();
        const bIsFavorite = oButton.getIcon() === "sap-icon://heart";
      
        if (bIsFavorite) {
          oButton.setIcon("sap-icon://heart-2");
          MessageToast.show("Producto quitado de favoritos.");
        } else {
          oButton.setIcon("sap-icon://heart");
          MessageToast.show("Producto agregado a favoritos.");
        }
      }
    });
  });
  