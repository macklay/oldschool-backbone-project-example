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