sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MenuItem",
    "sap/m/Menu",
    "sap/ui/Device"
  ], function(Controller, Fragment, MenuItem, Menu, Device) {
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

      onSubcategoryNavigation: function (oSubcategory) {
        let oRouter = this.getRouter();
        // let oContext = oItem.getBindingContext("catalog");
        // let sSubcategoryId = oContext.getProperty("id");
  
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
  
      _initializeBase: function () {
        this._attachDeviceMediaHeaderHandler();
      },

      _getHeaderFragment: function () {
        return this._oHeaderFragment;
      },

      _attachDeviceMediaHeaderHandler: function () {
        // Actualiza el modelo "device" ante cambios de tamaño
        Device.media.attachHandler(function (oEvent) {
          const bPhone = oEvent.name === "Phone";
          
          const oView = this.getView();
        
          const oHeader = this._getHeaderFragment();
          
          // console.log(oView);
          const oButtonCategories = oHeader.getContent().find(c => c.getId().includes("btn-nav-categories"));

          const oButtonCart = oHeader.getContent().find(c => c.getId().includes("btn-nav-cart"));

          const oButtonMenu = oHeader.getContent().find(c => c.getId().includes("btn-nav-menu"));
        
          // console.log(oButtonCategories && oButtonCart)
          if (oButtonCategories && oButtonCart) {
            oButtonCategories.setVisible(!bPhone);
            oButtonCart.setVisible(!bPhone);
            oButtonMenu.setVisible(bPhone);
          }
        }.bind(this));
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
      }
    });
  });
  