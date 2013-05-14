function ucfirst(text) {
    if (!text) return text;
    return text[0].toUpperCase() + text.substr(1);
}

function isTabletFallback() {
    return !(700 > Math.min(Ti.Platform.displayCaps.platformHeight, Ti.Platform.displayCaps.platformWidth));
}

var _ = require("alloy/underscore")._, Backbone = require("alloy/backbone");

var DEFAULT_WIDGET = "widget";

exports.version = "1.2.0";

exports._ = _;

exports.Backbone = Backbone;

exports.M = function(name, modelDesc, migrations) {
    var config = (modelDesc || {}).config || {};
    var adapter = config.adapter || {};
    var extendObj = {};
    var extendClass = {};
    var mod;
    if (adapter.type) {
        mod = require("alloy/sync/" + adapter.type);
        extendObj.sync = function(method, model, opts) {
            mod.sync(method, model, opts);
        };
    } else extendObj.sync = function(method, model) {
        Ti.API.warn("Execution of " + method + "#sync() function on a model that does not support persistence");
        Ti.API.warn("model: " + JSON.stringify(model.toJSON()));
    };
    extendObj.defaults = config.defaults;
    migrations && (extendClass.migrations = migrations);
    mod && _.isFunction(mod.beforeModelCreate) && (config = mod.beforeModelCreate(config, name) || config);
    var Model = Backbone.Model.extend(extendObj, extendClass);
    Model.prototype.config = config;
    _.isFunction(modelDesc.extendModel) && (Model = modelDesc.extendModel(Model) || Model);
    mod && _.isFunction(mod.afterModelCreate) && mod.afterModelCreate(Model, name);
    return Model;
};

exports.C = function(name, modelDesc, model) {
    var extendObj = {
        model: model
    };
    var config = (model ? model.prototype.config : {}) || {};
    var mod;
    if (config.adapter && config.adapter.type) {
        mod = require("alloy/sync/" + config.adapter.type);
        extendObj.sync = function(method, model, opts) {
            mod.sync(method, model, opts);
        };
    } else extendObj.sync = function(method, model) {
        Ti.API.warn("Execution of " + method + "#sync() function on a collection that does not support persistence");
        Ti.API.warn("model: " + JSON.stringify(model.toJSON()));
    };
    var Collection = Backbone.Collection.extend(extendObj);
    Collection.prototype.config = config;
    _.isFunction(modelDesc.extendCollection) && (Collection = modelDesc.extendCollection(Collection) || Collection);
    mod && _.isFunction(mod.afterCollectionCreate) && mod.afterCollectionCreate(Collection);
    return Collection;
};

exports.createWidget = function(id, name, args) {
    if ("undefined" != typeof name && null !== name && _.isObject(name) && !_.isString(name)) {
        args = name;
        name = DEFAULT_WIDGET;
    }
    return new (require("alloy/widgets/" + id + "/controllers/" + (name || DEFAULT_WIDGET)))(args);
};

exports.createController = function(name, args) {
    return new (require("alloy/controllers/" + name))(args);
};

exports.createModel = function(name, args) {
    return new (require("alloy/models/" + ucfirst(name)).Model)(args);
};

exports.createCollection = function(name, args) {
    return new (require("alloy/models/" + ucfirst(name)).Collection)(args);
};

exports.isTablet = function() {
    return "ipad" === Ti.Platform.osname;
}();

exports.isHandheld = !exports.isTablet;

exports.Globals = {};

exports.Models = {};

exports.Models.instance = function(name) {
    return exports.Models[name] || (exports.Models[name] = exports.createModel(name));
};

exports.Collections = {};

exports.Collections.instance = function(name) {
    return exports.Collections[name] || (exports.Collections[name] = exports.createCollection(name));
};

exports.CFG = require("alloy/CFG");