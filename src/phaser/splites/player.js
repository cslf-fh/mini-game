import Phaser from 'phaser';

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, animation, scale) {
    super(scene, x, y, texture);

    scene.add.existing(this); // シーンに追加
    scene.physics.add.existing(this); // 物理判定を追加

    this.setScale(scale);
    //this.setImmovable(true); // 描画時にオブジェクトを固定
    this.body.setAllowGravity(false); // オブジェクトが重力の影響を受けないように

    /* スプライトシートからアニメーションを作成 */
    this.anims.create({
      key: 'default',
      frameRate: 6,
      frames: this.anims.generateFrameNumbers(texture, { start: 0, end: 2 }),
      repeat: -1, // アニメーションを繰り返す
    });
    this.anims.create({
      key: 'damaged',
      frameRate: 3,
      frames: this.anims.generateFrameNumbers(texture, { start: 3, end: 5 }),
      repeat: -1,
    });
    this.play(animation); // アニメーションを追加
  }
}
export default Player;
