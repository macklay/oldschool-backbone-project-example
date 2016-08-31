"use strict";

/** Main product collection. */
App.Collections.ProductCollection = Backbone.Collection.extend({
  /** @type {App.Models.ProductModel} */
  model: App.Models.ProductModel,

  /** @type {string} */
  storageKey: 'products'
});