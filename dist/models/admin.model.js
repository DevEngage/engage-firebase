"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminModel = [
    {
        name: 'name',
        label: 'Name',
        type: 'string',
        default: '',
        position: 1,
    },
    {
        name: 'label',
        label: 'Label',
        type: 'string',
        default: '',
        position: 2,
    },
    {
        name: 'type',
        label: 'Type',
        type: 'array',
        default: 'string',
        choices: ['string', 'number', 'boolean', 'object', 'array', 'image', 'file', 'files', 'range', 'collection'],
        position: 3,
    },
    // [ $id, $id ] <- array with relation
    // { $id } <- object with relation
    // subCollection <- { $id } <- collection with relation
    {
        name: 'relation',
        label: 'Relation (collections)',
        field: '$id',
        type: 'collection',
        updateSibling: 'fields',
        collection: '$collections',
        position: 4,
    },
    {
        name: 'collectionField',
        label: 'Collection Field',
        type: 'string',
        default: 'name',
        position: 5,
    },
    {
        name: 'fields',
        label: 'Fields',
        field: 'name',
        type: 'collection',
        siblingValue: 'relation',
        collection: 'fields',
        multiple: true,
        position: 6,
    },
    {
        name: 'choices',
        label: 'Choices',
        type: 'array',
        multiple: true,
        default: [],
        position: 7,
    },
    {
        name: 'min',
        label: 'Min',
        type: 'number',
        position: 8,
    },
    {
        name: 'max',
        label: 'Max',
        type: 'number',
        position: 9,
    },
    // {
    //     name: 'backup',
    //     label: 'Backup',
    //     type: 'boolean',
    //     default: false,
    // },
    {
        name: 'default',
        label: 'Default',
        type: '',
        position: 10,
    },
    {
        name: 'size',
        label: 'Size',
        type: 'string',
        position: 11,
    },
    {
        name: 'quality',
        label: 'Quality',
        type: 'number',
        position: 12,
    },
    {
        name: 'permission',
        label: 'Permission',
        type: 'collection',
        collection: '$permissions',
        position: 13,
    },
    {
        name: 'hint',
        label: 'Hint',
        type: 'string',
        position: 14,
    },
    {
        name: 'required',
        label: 'Required',
        type: 'boolean',
        default: false,
        position: 15,
    },
    {
        name: 'multiple',
        label: 'Multiple',
        type: 'boolean',
        default: false,
        position: 16,
    },
    {
        name: 'sync',
        label: 'Sync',
        type: 'boolean',
        default: false,
        position: 17,
    },
];
//# sourceMappingURL=admin.model.js.map