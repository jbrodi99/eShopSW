sap.ui.define([
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (
    MessageBox,
    MessageToast) {
    "use strict"

    return {
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
            let oCollectionProducts = oCartModel.getData()["cart"];
            
            let oCartProduct = oCollectionProducts[oProductToBeAdded.id];

			if (oCartProduct === undefined) {
				// create new entry
				oCartProduct = Object.assign({}, oProductToBeAdded);
				oCartProduct.Quantity = 1;
				oCollectionProducts[oProductToBeAdded.id] = oCartProduct;
			} else {
				// update existing entry
				oCartProduct.Quantity += 1;
			}

            oCartModel.setProperty("/cart", Object.assign({}, oCollectionProducts));
			oCartModel.refresh(true);
			MessageToast.show(oBundle.getText("productMsgAddedToCart", [oProductToBeAdded.name] ));
        }
    }
})