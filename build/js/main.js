"use strict";

/** Base app object. */
window.App = {
  Models: {},
  Collections: {},
  Services: {},
  Views: {},
  router: {},
  Objects: {},
  routes: [],
  container: null,
  config: {},
};

/** Main App config. */
App.config = {
  productTools: [
    {name: 'Site Audit'},
    {name: 'Position tracking'},
    {name: 'Backlink Audit', version: 'beta'},
    {name: 'SEO Ideas'},
    {name: 'PPC Keyword tool', version: 'alpha'},
    {name: 'Social Media'},
    {name: 'Brand monitoring', version: 'beta'},
  ]
};
"use strict";

/** Backbone default function "sync" overload for work with localStorage and mock data from dataset.js */
Backbone.sync = function (method, model, options) {
  if (!model.storageKey) {
    return;
  }
  var data, collData, coll, idAttr, isExist;
  var type = model.cid ? 'model' : 'collection';

  if (method === 'read') {
    var json = localStorage.getItem(type + '.' + model.storageKey);

    if (!json) {
      data = window.dataset[model.storageKey];
      if (!data) {
        return;
      }
      localStorage.setItem(type + '.' + model.storageKey, JSON.stringify(data));
    } else {
      data = JSON.parse(json);
    }
    model.set(data);
  } else if (method === 'update') {
    collData = localStorage.getItem('collection.' + model.storageKey);
    if (collData) {
      coll = JSON.parse(collData);
      idAttr = model.idAttribute;
      isExist = false;
      coll = coll.map(function (itemModel) {
        if (itemModel[idAttr] === model.get(idAttr)) {
          isExist = true;
          return model.toJSON();
        }
        return itemModel
      });
      if (!isExist) {
        coll.unshift(model.toJSON());
      }
      localStorage.setItem('collection.' + model.storageKey, JSON.stringify(coll));
    } else {
      localStorage.setItem('model.' + model.storageKey, JSON.stringify(model.toJSON()));
    }

  } else if (method === 'create') {
    localStorage.setItem(type + '.' + model.storageKey, JSON.stringify(model.toJSON()));
  } else if (method === 'delete') {
    collData = localStorage.getItem('collection.' + model.storageKey);
    if (collData) {
      coll = JSON.parse(collData);
      idAttr = model.idAttribute;
      isExist = false;
      coll = coll.filter(function (itemModel) {
        if (itemModel[idAttr] === model.get(idAttr)) {
          return false;
        }
        return true;
      });
      localStorage.setItem('collection.' + model.storageKey, JSON.stringify(coll));
    }
  }
};
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

/** Simple DI container. */
(function () {
  "use strict";

  var objects = [];

  App.Objects.Container = function (classObject) {
  }

  /**
   * Get class instance
   * @param classObject
   * @returns {*}
   */
  App.Objects.Container.prototype.get = function (classObject) {

    var obj = _.findWhere(objects, {classObject: classObject});
    if (!obj) {
      var instance = new classObject();
      objects.push({classObject: classObject, instance: instance});
      return instance;
    }

    obj = _.findWhere(objects, {classObject: classObject})
    return obj.instance;
  }
})();

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

"use strict";

/** Base view class for pages controllers. */
App.Views.PageView = App.Views.WidgetView.extend({
  /** @type {string} */
  tagName: "main"
})

"use strict";

/** Main product model. */
App.Models.ProductModel = Backbone.Model.extend({

  /** @type {string} */
  storageKey: 'products',

  /** @type {string} */
  idAttribute: 'product_id',

  defaults: {
    product_id: null,
    product_name: '',
    url: null,
    keywords: [],
    pages: [],
    favorite: false
  }
});
"use strict";

/** States model for UI products logic. */
App.Models.ProductStateModel = Backbone.Model.extend({

  /** @type {string} */
  storageKey: 'productsState',

  initialize: function () {
    this.fetch();
  },

  defaults: {
    isFavoriteProductsOnly: null,
    favoriteToolName: null,
    limits: {}
  }
});
"use strict";

/** Main product collection. */
App.Collections.ProductCollection = Backbone.Collection.extend({
  /** @type {App.Models.ProductModel} */
  model: App.Models.ProductModel,

  /** @type {string} */
  storageKey: 'products'
});
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
"use strict";

