"use strict";

/** Base view class for main layouts. */
App.Views.LayoutView = App.Views.WidgetView.extend({

  /** @type {string} */
  contentSelector: null,

  /** @type {object} */
  _$main: null,
  /** @type {object} */
  _$content: null,

  constructor: function () {
    if (!this.contentSelector) {
      throw new Error('Layout contentSelector prop must be set');
    }
    this._$main = $(this.contentSelector);
    window.App.Views.WidgetView.prototype.constructor.apply(this, arguments);
  },

  /**
   * Insert content in layout html
   * @param $content
   */
  setContent: function ($content) {
    this._$content = $content;
    this._$main.html(this._$content);
  },

  onRender: function () {
    this._$main = $(this.contentSelector);
  }
});
