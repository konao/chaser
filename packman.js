const { Entity } = require('./entity');

// モジュールの公開するシンボルを全部インポートする
// モジュール内の各要素にはCONST.xxxでアクセスする
const C = require('./const');

// こう書くとモジュール名（上記ではCONST)を省略できる
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

class Packman extends Entity {
    constructor() {
        super();
        this._direc = C.NODIR;
        this._animCount = 0;
        this._curIdx = -1;
    }

    setStage(stage) {
        this._stage = stage;
    }

    setDirec(direc) {
        this._direc = direc;
        console.log(`direc=${direc}`);
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
        this._pack = [];

        let pack00 = new PIXI.Sprite(PIXI.Texture.from('pack00'));
        container.addChild(pack00);
        this._pack.push(pack00);

        let pack10 = new PIXI.Sprite(PIXI.Texture.from('pack10'));
        pack10.visible = false;
        container.addChild(pack10);
        this._pack.push(pack10);
        // container.addChild(pack10);

        let pack11 = new PIXI.Sprite(PIXI.Texture.from('pack11'));
        pack11.visible = false;
        container.addChild(pack11);
        this._pack.push(pack11);
        // container.addChild(pack11);

        let pack12 = new PIXI.Sprite(PIXI.Texture.from('pack12'));
        pack12.visible = false;
        container.addChild(pack12);
        this._pack.push(pack12);
        // container.addChild(pack12);

        let pack20 = new PIXI.Sprite(PIXI.Texture.from('pack20'));
        pack20.visible = false;
        container.addChild(pack20);
        this._pack.push(pack20);

        let pack21 = new PIXI.Sprite(PIXI.Texture.from('pack21'));
        pack21.visible = false;
        container.addChild(pack21);
        this._pack.push(pack21);

        let pack22 = new PIXI.Sprite(PIXI.Texture.from('pack22'));
        pack22.visible = false;
        container.addChild(pack22);
        this._pack.push(pack22);

        let pack30 = new PIXI.Sprite(PIXI.Texture.from('pack30'));
        pack30.visible = false;
        container.addChild(pack30);
        this._pack.push(pack30);

        let pack31 = new PIXI.Sprite(PIXI.Texture.from('pack31'));
        pack31.visible = false;
        container.addChild(pack31);
        this._pack.push(pack31);

        let pack32 = new PIXI.Sprite(PIXI.Texture.from('pack32'));
        pack32.visible = false;
        container.addChild(pack32);
        this._pack.push(pack32);

        let pack40 = new PIXI.Sprite(PIXI.Texture.from('pack40'));
        pack40.visible = false;
        container.addChild(pack40);
        this._pack.push(pack40);

        let pack41 = new PIXI.Sprite(PIXI.Texture.from('pack41'));
        pack41.visible = false;
        container.addChild(pack41);
        this._pack.push(pack41);

        let pack42 = new PIXI.Sprite(PIXI.Texture.from('pack42'));
        pack42.visible = false;
        container.addChild(pack42);
        this._pack.push(pack42);

        // this._pack.push(pack00);
    }

    updateSprite() {
        if (this._pack.length > 0) {
            let curIdx = this.getSprIdxFromDirAndAnimCount(this._direc, this._animCount);
            let p = this._pack[curIdx];

            let px = Math.floor(this._x * C.IMGW);
            let py = Math.floor(this._y * C.IMGW);

            p.x = px;
            p.y = py;
        }
    }

    move() {
        if (this._pack.length > 0) {

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
                            this._pack[this._curIdx].visible = false;
                        }

                        // アニメーションカウント更新
                        this._animCount++;
                        if (this._animCount >= MAX_ANIM_COUNT) {
                            this._animCount = 0;
                        }

                        // 新しいパックマンスプライトを表示onにする
                        let newIdx = this.getSprIdxFromDirAndAnimCount(direc, this._animCount);
                        // console.log(`curIdx=${curIdx}, newIdx=${newIdx}`);
                        this._pack[newIdx].visible = true;
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
    Packman
}