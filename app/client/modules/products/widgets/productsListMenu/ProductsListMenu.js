"use strict";

/** Actions menu for main products page header. */
App.Views.ProductsListMenu = App.Views.WidgetView.extend({

  /** @type {string} */
  templateUrl: '/modules/products/widgets/productsListMenu/productsListMenu.html',

  /** @type {string} */
  tagName: 'aside',

  /** @type {string} */
  className: 'products-list-menu container',

  events: {
    'change input': '_onFilterChange',
    'selectmenuchange .js-fav-tool': '_onFavoriteToolChange',
    'click #new': '_onNewClick'
  },

  /** @type {Backbone.View} */
  formView: null,

  /** @type {Object} */
  $dialog: null,

  initialize: function () {
    this.productStateModel = App.container.get(App.Models.ProductStateModel);
    this.productService = App.container.get(App.Services.ProductsService);
  },

  /**
   * On template execute handler
   * @param template
   */
  onTemplate(template) {
    return _.template(template)({
      tools: App.config.productTools,
      favoriteToolName: this.productStateModel.get('favoriteToolName'),
      isFavoriteProductsOnly: this.productStateModel.get('isFavoriteProductsOnly')
    });
  },

  /**
   * On render handler
   */
  onRender: function () {
    this.$('input').checkboxradio();
    this.$('.js-fav-tool').selectmenu();
    this._initDialog();
  },

  _initDialog: function () {
    this.formView = new App.Views.AddNewForm();
    this.formView.render();

    var that = this;
    this.$dialog = this.formView.$el.dialog({
      title: 'Add new product',
      modal: true,
      width: 500,
      buttons: {
        Ok: function () {
          that._addProduct(that.formView.getData());
          $(this).dialog('close');
        }
      }
    }).dialog('close');
  },

  _addProduct: function (data) {
    this.productService.add({
      product_name: data.name,
      url: data.domain
    });
  },

  _onFavoriteToolChange: function () {
    var $select = this.$('.js-fav-tool');
    this.productStateModel.save({favoriteToolName: $select.val()});
  },

  _onFilterChange: function () {
    var $filter = this.$('input:checked');
    this.productStateModel.save({isFavoriteProductsOnly: $filter.val() === 'FAVORITE'});
  },

  _onNewClick: function () {
    this.$dialog.dialog('open');
    this.formView.reset();
  }
});
