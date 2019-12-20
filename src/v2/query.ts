import EngageAuth from "./auth";


export default class EngageQuery {

    getStringVar(what, replaceWith?) {
        if (typeof what === 'string' && (what.indexOf('{userId}') > -1 || what.indexOf('{\$userId}') > -1)) {
            return replaceWith || EngageAuth.userId;
        }
        return what;
    }

    /* 
    field.isEqualTo: 1
    */
    buildQuery(filter, customRef) {
        filter.forEach((key, value) => {
            let keys = key.split('.');
            let field = keys[0];
            let type = keys[1];
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
    }

    getFilterDefaults(defaults, filter, defaultValue) {
        if (filter != null) {
            defaults = defaults || { };
            filter.forEach((key, value) => {
                if (defaults[key] == null) {
                    var keys = key.split('.');
                    if (keys[0] != null && keys[2] === 'default') {
                        defaults[keys[0]] = this.getStringVar(value, defaultValue);
                    }
                }
            });
        }
        return defaults;
    }

    /*
    where('grower', isEqualTo: 1)
    String field, {
    dynamic isEqualTo,
    dynamic isLessThan,
    dynamic isLessThanOrEqualTo,
    dynamic isGreaterThan,
    dynamic isGreaterThanOrEqualTo,
    bool isNull,
    */
}