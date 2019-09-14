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
    EngageModel.prototype.getValue = function (value) {
        switch (typeof value) {
            case 'string':
                if ((value.match(/\.(jpeg|jpg|gif|png)$/) != null)) {
                    return 'image';
                }
                else if (value.split('/').pop().indexOf('.') > -1) {
                    return 'file';
                }
                return 'string';
            case 'number':
                return 'string';
            case 'boolean':
                return 'string';
            case 'object':
                if (value.length) {
                    return 'array';
                }
                return 'string';
            default:
                return '';
        }
    };
    EngageModel.prototype.analyze = function (data) {
        var _this = this;
        var dataArray = Object.keys(data);
        return dataArray.map(function (key, index) {
            return {
                name: data[key],
                label: data[key],
                type: _this.getValue(data[key]),
                choices: [],
                relation: '',
                collection: '',
                backup: false,
                required: false,
                default: '',
                multiple: false,
                min: -1,
                max: -1,
                size: '',
                siblingValue: '',
                updateSibling: '',
                field: '',
                quality: '',
                permission: []
            };
        });
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