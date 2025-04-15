sap.ui.define([
    "com/geonosis/shop/e/shop/geonosis/controller/BaseController",
    "com/geonosis/shop/e/shop/geonosis/model/Cart"
  ], (BaseController, Cart) => {
    "use strict";
  
    return BaseController.extend("com.geonosis.shop.e.shop.geonosis.controller.Cart", {
      onInit: function() {

        this.loadHeader(this.getView().getViewName(), "cart-header-container");

        this.setComponentModel(Cart.createCnfModel(), "cfnTable");

        this._selectAllCartItems();
        this.byId("cartTable").attachSelectionChange(this._updateCartSummary, this);
      },

      onCartDelete: function (oEvent) {
        let oDeletedItem = oEvent.getParameter("listItem");
        
        let oProduct = oDeletedItem.getBindingContext("cart").getObject();
        
        Cart.removeFromCart(this.getResourceBundle(),oProduct,this.getComponentModel("cart"));
      },

      onEditCartPress: function() {
        let oCfnTableModel = this.getModel("cfnTable");
        oCfnTableModel.setProperty("/tableMode", "Delete");
        this.byId("cartEditClose").setVisible(true);
        this.byId("cartEdit").setVisible(false);
      },

      onDoneEditingCartPress: function () {
        let oCfnTableModel = this.getModel("cfnTable");
        oCfnTableModel.setProperty("/tableMode", "MultiSelect");
        this.byId("cartEditClose").setVisible(false);
        this.byId("cartEdit").setVisible(true);
        this._selectAllCartItems();
        this._updateCartSummary();
      },

      onQuantityChange: function () {
        this._updateCartSummary();
      },

      onBuyNowPress: function (oEvent) {
        let oTable = this.byId("cartTable");
        let oCartModel = this.getComponentModel("cart");
        let aSelectedItems = oTable.getSelectedItems();

        if (aSelectedItems.length === 0) {
          sap.m.MessageToast.show("No hay productos seleccionados para comprar.");
          return;
        }

        let aCartEntries = oCartModel.getProperty("/cartEntries");

        let aUpdatedEntries = aCartEntries.filter(entry => {
          return !aSelectedItems.some(oItem => {
            let oItemData = oItem.getBindingContext("cart").getObject();
            return oItemData.id === entry.id;
          });
        });

        oCartModel.setProperty("/cartEntries", aUpdatedEntries);
        
        oTable.removeSelections(true);

        this._updateCartSummary();

        sap.m.MessageToast.show("{i18n>msgToastBuy}");
      },

      _selectAllCartItems: function () {
        let oTable = this.byId("cartTable");
        let aItems = oTable.getItems();
    
        aItems.forEach(oItem => {
            oTable.setSelectedItem(oItem, true);
        });
      },

      _updateCartSummary: function () {
        let oTable = this.byId("cartTable");
        let aSelectedItems = oTable.getSelectedItems();
        let oCartModel = this.getComponentModel("cart");
      
        let iTotalProducts = 0;
        let fTotalPrice = 0;
      
        aSelectedItems.forEach(oItem => {
          let oData = oItem.getBindingContext("cart").getObject();
          let iQuantity = parseInt(oData.quantity, 10);
          let fPrice = parseFloat(oData.price);
      
          iTotalProducts += iQuantity;
          fTotalPrice += iQuantity * fPrice;
        });
      
        oCartModel.setProperty("/summary/products", iTotalProducts);
        oCartModel.setProperty("/summary/total", fTotalPrice.toFixed(2));
      }
    });
  });