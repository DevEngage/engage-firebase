"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var firestore_1 = require("./firestore/firestore");
exports.EngageFirestore = firestore_1.default;
var doc_1 = require("./doc/doc");
exports.EngageFireDoc = doc_1.default;
var model_1 = require("./model/model");
exports.EngageModel = model_1.default;
var algolia_1 = require("./algolia/algolia");
exports.EngageAlgolia = algolia_1.EngageAlgolia;
var image_1 = require("./image/image");
exports.EngageImage = image_1.EngageImage;
var admin_model_1 = require("./models/admin.model");
exports.adminModel = admin_model_1.adminModel;
var firestore = firestore_1.engageFirestore;
exports.firestore = firestore;
var Doc = doc_1.default;
exports.Doc = Doc;
exports.default = firestore_1.engageFirestore;
//# sourceMappingURL=index.js.map