import { COLORS } from '../utils/AssetFactory.js';
import VoicePrompt from '../utils/VoicePrompt.js';

import BackgroundMusic from '../utils/BackgroundMusic.js';
import AdaptiveDifficulty from '../utils/AdaptiveDifficulty.js';

export default class MenuScene extends Phaser.Scene {
  constructor() { super({ key: 'MenuScene' }); }

  init() {
    this.voicePrompt = null;
    this.bgMusic = null;
    this.adaptive = null;
  }

  shutdown() {
    if (this.bgMusic) { this.bgMusic.stop(); this.bgMusic = null; }
    if (this.voicePrompt) { this.voicePrompt.stop(); this.voicePrompt = null; }
  }

  create() {
    var W = this.sys.game.config.width;
    var H = this.sys.game.config.height;
    this.gameW = W; this.gameH = H;
    this.drawGarden();
    this.drawTitle();
    this.drawGameCards();
    this.drawVersion();

    // 主界面语音引导
    this.voicePrompt = new VoicePrompt(this);
    this.bgMusic = new BackgroundMusic();
    this.bgMusic.start();
    this.adaptive = new AdaptiveDifficulty();
    this.adaptive.level = this.difficulty;

    this.voicePrompt.start(
      '小朋友，欢迎来到思维花园！选一个游戏玩吧！',
      '点一朵花，就可以开始玩游戏啦！',
      25000
    );
  }

  drawGarden() {
    var W = this.gameW, H = this.gameH;
    var g = this.add.graphics();

    for (var y = 0; y < H * 0.72; y++) {
      var t = y / (H * 0.72);
      g.fillStyle(Phaser.Display.Color.GetColor(
        Phaser.Math.Linear(0x9F, 0xD4, t),
        Phaser.Math.Linear(0xD4, 0xEA, t),
        Phaser.Math.Linear(0xF0, 0xF7, t)
      ), 1);
      g.fillRect(0, y, W, 1);
    }

    for (var y2 = H * 0.72; y2 < H; y2++) {
      var t2 = (y2 - H * 0.72) / (H * 0.28);
      g.fillStyle(Phaser.Display.Color.GetColor(
        Phaser.Math.Linear(0x7B, 0x5D, t2),
        Phaser.Math.Linear(0xC8, 0xAF, t2),
        Phaser.Math.Linear(0x8A, 0x6E, t2)
      ), 1);
      g.fillRect(0, y2, W, 1);
    }

    this.makeCloud(W * 0.1, H * 0.1, 1);
    this.makeCloud(W * 0.5, H * 0.08, 0.8);
    this.makeCloud(W * 0.85, H * 0.12, 0.9);

    var sun = this.add.graphics();
    sun.fillStyle(0xFFF176, 0.7);
    sun.fillCircle(W * 0.85, H * 0.08, 32);

    this.drawGardenFlowers();
  }

