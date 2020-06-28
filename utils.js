const randDouble = (x) => {
    return Math.random() * x;
}

const randInt = (x) => {
    return Math.trunc(Math.random() * x);
}

// xが整数ならtrue．小数点部分があるならfalse
// eplisionで微妙な誤差でおかしくなることを防ぐ
//
// @param x {number}
const isFracZero = (x) => {
    const EPSILON = 1e-5;
    return (Math.abs(x - Math.round(x)) < EPSILON);
}

module.exports = {
    randDouble,
    randInt,
    isFracZero
}