"use strict";

/** Products list view. */
App.Views.ProductsList = App.Views.WidgetView.extend({

  /** @type {string} */
  templateUrl: '/modules/products/widgets/productsList/productsList.html',

  /** @type {string} */
  tagName: 'div',

  /** @type {string} */
  className: 'products-list',

  /** @type {App.Services.ProductsService} */
  productService: null,

  initialize: function () {
    this.productService = App.container.get(App.Services.ProductsService);
    this.productStateModel = App.container.get(App.Models.ProductStateModel);
    this.productsCollection = this.productService.getProductsCollection();

    this.productStateModel.on('change:isFavoriteProductsOnly', this.render.bind(this));
    this.productsCollection.on('add remove', this._onCollectonChanged.bind(this));
  },

  /**
   * On render handler
   */
  onRender: function () {
    var isFavoriteProductsOnly = this.productStateModel.get('isFavoriteProductsOnly');

    this.productsCollection.each(function (model) {
      if (isFavoriteProductsOnly && !model.get('favorite')) {
        return;
      }
      var item = new App.Views.ProductsListItem({productModel: model});
      item.render();
      this.$el.append(item.$el);
    }.bind(this));
  },

  _onCollectonChanged: function () {
    this.productsCollection.fetch();
    this.render();
  }
});
