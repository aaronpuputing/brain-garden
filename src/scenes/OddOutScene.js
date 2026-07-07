import { generateRound } from '../generators/OddOutGenerator.js';
import SoundManager from '../utils/SoundManager.js';
import VoicePrompt from "../utils/VoicePrompt.js";

export default class OddOutScene extends Phaser.Scene {
  constructor() { super({ key: 'OddOutScene' }); }

  init() {
    this.difficulty = 1;
    this.round = 0;
    this.isAnimating = false;
    this.voicePrompt = null;
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
    this.voicePrompt.start(
      '看一看，哪一个跟其他的不一样？找到它，点一下！',
      '仔细看看，哪个小动物混进来了？',
      18000
    );
  }

  shutdown() {
    if (this.voicePrompt) { this.voicePrompt.stop(); this.voicePrompt = null; }
  }

    drawBg() {
    var W = this.gameW, H = this.gameH;
    var g = this.add.graphics();
    for (var y = 0; y < H; y++) {
      var t = y / H;
      g.fillStyle(Phaser.Display.Color.GetColor(
        Phaser.Math.Linear(0xE8, 0xE8, t),
        Phaser.Math.Linear(0xE0, 0xF5, t),
        Phaser.Math.Linear(0xF0, 0xE9, t)
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

    this.hintText = this.add.text(W / 2, H - 14, '找到不一样的那个，点它！', {
      fontSize: '14px', color: '#6D8A6E', fontFamily: 'sans-serif',
      backgroundColor: '#FFFFFF80', padding: { x: 8, y: 3 }
    }).setOrigin(0.5, 1).setAlpha(0.7);
  }

  newRound() {
    var self = this;
    if (this.itemSprites) this.itemSprites.forEach(function(s) { s.destroy(); });
    this.itemSprites = [];
    this.isAnimating = false;
    this.round++;
    this.currentRound = generateRound(this.difficulty);
    this.roundText.setText('☆ Lv.' + this.difficulty + ' ☆  第' + this.round + '轮');

    var W = this.gameW, H = this.gameH;
    var spacing = W / 5;
    var startX = spacing * 1.5;
    var y = H * 0.45;
    var emojis = this.currentRound.items;

    var self = this;
    emojis.forEach(function(emoji, i) {
      var x = startX + i * (spacing * 0.8);
      var frame = self.add.graphics();
      frame.fillStyle(0xFFFFFF, 0.9);
      frame.fillRoundedRect(x - 55, y - 55, 110, 110, 20);
      frame.lineStyle(2, 0xE0E0E0, 0.5);
      frame.strokeRoundedRect(x - 55, y - 55, 110, 110, 20);

      var txt = self.add.text(x, y, emoji, {
        fontSize: '72px', fontFamily: 'sans-serif'
      }).setOrigin(0.5).setInteractive();

      txt.on('pointerdown', function() {
        if (self.isAnimating) return;
        self.handleTap(txt, frame, i);
      });

      txt.on('pointerover', function() {
        if (self.isAnimating) return;
        txt.setScale(1.15);
        frame.fillStyle(0xF0F0FF, 0.9);
        frame.fillRoundedRect(x - 55, y - 55, 110, 110, 20);
      });
      txt.on('pointerout', function() {
        if (self.isAnimating) return;
        txt.setScale(1);
        frame.fillStyle(0xFFFFFF, 0.9);
        frame.fillRoundedRect(x - 55, y - 55, 110, 110, 20);
      });

      self.itemSprites.push({ txt: txt, frame: frame, idx: i });
    });
  }

  handleTap(txt, frame, idx) {
    var self = this;
    this.isAnimating = true;
    var isCorrect = (idx === this.currentRound.oddIdx);

    // Highlight all
    this.itemSprites.forEach(function(s) {
      s.txt.disableInteractive();
      if (s.idx === self.currentRound.oddIdx) {
        self.tweens.add({ targets: s.frame, alpha: 0.15, duration: 200, yoyo: true, repeat: 1 });
      }
    });

    if (isCorrect) {
      this.soundManager.playCorrect();
      this.voicePrompt.say('找到了！就是它！');
      // Highlight the correct one green
      this.itemSprites[idx].frame.fillStyle(0xA5D6A7, 1);
      this.itemSprites[idx].frame.fillRoundedRect(
        this.itemSprites[idx].txt.x - 55, this.itemSprites[idx].txt.y - 55, 110, 110, 20
      );

      // Stars
      var sg = this.add.graphics();
      sg.fillStyle(0xFFD700, 1);
      sg.fillCircle(txt.x, txt.y - 40, 12);
      this.tweens.add({ targets: sg, alpha: 0, scaleX: 2, scaleY: 2, duration: 500, onComplete: function() { sg.destroy(); } });

      // Big text
      var cText = this.add.text(this.gameW / 2, this.gameH * 0.25, '🎉 答对啦！', {
        fontSize: '36px', color: '#FF8C00', fontFamily: 'sans-serif', fontStyle: 'bold',
        stroke: '#FFF', strokeThickness: 3
      }).setOrigin(0.5).setAlpha(0);
      this.tweens.add({ targets: cText, alpha: 1, scaleX: 1.1, scaleY: 1.1, duration: 250 });

      this.time.delayedCall(1200, function() {
        cText.destroy();
        self.difficulty = Math.min(self.difficulty + 1, 10);
        self.newRound();
        try { localStorage.setItem('bg-oddout-high', String(self.difficulty)); } catch(e) {}
      });
    } else {
      this.soundManager.playWrong();
      this.voicePrompt.say('不对哦，再看看！');
      // Shake the wrong one
      this.tweens.add({ targets: txt, x: txt.x - 8, duration: 40, yoyo: true, repeat: 5 });
      
      // Highlight correct one gently
      var correctS = this.itemSprites[this.currentRound.oddIdx];
      this.tweens.add({
        targets: correctS.frame,
        alpha: 0.3, duration: 300, yoyo: true, repeat: 2
      });

      this.time.delayedCall(1500, function() {
        self.difficulty = Math.max(self.difficulty - 1, 1);
        self.newRound();
      });
    }
  }
}


