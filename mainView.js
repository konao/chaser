const PIXI = require('pixi.js');
const $ = require('jquery');
const { Stage, SPACE, WALL, DOT, POWER_FOOD } = require('./stage');
const { Game } = require('./game');
const { Entity } = require('./entity');
const { Pacman } = require('./pacman');
const Utils = require('./utils');
const C = require('./const');

let game = new Game();

let stage = new Stage();
stage.generate(4, 8, 6);
stage.print();

let pacman = new Pacman();
pacman.setPos({x: 1.0, y: 1.0});
pacman.setStage(stage);

//Create a Pixi Application
let app = new PIXI.Application({ 
    view: document.getElementById('myCanvas'),
    width: 640, 
    height: 480,                       
    antialias: true, 
    transparent: false, 
    resolution: 1
  }
);
app.renderer.autoResize = true;
app.stage.interactive = true;

//Add the canvas that Pixi automatically created for you to the HTML document
// document.body.appendChild(app.view);

const loader = PIXI.Loader.shared;
loader.add('images/characters.json');
loader.load((loader, resources) => {
    const N=0;
    const w = window.innerWidth;
    const h = window.innerHeight;

    let container = new PIXI.Container();

    // stageに対応するスプライト生成
    stage.genSprite(PIXI, container, resources);

    // pacmanスプライト生成
    pacman.genSprite(PIXI, container, resources);

    app.stage.addChild(container);

    // app.ticker.speed = 0.2;  // 効かなかった
    app.ticker.add((delta) => {
        if (pacman) {
            pacman.move();
            pacman.detectCollision(stage);
        }
    });
});

let g_width;
let g_height;
// ロード時とリサイズ時の両方でイベントを受け取る
// https://qiita.com/chillart/items/15bc48f98897391e12ca
$(window).on('load resize', () => {
    let w = window.innerWidth-30;
    let h = window.innerHeight-50;
    app.renderer.resize(w, h);
});

$(window).keydown(e => {
    console.log(`keydown (${e.which})`);
    switch (e.which) {
        case 37:    // left
        {
            pacman.setDirec(C.LEFT);
            break;
        }
        case 38:    // up
        {
            pacman.setDirec(C.UP);
            break;
        }
        case 39:    // right
        {
            pacman.setDirec(C.RIGHT);
            break;
        }
        case 40:    // down
        {
            pacman.setDirec(C.DOWN);
            break;
        }
        case 32:    // space
        {
            pacman.setDirec(C.NODIR);
            break;
        }
    }
});

$('#btStart').click(function() {
    console.log('start clicked');
});

$('#btPause').click(function() {
    console.log('pause clicked');
});
