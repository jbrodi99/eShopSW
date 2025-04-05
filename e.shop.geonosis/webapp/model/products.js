sap.ui.define([
  "sap/ui/model/json/JSONModel"
], (JSONModel) => {
  "use strict";

  return {
    createProductsModel: function(oComponent) {
      let aProducts = this._getAllProducts(oComponent);
      let oProductModel = new JSONModel({ products: aProducts });
      return oProductModel;
    },

    createFeactureProductsModel: function (oComponent) {
      let aProducts = this._getAllProducts(oComponent);

      let aFeaturedProducts = aProducts.filter(product => product.rating >= 4.7);

      let oFeaturedModel = new JSONModel({ products: aFeaturedProducts });
      return oFeaturedModel;
    },
    
    createTopSellingByCategoryModel: function (oComponent, n = 5) {
      let oCatalogModel = oComponent.getModel("catalog");
      let oCatalogData = oCatalogModel ? oCatalogModel.getData() : { catalog: { categories: [] } };
    
      let aCategoryTopSellers = [];
    
      oCatalogData.catalog.categories.forEach(category => {
        let aProducts = [];
        category.subcategories.forEach(subcat => {
          aProducts.push(...subcat.products);
        });
    
        let aTop = aProducts
          .sort((a, b) => (b.cantidadVendida || 0) - (a.cantidadVendida || 0))
          .slice(0, n);
    
        aCategoryTopSellers.push({
          id: category.id,
          name: category.name,
          topProducts: aTop
        });
      });
    
      return new JSONModel({ categories: aCategoryTopSellers });
    },

    _getAllProducts: (oComponent) => {
      let oCatalogModel = oComponent.getModel("catalog");
      let oCatalogData = oCatalogModel ? oCatalogModel.getData() : { catalog: { categories: [] } };

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
  }
})