  drawGardenFlowers() {
    var W = this.gameW, H = this.gameH;
    var games = [
      { key: 'feed', emoji: '🐱', color: 0xFFB347, saveKey: 'bg-feed-high' },
      { key: 'train', emoji: '🚂', color: 0x42A5F5, saveKey: 'bg-train-high' },
      { key: 'bearsort', emoji: '🐻', color: 0xC4956A, saveKey: 'bg-bearsort-high' },
      { key: 'memory', emoji: '🍎', color: 0xEF5350, saveKey: 'bg-memory-high' },
      { key: 'puzzle', emoji: '🐰', color: 0x9467BD, saveKey: 'bg-puzzle-high' },
      { key: 'oddout', emoji: '🔍', color: 0x26A69A, saveKey: 'bg-oddout-high' },
      { key: 'gardener', emoji: '🌻', color: 0x66BB6A, saveKey: 'bg-gardener-high' },
    ];

    var self = this;
    games.forEach(function(game, i) {
      var fx = 55 + i * (W - 110) / (games.length - 1);
      var fy = H * 0.86;
      var highLevel = 1;
      try {
        var val = localStorage.getItem(game.saveKey);
        if (val) highLevel = Math.min(parseInt(val) || 1, 10);
      } catch(e) {}

      var bloomScale = 1 + (highLevel - 1) * 0.15;
      var fg = self.add.graphics();

      fg.lineStyle(2, 0x5DAF6E, 0.8);
      fg.beginPath();
      fg.moveTo(fx, fy + 5);
      fg.lineTo(fx, fy + 18);
      fg.strokePath();

      if (highLevel >= 3) {
        fg.fillStyle(0x5DAF6E, 0.6);
        fg.fillEllipse(fx + 6, fy + 10, 8, 4);
        fg.fillEllipse(fx - 6, fy + 13, 8, 4);
      }

      var petalCount = 5;
      var petalSize = 5 * bloomScale;
      for (var p = 0; p < petalCount; p++) {
        var angle = (p / petalCount) * Math.PI * 2;
        var alpha = 0.5 + (highLevel - 1) * 0.05;
        fg.fillStyle(game.color, alpha);
        fg.fillCircle(fx + Math.cos(angle) * petalSize * 0.6, fy + Math.sin(angle) * petalSize * 0.6, petalSize);
      }
      fg.fillStyle(0xFFF176, 0.9);
      fg.fillCircle(fx, fy, petalSize * 0.5);

      self.add.text(fx, fy - petalSize - 8, game.emoji, {
        fontSize: '11px', fontFamily: 'sans-serif'
      }).setOrigin(0.5).setAlpha(0.8);

      if (highLevel <= 1) {
        fg.fillStyle(0xCCCCCC, 0.3);
        fg.fillCircle(fx, fy, 3);
      }

      self.tweens.add({
        targets: fg,
        scaleX: 1.02, scaleY: 1.02,
        duration: 2000 + i * 200,
        yoyo: true, repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });
  }

  drawTitle() {
    var W = this.gameW, H = this.gameH;
    var title = this.add.text(W / 2, H * 0.04, '🌻 思维花园 🌻', {
      fontSize: '30px', color: '#5D4037', fontFamily: 'sans-serif',
      fontStyle: 'bold', stroke: '#FFFFFF', strokeThickness: 4,
    }).setOrigin(0.5, 0);
    this.tweens.add({
      targets: title, scaleX: 1.04, scaleY: 1.04,
      duration: 2200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });

    this.add.text(W / 2, H * 0.10, '小朋友，选一个游戏吧！', {
      fontSize: '14px', color: '#8D7B6B', fontFamily: 'sans-serif',
    }).setOrigin(0.5, 0);
  }

  drawGameCards() {
    var W = this.gameW, H = this.gameH;
    var cards = [
      { key: 'FeedAnimalsScene', label: '小动物喂食', desc: '拖拽食物喂小动物', emoji: '🐱', bg: 0xFFE0B2 },
      { key: 'ColorTrainScene', label: '彩色小火车', desc: '看规律补全列车', emoji: '🚂', bg: 0xBBDEFB },
      { key: 'BearSortScene', label: '小熊排序', desc: '按大小分东西', emoji: '🐻', bg: 0xE8D5CC },
      { key: 'MemoryScene', label: '水果配对', desc: '翻开卡片找对子', emoji: '🍎', bg: 0xFFCDD2 },
      { key: 'PuzzleScene', label: '动物拼图', desc: '把动物拼完整', emoji: '🐰', bg: 0xE1BEE7 },
      { key: 'OddOutScene', label: '谁混进来了', desc: '找到不一样的那个', emoji: '🔍', bg: 0xB2DFDB },
      { key: 'GardenerScene', label: '种花小园丁', desc: '一步步种出花朵', emoji: '🌻', bg: 0xC8E6C9 },
    ];

    var cardW = Math.min(126, (W - 20) / cards.length - 4);
    var cardH = cardW * 1.2;
    var totalW = cards.length * (cardW + 4) - 4;
    var startX = (W - totalW) / 2 + cardW / 2;
    var cy = H * 0.52;
    var self = this;

    cards.forEach(function(card, i) {
      var cx = startX + i * (cardW + 4);

      var shadow = self.add.graphics();
      shadow.fillStyle(0x000000, 0.05);
      shadow.fillRoundedRect(cx - cardW / 2 + 2, cy - cardH / 2 + 2, cardW, cardH, 12);

      var cardBg = self.add.graphics();
      cardBg.fillStyle(0xFFFFFF, 0.95);
      cardBg.fillRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 12);

      var stripe = self.add.graphics();
      stripe.fillStyle(card.bg, 1);
      stripe.fillRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardW * 0.38, { tl: 12, tr: 12, bl: 0, br: 0 });

      var emoji = self.add.text(cx, cy - cardH * 0.13, card.emoji, {
        fontSize: Math.floor(cardW * 0.38) + 'px',
      }).setOrigin(0.5);

      self.add.text(cx, cy + cardH * 0.20, card.label, {
        fontSize: Math.floor(cardW * 0.12) + 'px', color: '#5D4037',
        fontFamily: 'sans-serif', fontStyle: 'bold',
      }).setOrigin(0.5);

      self.add.text(cx, cy + cardH * 0.32, card.desc, {
        fontSize: Math.floor(cardW * 0.078) + 'px', color: '#9E8B7B',
        fontFamily: 'sans-serif',
      }).setOrigin(0.5);

      var btnW = cardW * 0.6, btnH = cardW * 0.22;
      var btnBg = self.add.graphics();
      btnBg.fillStyle(0xFFB347, 1);
      btnBg.fillRoundedRect(cx - btnW / 2, cy + cardH * 0.40 - btnH / 2, btnW, btnH, btnH / 2);
      self.add.text(cx, cy + cardH * 0.40, '▶ 玩', {
        fontSize: Math.floor(cardW * 0.10) + 'px', color: '#FFF',
        fontFamily: 'sans-serif', fontStyle: 'bold',
      }).setOrigin(0.5);

      var zone = self.add.zone(cx, cy, cardW, cardH).setInteractive({ useHandCursor: false });
      zone.on('pointerdown', function() {
        self.tweens.add({
          targets: [cardBg, emoji],
          scaleX: 0.95, scaleY: 0.95, duration: 80, yoyo: true,
          onComplete: function() { self.scene.start(card.key); },
        });
      });
      zone.on('pointerover', function() {
        self.tweens.add({ targets: emoji, scaleX: 1.15, scaleY: 1.15, duration: 150, ease: 'Back.easeOut' });
      });
      zone.on('pointerout', function() {
        self.tweens.add({ targets: emoji, scaleX: 1, scaleY: 1, duration: 150 });
      });
    });
  }

  drawVersion() {
    var W = this.gameW, H = this.gameH;
    var verText = this.add.text(W - 10, H - 8, 'v1.0.0-beta', {
      fontSize: '10px', color: '#AAA', fontFamily: 'sans-serif',
    }).setOrigin(1, 1).setInteractive();

    // Long-press to open parent dashboard
    var holdTimer = null;
    verText.on('pointerdown', function() {
      holdTimer = this.scene.time.delayedCall(1500, function() {
        this.scene.scene.start('ParentDashboardScene');
      }, null, verText);
    }, this);
    verText.on('pointerup', function() {
      if (holdTimer) { holdTimer.remove(); holdTimer = null; }
    }, this);
    verText.on('pointerout', function() {
      if (holdTimer) { holdTimer.remove(); holdTimer = null; }
    }, this);
  }

  makeCloud(x, y, s) {
    var g = this.add.graphics();
    g.fillStyle(0xFFFFFF, 0.55);
    g.fillCircle(x, y, 30 * s);
    g.fillCircle(x + 26 * s, y - 4 * s, 26 * s);
    g.fillCircle(x + 48 * s, y, 24 * s);
    g.fillCircle(x + 22 * s, y + 6 * s, 22 * s);
  }
}


