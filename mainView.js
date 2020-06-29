const PIXI = require('pixi.js');
const $ = require('jquery');
const { Stage, SPACE, WALL, DOT, POWER_FOOD } = require('./stage');
const Utils = require('./utils');
const { Entity } = require('./entity');
const { Packman } = require('./packman');
const C = require('./const');

let stage = new Stage();
stage.generate(4, 8, 6);
stage.print();

let packman = new Packman();
packman.setPos({x: 1.0, y: 1.0});
packman.setStage(stage);

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
loader
    .add('images/characters.json')
loader.load((loader, resources) => {
    const N=0;
    const w = window.innerWidth;
    const h = window.innerHeight;

    let container = new PIXI.Container();

    // stageに対応するスプライト生成
    // resources.tile.texture.frame = new PIXI.Rectangle(24*1, 24*3, 24, 24);
    let stageSize = stage.getSize();
    for (let y=0; y<stageSize.h; y++) {
        for (let x=0; x<stageSize.w; x++) {
            let e = stage.get(x, y);
            let spr = null;
            switch (e) {
                case WALL:
                    spr = new PIXI.Sprite(PIXI.Texture.from('wall'));
                    break;
                case DOT:
                    spr = new PIXI.Sprite(PIXI.Texture.from('dot'));
                    stage.setSpr(x, y, spr);    // ドットスプライトを登録
                    break;
            }

            if (spr) {
                spr.x = x*26;
                spr.y = y*26;
    
                container.addChild(spr);
            }
        }
    }

    // packmanスプライト生成
    console.log(resources);
    packman.genSprite(PIXI, container, resources);

    app.stage.addChild(container);

    // app.ticker.speed = 0.2;  // 効かなかった
    app.ticker.add((delta) => {
        if (packman) {
            packman.move();
            packman.detectCollision(stage);
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
            packman.setDirec(C.LEFT);
            break;
        }
        case 38:    // up
        {
            packman.setDirec(C.UP);
            break;
        }
        case 39:    // right
        {
            packman.setDirec(C.RIGHT);
            break;
        }
        case 40:    // down
        {
            packman.setDirec(C.DOWN);
            break;
        }
        case 32:    // space
        {
            packman.setDirec(C.NODIR);
            break;
        }
    }
});

$(window).mousedown(e => {
    console.log(`mousedown (${e.clientX}, ${e.clientY})`);
});

$('#btStart').click(function() {
    console.log('start clicked');
});

$('#btPause').click(function() {
    console.log('pause clicked');
});
