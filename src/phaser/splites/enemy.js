import Phaser from 'phaser';

class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, animation) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(5);
    this.setImmovable(true);
    this.body.setAllowGravity(false);

    this.anims.create({
      key: 'default',
      frameRate: 6,
      frames: this.anims.generateFrameNumbers(texture, { start: 0, end: 3 }),
      repeat: -1,
    });
    this.play(animation);
  }
}
export default Enemy;
