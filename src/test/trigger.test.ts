
import Trigger from '../trigger/trigger';

const trigger = new Trigger('/recipes/{id}', 'recipes').enableSearch();
exports.triggerOnWrite = trigger.onWrite();
exports.triggerOnDelete = trigger.onDelete();