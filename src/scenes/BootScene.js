import generateAllTextures, { generateStarTexture } from '../utils/AssetFactory.js';

export default class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  preload() {
    const { width, height } = this.sys.game.config;
    this.add.text(width / 2, height / 2 - 40, '🌱 花园正在生长...', {
      fontSize: '24px', color: '#8B7355', fontFamily: 'sans-serif',
    }).setOrigin(0.5);
  }

  create() {
    generateAllTextures(this);
    generateStarTexture(this);
    this.time.delayedCall(500, () => { this.scene.start('MenuScene'); });
  }
}

