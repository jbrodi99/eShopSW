sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/Fragment",
  "sap/m/MenuItem",
  "sap/m/Menu",
  "sap/ui/Device",
  "com/geonosis/shop/e/shop/geonosis/model/models"
], function(Controller, Fragment, MenuItem, Menu, Device, models) {
  "use strict";
  
  return Controller.extend("com.geonosis.shop.e.shop.geonosis.controller.BaseController", {
    
      _initializeBase: function () {
        this.models.onMediaChange(function (oEvent) {
          const bPhone = oEvent.name === "Phone";
          
          const oHeader = this._getHeaderFragment();
          
          const oButtonCategories = oHeader.getContent().find(c => c.getId().includes("btn-nav-categories"));
          
          const oButtonCart = oHeader.getContent().find(c => c.getId().includes("btn-nav-cart"));
          
          const oButtonMenu = oHeader.getContent().find(c => c.getId().includes("btn-nav-menu"));
          
          // console.log(oButtonCategories && oButtonCart)
          if (oButtonCategories && oButtonCart) {
            oButtonCategories.setVisible(!bPhone);
            oButtonCart.setVisible(!bPhone);
            oButtonMenu.setVisible(bPhone);
          }
         })
      },

      getRouter: function () {
        return this.getOwnerComponent().getRouter();
      },
  
      getModel: function (sName) {
        return this.getView().getModel(sName);
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

      onSubcategoryNavigation: function (oSubcategory) {
        let oRouter = this.getRouter();
  
        oRouter.navTo("Products", {
          subcategory: encodeURIComponent(oSubcategory.id)
        });
      },

      onOpenMenu: function (oEvent) {
        const bIsMobile = sap.ui.Device.system.phone || sap.ui.Device.system.tablet;
      
        if (this._pMenu) {
          this._pMenu.destroy(); // destruir para regenerar según el device
          this._pMenu = null;
        }
      
        if (bIsMobile) {
          // Mobile: Cargar menú sin submenús, se crearán dinámicamente
          Fragment.load({
            name: "com.geonosis.shop.e.shop.geonosis.view.fragments.MenuMobile",
            controller: this
          }).then(function (oMenu) {
            this._pMenu = oMenu;
            this.getView().addDependent(oMenu);
            oMenu.openBy(oEvent.getSource());
          }.bind(this));
        } else {
          // Desktop: Menú con binding completo (categoría + subcategorías)
          Fragment.load({
            name: "com.geonosis.shop.e.shop.geonosis.view.fragments.MenuDesktop",
            controller: this
          }).then(function (oMenu) {
            this._pMenu = oMenu;
            this.getView().addDependent(oMenu);
            oMenu.openBy(oEvent.getSource());
          }.bind(this));
        }
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
              press: () => this.onSubcategoryNavigation(sub) // o navegación
            }))
          });
      
          oSubMenu.openBy(oItem);
        }
      },

      onSubcategoryMenuPress: function (oEvent) {
        let oItem = oEvent.getSource();
        let oRouter = this.getRouter();
        let oContext = oItem.getBindingContext("catalog");
        let sSubcategoryId = oContext.getProperty("id");

        oRouter.navTo("Products", {
          subcategory: encodeURIComponent(sSubcategoryId)
        });
      },
      
      onHamburgerPress: function (oEvent) {
        const oView = this.getView();
        
        if (!this._pHamburgerPopover) {
          this._pHamburgerPopover = Fragment.load({
            name: "com.geonosis.shop.e.shop.geonosis.view.fragments.HamburgerMenu",
            controller: this
          }).then(function (oPopover) {
            oView.addDependent(oPopover);
            return oPopover;
          });
        }
        
        this._pHamburgerPopover.then(function (oPopover) {
          oPopover.openBy(oEvent.getSource());
        });
      },

      _getHeaderFragment: function () {
        return this.getOwnerComponent()._oHeaderFragment;
      }
    });
  });
  