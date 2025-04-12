sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MenuItem",
  "sap/m/Menu",
  "sap/ui/Device",

], function(Controller, MenuItem, Menu, Device) {
  "use strict";
  
  return Controller.extend("com.geonosis.shop.e.shop.geonosis.controller.BaseController", {
    
      // _initializeBase: function () {
      //   models.onMediaChange(function (oEvent) {
      //     const bPhone = oEvent.name === "Phone";
          
      //     const oHeader = this._getHeaderFragment();
          
      //     const oButtonCategories = oHeader.getContent().find(c => c.getId().includes("btn-nav-categories"));
          
      //     const oButtonCart = oHeader.getContent().find(c => c.getId().includes("btn-nav-cart"));
          
      //     const oButtonMenu = oHeader.getContent().find(c => c.getId().includes("btn-nav-menu"));
          
      //     // console.log(oButtonCategories && oButtonCart)
      //     if (oButtonCategories && oButtonCart) {
      //       oButtonCategories.setVisible(!bPhone);
      //       oButtonCart.setVisible(!bPhone);
      //       oButtonMenu.setVisible(bPhone);
      //     }
      //    }.bind(this))
      // },

      getRouter: function () {
        return this.getOwnerComponent().getRouter();
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

      //Fragment Header Methods

      onCartPress: function () {
        this.getRouter().navTo("Cart");
      },

      onSubcategoryNavigation: function (sSubcategory) {
        let oRouter = this.getRouter();

        oRouter.navTo("Products", {
          subcategory: encodeURIComponent(sSubcategory)
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
        if (aSubcategories && aSubcategories.length > 0) {
          const oSubMenu = new Menu({
            items: aSubcategories.map(sub => new MenuItem({
              text: sub.name,
              icon: "sap-icon://product",
              press: () => this.onSubcategoryNavigation(sub.id) // o navegación
            }))
          });
      
          oSubMenu.openBy(oItem);
        }
      },

      onSubcategoryMenuPress: function (oEvent) {
        let oItem = oEvent.getSource();
        let oContext = oItem.getBindingContext("catalog");
        let sSubcategoryId = oContext.getProperty("id");

        this.onSubcategoryNavigation(sSubcategoryId);
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

        this.loadFragment({
          name: sPath,
          id: sPath
        }).then(function (oFragment) {
          oFragment.openBy(oEvent.getSource());
        }.bind(this));
      }
    });
  });
  