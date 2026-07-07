import { generateRound } from '../generators/GardenerGenerator.js';
import SoundManager from '../utils/SoundManager.js';
import VoicePrompt from "../utils/VoicePrompt.js";

import BackgroundMusic from '../utils/BackgroundMusic.js';
import AdaptiveDifficulty from '../utils/AdaptiveDifficulty.js';

export default class GardenerScene extends Phaser.Scene {
  constructor() { super({ key: 'GardenerScene' }); }

  init() {
    this.difficulty = 1;
    this.currentStep = 0;
    this.isAnimating = false;
    this.stepSprites = [];
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
      '跟着步骤，一步一步种出漂亮的花！',
      '看一看，下一步该做什么呢？',
      18000
    );
  }

  shutdown() {
    if (this.bgMusic) { this.bgMusic.stop(); this.bgMusic = null; }
    if (this.voicePrompt) { this.voicePrompt.stop(); this.voicePrompt = null; }
  }

    drawBg() {
    var W = this.gameW, H = this.gameH;
    var g = this.add.graphics();
    // Earthy tones
    for (var y = 0; y < H * 0.7; y++) {
      var t = y / (H * 0.7);
      g.fillStyle(Phaser.Display.Color.GetColor(
        Phaser.Math.Linear(0xE8, 0xF5, t),
        Phaser.Math.Linear(0xF5, 0xE9, t),
        Phaser.Math.Linear(0xF8, 0xE8, t)
      ), 1);
      g.fillRect(0, y, W, 1);
    }
    // Ground
    for (var y2 = H * 0.7; y2 < H; y2++) {
      var t2 = (y2 - H * 0.7) / (H * 0.3);
      g.fillStyle(Phaser.Display.Color.GetColor(
        Phaser.Math.Linear(0x8B, 0x6B, t2),
        Phaser.Math.Linear(0x6F, 0x4F, t2),
        Phaser.Math.Linear(0x3E, 0x2E, t2)
      ), 1);
      g.fillRect(0, y2, W, 1);
    }
    // Sun
    g.fillStyle(0xFFF176, 0.7);
    g.fillCircle(W * 0.12, H * 0.06, 28);

    // Draw a garden bed
    var bx = W / 2, by = H * 0.75;
    g.fillStyle(0x8B6F3E, 0.6);
    g.fillRoundedRect(bx - 80, by - 15, 160, 50, 10);
    g.lineStyle(2, 0x6B4F2E, 0.4);
    g.strokeRoundedRect(bx - 80, by - 15, 160, 50, 10);
    this.bedX = bx; this.bedY = by;
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
      fontSize: '14px', color: '#5D4037', fontFamily: 'sans-serif', fontStyle: 'bold'
    }).setOrigin(0.5, 0);

    this.gardenDisplay = this.add.text(W / 2, H * 0.45, '🌱', {
      fontSize: '80px', fontFamily: 'sans-serif'
    }).setOrigin(0.5);

    this.hintText = this.add.text(W / 2, H - 14, '', {
      fontSize: '14px', color: '#6D8A6E', fontFamily: 'sans-serif',
      backgroundColor: '#FFFFFF80', padding: { x: 8, y: 3 }
    }).setOrigin(0.5, 1).setAlpha(0.7);
  }

  newRound() {
    var self = this;
    if (self.stepSprites) self.stepSprites.forEach(function(s) { if (s.bg) s.bg.destroy(); if (s.emoji) s.emoji.destroy(); if (s.label) s.label.destroy(); });
    self.stepSprites = [];
    self.currentStep = 0;
    self.isAnimating = false;
    self.currentRound = generateRound(self.difficulty);
    self.roundText.setText('☆ Lv.' + self.difficulty + ' ☆  种一朵' + self.currentRound.flowerName);
    self.gardenDisplay.setText('🌱');
    self.hintText.setText('按顺序帮' + self.currentRound.flowerName + '长大吧！');

    var W = self.gameW, H = self.gameH;
    var steps = self.currentRound.steps;
    var stepSpacing = Math.min(120, (W - 40) / steps.length);
    var totalW = steps.length * stepSpacing;
    var startX = (W - totalW) / 2 + stepSpacing / 2;
    var stepY = H * 0.85;

    steps.forEach(function(step, i) {
      var sx = startX + i * stepSpacing;
      var bg = self.add.graphics();
      bg.fillStyle(0xFFFFFF, 0.85);
      bg.fillRoundedRect(sx - 40, stepY - 40, 80, 80, 16);

      var emoji = self.add.text(sx, stepY - 10, step.emoji, {
        fontSize: '40px', fontFamily: 'sans-serif'
      }).setOrigin(0.5);

      var label = self.add.text(sx, stepY + 28, step.action, {
        fontSize: '11px', color: '#5D4037', fontFamily: 'sans-serif'
      }).setOrigin(0.5);

      emoji.setInteractive();
      emoji.on('pointerdown', function() {
        if (self.isAnimating) return;
        if (i === self.currentStep) {
          self.doStep(step, i, bg, emoji);
        }
      });
      emoji.on('pointerover', function() {
        if (self.isAnimating || i !== self.currentStep) return;
        emoji.setScale(1.2);
      });
      emoji.on('pointerout', function() {
        if (self.isAnimating || i !== self.currentStep) return;
        emoji.setScale(1);
      });

      self.stepSprites.push({ bg: bg, emoji: emoji, label: label, idx: i, done: false });
    });
  }

  doStep(step, idx, bg, emoji) {
    var self = this;
    self.isAnimating = true;
    self.soundManager.playCorrect();
    self.voicePrompt.say('做得好！');

    // Highlight and mark done
    bg.fillStyle(0xA5D6A7, 1);
    bg.fillRoundedRect(emoji.x - 40, emoji.y - 50, 80, 80, 16);
    emoji.setAlpha(0.5);
    
    // Fly effect - emoji goes to garden
    var flyEmoji = self.add.text(emoji.x, emoji.y, step.emoji, {
      fontSize: '40px', fontFamily: 'sans-serif'
    }).setOrigin(0.5);
    self.tweens.add({
      targets: flyEmoji,
      x: self.bedX, y: self.bedY - 30,
      scaleX: 0.5, scaleY: 0.5, alpha: 0.5,
      duration: 500,
      onComplete: function() { flyEmoji.destroy(); }
    });

    self.currentStep++;
    var steps = self.currentRound.steps;
    var progress = self.currentStep / steps.length;

    // Update garden display based on progress
    if (progress <= 0.25) self.gardenDisplay.setText('🌱');
    else if (progress <= 0.5) self.gardenDisplay.setText('🌿');
    else if (progress <= 0.75) self.gardenDisplay.setText('🌷');
    else self.gardenDisplay.setText(self.currentRound.flowerEmoji);

    self.tweens.add({
      targets: self.gardenDisplay,
      scaleX: 1.3, scaleY: 1.3,
      duration: 150, yoyo: true
    });

    if (self.currentStep >= steps.length) {
      // Complete!
      self.time.delayedCall(600, function() {
        self.soundManager.playCelebrate();
        self.hintText.setText(self.currentRound.flowerName + '开花啦！🌸');

        // Flower bloom effect
        self.gardenDisplay.setText(self.currentRound.flowerEmoji);
        self.tweens.add({
          targets: self.gardenDisplay,
          scaleX: 1.8, scaleY: 1.8,
          duration: 300, yoyo: true, repeat: 2,
          ease: 'Back.easeOut'
        });

        // Stars
        var sg = self.add.graphics();
        sg.fillStyle(0xFFD700, 0.8);
        for (var i = 0; i < 8; i++) {
          var angle = (i / 8) * Math.PI * 2;
          sg.fillCircle(self.bedX + Math.cos(angle) * 50, self.bedY + Math.sin(angle) * 40, 7);
        }
        self.tweens.add({ targets: sg, alpha: 0, duration: 1200, onComplete: function() { sg.destroy(); } });

        self.time.delayedCall(2000, function() {
          self.difficulty = self.adaptive.record(true);
          self.newRound();
          try { localStorage.setItem('bg-gardener-high', String(self.difficulty)); } catch(e) {}
        });
      });
    } else {
      self.time.delayedCall(400, function() { self.isAnimating = false; });
    }
  }
}




