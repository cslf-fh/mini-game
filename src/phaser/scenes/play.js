import Phaser from 'phaser';
import Preset from '../preset';
import Player from '../splites/player';
import Enemy from '../splites/enemy';
import Star from '../splites/star';

/*
5レーンを移動しながら上から落ちてくる敵機を避けるゲーム
移動後敵機にぶつかるか、敵機に押されちょっと経つとゲームオーバー
*/
let PLAYER; // 自機
let ENEMY; // 敵機
const WIDTH = Preset.config.width; // 画面の幅
const HEIGHT = Preset.config.height; // 画面の高さ
const ENEMY_Y = -100;
const SIZE = 32; // スプライトのサイズ
const SCALE = 2; // スプライトの拡大率
/* レーンに関するプロパティ */
const LANE = {
  width: SIZE * SCALE, // レーンの幅
  padding: SIZE / 2, // レーン間の余白
  distance: SIZE * SCALE + SIZE / 2, // レーン間の距離
};
let TIMER; // タイマー
/* 背景に関するプロパティ */
const BG = {
  number: 3, // レイヤの数
  quanity: 50, // スプライトの個数
  scale: 0.2, // スプライトの拡大率
  incY: 0.01, // スプライトのy軸への移動距離
  layers: [], // 作成したレイヤの配列
};

class Play extends Phaser.Scene {
  constructor() {
    super({ key: 'Play' });
    this.IS_PLAYING = true; // 操作可能かどうか
  }

  preload() {
    this.load.spritesheet('player', './assets/images/spritesheets/player.png', {
      frameWidth: SIZE,
      frameHeight: SIZE,
    });
    this.load.spritesheet('enemy', './assets/images/spritesheets/enemy.png', {
      frameWidth: SIZE,
      frameHeight: SIZE,
    });
    this.load.image('star', './assets/images/star.png');
  }

  create() {
    /* 自機の描画 */
    PLAYER = new Player(
      this,
      WIDTH / 2, // x座標
      HEIGHT - LANE.distance, // y座標
      'player', // 画像
      'default', // アニメーションの種類
      SCALE // 拡大率
    );
    ENEMY = this.physics.add.group(); // 敵機のグループを作成
    /* タイマーの設定 */
    TIMER = this.time.addEvent({
      delay: 1000,
      loop: true,
    });
    /* タイマーのコールバック */
    TIMER.callback = () => {
      this.createEnemy(); // 敵機の生成
      this.time.timeScale += 0.1; // ゲームスピードの更新
    };

    this.physics.add.collider(PLAYER, ENEMY); // 当たり判定の追加
    /* 自機と敵機が衝突時 */
    this.physics.add.overlap(PLAYER, ENEMY, (p) => {
      this.physics.pause(); // 敵機の移動を停止
      this.time.timeScale = 1; // ゲームスピードの初期化
      this.IS_PLAYING = false; // 自機を操作不能に
      TIMER.remove(); // タイマーの除去
      /* 自機の画像の差し替え */
      p.destroy();
      PLAYER = new Player(
        this,
        p.x, // 衝突時の自機のx座標
        p.y, // 衝突時の自機のy座標
        'player',
        'damaged',
        SCALE
      );
    });
    /* 背景のレイヤを作成 */
    for (let i = 0; i < BG.number; i++) {
      BG.layers[i] = this.add.group(); // 作成するレイヤをグループ化
      /* 作成したグループにスプライトを追加 */
      this.createLayer(BG.layers[i], BG.quanity, BG.scale + (BG.scale / 4) * i);
    }

    const change = this.add
      .text(WIDTH / 2, HEIGHT / 2, 'play', {
        fontFamily: Preset.style.fontFamily,
        fontSize: 50,
      })
      .setOrigin(0.5)
      .setInteractive();
    change.on(
      'pointerdown',
      () => {
        this.scene.start('Result');
      },
      this
    );
  }

  update() {
    /* 背景を動かす */
    for (let i = 0; i < BG.number; i++) {
      BG.layers[i].incY(BG.incY + BG.incY * i);
    }
    const x = PLAYER.x; // 自機のx座標
    const pointer = this.input.activePointer; // クリックorタッチ位置のx座標
    /* ゲーム画面内をクリックされたかどうかを判定 */
    let isTouchedDisplay = false;
    if (pointer.x > 0 && pointer.x < WIDTH) {
      isTouchedDisplay = true;
    }
    /* クリック時、自機の位置とクリック位置を比較して移動 */
    if (
      pointer.isDown &&
      Math.abs(x - pointer.x) > LANE.distance / 2 &&
      isTouchedDisplay &&
      this.IS_PLAYING
    ) {
      if (x < pointer.x) {
        PLAYER.x += LANE.distance; // 右に移動
      } else {
        PLAYER.x -= LANE.distance; // 左に移動
      }
      /* 敵機と上から接触して押された分のy軸の補正 */
      PLAYER.y = HEIGHT - LANE.distance; // 元の高さに
      PLAYER.setVelocityY(0); // 下方向の重力を0に
    }
  }

  createEnemy() {
    const randX = Phaser.Math.Between(0, 4);
    const randF = Phaser.Math.Between(1, 8); // アニメーションのfps
    const dist = LANE.distance;
    const x = dist / 2 + dist * randX; // x座標
    /* 敵機のグループに追加 */
    ENEMY.add(new Enemy(this, x, ENEMY_Y, 'enemy', 'default', SCALE, randF));
  }

  createLayer(arr, num, scale) {
    for (let i = 0; i < num; i++) {
      const x = Phaser.Math.Between(0, WIDTH);
      const y = Phaser.Math.Between(HEIGHT * -1, HEIGHT);
      arr.add(new Star(this, x, y, 'star', scale));
    }
  }
}

export default Play;
