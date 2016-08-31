"use strict";

/** Service layer for work with products data. */
App.Services.ProductsService = function () {
  /** @type {App.Collections.ProductCollection} */
  var collection = App.container.get(App.Collections.ProductCollection);
  collection.fetch();

  /**
   * Get nain products collection
   * @returns {App.Collections.ProductCollection}
   */
  this.getProductsCollection = function () {
    return collection;
  };

  /**
   * Create new model and put this model into collection
   * @param data
   */
  this.add = function (data) {
    if (!data.product_id) {
      data.product_id = new Date().getTime();
    }
    var model = new App.Models.ProductModel(data);
    model.save();
    collection.add(model);
  };

  /**
   * Get keywords total count for all product models
   */
  this.getKeywordsCount = function () {
    return this._getPropCount('keywords');
  };

  /**
   * Get Pages total count for all product models
   */
  this.getPagesCount = function () {
    return this._getPropCount('pages');
  };

  this._getPropCount = function (name) {
    var count = 0;
    collection.each(function (model) {
      count += (model.get(name) || []).length;
    })
    return count;
  };
};
