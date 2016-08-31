"use strict";

/** One product page vew controller. */
App.Views.ProductItem = App.Views.PageView.extend({

  /** @type {string} */
  templateUrl: '/modules/products/pages/productsItem/productsItem.html',

  /** @type {string} */
  className: 'products-item-page container',

  events: {
    'click .js-delete': '_onDelete'
  },

  /** @type {App.Services.ProductsService} */
  productService: null,

  initialize: function (options) {
    this.productId = options.routeArguments[0];
    this.productService = App.container.get(App.Services.ProductsService);
    this.productStateModel = App.container.get(App.Models.ProductStateModel);

    this.collection = this.productService.getProductsCollection();
    this.productModel = this.collection.findWhere({product_id: +this.productId});
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
      keywords: this.productModel.get('keywords'),
      limits: this.productStateModel.get('limits'),
      current: {
        products: this.collection.length,
        keywords: this.productService.getKeywordsCount(),
        pages: this.productService.getPagesCount()
      }
    });
  },

  /**
   * On render handler
   */
  onRender: function () {
    var that = this;
    this.$dialog = $('<p>Are you shure?</p>').dialog({
      autoOpen: false,
      resizable: false,
      height: 170,
      modal: true,
      buttons: {
        Yes: function () {
          that._deleteItem();
          $(this).dialog('close');
        },
        Cancel: function () {
          $(this).dialog('close');
        }
      }
    });
  },

  _deleteItem: function () {
    this.productModel.destroy();
    this.collection.remove(this.productModel);
    App.router.navigate('', {trigger: true});
  },

  _onDelete: function () {
    this.$dialog.dialog("open");
    return false;
  }
});
