"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EngageAnalytics = /** @class */ (function () {
    function EngageAnalytics(path, data) {
        this.path = path;
        this.data = data;
        //path: $analytics/watchingValues
    }
    EngageAnalytics.prototype.linkFieldToCollection = function (field) {
        // TODO: collection($analytics/watchingValues)
        //  { values }
        // TODO: collection($analytics/watchingValues/relations)
    };
    EngageAnalytics.prototype.healthCheck = function () {
    };
    return EngageAnalytics;
}());
exports.EngageAnalytics = EngageAnalytics;
//# sourceMappingURL=analytics.js.map