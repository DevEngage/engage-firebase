"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var trigger_1 = require("../trigger/trigger");
var trigger = new trigger_1.default('/recipes/{id}', 'recipes').enableSearch();
exports.triggerOnWrite = trigger.onWrite();
exports.triggerOnDelete = trigger.onDelete();
//# sourceMappingURL=trigger.test.js.map