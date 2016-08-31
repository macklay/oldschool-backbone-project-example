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
