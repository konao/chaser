const { Entity } = require('./entity');
const C = require('./const');
const ST = require('./stage');
const UTL = require('./utils');

// 敵
class Enemy extends Entity {
    constructor(kind) {
        // モンスター種類
        this._kind = kind;

    }
}

module.exports = {
    Enemy
}