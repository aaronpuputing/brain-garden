import { generateRound } from '../generators/BearSortGenerator.js';
import SoundManager from '../utils/SoundManager.js';
import VoicePrompt from '../utils/VoicePrompt.js';
import { COLORS } from '../utils/AssetFactory.js';

// 小熊颜色（从小到大）
const BEAR_HAT_COLORS = [0xEF5350, 0xFF9800, 0xFFD54F, 0x66BB6A, 0x42A5F5];
// 物品纹理映射
const ITEM_TEXTURE_MAP = {
  '🥣': 'sort_bowl',
  '🛏️': 'sort_bed',
  '🪑': 'sort_chair',
  '🧥': 'sort_coat',
  '🎒': 'sort_backpack'
};

export default class BearSortScene extends Phaser.Scene {
  constructor() { super({ key: 'BearSortScene' }); }

  init() {
    this.difficulty = 1;
    this.score = 0;
    this.currentRound = null;
    this.isAnimating = false;
    this.bearSprites = [];
    this.itemSprites = [];
    this.voicePrompt = null;
  }

  create() {
    var W = this.sys.game.config.width;
    var H = this.sys.game.config.height;
    this.gameW = W; this.gameH = H;
    this.soundManager = new SoundManager();
    this.drawBackground();
    this.createUI();
    this.newRound();

    // 语音提示 — 小朋友不认识字也能听懂
    this.voicePrompt = new VoicePrompt(this);
    this.voicePrompt.start(
      '把大的东西拿给大熊，小的东西拿给小熊！',
      '看一看，哪个东西大，哪个东西小呀？',
      18000
    );
  }

  shutdown() {
    if (this.voicePrompt) { this.voicePrompt.stop(); this.voicePrompt = null; }
  }

  drawBackground() {
    var g = this.add.graphics();
    var W = this.gameW, H = this.gameH;
    for (var y = 0; y < H * 0.55; y++) {
      var t = y / (H * 0.55);
      g.fillStyle(Phaser.Display.Color.GetColor(
        Phaser.Math.Linear(0x9F, 0xD4, t),
        Phaser.Math.Linear(0xD4, 0xEA, t),
        Phaser.Math.Linear(0xF0, 0xF7, t)
      ), 1);
      g.fillRect(0, y, W, 1);
    }
    for (var y2 = H * 0.55; y2 < H; y2++) {
      var t2 = (y2 - H * 0.55) / (H * 0.45);
      g.fillStyle(Phaser.Display.Color.GetColor(
        Phaser.Math.Linear(0x7B, 0x5D, t2),
        Phaser.Math.Linear(0xC8, 0xAF, t2),
        Phaser.Math.Linear(0x8A, 0x6E, t2)
      ), 1);
      g.fillRect(0, y2, W, 1);
    }
    g.fillStyle(0xFFF176, 0.7);
    g.fillCircle(W * 0.88, H * 0.08, 30);
    var fcs = [0xFF8FAB, 0xFFD54F, 0xCE93D8];
    for (var i = 0; i < 5; i++) {
      var fx = 60 + i * (W - 120) / 4;
      var fy = H * 0.85;
      g.fillStyle(fcs[i % 3], 0.5);
      g.fillCircle(fx, fy, 5);
      g.fillCircle(fx - 5, fy - 3, 3);
      g.fillCircle(fx + 5, fy - 3, 3);
    }
  }

  createUI() {
    var W = this.gameW, H = this.gameH;
    var backBg = this.add.graphics();
    backBg.fillStyle(0x66BB6A, 1);
    backBg.fillCircle(34, 34, 28);
    var backBtn = this.add.text(34, 34, '🏠', { fontSize: '26px' })
      .setOrigin(0.5).setInteractive();
    backBtn.on('pointerdown', function() { this.scene.scene.start('MenuScene'); }, this);

    var badgeBg = this.add.graphics();
    badgeBg.fillStyle(0xFFFFFF, 0.85);
    badgeBg.fillRoundedRect(W / 2 - 70, 8, 140, 34, 14);
    this.roundText = this.add.text(W / 2, 17, '', {
      fontSize: '14px', color: '#7B9C7B', fontFamily: 'sans-serif', fontStyle: 'bold'
    }).setOrigin(0.5, 0);

    this.doneText = this.add.text(W - 54, 18, '', {
      fontSize: '15px', color: '#7B9C7B', fontFamily: 'sans-serif', fontStyle: 'bold'
    }).setOrigin(0.5, 0);

    this.hintText = this.add.text(W / 2, H - 18, '把东西拖给大小匹配的小熊吧！', {
      fontSize: '14px', color: '#6D8A6E', fontFamily: 'sans-serif',
      backgroundColor: '#FFFFFF80', padding: { x: 10, y: 4 }
    }).setOrigin(0.5, 1).setAlpha(0.7);
  }

