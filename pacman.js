const { Entity } = require('./entity');

// モジュールの公開するシンボルを全部インポートする
// モジュール内の各要素にはC.xxxでアクセスする
const C = require('./const');

// こう書くとモジュール名（上記ではC)を省略できる
// ただしモジュールの公開するシンボルが多くなると他とバッティングの可能性が高まるのでよろしくないかも
// const { IMGW, UP, RIGHT, DOWN, LEFT } = require('./const');

const ST = require('./stage');
const UTL = require('./utils');

// 移動の際、この範囲での差を調整する
// （ぴったり整数値の座標でしか曲がれないのでは操作しにくいため）
const PosAdjustMargin = 0.4;

// ドット食い判定マージン
const EatDotMargin = 0.2;

const MAX_ANIM_COUNT = 6;

// パックマン
class Pacman extends Entity {
    constructor() {
        super();
        // 進行方向
        this._direc = C.NODIR;

        // アニメーションカウント
        this._animCount = 0;

        // スプライトコンテナ
        this._pac = [];

        // 現在のスプライトインデックス
        this._curIdx = -1;

        // ステージオブジェクトへの参照
        this._stage = null;
    }

    setStage(stage) {
        this._stage = stage;
    }

    setDirec(direc) {
        this._direc = direc;
    }

    getDirec() {
        return this._direc;
    }

    setAnimCount(c) {
        this._animCount = c;
    }

    getAnimCount() {
        return this._animCount;
    }

    // 進行方向とアニメーションカウントから
    // スプライトインデックスを求める
    getSprIdxFromDirAndAnimCount(direc, animCount) {
        if (animCount === 0) {
            return 0;
        } else {
            let base = 0;
            switch (direc) {
                case C.UP:
                    base = 1;
                    break;
                case C.RIGHT:
                    base = 4;
                    break;
                case C.DOWN:
                    base = 7;
                    break;
                case C.LEFT:
                    base = 10;
                    break;
                default:
                    return 0;
            }

            if (animCount >= 4) {
                animCount = MAX_ANIM_COUNT - animCount;
            }
            return base + (animCount-1);
        }
    }

    genSprite(PIXI, container, resources) {
        this._pac = [];

        // PIXI.Texture.fromに与える文字列(ID)はimage/character.jsonに記述されている
        let pac00 = new PIXI.Sprite(PIXI.Texture.from('pac00'));
        container.addChild(pac00);
        this._pac.push(pac00);

        let pac10 = new PIXI.Sprite(PIXI.Texture.from('pac10'));
        pac10.visible = false;
        container.addChild(pac10);
        this._pac.push(pac10);

        let pac11 = new PIXI.Sprite(PIXI.Texture.from('pac11'));
        pac11.visible = false;
        container.addChild(pac11);
        this._pac.push(pac11);

        let pac12 = new PIXI.Sprite(PIXI.Texture.from('pac12'));
        pac12.visible = false;
        container.addChild(pac12);
        this._pac.push(pac12);

        let pac20 = new PIXI.Sprite(PIXI.Texture.from('pac20'));
        pac20.visible = false;
        container.addChild(pac20);
        this._pac.push(pac20);

        let pac21 = new PIXI.Sprite(PIXI.Texture.from('pac21'));
        pac21.visible = false;
        container.addChild(pac21);
        this._pac.push(pac21);

        let pac22 = new PIXI.Sprite(PIXI.Texture.from('pac22'));
        pac22.visible = false;
        container.addChild(pac22);
        this._pac.push(pac22);

        let pac30 = new PIXI.Sprite(PIXI.Texture.from('pac30'));
        pac30.visible = false;
        container.addChild(pac30);
        this._pac.push(pac30);

        let pac31 = new PIXI.Sprite(PIXI.Texture.from('pac31'));
        pac31.visible = false;
        container.addChild(pac31);
        this._pac.push(pac31);

        let pac32 = new PIXI.Sprite(PIXI.Texture.from('pac32'));
        pac32.visible = false;
        container.addChild(pac32);
        this._pac.push(pac32);

        let pac40 = new PIXI.Sprite(PIXI.Texture.from('pac40'));
        pac40.visible = false;
        container.addChild(pac40);
        this._pac.push(pac40);

        let pac41 = new PIXI.Sprite(PIXI.Texture.from('pac41'));
        pac41.visible = false;
        container.addChild(pac41);
        this._pac.push(pac41);

        let pac42 = new PIXI.Sprite(PIXI.Texture.from('pac42'));
        pac42.visible = false;
        container.addChild(pac42);
        this._pac.push(pac42);

        // this._pac.push(pac00);
    }

    updateSprite() {
        if (this._pac.length > 0) {
            let curIdx = this.getSprIdxFromDirAndAnimCount(this._direc, this._animCount);
            let pSprite = this._pac[curIdx];

            let px = Math.floor(this._x * C.IMGW);
            let py = Math.floor(this._y * C.IMGW);

            pSprite.x = px;
            pSprite.y = py;
        }
    }

