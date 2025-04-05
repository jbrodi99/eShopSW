sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel"
], (BaseController,JSONModel) => {
  "use strict";

  return BaseController.extend("com.geonosis.shop.e.shop.geonosis.controller.App", {
      onInit() {
        let sImagePath = "../assets/images/geo-logo.png";
        // let sImagePath = "../assets/images/group.png";
        
        // Crear un modelo con la imagen
        let oImageModel = new JSONModel({
            logo: sImagePath
        });

        // Asignar el modelo a la vista
        this.getView().setModel(oImageModel, "logoModel");
      }
  });
});