  newRound() {
    var self = this;
    this.bearSprites.forEach(function(s) { if (s.text) s.text.destroy(); if (s.hat) s.hat.destroy(); if (s.bg) s.bg.destroy(); });
    this.itemSprites.forEach(function(s) { s.destroy(); });
    this.bearSprites = [];
    this.itemSprites = [];
    this.isAnimating = false;
    this.score = 0;
    this.currentRound = generateRound(this.difficulty);
    var round = this.currentRound;
    this.roundText.setText('☆ Lv.' + this.difficulty + ' ☆');

    var W = this.gameW, H = this.gameH;
    var spacing = W / (round.numBears + 1);

    // 画小熊 — 每个熊大小不同（范围扩大到 0.55-1.45），还戴不同颜色的帽子
    round.bears.forEach(function(bear, i) {
      var bx = spacing * (i + 1);
      var by = H * 0.32;
      var sizeScale = 0.55 + (bear.size - 0.55) * 1.8; // 放大差异: 0.55→1.45
      if (sizeScale > 1.45) sizeScale = 1.45;
      if (sizeScale < 0.55) sizeScale = 0.55;

      // 小熊身体（emoji）
      var bearText = self.add.text(bx, by, '🐻', {
        fontSize: Math.floor(70 * sizeScale) + 'px', fontFamily: 'sans-serif'
      }).setOrigin(0.5);

      // 帽子 — 不同颜色帮助区分
      var hatColor = BEAR_HAT_COLORS[i % BEAR_HAT_COLORS.length];
      var hatG = self.add.graphics();
      var hatSize = 12 * sizeScale;
      var hatY = by - Math.floor(35 * sizeScale);
      hatG.fillStyle(hatColor, 0.85);
      hatG.fillCircle(bx, hatY, hatSize);
      hatG.fillRect(bx - hatSize * 0.7, hatY, hatSize * 1.4, hatSize * 0.4);

      self.bearSprites.push({ text: bearText, hat: hatG, x: bx, y: by, bearData: bear });
    });

    // 画物品 — 用 Canvas 纹理，每个大小不同
    var itemKey = round.items[0].emoji;
    var textureKey = ITEM_TEXTURE_MAP[itemKey] || 'sort_bowl';

    round.items.forEach(function(item, i) {
      var ix = spacing * (i + 1);
      var iy = H * 0.75;
      var itemScale = 0.55 + (item.size - 0.55) * 1.8;
      if (itemScale > 1.45) itemScale = 1.45;
      if (itemScale < 0.55) itemScale = 0.55;

      // 物品背景圆（让小朋友知道可以拖）
      var bg = self.add.graphics();
      bg.fillStyle(0xFFFFFF, 0.85);
      bg.fillCircle(ix, iy, 38 * itemScale);
      bg.setAlpha(0);
      bg.destroy();

      // Canvas 纹理图像
      var sprite = self.add.image(ix, iy, textureKey);
      sprite.setScale(itemScale * 0.8);
      sprite.setInteractive({ useHandCursor: false, draggable: true });
      self.input.setDraggable(sprite);
      sprite.itemData = item;
      sprite.originalX = ix;
      sprite.originalY = iy;
      sprite.baseScale = itemScale * 0.8;

      sprite.on('pointerdown', function() {
        if (self.isAnimating) return;
        self.children.bringToTop(sprite);
        sprite.setScale(sprite.baseScale * 1.2);
      });

      self.input.on('drag', function(pointer, go, dragX, dragY) {
        if (self.isAnimating || go !== sprite) return;
        go.x = dragX; go.y = dragY;
      });

      self.input.on('dragend', function(pointer, go) {
        if (go !== sprite) return;
        self.checkMatch(go);
      });

      self.itemSprites.push(sprite);
    });

    this.doneText.setText('0/' + round.numBears);
  }

