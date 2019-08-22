"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const trigger_1 = require("../trigger");
const trigger = new trigger_1.default('/recipes/{id}', 'recipes').enableSearch();
exports.triggerOnWrite = trigger.onWrite();
exports.triggerOnDelete = trigger.onDelete();
//# sourceMappingURL=trigger.test.js.map