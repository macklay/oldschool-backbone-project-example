"use strict";

/** Main page vew controller. */
App.Views.ProductsMain = App.Views.PageView.extend({

  /** @type {string} */
  templateUrl: '/modules/products/pages/productsMain/productsMain.html',

  /** @type {string} */
  className: 'products-main-page',

  /**
   * On render handler
   */
  onRender: function () {
    var $header = this.$('>header');

    var menu = new App.Views.ProductsListMenu();
    menu.render();
    $header.append(menu.$el);

    var list = new App.Views.ProductsList();
    list.render()
    $header.after(list.$el);
  }
});
