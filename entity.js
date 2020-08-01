// キャラクターベースクラス
class Entity {
    constructor() {
        this._x = 0.0;
        this._y = 0.0;
    }

    getPos() {
        return {
            x: this._x,
            y: this._y
        };
    }

    // セル座標（整数値）を返す
    getCellPos() {
        return Entity.toCellPos({
            x: this._x,
            y: this._y
        });
    }

    // @param x {number} [i] x座標値
    // @param y {number} [i] y座標値
    // setPos(x, y) {
    //     this._x = x;
    //     this._y = y;
    // }

    setPos({x, y}) {
        this._x = x;
        this._y = y;
    }

    // @param cpos [i] セル座標 ({cx, cy})
    setCellPos(cpos) {
        let pos = Entity.fromCellPos(cpos)
        this._x = pos.x;
        this._y = pos.y;
    }

    // ピクセル座標 <--> セル座標変換
    static toCellPos({x, y}) {
        return {
            x: Math.floor(x+0.5),
            y: Math.floor(y+0.5)
        }
    }

    static fromCellPos({x, y}) {
        // ここはそのまま値を返してOK
        return {
            x: x,
            y: y
        }
    }

    // 変位を加えた値を返す
    static d({x, y}, {dx, dy}) {
        return {
            x: x+dx,
            y: y+dy
        }
    }
}

module.exports = {
    Entity
}