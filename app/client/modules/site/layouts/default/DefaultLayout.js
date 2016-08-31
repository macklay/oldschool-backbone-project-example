"use strict";

App.Views.DefaultLayout = App.Views.LayoutView.extend({

  tagName: "div",

  className: "layout-wrapper container",

  contentSelector: '.js-main-wrapper',

  templateUrl: '/modules/site/layouts/default/defaultLayout.html',

  showWait: function () {
    this.$main.html("Please wait..");
  },

  hideWait: function () {
    this.$main.html("");
  }

});