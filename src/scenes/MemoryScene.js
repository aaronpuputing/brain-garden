import { generateRound, CARD_BACK } from '../generators/MemoryGenerator.js';
import SoundManager from '../utils/SoundManager.js';
import VoicePrompt from "../utils/VoicePrompt.js";
import BackgroundMusic from '../utils/BackgroundMusic.js';
import AdaptiveDifficulty from '../utils/AdaptiveDifficulty.js';

// Fruit emoji to AI image key mapping (fallback to emoji text if image unavailable)
// FRUIT_TO_IMAGE: maps emoji to image key, falls back to null (use emoji)
var FRUIT_TO_IMAGE = {
  '🍎': 'memory_apple', '🍌': 'memory_banana', '🍓': 'memory_strawberry',
  '🍇': 'memory_grape', '🍊': 'memory_orange', '🍒': 'memory_cherry',
  '🍋': 'memory_lemon', '🍑': 'memory_peach', '🥝': 'memory_kiwi',
  '🍐': 'memory_pear', '🥭': 'memory_mango', '🍍': 'memory_pineapple'
};
FRUIT_TO_IMAGE['🍎'] = 'mem_apple';
FRUIT_TO_IMAGE['🍌'] = 'mem_banana';  
FRUIT_TO_IMAGE['🍓'] = 'mem_strawberry';
FRUIT_TO_IMAGE['🍇'] = 'mem_grape';
export default class MemoryScene extends Phaser.Scene {
  constructor() { super({ key: 'MemoryScene' }); }

  init() {
    this.difficulty = 1;
    this.flippedCards = [];
    this.matchedCount = 0;
    this.totalPairs = 0;
    this.isChecking = false;
    this.cardObjects = [];
    this.voicePrompt = null;
    this.bgMusic = null;
    this.adaptive = null;
  }

  create() {
    var W = this.sys.game.config.width;
    var H = this.sys.game.config.height;
    this.gameW = W; this.gameH = H;
    this.soundManager = new SoundManager();
    this.drawBg();
    this.createUI();
    this.newRound();

    this.voicePrompt = new VoicePrompt(this);
    this.bgMusic = new BackgroundMusic();
    this.bgMusic.start();
    this.adaptive = new AdaptiveDifficulty();
    this.adaptive.level = this.difficulty;

    this.voicePrompt.start(
      '翻开卡片，找到两个相同的水果！',
      '记住卡片的位置，找一样的！',
      18000
    );
  }

  shutdown() {
    if (this.bgMusic) { this.bgMusic.stop(); this.bgMusic = null; }
    if (this.voicePrompt) { this.voicePrompt.stop(); this.voicePrompt = null; }
  }

    drawBg() {
    var g = this.add.graphics();
    var W = this.gameW, H = this.gameH;
    for (var y = 0; y < H; y++) {
      var t = y / H;
      g.fillStyle(Phaser.Display.Color.GetColor(
        Phaser.Math.Linear(0xC5, 0xE8, t),
        Phaser.Math.Linear(0xE5, 0xF0, t),
        Phaser.Math.Linear(0xF7, 0xE5, t)
      ), 1);
      g.fillRect(0, y, W, 1);
    }
    g.fillStyle(0xFFF176, 0.7);
    g.fillCircle(W * 0.88, H * 0.05, 25);
  }

  createUI() {
    var W = this.gameW, H = this.gameH;
    var backBg = this.add.graphics();
    backBg.fillStyle(0x66BB6A, 1);
    backBg.fillCircle(34, 34, 28);
    var backBtn = this.add.text(34, 34, '🏠', { fontSize: '26px' })
      .setOrigin(0.5).setInteractive();
    backBtn.on('pointerdown', function() { this.scene.scene.start('MenuScene'); }, this);

    this.roundText = this.add.text(W / 2, 12, '', {
      fontSize: '14px', color: '#7B9C7B', fontFamily: 'sans-serif', fontStyle: 'bold'
    }).setOrigin(0.5, 0);

    this.hintText = this.add.text(W / 2, H - 14, '点击卡片翻开，找到相同的水果！', {
      fontSize: '14px', color: '#6D8A6E', fontFamily: 'sans-serif',
      backgroundColor: '#FFFFFF80', padding: { x: 8, y: 3 }
    }).setOrigin(0.5, 1).setAlpha(0.7);
  }

