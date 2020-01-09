"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var trigger_1 = require("./trigger/trigger");
exports.EngageTrigger = trigger_1.default;
var analytics_1 = require("./analytics/analytics");
exports.EngageAnalytics = analytics_1.EngageAnalytics;
var algolia_export_1 = require("./algolia/algolia.export");
exports.AlgoliaExport = algolia_export_1.AlgoliaExport;
var v2_1 = require("./v2");
exports.EngageDoc = v2_1.EngageDoc;
// IEngageFirebase, IEngageFirebaseObject, IEngageImage, IEngageFirebaseCollection, IEngageFirebaseDoc, IEngageModel,
var firestore_functions_1 = require("./firestore/firestore.functions");
exports.EngageFirestore = firestore_functions_1.default;
var analytics_trigger_1 = require("./trigger/analytics.trigger");
exports.EngageAnalyticsTrigger = analytics_trigger_1.EngageAnalyticsTrigger;
analytics_1.EngageAnalytics.DOC = v2_1.EngageDoc;
analytics_1.EngageAnalytics.STORE = firestore_functions_1.default;
analytics_trigger_1.EngageAnalyticsTrigger.STORE = firestore_functions_1.default;
analytics_trigger_1.EngageAnalyticsTrigger.DOC = v2_1.EngageDoc;
var firestore = firestore_functions_1.engageFirestore;
exports.firestore = firestore;
var Doc = v2_1.EngageDoc;
exports.Doc = Doc;
exports.default = trigger_1.default;
//# sourceMappingURL=functions.js.map