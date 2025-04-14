sap.ui.define([
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
], function (
    MessageBox,
    MessageToast,
	JSONModel) {
    "use strict"

    return {

		createCartModel: function(oCart) {
			let oCartModel = new JSONModel(oCart);
			return oCartModel;
		},

        addToCart: function (oBundle, oProduct, oCartModel) {
            if (oProduct?.getData()?.product !== undefined){
                oProduct = oProduct.getData().product;
            }
            switch (oProduct.status) {
				case "O":
					// show message dialog
					MessageBox.show(
						oBundle.getText("productStatusOutOfStockMsg"), {
                            icon: MessageBox.Icon.ERROR,
							title: oBundle.getText("productStatusOutOfStockTitle"),
							actions: [MessageBox.Action.OK]
						});
					break;
				case "A":
				default:
					this._updateCartItem(oBundle, oProduct, oCartModel);
					break;  
            }
        },

        _updateCartItem: function (oBundle, oProductToBeAdded, oCartModel) {
			const aCart = oCartModel.getProperty("/cart") || [];
		
			let oCartProduct = aCart.find(p => p.id === oProductToBeAdded.id);
		
			if (oCartProduct) {
				oCartProduct.Quantity += 1;
			} else {
				let oNewProduct = Object.assign({}, oProductToBeAdded);
				oNewProduct.Quantity = 1;
				aCart.push(oNewProduct);
			}
		
			// Forzar actualización del array completo
			oCartModel.setProperty("/cart", [...aCart]);
		
			MessageToast.show(oBundle.getText("productMsgAddedToCart", [oProductToBeAdded.name]));
		}
		
    }
})