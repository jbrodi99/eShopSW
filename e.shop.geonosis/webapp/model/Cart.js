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
		
		createCnfModel: function() {
			let oCfn = {
				tableMode: "MultiSelect"
			}
			let oCfnModel = new JSONModel(oCfn);
			return oCfnModel;
		},

        addToCart: function (oBundle, oProduct, oCartModel, iQuantity = 1) {
            if (oProduct?.getData()?.product !== undefined){
                oProduct = oProduct.getData().product;
				console.log(oProduct);
            }else {
				oProduct = oProduct.getData();
				console.log(oProduct);
			}

            switch (oProduct.status) {
				case "O":
					
					MessageBox.show(
						oBundle.getText("productStatusOutOfStockMsg"), {
                            icon: MessageBox.Icon.ERROR,
							title: oBundle.getText("productStatusOutOfStockTitle"),
							actions: [MessageBox.Action.OK]
						});
					break;
				case "A":
				default:
					this._updateCartItem(oBundle, oProduct, oCartModel, iQuantity);
					break;  
            }
        },

        _updateCartItem: function (oBundle, oProductToBeAdded, oCartModel,iQuantity) {
			const aCart = oCartModel.getProperty("/cartEntries") || [];

			let iIndex = aCart.findIndex(p => p.id === oProductToBeAdded.id);

			console.log(iIndex);

			if (iIndex > -1) {
				if (iQuantity === -1) {
					// Eliminar el producto completamente
					aCart.splice(iIndex, 1);
				} else {
					aCart[iIndex].quantity += iQuantity;
				}
			} else if (iQuantity !== -1) {
				// Si no existe y se intenta agregar (no eliminar)
				let oNewProduct = Object.assign({}, oProductToBeAdded);
				oNewProduct.quantity = iQuantity;
				aCart.push(oNewProduct);
			}

			// Actualizar el modelo con el nuevo array
			oCartModel.setProperty("/cartEntries", [...aCart]);

			// Mensaje visual
			const sMsg = (iQuantity === -1)
				? oBundle.getText("productMsgRemovedFromCart", [oProductToBeAdded.name])
				: oBundle.getText("productMsgAddedToCart", [oProductToBeAdded.name]);

			MessageToast.show(sMsg);
		},

		removeFromCart: function (oBundle, oProduct, oCartModel) {
		
			MessageBox.confirm(
				oBundle.getText("productRemoveFromCartMsg", [oProduct.name]), {
					title: oBundle.getText("productRemoveFromCartTitle"),
					icon: MessageBox.Icon.WARNING,
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					onClose: (oAction) => {
						if (oAction === MessageBox.Action.YES) {
							this._updateCartItem(oBundle, oProduct, oCartModel, -1);
						}
					}
				}
			);
		}
		
    }
})