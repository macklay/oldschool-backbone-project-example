"use strict";

/** Item view for list of products. */
App.Views.ProductsListItem = App.Views.WidgetView.extend({

  /** @type {string} */
  templateUrl: '/modules/products/widgets/productsListItem/productsListItem.html',

  /** @type {string} */
  tagName: 'section',

  /** @type {string} */
  className: 'products-list-item',

  events: {
    'click .js-fav-project': '_onFavProjectClick'
  },

  initialize: function (options) {
    this.productModel = options.productModel;
    this.productStateModel = App.container.get(App.Models.ProductStateModel);

    this.productModel.on('change:favorite', this._onFavoriteChanged.bind(this));
    this.productStateModel.on('change:favoriteToolName', this._onFavoriteToolChanged.bind(this));
  },

  /**
   * On template execute handler
   * @param template
   */
  onTemplate(template) {
    var name = this.productModel.get('product_name');
    var url = this.productModel.get('url');
    var urlCaption = url.replace(/^(https?:)?\/\//i, '');

    if (!/^((https?:\/\/)|(\/\/))/i.test(url)) {
      url = 'http://' + url;
    }
    return _.template(template)({
      name: name,
      id: this.productModel.get('product_id'),
      url: url,
      urlCaption: urlCaption,
      tools: App.config.productTools,
      favoriteToolName: this.productStateModel.get('favoriteToolName'),
      isFavorite: this.productModel.get('favorite')
    });
  },

  _onFavProjectClick: function () {
    this.productModel.save({favorite: !this.productModel.get('favorite')});
  },

  _onFavoriteChanged: function () {
    this.$('.js-fav-project').toggleClass('active', this.productModel.get('favorite'));
  },

  _onFavoriteToolChanged: function (model, value) {
    this.$('.js-tool').removeClass('active');
    this.$('[name="' + value + '"].js-tool').addClass('active');
  }
});
