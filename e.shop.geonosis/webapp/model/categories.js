sap.ui.define([
    "sap/ui/model/json/JSONModel"
  ], (JSONModel) => {
    "use strict";
  
    return {
      createCategoriesModel: function(oComponent) {
        let aCategories = this._getCategoriesAndSubcategories(oComponent);
        let oCategoriesModel = new JSONModel({ categories: aCategories });
        return oCategoriesModel;
      },
  
      _getCategoriesAndSubcategories: (oComponent) => {
        const oCatalogModel = oComponent.getModel("catalog");
        const oCatalogData = oCatalogModel ? oCatalogModel.getData() : { catalog: { categories: [] } };
      
        // Mapear categorías y subcategorías, sin incluir productos
        const aCategories = oCatalogData.catalog.categories.map(category => {
          return {
            id: category.id,
            name: category.name,
            subcategories: category.subcategories.map(sub => ({
              name: sub.name,
              id: sub.id,
              image: sub.image
            }))
          };
        });
      
        return aCategories;
      }
    }
});