/** Mock data set. Only for demonstration. */
window.dataset = {
  limits: {
    pages: 12300,
    keywords: 12300000,
    products: 123
  },
  products: [
    {
      "keywords": [
        {
          "keyword": "backbone cache collection",
          "tags": [],
          "timestamp": 1429262433
        },
        {
          "keyword": "backbone cache",
          "tags": [],
          "timestamp": 1429262433
        },
        {
          "keyword": "backbone cache model",
          "tags": [],
          "timestamp": 1429262433
        },
        {
          "keyword": "backbone",
          "tags": [],
          "timestamp": 1429262433
        },
        {
          "keyword": "backbone cache fetch",
          "tags": [],
          "timestamp": 1429262433
        }
      ],
      "product_id": 19215,
      "product_name": "amazone",
      "url": "amazone.com"
    },
    {
      "keywords": [
        {
          "keyword": "backbone cache collection",
          "tags": [],
          "timestamp": 1429262433
        },
        {
          "keyword": "backbone cache",
          "tags": [],
          "timestamp": 1429262433
        },
        {
          "keyword": "backbone cache model",
          "tags": [],
          "timestamp": 1429262433
        },
        {
          "keyword": "backbone",
          "tags": [],
          "timestamp": 1429262433
        },
        {
          "keyword": "backbone cache fetch",
          "tags": [],
          "timestamp": 1429262433
        }
      ],
      "product_id": 19216,
      "product_name": "github",
      "url": "https://github.com"
    },
    {
      "keywords": [
        {
          "keyword": "backbone cache collection",
          "tags": [],
          "timestamp": 1429262433
        },
        {
          "keyword": "backbone cache",
          "tags": [],
          "timestamp": 1429262433
        },
        {
          "keyword": "backbone cache model",
          "tags": [],
          "timestamp": 1429262433
        },
        {
          "keyword": "backbone",
          "tags": [],
          "timestamp": 1429262433
        },
        {
          "keyword": "backbone cache fetch",
          "tags": [],
          "timestamp": 1429262433
        }
      ],
      "product_id": 19210,
      "product_name": "twitter",
      "url": "//twitter.com"
    },
    {
      "keywords": [
        {
          "keyword": "backbone cache collection",
          "tags": [],
          "timestamp": 1429262433
        },
        {
          "keyword": "backbone cache",
          "tags": [],
          "timestamp": 1429262433
        }
      ],
      "product_id": 19222,
      "product_name": "ebay",
      "url": "http://ebay.com"
    }
  ]
};
"use strict";

/** Service layer for work with products data. */
App.Services.ProductsService = function () {
  /** @type {App.Collections.ProductCollection} */
  var collection = App.container.get(App.Collections.ProductCollection);
  collection.fetch();

  /**
   * Get nain products collection
   * @returns {App.Collections.ProductCollection}
   */
  this.getProductsCollection = function () {
    return collection;
  };

  /**
   * Create new model and put this model into collection
   * @param data
   */
  this.add = function (data) {
    if (!data.product_id) {
      data.product_id = new Date().getTime();
    }
    var model = new App.Models.ProductModel(data);
    model.save();
    collection.add(model);
  };

  /**
   * Get keywords total count for all product models
   */
  this.getKeywordsCount = function () {
    return this._getPropCount('keywords');
  };

  /**
   * Get Pages total count for all product models
   */
  this.getPagesCount = function () {
    return this._getPropCount('pages');
  };

  this._getPropCount = function (name) {
    var count = 0;
    collection.each(function (model) {
      count += (model.get(name) || []).length;
    })
    return count;
  };
};

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

"use strict";

/** Products list view. */
App.Views.ProductsList = App.Views.WidgetView.extend({

  /** @type {string} */
  templateUrl: '/modules/products/widgets/productsList/productsList.html',

  /** @type {string} */
  tagName: 'div',

  /** @type {string} */
  className: 'products-list',

  /** @type {App.Services.ProductsService} */
  productService: null,

  initialize: function () {
    this.productService = App.container.get(App.Services.ProductsService);
    this.productStateModel = App.container.get(App.Models.ProductStateModel);
    this.productsCollection = this.productService.getProductsCollection();

    this.productStateModel.on('change:isFavoriteProductsOnly', this.render.bind(this));
    this.productsCollection.on('add remove', this._onCollectonChanged.bind(this));
  },

  /**
   * On render handler
   */
  onRender: function () {
    var isFavoriteProductsOnly = this.productStateModel.get('isFavoriteProductsOnly');

    this.productsCollection.each(function (model) {
      if (isFavoriteProductsOnly && !model.get('favorite')) {
        return;
      }
      var item = new App.Views.ProductsListItem({productModel: model});
      item.render();
      this.$el.append(item.$el);
    }.bind(this));
  },

  _onCollectonChanged: function () {
    this.productsCollection.fetch();
    this.render();
  }
});

"use strict";

/** Item view for list of products. */
App.Views.ProductsListItem = App.Views.WidgetView.extend({

  /** @type {string} */
  templateUrl: '/modules/products/widgets/productsListItem/productsListItem.html',

  /** @type {string} */
  tagName: 'section',

  /** @type {string} */
  className: 'products-list-item',

  events: {
    'click .js-fav-project': '_onFavProjectClick'
  },

  initialize: function (options) {
    this.productModel = options.productModel;
    this.productStateModel = App.container.get(App.Models.ProductStateModel);

    this.productModel.on('change:favorite', this._onFavoriteChanged.bind(this));
    this.productStateModel.on('change:favoriteToolName', this._onFavoriteToolChanged.bind(this));
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
      tools: App.config.productTools,
      favoriteToolName: this.productStateModel.get('favoriteToolName'),
      isFavorite: this.productModel.get('favorite')
    });
  },

  _onFavProjectClick: function () {
    this.productModel.save({favorite: !this.productModel.get('favorite')});
  },

  _onFavoriteChanged: function () {
    this.$('.js-fav-project').toggleClass('active', this.productModel.get('favorite'));
  },

  _onFavoriteToolChanged: function (model, value) {
    this.$('.js-tool').removeClass('active');
    this.$('[name="' + value + '"].js-tool').addClass('active');
  }
});

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
