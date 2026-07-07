import { generateRound } from '../generators/PuzzleGenerator.js';
import SoundManager from '../utils/SoundManager.js';
import VoicePrompt from '../utils/VoicePrompt.js';

export default class PuzzleScene extends Phaser.Scene {
  constructor() { super({ key: 'PuzzleScene' }); }

  init() {
    this.difficulty = 1;
    this.pieces = [];
    this.slots = [];
    this.placedCount = 0;
    this.totalPieces = 0;
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
      '按顺序把图案拖到正确的位置！',
      '看一看，每个格子里想要什么图案呢？',
      18000
    );
  }

  shutdown() {
    if (this.voicePrompt) { this.voicePrompt.stop(); this.voicePrompt = null; }
  }

  drawBg() {
    var g = this.add.graphics();
    var W = this.gameW, H = this.gameH;
    for (var y = 0; y < H; y++) {
      var t = y / H;
      g.fillStyle(Phaser.Display.Color.GetColor(
        Phaser.Math.Linear(0xE8, 0xF5, t),
        Phaser.Math.Linear(0xF5, 0xE9, t),
        Phaser.Math.Linear(0xF8, 0xE8, t)
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

    this.hintText = this.add.text(W / 2, H - 14, '按顺序把图案排列好吧！', {
      fontSize: '14px', color: '#6D8A6E', fontFamily: 'sans-serif',
      backgroundColor: '#FFFFFF80', padding: { x: 8, y: 3 }
    }).setOrigin(0.5, 1).setAlpha(0.7);
  }

  newRound() {
    var self = this;
    this.pieces.forEach(function(p) { p.sprite.destroy(); });
    this.slots.forEach(function(s) { s.g.destroy(); if (s.hint) s.hint.destroy(); });
    this.pieces = [];
    this.slots = [];
    this.placedCount = 0;
    this.isAnimating = false;

    this.currentRound = generateRound(this.difficulty);
    this.totalPieces = this.currentRound.numPieces;
    this.roundText.setText('☆ Lv.' + this.difficulty + ' ☆');

    var W = this.gameW, H = this.gameH;
    var pieceSize = Math.min(110, (W - 40) / this.currentRound.numPieces);
    var slotSpacing = pieceSize + 14;
    var totalW = this.currentRound.numPieces * slotSpacing - 14;
    var slotsStartX = (W - totalW) / 2 + pieceSize / 2;
    var slotY = H * 0.55;

    // Draw slots — each shows the correct emoji as a faded hint
    for (var i = 0; i < this.currentRound.numPieces; i++) {
      var sx = slotsStartX + i * slotSpacing;
      var slotG = self.add.graphics();
      // Slot border
      slotG.lineStyle(3, 0xAAAAAA, 0.5);
      slotG.strokeRoundedRect(sx - pieceSize / 2, slotY - pieceSize / 2, pieceSize, pieceSize + 10, 12);
      slotG.fillStyle(0xFFFFFF, 0.3);
      slotG.fillRoundedRect(sx - pieceSize / 2, slotY - pieceSize / 2, pieceSize, pieceSize + 10, 12);

      // Faded hint emoji in slot
      var hintEmoji = self.currentRound.pieces.find(function(p) { return p.slot === i; });
      var hint = null;
      if (hintEmoji) {
        hint = self.add.text(sx, slotY, hintEmoji.emoji, {
          fontSize: Math.floor(pieceSize * 0.45) + 'px', fontFamily: 'sans-serif'
        }).setOrigin(0.5).setAlpha(0.25);
      }

      self.slots.push({ g: slotG, hint: hint, x: sx, y: slotY, size: pieceSize, idx: i, filled: false });
    }

    // Create shuffled puzzle pieces
    self.currentRound.pieces.forEach(function(piece) {
      var px = 50 + Math.random() * (W - 100);
      var py = H * 0.78 + Math.random() * (H * 0.1);
      var sprite = self.add.text(px, py, piece.emoji, {
        fontSize: Math.floor(pieceSize * 0.55) + 'px',
        fontFamily: 'sans-serif',
        backgroundColor: '#FFFFFFCC',
        padding: { x: pieceSize * 0.18, y: 10 }
      }).setOrigin(0.5).setInteractive({ useHandCursor: false, draggable: true });

      self.input.setDraggable(sprite);
      sprite.pieceData = piece;
      sprite.origX = px; sprite.origY = py;

      sprite.on('pointerdown', function() {
        if (self.isAnimating) return;
        self.children.bringToTop(sprite);
        sprite.setScale(1.15);
      });

      self.input.on('drag', function(pointer, go, dragX, dragY) {
        if (self.isAnimating || go !== sprite) return;
        go.x = dragX; go.y = dragY;
      });

      self.input.on('dragend', function(pointer, go) {
        if (go !== sprite) return;
        self.checkPlace(go);
      });

      self.pieces.push({ sprite: sprite, piece: piece });
    });
  }

  checkPlace(pieceSprite) {
    var self = this;
    var targetSlot = null;

    // Find nearest unfilled slot
    for (var i = 0; i < this.slots.length; i++) {
      var slot = this.slots[i];
      if (slot.filled) continue;
      var dist = Phaser.Math.Distance.Between(pieceSprite.x, pieceSprite.y, slot.x, slot.y);
      if (dist < 70) {
        targetSlot = slot;
        break;
      }
    }

    if (!targetSlot) {
      // Missed all slots — bounce back
      this.soundManager.playWrong();
      this.voicePrompt.say('再试试看！拖到格子里。');
      this.isAnimating = true;
      this.tweens.add({
        targets: pieceSprite,
        x: pieceSprite.origX, y: pieceSprite.origY,
        duration: 300, ease: 'Back.easeOut',
        onComplete: function() { self.isAnimating = false; }
      });
      return;
    }

    // Check if piece matches slot
    if (pieceSprite.pieceData.slot !== targetSlot.idx) {
      this.soundManager.playWrong();
      this.voicePrompt.say('不对哦！看看格子里想要什么图案？');
      this.isAnimating = true;
      this.tweens.add({
        targets: pieceSprite,
        x: pieceSprite.origX, y: pieceSprite.origY,
        duration: 300, ease: 'Back.easeOut',
        onComplete: function() { self.isAnimating = false; }
      });
      this.cameras.main.shake(50, 0.002);
      return;
    }

    // Correct!
    pieceSprite.disableInteractive();
    this.isAnimating = true;
    this.soundManager.playCorrect();
    this.voicePrompt.say('对啦！');

    this.tweens.add({
      targets: pieceSprite,
      x: targetSlot.x, y: targetSlot.y,
      duration: 200, ease: 'Back.easeOut',
      onComplete: function() {
        targetSlot.filled = true;
        self.placedCount++;
        pieceSprite.setAlpha(0.85);
        // Show hint clearly now
        if (targetSlot.hint) targetSlot.hint.setAlpha(0);

        // Stars
        var sg = self.add.graphics();
        sg.fillStyle(0xFFD700, 1);
        sg.fillCircle(targetSlot.x, targetSlot.y - 20, 10);
        self.tweens.add({ targets: sg, alpha: 0, scaleX: 2, scaleY: 2, duration: 400, onComplete: function() { sg.destroy(); } });

        if (self.placedCount >= self.totalPieces) {
          self.time.delayedCall(400, function() { self.onRoundComplete(); });
        } else {
          self.isAnimating = false;
        }
      }
    });
  }

  onRoundComplete() {
    var self = this;
    this.soundManager.playCelebrate();
    this.isAnimating = true;
    this.voicePrompt.say('太棒啦！全部拼好啦！');

    this.difficulty = Math.min(this.difficulty + 1, 10);

    var txt = this.add.text(this.gameW / 2, this.gameH / 2 - 20, '🎉 拼好啦！🎉', {
      fontSize: '40px', color: '#FF8C00', fontFamily: 'sans-serif', fontStyle: 'bold',
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

    try { localStorage.setItem('bg-puzzle-high', String(self.difficulty)); } catch(e) {}
  }
}

