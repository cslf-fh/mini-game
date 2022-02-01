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
/* レーンのプロパティ */
const LANE = {
  width: SIZE * SCALE, // レーンの幅
  padding: SIZE / 2, // レーン間の余白
  distance: SIZE * SCALE + SIZE / 2, // レーン間の距離
};
let TIMER; // タイマー
/* 背景のプロパティ */
const BG = {
  number: 3, // レイヤの数
  quanity: 50, // スプライトの個数
  scale: 0.2, // スプライトの拡大率
  incY: 0.01, // スプライトのy軸への移動距離
  layers: [], // 作成したレイヤの配列
};
/* スコアを表示するラベルのプロパティ */
const LABEL = {
  x: 70,
  y: 44,
  width: 150,
  height: 50,
  orientation: 0,
  depth: 1,
  color: 0x2681c8,
  alpha: 0.8,
  round: [0, 0, 1, 1, 10],
  text: {
    value: 'score:',
    size: 24,
    align: 'left',
  },
  space: {
    left: 54,
    right: 16,
    top: 16,
    bottom: 16,
  },
};

class Play extends Phaser.Scene {
  constructor() {
    super({ key: 'Play' });
    this.IS_PLAYING; // 操作可能かどうか
    this.SCORE; // スコア
    this.SCORE_TEXT; // スコア表示用のテキスト
  }

  init() {
    this.IS_PLAYING = true;
    this.SCORE = 0;
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
    this.load.scenePlugin(
      'rexuiplugin',
      'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
      'rexUI',
      'rexUI'
    );
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
      this.SCORE += 100; // スコアを加算
    };
    /* 背景のレイヤを作成 */
    for (let i = 0; i < BG.number; i++) {
      BG.layers[i] = this.add.group(); // 作成するレイヤをグループ化
      /* 作成したグループにスプライトを追加 */
      this.createLayer(BG.layers[i], BG.quanity, BG.scale + (BG.scale / 4) * i);
    }
    /* スコアを表示するラベルの作成 */
    this.SCORE_TEXT = this.createLabel(this, `${LABEL.text.value}000000`); // スコアテキストを更新する用の変数
    const label = this.rexUI.add
      .sizer({
        x: LABEL.x,
        y: LABEL.y,
        width: LABEL.width,
        height: LABEL.height,
        orientation: LABEL.orientation,
      })
      .add(this.SCORE_TEXT, 1, LABEL.text.align)
      .layout();
    label.setDepth(LABEL.depth); // ラベルが前面に来るように

    this.physics.add.collider(PLAYER, ENEMY); // 当たり判定の追加
    /* 自機と敵機が衝突時 */
    this.physics.add.overlap(PLAYER, ENEMY, async (p) => {
      this.physics.pause(); // 敵機の移動を停止
      this.IS_PLAYING = false; // 自機を操作不能に
      await TIMER.remove(); // タイマーの除去
      this.time.timeScale = 1; // ゲームスピードの初期化
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
        this.scene.start('Result', { score: this.SCORE });
      },
      this
    );
  }

  update() {
    /* 表示用のスコアテキストの更新 */
    const scoreText = this.createScoreText(this.SCORE);
    this.SCORE_TEXT.setText(LABEL.text.value + scoreText);

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

  createLabel(scene, text) {
    return scene.rexUI.add.label({
      background: scene.rexUI.add.roundRectangle(
        ...LABEL.round,
        LABEL.color,
        LABEL.alpha
      ),
      text: scene.add.text(0, 0, text, {
        fontFamily: Preset.style.fontFamily,
        fontSize: LABEL.text.size,
      }),
      align: LABEL.text.align,
      space: { ...LABEL.space },
    });
  }

  createScoreText(score) {
    const text = '000000';
    const val = String(score);
    return text.slice(0, text.length - val.length) + val; // スコアの表示が"000xyz"な感じになるように整形
  }
}

export default Play;
