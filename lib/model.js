"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EngageModel {
    constructor(model, data) {
        this.model = model;
        this.data = data;
        this.keys = [];
        if (this.model) {
            this.generateKeys();
        }
    }
    generateKeys() {
        this.keys = this.model.map(item => item.name || '').filter(item => item !== '');
    }
    setModel(model) {
        this.model = model;
    }
    getModel() {
        return this.model;
    }
    addModel(modelItem) {
        this.model.push(modelItem);
    }
    setData(data) {
        this.data = data;
    }
    validateAll(data) {
        if (!data)
            data = this.data;
        return this.model.every((item) => {
            return this.validate(item.name, data);
        });
    }
    validate(key, data) {
        let valid = true;
        const dataItem = data[key || ''];
        const modelItem = this.model.find(item => item && item.name === key);
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
    }
}
exports.default = EngageModel;
exports.validateFunction = (change, model) => {
    const data = change.after.data();
    const valid = new EngageModel(model, data).validateAll();
    return valid ? data : change.before.data();
};
//# sourceMappingURL=model.js.map