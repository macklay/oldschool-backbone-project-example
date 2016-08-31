"use strict";

/** Main product model. */
App.Models.ProductModel = Backbone.Model.extend({

  /** @type {string} */
  storageKey: 'products',

  /** @type {string} */
  idAttribute: 'product_id',

  defaults: {
    product_id: null,
    product_name: '',
    url: null,
    keywords: [],
    pages: [],
    favorite: false
  }
});