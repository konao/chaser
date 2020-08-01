const Utils = require('./utils');
const { IMGW } = require('./const');

const SPACE = 0;
const WALL = 1;
const DOT = 2;
const POWER_FOOD = 3;

class Stage {
    constructor() {
        this._stage = null; // this._stage[y][x]の順で格納されている
        this._sprs = null;  // this._sprs[y][x]の順で格納されている
        this._w = 0;
        this._h = 0;
    }

    getSize() {
        return {
            w: this._w,
            h: this._h
        };
    }

    // @param x [i] 0<=x<this._w
    // @param y [i] 0<=y<this._h
    //
    // @return (x, y)にあるもの
    // 範囲オーバーの時はWALLを返す
    get(x, y) {
        if ((x<0) || (x>=this._w) ||
            (y<0) || (y>=this._h)) {
                return WALL;
        }

        return this._stage[y][x];
    }

    getSpr(x, y) {
        if ((x<0) || (x>=this._w) ||
            (y<0) || (y>=this._h)) {
                return null;
        }

        return this._sprs[y][x];
    }

    setSpr(x, y, spr) {
        if ((x<0) || (x>=this._w) ||
            (y<0) || (y>=this._h)) {
                return;
        }

        this._sprs[y][x] = spr;
    }

    // @param edgeLen [i] 1つの正方形ブロックの辺の長さ
    // @param wc [i] 幅方向カウント（正方形ブロックの個数）
    // @param hc [i] 高さ方向カウント（正方形ブロックの個数）
    // 
    // ステージの幅(w)は(edgeLen+1)*wc+3
    // ステージの高さ(h)は(edgeLen+1)*hc+3
    // になる．
    generate(edgeLen, wc, hc) {
        let w = (edgeLen+1)*wc+3;
        let h = (edgeLen+1)*hc+3;
        this._w = w;
        this._h = h;
        this._stage = new Array(h).fill(null);
        for (let i=0; i<h; i++) {
            this._stage[i] = new Array(w).fill(SPACE);
        }
        this._sprs = new Array(h).fill(null);
        for (let i=0; i<h; i++) {
            this._sprs[i] = new Array(w).fill(null);
        }

        // 内側基本ブロック
        for (let i=0; i<hc; i++) {
            let pivotY = (edgeLen+1)*i+2;
            for (let j=0; j<wc; j++) {
                let pivotX = (edgeLen+1)*j+2;
                for (let dx=0; dx<edgeLen; dx++) {
                    let x=pivotX+dx;                    
                    for (let dy=0; dy<edgeLen; dy++) {
                        let y=pivotY+dy;
                        this._stage[y][x] = WALL;  // -1=壁
                    }
                }
            }
        }

        // 乱数でブロック間をつなげる壁を作る
        for (let i=0; i<hc; i++) {
            let pivotY = (edgeLen+1)*i+2;
            for (let j=0; j<wc; j++) {
                let pivotX = (edgeLen+1)*j+2;
                // 右横の通路を壁で埋めるか？
                if ((j!==wc-1) && Utils.randDouble(1.0) < 0.2) {
                    for (let dy=0; dy<edgeLen; dy++) {
                        let x=pivotX+edgeLen;
                        let y=pivotY+dy;
                        this._stage[y][x] = WALL;
                    }
                }

                // 下の通路を壁で埋めるか？
                if ((i!==hc-1) && Utils.randDouble(1.0) < 0.2) {
                    for (let dx=0; dx<edgeLen; dx++) {
                        let x=pivotX+dx;
                        let y=pivotY+edgeLen;
                        this._stage[y][x] = WALL;
                    }
                }
            }
        }

        // 周りの壁作成
        for (let i=0; i<h; i++) {
            this._stage[i][0] = WALL;
            this._stage[i][w-1] = WALL;
        }
        for (let j=0; j<w; j++) {
            this._stage[0][j] = WALL;
            this._stage[h-1][j] = WALL;
        }

        // 空いていく空白をドットに変える
        for (let i=0; i<h; i++) {
            for (let j=0; j<w; j++) {
                if (this._stage[i][j] === SPACE) {
                    this._stage[i][j] = DOT;
                }
            }
        }
    }

    print() {
        console.log(`w=${this._w}, h=${this._h}`);
        for (let i=0; i<this._h; i++) {
            // 行番号を先頭に書く（3桁でゼロサプレス）
            let s = i.toString().padStart(3, '0') + ' ';
            s += this._stage[i].map(x => {
                switch (x) {
                    case SPACE:
                        return ' ';
                    case DOT:
                        return '.';
                    case POWER_FOOD:
                        return 'o';
                    case WALL:
                        return '*';
                    default:
                        return ' ';
                }
            }).join('');
            console.log(s);
        }
    }

    // stageに対応するスプライト生成
    genSprite(PIXI, container, resources) {
        let stageSize = this.getSize();
        for (let y=0; y<stageSize.h; y++) {
            for (let x=0; x<stageSize.w; x++) {
                let e = this.get(x, y);
                let spr = null;
                switch (e) {
                    case WALL:
                        spr = new PIXI.Sprite(PIXI.Texture.from('wall'));
                        break;
                    case DOT:
                        spr = new PIXI.Sprite(PIXI.Texture.from('dot'));
                        this.setSpr(x, y, spr);    // ドットスプライトを登録
                        break;
                }
    
                if (spr) {
                    spr.x = x*26;
                    spr.y = y*26;
        
                    container.addChild(spr);
                }
            }
        }
    }
}

module.exports = {
    Stage,
    SPACE,
    DOT,
    POWER_FOOD,
    WALL
}