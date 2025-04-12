sap.ui.define([
  "sap/ui/model/json/JSONModel"
], 
function (JSONModel) {
    "use strict";

    return {

      createProductsModel: function(oModel) {
        let aProducts = this._getAllProducts(oModel);
        let oProductModel = new JSONModel({ products: aProducts });
        return oProductModel;
      },

      getFilteredProducts: function (oCatalogModel, sQuery) {
        let oCatalogData = oCatalogModel?.getData();

        let aFilteredProducts = [];
        
        if (oCatalogData && oCatalogData.catalog.categories) {
          const sQueryLower = sQuery.toLowerCase();
  
          for (const category of oCatalogData.catalog.categories) {
            const bCategoryMatch = category.id?.toLowerCase().includes(sQueryLower) ||
                                   category.name?.toLowerCase().includes(sQueryLower);
  
            if (bCategoryMatch) {
              for (const sub of category.subcategories || []) {
                aFilteredProducts.push(...(sub.products || []));
              }
              break;
            }
  
            const oSubcategory = category.subcategories.find(sub =>
              sub.id?.toLowerCase().includes(sQueryLower) ||
              sub.name?.toLowerCase().includes(sQueryLower)
            );
  
            if (oSubcategory) {
              aFilteredProducts = oSubcategory.products || [];
              break;
            }
          }
        }

        return aFilteredProducts;
      },

      _getAllProducts: (oModel) => {
        let oCatalogData = oModel ? oModel.getData() : { catalog: { categories: [] } };
  
        let extractedProduct = (aCategories) => {
          return aCategories.reduce((aProducts, category) => {
            category.subcategories.forEach(subCategory => {
              aProducts.push(...subCategory.products);
            });
            return aProducts;
          }, []);
        };
  
        let aProducts = extractedProduct(oCatalogData.catalog.categories);
        
        return aProducts;
      }
    };

});