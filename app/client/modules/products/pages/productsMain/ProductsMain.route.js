/** Main page route. */
(function () {
  "use strict";

  window.App.routes.push({
    name: 'list',
    route: '',
    LayoutClass: App.Views.DefaultLayout,
    ViewClass: App.Views.ProductsMain
  })
})();
