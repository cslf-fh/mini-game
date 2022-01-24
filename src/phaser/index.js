import Phaser from 'phaser';
import preset from './preset';
import Title from './scene/title';
import Play from './scene/play';
import Result from './scene/result';

const config = { ...preset.config, scene: [Title, Play, Result] };

const game = new Phaser.Game(config);

export default game;
