/** Base view class for all project views. */
(function () {
  "use strict";

  var cache = {};

  App.Views.WidgetView = Backbone.View.extend({

    /** @type {string} */
    template: null,

    /** @type {string} */
    templateUrl: null,

    render: function () {
      var that = this;
      return new Promise(function (resolve, reject) {
        if (that.templateUrl) {
          if (cache[that.templateUrl]) {
            that._applyHtml.call(that, cache[that.templateUrl]);
            resolve();
          } else {
            $.get(that.templateUrl, function (html) {
              cache[that.templateUrl] = html;
              that._applyHtml.call(that, html)
              resolve();
            });
          }
        } else {
          resolve();
        }
      });
    },

    _applyHtml: function (html) {
      this.$el.html(this.onTemplate(html));
      this.onRender();
    },

    onTemplate(html) {
      return html;
    },

    onRender: function () {

    }
  });
})();
