const C = require('./const');
const { Stage, SPACE, WALL, DOT, POWER_FOOD } = require('./stage');
const { Pacman } = require('./pacman');

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

    initGame() {

    }

    initStage() {
        this._stage = new Stage();
        this._stage.generate(4, 8, 6);
        this._stage.print();
        
        this._pacman = new Pacman();
        this._pacman.setPos({x: 1.0, y: 1.0});
        this._pacman.setStage(this._stage);
    }

    // @param PIXI [i] PIXIオブジェクト
    // @param container [i] PIXI.containerオブジェクト
    // @param resources [i] 
    genSprites(PIXI, container, resources) {
        // stageに対応するスプライト生成
        this._stage.genSprite(PIXI, container, resources);

        // pacmanスプライト生成
        this._pacman.genSprite(PIXI, container, resources);
    }

    onUpPressed() {
        this._pacman.setDirec(C.UP);
    }

    onDownPressed() {
        this._pacman.setDirec(C.DOWN);
    }

    onLeftPressed() {
        this._pacman.setDirec(C.LEFT);
    }

    onRightPressed() {
        this._pacman.setDirec(C.RIGHT);
    }

    onSpacePressed() {
        this._pacman.setDirec(C.NODIR);
    }

    update() {
        if (this._pacman) {
            this._pacman.move();
            this._pacman.detectCollision(this._stage);
        }
    }
}

module.exports = {
    Game
}