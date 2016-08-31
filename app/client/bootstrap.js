"use strict";

/** Main app bootstrap logic. */
App.Objects.Router = Backbone.Router.extend({

  routes: {
    '*notFound': "notFoundPage"
  },

  currentLayout: null,
  currentLayoutClass: null,

  initialize: function () {

    App.container = new App.Objects.Container();

    this.$el = $('.js-layout-container');
    $(document).on('click', 'a', this._onLinkClick.bind(this));

    var that = this;
    window.App.routes.forEach(function (data) {
      that.route(data.route, data.name, function () {
        var view = new data.ViewClass({routeArguments: arguments});
        view.render();
        if (that.currentLayoutClass !== data.LayoutClass) {
          that.currentLayout = new data.LayoutClass();
          that.currentLayoutClass = data.LayoutClass;
          that.$el.html(that.currentLayout.$el);
          that.currentLayout.render().then(function () {
            that.currentLayout.setContent(view.$el);
          });
        } else {
          that.currentLayout.setContent(view.$el);
        }
      });
    });

    var stateModel = App.container.get(App.Models.ProductStateModel);
    stateModel.set('limits', window.dataset.limits);
  },

  _onLinkClick: function (event) {
    var href = $(event.currentTarget).attr('href');

    if (~href.indexOf('//')) {
      return;
    }

    event.preventDefault();
    this.navigate(href, true);
  },

  notFoundPage: function () {
    this.$el.html('<h1>Page not Found =(</h1>');
  }
});