sap.ui.define([
    "com/geonosis/shop/e/shop/geonosis/controller/BaseController",
    "sap/ui/model/json/JSONModel"
  ], (BaseController, JSONModel) => {
    "use strict";
  
    return BaseController.extend("com.geonosis.shop.e.shop.geonosis.controller.Detail", {
      onInit: function() {

        let mockProduct = {
            "id": "prod12",
            "name": "Modelo Destructor Estelar",
            "price": 499.99,
            "currency": "USD",
            "description": "Magnífico modelo a escala del Destructor Estelar con múltiples detalles, ideal para los coleccionistas.",
            "image": [
            "assets/images/luke.png",
            "assets/images/luke.png",
            "assets/images/luke.png"
            ],
            "mainImage": "assets/images/luke.png",
            "stock": 3,
            "cantidadVendida": 5,
            "rating": 4.9,
            "details": {
            "scale": "1:144",
            "material": "Plástico y metal",
            "manufacturer": "Starship Models",
            "weight": "3.5 kg"
            },
            "tags": ["modelo", "Destructor Estelar", "Star Wars", "coleccionable"],
            "variants": []
        };

        let detailsObject = mockProduct.details;
        let detailsArray = Object.entries(detailsObject).map(([key, value]) => {
          return { key, value };
        });
        mockProduct.detailsArray = detailsArray;

        let oProductModel = new JSONModel({product: mockProduct});

        console.log(oProductModel);
        this.getView().setModel(oProductModel, "product");
      }
    });
  });