"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = require("./auth");
var EngageQuery = /** @class */ (function () {
    function EngageQuery() {
    }
    EngageQuery.prototype.getStringVar = function (what, replaceWith) {
        if (typeof what === 'string' && (what.indexOf('{userId}') > -1 || what.indexOf('{\$userId}') > -1)) {
            return replaceWith || auth_1.default.userId;
        }
        return what;
    };
    /*
    field.isEqualTo: 1
    */
    EngageQuery.prototype.buildQuery = function (filter, customRef) {
        filter.forEach(function (key, value) {
            var keys = key.split('.');
            var field = keys[0];
            var type = keys[1];
            switch (type) {
                case 'isEqualTo':
                    customRef = customRef.where(field, '==', value);
                    break;
                case 'isLessThan':
                    customRef = customRef.where(field, '<', value);
                    break;
                case 'isLessThanOrEqualTo':
                    customRef = customRef.where(field, '<=', value);
                    break;
                case 'isGreaterThan':
                    customRef = customRef.where(field, '>', value);
                    break;
                case 'isGreaterThanOrEqualTo':
                    customRef = customRef.where(field, '>=', value);
                    break;
                case 'isNull':
                    customRef = customRef.where(field, '==', null);
                    break;
                case 'arrayContainsAny':
                    customRef = customRef.where(field, 'array-contains-any', value);
                    break;
                case 'in':
                    customRef = customRef.where(field, 'in', value);
                    break;
                case 'arrayContains':
                    customRef = customRef.where(field, 'array-contains', value);
                    break;
            }
        });
        return customRef;
    };
    EngageQuery.prototype.getFilterDefaults = function (defaults, filter, defaultValue) {
        var _this = this;
        if (filter != null) {
            defaults = defaults || {};
            filter.forEach(function (key, value) {
                if (defaults[key] == null) {
                    var keys = key.split('.');
                    if (keys[0] != null && keys[2] === 'default') {
                        defaults[keys[0]] = _this.getStringVar(value, defaultValue);
                    }
                }
            });
        }
        return defaults;
    };
    return EngageQuery;
}());
exports.default = EngageQuery;
//# sourceMappingURL=query.js.map