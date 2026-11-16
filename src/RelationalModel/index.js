/**
* Contains the declaration for the {@link module:enyo/RelationalModel~RelationalModel} and
* {@link module:enyo/RelationalModel~Collection} kinds.
* @module enyo/RelationalModel
*/

import Model from './Model.js';
import Relation from './Relation.js';
import toOne from './toOne.js';
import toMany from './toMany.js';
import manyToMany from './manyToMany.js';

Model.defineRelationType('toOne', toOne, true);
Model.defineRelationType('toMany', toMany);
Model.defineRelationType('manyToMany', manyToMany);

Relation.relationDefaults.model = Model;
Relation.relationDefaults.type = toOne;

module.exports = Model;