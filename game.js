const C = require('./const');

// ---------------------------------
// ゲーム本体制御
// ---------------------------------
class Game {
    constructor() {
        // 状態
        this._state = C.TITLE;

        // スコア
        this._score = 0;

        // ステージ
        this._stage = null;

        // パックマン
        this._pacman = null;

        // 敵
    }

    init() {

    }

    // @param PIXI [i] PIXIオブジェクト
    // @param container [i] PIXI.containerオブジェクト
    // @param resources [i] 
    genSprites(PIXI, container, resources) {

    }

    onUpPressed() {

    }

    onDownPressed() {

    }

    onLeftPressed() {

    }

    onDownPressed() {

    }

    update() {

    }
}

module.exports = {
    Game
}