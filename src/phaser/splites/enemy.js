import Phaser from 'phaser';

class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, animation, scale, flameRate) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(scale);

    this.anims.create({
      key: 'default',
      frameRate: flameRate,
      frames: this.anims.generateFrameNumbers(texture, { start: 0, end: 3 }),
      repeat: -1,
    });
    this.play(animation);
  }
}
export default Enemy;
