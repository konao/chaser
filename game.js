const C = require('./const');
const { Stage, SPACE, WALL, DOT, POWER_FOOD } = require('./stage');
const { Pacman } = require('./pacman');
const Utils = require('./utils');
const { Enemy } = require('./enemy');

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
        this._enemies = [];
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

        // debug
        this._stage.searchAllWayPoints();

        // ランダムにn個のウェイポイントを選び出す
        // ---> そこをモンスターの位置とする
        this._enemies = [];
        const nEnemies = 5; // ****** モンスターの数 ******
        let wps = this._stage.getRandomWayPoints(nEnemies);
        for (let i=0; i<nEnemies; i++) {
            let kind = Utils.randInt(4);
            let enemy = new Enemy(kind);
            enemy.setPos(wps[i]);
            console.log(`[${i}] pos=(${wps[i].x}, ${wps[i].y})`);
            enemy.setDirec(C.NODIR);
            enemy.setStage(this._stage);
            this._enemies.push(enemy);
        }
    }

    // @param PIXI [i] PIXIオブジェクト
    // @param container [i] PIXI.containerオブジェクト
    // @param resources [i] 
    genSprites(PIXI, container, resources) {
        // stageに対応するスプライト生成
        this._stage.genSprite(PIXI, container, resources);

        // pacmanスプライト生成
        this._pacman.genSprite(PIXI, container, resources);

        // 敵スプライト生成
        for (let i=0; i<this._enemies.length; i++) {
            this._enemies[i].genSprite(PIXI, container, resources);
        }
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
        // パックマン移動
        if (this._pacman) {
            this._pacman.move();
            this._pacman.detectCollision(this._stage);
        }

        // 敵移動
        if (this._enemies && this._enemies.length > 0) {
            for (let i=0; i<this._enemies.length; i++) {
                let enemy = this._enemies[i];
                enemy.move(this._pacman.getPos());
                enemy.updateSprite();
            }
        }
    }
}

module.exports = {
    Game
}