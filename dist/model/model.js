"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EngageModel = /** @class */ (function () {
    function EngageModel(model, data) {
        this.model = model;
        this.data = data;
        this.keys = [];
        if (this.model) {
            this.generateKeys();
        }
    }
    EngageModel.prototype.generateKeys = function () {
        this.keys = this.model.map(function (item) { return item.name || ''; }).filter(function (item) { return item !== ''; });
    };
    EngageModel.prototype.setModel = function (model) {
        this.model = model;
    };
    EngageModel.prototype.getModel = function () {
        return this.model;
    };
    EngageModel.prototype.addModel = function (modelItem) {
        this.model.push(modelItem);
    };
    EngageModel.prototype.setData = function (data) {
        this.data = data;
    };
    EngageModel.prototype.validateAll = function (data) {
        var _this = this;
        if (!data)
            data = this.data;
        return this.model.every(function (item) {
            return _this.validate(item.name, data);
        });
    };
    EngageModel.prototype.validate = function (key, data) {
        var valid = true;
        var dataItem = data[key || ''];
        var modelItem = this.model.find(function (item) { return item && item.name === key; });
        if (!modelItem || !key) {
            return false;
        }
        if (!dataItem && modelItem && modelItem.required) {
            return false;
        }
        if (dataItem && modelItem && modelItem.type) {
            valid = typeof dataItem === modelItem.type;
        }
        if (!dataItem && modelItem && modelItem.default !== undefined) {
            data[key] = modelItem.default;
        }
        return valid;
    };
    return EngageModel;
}());
exports.default = EngageModel;
exports.validateFunction = function (change, model) {
    var data = change.after.data();
    var valid = new EngageModel(model, data).validateAll();
    return valid ? data : change.before.data();
};
//# sourceMappingURL=model.js.map