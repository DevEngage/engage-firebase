
import Trigger from '../src/trigger';

const trigger = new Trigger('/recipes/{id}', 'recipes').enableSearch();
exports.triggerOnWrite = trigger.onWrite();
exports.triggerOnDelete = trigger.onDelete();