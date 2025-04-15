sap.ui.define([
    "com/geonosis/shop/e/shop/geonosis/controller/BaseController",
    "com/geonosis/shop/e/shop/geonosis/model/Cart"
  ], (BaseController, Cart) => {
    "use strict";
  
    return BaseController.extend("com.geonosis.shop.e.shop.geonosis.controller.Cart", {
      onInit: function() {

        this.loadHeader(this.getView().getViewName(), "cart-header-container");

        let oView = this.getView();
        let oScrollContainer = oView.byId("myScrollContainer");
        oScrollContainer.addStyleClass("stickyBottom");

        this.setComponentModel(Cart.createCnfModel(), "cfnTable");

        this._selectAllCartItems();
        this.byId("cartTable").attachSelectionChange(this._updateCartSummary, this);
      },

      onCartDelete: function (oEvent) {
        const oDeletedItem = oEvent.getParameter("listItem");
        
        const oProduct = oDeletedItem.getBindingContext("cart").getObject();
        
        Cart.removeFromCart(this.getResourceBundle(),oProduct,this.getComponentModel("cart"));

       
      },

      onEditCartPress: function(oEvent) {
        const oCfnTableModel = this.getView().getModel("cfnTable");
        oCfnTableModel.setProperty("/tableMode", "Delete");
        this.byId("cartEditClose").setVisible(true);
        this.byId("cartEdit").setVisible(false);
      },

      onDoneEditingCartPress: function () {
        const oCfnTableModel = this.getView().getModel("cfnTable");
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
        const oTable = this.byId("cartTable");
        const oCartModel = this.getComponentModel("cart");
        const aSelectedItems = oTable.getSelectedItems();

        if (aSelectedItems.length === 0) {
          sap.m.MessageToast.show("No hay productos seleccionados para comprar.");
          return;
        }

        let aCartEntries = oCartModel.getProperty("/cartEntries");

       
        const aUpdatedEntries = aCartEntries.filter(entry => {
          return !aSelectedItems.some(oItem => {
            const oItemData = oItem.getBindingContext("cart").getObject();
            return oItemData.id === entry.id;
          });
        });

        
        oCartModel.setProperty("/cartEntries", aUpdatedEntries);

        
        oTable.removeSelections(true);

        this._updateCartSummary();

        sap.m.MessageToast.show("¡Compra realizada con éxito!");
      },

      _selectAllCartItems: function () {
        const oTable = this.byId("cartTable");
        const aItems = oTable.getItems();
    
        aItems.forEach(oItem => {
            oTable.setSelectedItem(oItem, true);
        });
      },

      _updateCartSummary: function () {
        const oTable = this.byId("cartTable");
        const aSelectedItems = oTable.getSelectedItems();
        const oCartModel = this.getComponentModel("cart");
      
        let iTotalProducts = 0;
        let fTotalPrice = 0;
      
        aSelectedItems.forEach(oItem => {
          const oData = oItem.getBindingContext("cart").getObject();
          const iQuantity = parseInt(oData.quantity, 10);
          const fPrice = parseFloat(oData.price);
      
          iTotalProducts += iQuantity;
          fTotalPrice += iQuantity * fPrice;
        });
      
        oCartModel.setProperty("/summary/products", iTotalProducts);
        oCartModel.setProperty("/summary/total", fTotalPrice.toFixed(2));
      }
    
      
    });
  });