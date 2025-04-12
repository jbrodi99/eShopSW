sap.ui.define([
    "com/geonosis/shop/e/shop/geonosis/controller/BaseController",
    "com/geonosis/shop/e/shop/geonosis/model/products",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
  ], (BaseController,products, Filter, FilterOperator) => {
    "use strict";
  
    return BaseController.extend("com.geonosis.shop.e.shop.geonosis.controller.App", {
        onInit() {
          let testModel = products.createProductsModel(this.getOwnerComponent().getModel("catalog"));
          console.log(testModel);
          this.getView().setModel(testModel, "products");
        },

        onFilter: function (oEvent) {
        //   let res = products.getFilteredProducts(this.getOwnerComponent().getModel("catalog"),oEvent.getSource().getValue());
        //   console.log(res)

          // let prodById = products.getProductById(this.getOwnerComponent().getModel("catalog"),oEvent.getSource().getValue());
          // console.log(prodById);

        
          let sSearchQuery = oEvent.getSource().getValue();
            let aFilters = [];
            if (sSearchQuery && sSearchQuery.length > 0) {
                //Crea un filtro para el campo "CustomerName" usando el operador Contains
                let oFilter = new Filter("name", FilterOperator.Contains, sSearchQuery);
                aFilters.push(oFilter);
            }
            //Obtiene la lista con el id "invoiceList", vista Main.view.xml
            let oList = this.byId("list");
            //Obtiene el binding de items y aplica los filtros
            let oBinding = oList.getBinding("items");
            oBinding.filter(aFilters, "Application");

        }
    });
  });