sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("com.geonosis.shop.e.shop.geonosis.controller.Main", {
        onInit() {
            const oDataImgs = {
                images: [
                    { src: "../assets/images/banner-1-sw.png" },
                    { src: "../assets/images/banner-2-sw.png" },
                    { src: "../assets/images/banner-3-sw.png" }
                ]
            };

            const oModelImgs = new JSONModel(oDataImgs);
            this.getView().setModel(oModelImgs, "view");

        }
    });
});