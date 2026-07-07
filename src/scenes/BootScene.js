import generateAllTextures, { generateStarTexture } from '../utils/AssetFactory.js';

// AI image list — Phaser will skip missing files gracefully
// but we list only confirmed-available images
const AI_IMAGES = [
  'feed_cat.png', 'feed_dog.png', 'feed_bunny.png',
  'feed_fish.png', 'feed_bone.png', 'feed_carrot.png',
  'memory_apple.png', 'memory_banana.png', 'memory_strawberry.png',
  'gardener_seed.png', 'gardener_sprout.png', 'gardener_watering_can.png',
  'train_engine.png', 'bearsort_backpack.png', 'bearsort_chair.png', 'bearsort_coat.png',
  'puzzle_bunny.png', 'puzzle_cat.png', 'puzzle_dog.png', 'puzzle_fish.png',
  'oddout_apple.png', 'oddout_banana.png', 'oddout_carrot.png',
  'oddout_fish.png', 'oddout_tree.png'
];

export default class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  preload() {
    var W = this.sys.game.config.width;
    var H = this.sys.game.config.height;
    this.add.text(W / 2, H / 2 - 40, '🌱 花园正在生长...', {
      fontSize: '24px', color: '#8B7355', fontFamily: 'sans-serif',
    }).setOrigin(0.5);

    var imgDir = 'assets/images/generated/';
    AI_IMAGES.forEach(function(img) {
      this.load.image(img.replace('.png', ''), imgDir + img);
    }, this);
  }

  create() {
    generateAllTextures(this);
    generateStarTexture(this);
    this.time.delayedCall(500, function() { this.scene.start('MenuScene'); }, [], this);
  }
}

