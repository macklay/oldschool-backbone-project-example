/** Item page route. */
(function () {
  "use strict";

  window.App.routes.push({
    name: 'product',
    route: 'product/:productId',
    LayoutClass: App.Views.DefaultLayout,
    ViewClass: App.Views.ProductItem
  })
})();
