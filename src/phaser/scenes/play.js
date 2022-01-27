import Phaser from 'phaser';
import Preset from '../preset';
import Player from '../splites/player';
import Enemy from '../splites/enemy';

class Play extends Phaser.Scene {
  constructor() {
    super({ key: 'Play' });
    this.width = Preset.config.width; // 画面の幅
    this.height = Preset.config.height; // 画面の高さ
    this.player; // 自機
    this.enemy; // 敵機
  }

  preload() {
    this.load.spritesheet('player', './assets/images/objects/player.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('enemy', './assets/images/objects/enemy.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    /* 自機を描画 */
    this.player = new Player(
      this,
      this.width / 2,
      this.height / 2,
      'player',
      'default'
    );
    this.enemy = new Enemy(
      this,
      this.width / 2,
      this.height / 2,
      'enemy',
      'default'
    );

    const change = this.add
      .text(this.width / 2, this.height / 2, 'play', {
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
    const x = this.player.x; // 自機のx座標
    const pointer = this.input.activePointer; // クリックorタッチ位置のx座標
    let isTouchedDisplay = false;
    /* ゲーム画面内をクリックされたかどうかを判定 */
    if (pointer.x > 0 && pointer.x < this.width) {
      isTouchedDisplay = true;
    }
    /* クリック時、自機の位置とクリック位置を比較して移動 */
    if (pointer.isDown && Math.abs(x - pointer.x) > 100 && isTouchedDisplay) {
      if (x < pointer.x) {
        this.player.x += 100; // 右に移動
      } else {
        this.player.x -= 100; // 左に移動
      }
    }
  }
}

export default Play;
