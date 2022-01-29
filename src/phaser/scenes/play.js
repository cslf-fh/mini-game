import Phaser from 'phaser';
import Preset from '../preset';
import Player from '../splites/player';
import Enemy from '../splites/enemy';

/*
5レーンを移動しながら上から落ちてくる敵機を避けるゲーム
移動後敵機にぶつかるか、敵機に押されちょっと経つとゲームオーバー
*/
class Play extends Phaser.Scene {
  constructor() {
    super({ key: 'Play' });
    this.PLAYER; // 自機
    this.ENEMY; // 敵機
    this.WIDTH = Preset.config.width; // 画面の幅
    this.HEIGHT = Preset.config.height; // 画面の高さ
    this.SIZE = 32; // スプライトのサイズ
    this.SCALE = 2; // スプライトの拡大率
    this.LANE = {}; // レーンに関するプロパティ
    this.IS_PLAYING = true; // 操作可能かどうか
    this.TIMER; // タイマー
  }

  preload() {
    /* 初期設定(コンストラクタに記述したら上手くいかなかった) */
    this.LANE.width = this.SIZE * this.SCALE; // レーンの幅
    this.LANE.padding = this.SIZE / 2; // レーン間の余白
    this.LANE.distance = this.LANE.width + this.LANE.padding; // レーン間の距離

    this.load.spritesheet('player', './assets/images/objects/player.png', {
      frameWidth: this.SIZE,
      frameHeight: this.SIZE,
    });
    this.load.spritesheet('enemy', './assets/images/objects/enemy.png', {
      frameWidth: this.SIZE,
      frameHeight: this.SIZE,
    });
  }

  create() {
    /* 自機の描画 */
    this.PLAYER = new Player(
      this,
      this.WIDTH / 2, // x座標
      this.HEIGHT - this.LANE.distance, // y座標
      'player', // 画像
      'default', // アニメーションの種類
      this.SCALE // 拡大率
    );
    this.ENEMY = this.physics.add.group(); // 敵機のグループを作成
    /* タイマーの設定 */
    this.TIMER = this.time.addEvent({
      delay: 1000,
      loop: true,
    });
    /* タイマーのコールバック */
    this.TIMER.callback = () => {
      this.createEnemy(); // 敵機の生成
      this.time.timeScale += 0.1; // ゲームスピードの更新
    };

    this.physics.add.collider(this.PLAYER, this.ENEMY); // 当たり判定の追加
    /* 自機と敵機が衝突時 */
    this.physics.add.overlap(this.PLAYER, this.ENEMY, (p) => {
      this.physics.pause(); // 敵機の移動を停止
      this.time.timeScale = 1; // ゲームスピードの初期化
      this.IS_PLAYING = false; // 自機を操作不能に
      this.TIMER.remove(); // タイマーの除去
      /* 自機の画像の差し替え */
      p.destroy();
      this.PLAYER = new Player(
        this,
        p.x, // 衝突時の自機のx座標
        p.y, // 衝突時の自機のy座標
        'player',
        'damaged',
        this.SCALE
      );
    });

    const change = this.add
      .text(this.WIDTH / 2, this.HEIGHT / 2, 'play', {
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
    const x = this.PLAYER.x; // 自機のx座標
    const pointer = this.input.activePointer; // クリックorタッチ位置のx座標
    /* ゲーム画面内をクリックされたかどうかを判定 */
    let isTouchedDisplay = false;
    if (pointer.x > 0 && pointer.x < this.WIDTH) {
      isTouchedDisplay = true;
    }
    /* クリック時、自機の位置とクリック位置を比較して移動 */
    if (
      pointer.isDown &&
      Math.abs(x - pointer.x) > this.LANE.distance / 2 &&
      isTouchedDisplay &&
      this.IS_PLAYING
    ) {
      if (x < pointer.x) {
        this.PLAYER.x += this.LANE.distance; // 右に移動
      } else {
        this.PLAYER.x -= this.LANE.distance; // 左に移動
      }
      /* 敵機と上から接触して押された分のy軸の補正 */
      this.PLAYER.y = this.HEIGHT - this.LANE.distance; // 元の高さに
      this.PLAYER.setVelocityY(0); // 下方向の重力を0に
    }
  }

  createEnemy() {
    const randX = Phaser.Math.Between(0, 4);
    const randF = Phaser.Math.Between(1, 8); // アニメーションのfps
    const dist = this.LANE.distance;
    const x = dist / 2 + dist * randX; // x座標
    /* 敵機のグループに追加 */
    this.ENEMY.add(
      new Enemy(this, x, -100, 'enemy', 'default', this.SCALE, randF)
    );
  }
}

export default Play;
