"use strict";

/** Form for new product dialog. */
App.Views.AddNewForm = App.Views.WidgetView.extend({

  /** @type {string} */
  templateUrl: '/modules/products/widgets/addNewForm/addNewForm.html',

  /** @type {string} */
  tagName: 'div',

  /** @type {string} */
  className: 'add-new-form',

  events: {
    'input input[type="text"]': '_onInputChange'
  },

  /**
   * On render handler
   */
  onRender: function () {
    this._checkForm();
  },

  /**
   * Reset html form
   */
  reset: function () {
    this.$('form').get(0).reset();
  },

  /**
   * Get form data
   * @returns {{name: *, domain: *}}
   */
  getData: function () {
    return {
      name: this.$('[name="name"]').val(),
      domain: this.$('[name="domain"]').val()
    }
  },

  _onInputChange: function () {
    this._checkForm();
  },

  _checkForm: function () {
    var data = this.getData();

    var isInvalidUrl = !!~data.domain.indexOf('.');
    var isInvalid = !data.name || !data.domain || !isInvalidUrl;

    this.$el.parent().find('.ui-dialog-buttonset button').button(isInvalid ? 'disable' : 'enable');

    this.$('[name="domain"]').toggleClass('error', !(isInvalidUrl || !data.domain.trim()));
  }
});