  checkMatch(item) {
    var self = this;
    var matched = null;
    var bearObj = null;
    for (var i = 0; i < this.bearSprites.length; i++) {
      var bear = this.bearSprites[i];
      var dist = Phaser.Math.Distance.Between(item.x, item.y, bear.x, bear.y);
      if (dist < 90) {
        if (item.itemData.targetBearId === bear.bearData.id) {
          matched = bear;
          bearObj = bear;
          break;
        }
      }
    }

    if (matched) {
      this.isAnimating = true;
      item.disableInteractive();
      this.soundManager.playCorrect();
      this.voicePrompt.say('对啦！真棒！');
      this.tweens.add({
        targets: item,
        x: matched.x, y: matched.y,
        scaleX: item.baseScale * 0.3, scaleY: item.baseScale * 0.3, alpha: 0.5,
        duration: 250,
        onComplete: function() {
          item.setVisible(false);
          self.score++;
          self.doneText.setText(self.score + '/' + self.currentRound.numBears);
          // Bear happy bounce
          self.tweens.add({ targets: matched.text, scaleX: 1.15, scaleY: 1.15, duration: 120, yoyo: true });
          // Stars
          var sg = self.add.graphics();
          sg.fillStyle(0xFFD700, 1);
          sg.fillCircle(matched.x, matched.y - 30, 8);
          self.tweens.add({ targets: sg, alpha: 0, scaleX: 1.5, scaleY: 1.5, duration: 500, onComplete: function() { sg.destroy(); } });

          if (self.score >= self.currentRound.numBears) {
            self.time.delayedCall(600, function() { self.onRoundComplete(); });
          } else {
            self.isAnimating = false;
          }
        }
      });
    } else {
      this.soundManager.playWrong();
      this.voicePrompt.say('再试试看！想一想哪个大哪个小？');
      this.isAnimating = true;
      this.tweens.add({
        targets: item,
        x: item.originalX, y: item.originalY,
        scaleX: item.baseScale, scaleY: item.baseScale,
        duration: 300, ease: 'Back.easeOut',
        onComplete: function() { self.isAnimating = false; }
      });
      this.cameras.main.shake(50, 0.002);
    }
  }

  onRoundComplete() {
    var self = this;
    this.soundManager.playCelebrate();
    this.isAnimating = true;

    if (this.voicePrompt) this.voicePrompt.say('太棒啦！全部都对啦！');

    this.difficulty = Math.min(this.difficulty + 1, 10);

    var txt = this.add.text(this.gameW / 2, this.gameH / 2, '🎉 太棒了！🎉', {
      fontSize: '40px', color: '#FF8C00', fontFamily: 'sans-serif', fontStyle: 'bold',
      stroke: '#FFF', strokeThickness: 4
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({ targets: txt, alpha: 1, scaleX: 1.1, scaleY: 1.1, duration: 300 });

    var btnY = this.gameH / 2 + 70;
    var playBtn = this.add.text(this.gameW / 2 - 100, btnY, '▶ 再玩一次', {
      fontSize: '24px', color: '#FFF', fontFamily: 'sans-serif', fontStyle: 'bold',
      backgroundColor: '#FF9800', padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

    var homeBtn = this.add.text(this.gameW / 2 + 100, btnY, '🏠 返回', {
      fontSize: '24px', color: '#FFF', fontFamily: 'sans-serif', fontStyle: 'bold',
      backgroundColor: '#66BB6A', padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

    playBtn.on('pointerdown', function() {
      if (self.voicePrompt) self.voicePrompt.say('再来一轮！');
      txt.destroy(); playBtn.destroy(); homeBtn.destroy();
      self.difficulty = Math.max(self.difficulty - 1, 1);
      self.newRound();
    });

    homeBtn.on('pointerdown', function() { self.scene.start('MenuScene'); });

    try { localStorage.setItem('bg-bearsort-high', String(this.difficulty)); } catch(e) {}
  }
}

