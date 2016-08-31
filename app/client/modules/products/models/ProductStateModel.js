"use strict";

/** States model for UI products logic. */
App.Models.ProductStateModel = Backbone.Model.extend({

  /** @type {string} */
  storageKey: 'productsState',

  initialize: function () {
    this.fetch();
  },

  defaults: {
    isFavoriteProductsOnly: null,
    favoriteToolName: null,
    limits: {}
  }
});