  newRound() {
    var self = this;
    this.flippedCards = [];
    this.matchedCount = 0;
    this.isChecking = false;
    this.cardObjects.forEach(function(c) { c.bg.destroy(); c.text.destroy(); if (c.frontImg) c.frontImg.destroy(); });
    this.cardObjects = [];

    this.currentRound = generateRound(this.difficulty);
    this.totalPairs = this.currentRound.cards.length / 2;
    this.roundText.setText('☆ Lv.' + this.difficulty + ' ☆  配对: 0/' + this.totalPairs);

    var W = this.gameW, H = this.gameH;
    var cols = this.currentRound.cols;
    var rows = this.currentRound.rows;
    var cardW = Math.min(100, (W - 40) / cols - 10);
    var cardH = cardW * 1.15;
    var gridW = cols * (cardW + 10) - 10;
    var gridH = rows * (cardH + 10) - 10;
    var startX = (W - gridW) / 2 + cardW / 2;
    var startY = (H - gridH) / 2 + cardH / 2 - 10;

    this.currentRound.cards.forEach(function(card, i) {
      var col = i % cols, row = Math.floor(i / cols);
      var cx = startX + col * (cardW + 10);
      var cy = startY + row * (cardH + 10);

      var bg = self.add.graphics();
      bg.fillStyle(0x66BB6A, 1);
      bg.fillRoundedRect(cx - cardW/2, cy - cardH/2, cardW, cardH, 12);
      bg.lineStyle(1, 0x4CAF50, 0.3);
      bg.strokeRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 12);

      var txt = self.add.text(cx, cy, CARD_BACK, {
        fontSize: Math.floor(cardW * 0.6) + 'px', fontFamily: 'sans-serif'
      }).setOrigin(0.5).setInteractive();

      var imgKey = FRUIT_TO_IMAGE[card.fruit];
      var frontImg = null;
      if (imgKey && self.textures.exists(imgKey)) {
        frontImg = self.add.image(cx, cy, imgKey);
        frontImg.setScale(Math.min(cardW, cardH) / 256 * 0.7);
        frontImg.setVisible(false);
      }
      var emojiFallback = self.add.text(cx, cy, card.fruit, {
          fontSize: Math.floor(cardW * 0.55) + 'px', fontFamily: 'sans-serif'
        }).setOrigin(0.5).setVisible(false);
      var cardObj = { card: card, bg: bg, text: txt, frontImg: frontImg, emojiText: emojiFallback, cx: cx, cy: cy, flipped: false, cardW: cardW, cardH: cardH,
        showFront: function() {
          if (FRUIT_TO_IMAGE[card.fruit]) {
            frontImg.setVisible(true);
          } else {
            emojiFallback.setVisible(true);
          }
        },
        hideFront: function() {
          frontImg.setVisible(false);
          emojiFallback.setVisible(false);
        }
      };

      txt.on('pointerdown', function() {
        if (self.isChecking || cardObj.flipped || card.matched) return;
        self.flipCard(cardObj);
      });

      self.cardObjects.push(cardObj);
    });
  }

  flipCard(cardObj) {
    var self = this;
    cardObj.flipped = true;
    this.soundManager.playTap();

    this.tweens.add({
      targets: [cardObj.bg, cardObj.text],
      scaleX: 0, duration: 80,
      onComplete: function() {
        cardObj.text.setVisible(false);
        cardObj.showFront();
        cardObj.bg.fillStyle(0xFFF8E1, 1);
        var hw = cardObj.cardW / 2, hh = cardObj.cardH / 2;
        cardObj.bg.fillRoundedRect(cardObj.cx - hw, cardObj.cy - hh, cardObj.cardW, cardObj.cardH, 12);
        self.tweens.add({
          targets: [cardObj.bg, cardObj.text],
          scaleX: 1, duration: 80,
          onComplete: function() {
            self.flippedCards.push(cardObj);
            if (self.flippedCards.length === 2) {
              self.isChecking = true;
              self.time.delayedCall(500, function() { self.checkMatch(); });
            }
          }
        });
      }
    });
  }

  checkMatch() {
    var self = this;
    var c1 = this.flippedCards[0], c2 = this.flippedCards[1];
    if (c1.card.fruit === c2.card.fruit) {
      this.soundManager.playCorrect();
      this.voicePrompt.say('找到一对啦！');
      c1.card.matched = true;
      c2.card.matched = true;
      this.matchedCount++;
      this.roundText.setText('☆ Lv.' + this.difficulty + ' ☆  配对: ' + this.matchedCount + '/' + this.totalPairs);

      this.tweens.add({ targets: [c1.bg, c1.text], scaleX: 1.1, scaleY: 1.1, duration: 100, yoyo: true });
      this.tweens.add({ targets: [c2.bg, c2.text], scaleX: 1.1, scaleY: 1.1, duration: 100, yoyo: true });

      // Stars
      [c1, c2].forEach(function(co) {
        var sg = self.add.graphics();
        sg.fillStyle(0xFFD700, 1);
        sg.fillCircle(co.cx, co.cy, 10);
        self.tweens.add({ targets: sg, alpha: 0, scaleX: 2, scaleY: 2, duration: 400, onComplete: function() { sg.destroy(); } });
      });

      if (this.matchedCount >= this.totalPairs) {
        this.time.delayedCall(400, function() { self.onRoundComplete(); });
      }

      this.flippedCards = [];
      this.isChecking = false;
    } else {
      this.soundManager.playWrong();
      this.voicePrompt.say('不一样哦，再试试！');
      this.time.delayedCall(300, function() {
        c1.flipped = false; c2.flipped = false;
        self.tweens.add({
          targets: [c1.bg, c1.text],
          scaleX: 0, duration: 80,
          onComplete: function() {
            c1.hideFront();
            c1.text.setVisible(true);
            c1.bg.fillStyle(0x66BB6A, 1);
            c1.bg.fillRoundedRect(c1.cx-c1.cardW/2,c1.cy-c1.cardH/2,c1.cardW,c1.cardH,12);
            self.tweens.add({ targets: [c1.bg, c1.text], scaleX: 1, duration: 80 });
          }
        });
        self.tweens.add({
          targets: [c2.bg, c2.text],
          scaleX: 0, duration: 80,
          onComplete: function() {
            c2.hideFront();
            c2.text.setVisible(true);
            c2.bg.fillStyle(0x66BB6A, 1);
            c2.bg.fillRoundedRect(c2.cx-c2.cardW/2,c2.cy-c2.cardH/2,c2.cardW,c2.cardH,12);
            self.tweens.add({ targets: [c2.bg, c2.text], scaleX: 1, duration: 80 });
          }
        });
        self.flippedCards = [];
        self.isChecking = false;
      });
    }
  }

  onRoundComplete() {
    var self = this;
    this.soundManager.playCelebrate();
    this.isChecking = true;
    this.difficulty = this.adaptive.record(true);

    var txt = this.add.text(this.gameW / 2, this.gameH / 2 - 20, '🎉 全部找到啦！🎉', {
      fontSize: '36px', color: '#FF8C00', fontFamily: 'sans-serif', fontStyle: 'bold',
      stroke: '#FFF', strokeThickness: 4
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({ targets: txt, alpha: 1, scaleX: 1.1, scaleY: 1.1, duration: 300 });

    var btnY = this.gameH / 2 + 60;
    var playBtn = this.add.text(this.gameW / 2 - 100, btnY, '▶ 再玩一次', {
      fontSize: '24px', color: '#FFF', fontFamily: 'sans-serif', fontStyle: 'bold',
      backgroundColor: '#FF9800', padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

    var homeBtn = this.add.text(this.gameW / 2 + 100, btnY, '🏠 返回', {
      fontSize: '24px', color: '#FFF', fontFamily: 'sans-serif', fontStyle: 'bold',
      backgroundColor: '#66BB6A', padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

    playBtn.on('pointerdown', function() {
      txt.destroy(); playBtn.destroy(); homeBtn.destroy();
      self.newRound();
    });
    homeBtn.on('pointerdown', function() { self.scene.start('MenuScene'); });

    try { localStorage.setItem('bg-memory-high', String(self.difficulty)); } catch(e) {}
  }
}






