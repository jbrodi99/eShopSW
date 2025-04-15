sap.ui.define([
  "sap/ui/model/json/JSONModel"
], 
function (JSONModel) {
    "use strict";

    return {

      createProductsModel: function(oComponent) {
        let aProducts = this._getAllProducts(oComponent);
        let oProductModel = new JSONModel({ products: aProducts });
        return oProductModel;
      },

      getFilteredProducts: function (oComponent, sQuery) {
        const oCatalogModel = oComponent.getModel("catalog");
        const oCatalogData = oCatalogModel?.getData();
        const aFilteredProducts = [];
        const sQueryLower = sQuery.toLowerCase();
        
      
        if (oCatalogData && oCatalogData.catalog.categories) {
          let bFound = false;
      
          for (const category of oCatalogData.catalog.categories) {
            const bCategoryMatch = category.id?.toLowerCase().includes(sQueryLower) ||
                                   category.name?.toLowerCase().includes(sQueryLower);
      
            if (bCategoryMatch) {
              for (const sub of category.subcategories || []) {
                aFilteredProducts.push(...(sub.products || []));
              }
              bFound = true;
              break;
            }
      
            const oSubcategory = category.subcategories.find(sub =>
              sub.id?.toLowerCase().includes(sQueryLower) ||
              sub.name?.toLowerCase().includes(sQueryLower)
            );
            
      
            if (oSubcategory) {

              aFilteredProducts.push(...(oSubcategory.products || []));
              bFound = true;
              break;
            }
          }
      
          if (!bFound) {
            
            for (const category of oCatalogData.catalog.categories) {
              for (const sub of category.subcategories || []) {
                const aMatchingProducts = (sub.products || []).filter(prod =>
                  prod.name?.toLowerCase().includes(sQueryLower)
                );
                aFilteredProducts.push(...aMatchingProducts);
              }
            }
          }
        }
      
        return new JSONModel({ 
          products: aFilteredProducts,
          _originalProducts: [...aFilteredProducts]
        });
      },

      _getAllProducts: (oComponent) => {
        let oCatalogModel = oComponent.getModel("catalog");
        let oCatalogData = oCatalogModel?.getData?.(); // <- correctamente accediendo a oData

        let aCategories = oCatalogData?.catalog?.categories || []; // <- defensivo

        let extractedProduct = (aCategories) => {
          return aCategories.reduce((aProducts, category) => {
            category.subcategories?.forEach(subCategory => {
              aProducts.push(...subCategory.products);
            });
            return aProducts;
          }, []);
        };
        
        return extractedProduct(aCategories);
      },

      getById: function (oComponent, sId) {
        let oCatalogModel = oComponent.getModel("catalog");
        let oCatalogData = oCatalogModel?.getData?.();
        let aCategories = oCatalogData?.catalog?.categories || []; // <- defensivo

        let product = {};

        aCategories.forEach(cat => {
          cat.subcategories.forEach(sub => {
            sub.products.forEach(prod => {
              if(prod.id === sId){
                product = prod;
                product.category = cat.id;
                product.subcategory = sub.id;
              }
            })
          })
        });
        
        let details = Object.entries(product.details).map(([key, value]) => {
          return { key, value };
        });
        
        return new JSONModel({
          product : product,
          productDetails: details
        });
      }
    };

});