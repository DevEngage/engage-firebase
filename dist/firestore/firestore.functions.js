"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var firestore_base_1 = require("./firestore.base");
var engagefire_functions_1 = require("../engagefire/engagefire.functions");
var doc_1 = require("../doc/doc");
/*
 * TODO:
 * [ ] Fully test everything!
 * */
var EngageFirestore = /** @class */ (function (_super) {
    __extends(EngageFirestore, _super);
    function EngageFirestore() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(EngageFirestore, "__DOC__", {
        /*
        * STATIC SETUP
        * */
        set: function (doc) {
            EngageFirestore.DOC = doc;
            firestore_base_1.default.DOC = doc;
            doc_1.default.STORE = EngageFirestore;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EngageFirestore, "__ENGAGE_FIRE__", {
        set: function (engageFire) {
            EngageFirestore.ENGAGE_FIRE = engageFire;
            firestore_base_1.default.ENGAGE_FIRE = engageFire;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EngageFirestore, "__FIRE_OPTIONS__", {
        set: function (options) {
            EngageFirestore.FIRE_OPTIONS = options;
            firestore_base_1.default.FIRE_OPTIONS = options;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EngageFirestore, "__STATE__", {
        set: function (state) {
            EngageFirestore.STATE = state;
            firestore_base_1.default.STATE = state;
        },
        enumerable: true,
        configurable: true
    });
    return EngageFirestore;
}(firestore_base_1.default));
exports.default = EngageFirestore;
EngageFirestore.__DOC__ = doc_1.default;
EngageFirestore.__ENGAGE_FIRE__ = engagefire_functions_1.EngagefireFunctions;
// export EngageFirestore
exports.engageFirestore = function (path, options) { return EngageFirestore.getInstance(path, options); };
//# sourceMappingURL=firestore.functions.js.map