    move() {
        if (this._pac.length > 0) {

            // @param direc [i] 方向
            // @param pd {dx, dy} [i] ピクセル単位の変位
            // @param cd {dx, dy} [i] セル単位の変位
            // @param adjustX {boolean} [i] x軸補正を行うか
            // @param adjustY {boolean} [i] y軸補正を行うか
            let moveSub = ((direc, pd, cd, adjustX, adjustY) => {
                let pos = this.getPos();    // 現在のピクセル座標
                let cpos = this.getCellPos();   // 現在のセル座標

                let bCanMove = false;
                if (adjustX) {
                    if (Math.abs(pos.x - cpos.x) < PosAdjustMargin) {
                        // 補正
                        pos = {
                            x: Entity.fromCellPos(cpos).x,  // x座標だけを補正
                            y: pos.y
                        };
                        bCanMove = true;
                    }
                }
                else if (adjustY) {
                    if (Math.abs(pos.y - cpos.y) < PosAdjustMargin) {
                        // 補正
                        pos = {
                            x: pos.x,
                            y: Entity.fromCellPos(cpos).y,  // y座標だけを補正
                        }
                        bCanMove = true;
                    }
                }

                if (bCanMove) {
                    let nextPos = Entity.d(pos, pd); // 移動先のピクセル座標
                    let nextCPos = Entity.d(cpos, cd); // 一つ上のセル座標

                    let nextChar = this._stage.get(nextCPos.x, nextCPos.y);

                    // console.log(`pos=(${pos.x}, ${pos.y}), nextPos=(${nextPos.x}, ${nextPos.y})`);
                    // console.log(`cpos=(${cpos.x}, ${cpos.y}), nextCPos=(${nextCPos.x}, ${nextCPos.y}) ---> ${nextChar}`);

                    let moved = false;
                    if (nextChar !== ST.WALL) {
                        // 進む先は壁ではないので、進める
                        this.setPos(nextPos);
                        moved = true;
                    } else {
                        switch (direc) {
                            case C.UP:
                            case C.DOWN:
                                {
                                    if (nextChar === ST.WALL && !UTL.isFracZero(pos.y)) {
                                        // 進む先は壁だが、まだ壁に到達していない場合も、進める
                                        this.setPos(nextPos);
                                        moved = true;
                                    }
                                }
                                break;
                            
                            case C.RIGHT:
                            case C.LEFT:
                                {
                                    if (nextChar === ST.WALL && !UTL.isFracZero(pos.x)) {
                                        // 進む先は壁だが、まだ壁に到達していない場合も、進める
                                        this.setPos(nextPos);
                                        moved = true;
                                    }
                                }
                                break;
                        }
                    }

                    if (moved) {
                        // 現在のパックマンスプライトを表示offにする
                        if (this._curIdx >= 0) {
                            this._pac[this._curIdx].visible = false;
                        }

                        // アニメーションカウント更新
                        this._animCount++;
                        if (this._animCount >= MAX_ANIM_COUNT) {
                            this._animCount = 0;
                        }

                        // 新しいパックマンスプライトを表示onにする
                        let newIdx = this.getSprIdxFromDirAndAnimCount(direc, this._animCount);
                        // console.log(`curIdx=${curIdx}, newIdx=${newIdx}`);
                        this._pac[newIdx].visible = true;
                        this._curIdx = newIdx; // 保存しておく
                    }
                }
            }).bind(this);

            switch (this._direc) {
                case C.UP: {
                    moveSub(
                        C.UP,
                        {dx:0, dy:-0.2},
                        {dx:0, dy:-1},
                        true, false
                    );
                    break;
                }

                case C.RIGHT: {
                    moveSub(
                        C.RIGHT,
                        {dx:0.2, dy:0},
                        {dx:1, dy:0},
                        false, true
                    );
                    break;
                }

                case C.DOWN: {
                    moveSub(
                        C.DOWN,
                        {dx:0, dy:0.2},
                        {dx:0, dy:1},
                        true, false
                    );
                    break;
                }

                case C.LEFT: {
                    moveSub(
                        C.LEFT,
                        {dx:-0.2, dy:0},
                        {dx:-1, dy:0},
                        false, true
                    );
                    break;
                }
            }

            this.updateSprite();
        }
    }

    // 衝突判定
    detectCollision(stage) {
        let x = this._x;
        let y = this._y;

        let cx = Math.round(x);
        let cy = Math.round(y);

        if ((Math.abs(x-cx) < EatDotMargin) &&
            (Math.abs(y-cy) < EatDotMargin)) {
                // 各セルの基準点に十分近い距離に入った．
                // (cx, cy)にドットがあれば、ドットを食べたこととする．
                let value = stage.get(cx, cy);
                if (value === ST.DOT) {
                    let dotSpr = stage.getSpr(cx, cy);
                    if (dotSpr && dotSpr.visible) {
                        dotSpr.visible = false;
                    }
                }
            }
    }
}

module.exports = {
    Pacman
}