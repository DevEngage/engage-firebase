"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EngageAnalytics {
    constructor(path, data) {
        this.path = path;
        this.data = data;
        //path: $analytics/watchingValues
    }
    linkFieldToCollection(field) {
        // TODO: collection($analytics/watchingValues)
        //  { values }
        // TODO: collection($analytics/watchingValues/relations)
    }
    healthCheck() {
    }
}
exports.EngageAnalytics = EngageAnalytics;
//# sourceMappingURL=analytics.js.map