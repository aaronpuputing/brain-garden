/**
 * FeedAnimalsScene fix: 
 * 1. Remove duplicate SoundManager inits (lines 156, 287, 309, 312, 346)
 * 2. Add this.sound.playAnimalHappy() in handleCorrect onComplete
 * 3. In handleCorrect, fix the delayedCall callback formatting
 */
import { generateRound, EMOJI_MAP } from "../generators/FeedAnimalsGenerator.js";
import SoundManager from "../utils/SoundManager.js";
import VoicePrompt from "../utils/VoicePrompt.js";



export default class FeedAnimalsScene extends Phaser.Scene {
  constructor() {
    super({ key: "FeedAnimalsScene" });
  }

  init() {
    this.difficulty = 1;
    this.score = 0;
    this.foodSprites = [];
    this.animalSprites = [];
    this.currentRound = null;
    this.isAnimating = false;
    this.soundManager = null;
    this.voicePrompt = null;
  }

  create() {
    const { width, height } = this.sys.game.config;
    this.gameW = width;
    this.gameH = height;
    this.soundManager = new SoundManager();
    this.drawBackground();
    this.createUI();
    this.newRound();

    this.voicePrompt = new VoicePrompt(this);
    this.voicePrompt.start(
      '把鱼拖给小猫，把骨头拖给小狗，把胡萝卜拖给小兔子！',
      '想一想，小动物们爱吃什么呀？',
      18000
    );
  }

  shutdown() {
    if (this.voicePrompt) { this.voicePrompt.stop(); this.voicePrompt = null; }
  }

  drawBackground() {
    const g = this.add.graphics();
    const W = this.gameW, H = this.gameH;
    const skyTop = Phaser.Display.Color.HexStringToColor("#9FD4F0");
    const skyBot = Phaser.Display.Color.HexStringToColor("#D4EAF7");
    for (let y = 0; y < H * 0.55; y++) {
      const t = y / (H * 0.55);
      const r = Phaser.Math.Linear(skyTop.red, skyBot.red, t);
      const gr = Phaser.Math.Linear(skyTop.green, skyBot.green, t);
      const b = Phaser.Math.Linear(skyTop.blue, skyBot.blue, t);
      g.fillStyle(Phaser.Display.Color.GetColor(r, gr, b), 1);
      g.fillRect(0, y, W, 1);
    }
    const grassTop = Phaser.Display.Color.HexStringToColor("#7BC88A");
    const grassBot = Phaser.Display.Color.HexStringToColor("#5DAF6E");
    for (let y = H * 0.55; y < H; y++) {
      const t = (y - H * 0.55) / (H * 0.45);
      const r = Phaser.Math.Linear(grassTop.red, grassBot.red, t);
      const gr = Phaser.Math.Linear(grassTop.green, grassBot.green, t);
      const b = Phaser.Math.Linear(grassTop.blue, grassBot.blue, t);
      g.fillStyle(Phaser.Display.Color.GetColor(r, gr, b), 1);
      g.fillRect(0, y, W, 1);
    }
    g.lineStyle(2, 0x6AB87A, 0.25);
    for (let x = 0; x < W; x += 40) {
      const h = 8 + Math.random() * 12;
      g.beginPath();
      g.moveTo(x, H * 0.56);
      g.lineTo(x - 3, H * 0.56 + h);
      g.strokePath();
    }
    this.drawCloud(W * 0.12, H * 0.06, 1.1);
    this.drawCloud(W * 0.50, H * 0.04, 0.9);
    this.drawCloud(W * 0.82, H * 0.08, 1.0);
    const sun = this.add.graphics();
    sun.fillStyle(0xFFF176, 0.8);
    sun.fillCircle(W * 0.88, H * 0.08, 30);
    sun.fillStyle(0xFFF176, 0.15);
    sun.fillCircle(W * 0.88, H * 0.08, 50);
    const flowerColors = [0xFF8FAB, 0xFFD54F, 0xCE93D8, 0xEF5350, 0x81D4FA];
    for (let i = 0; i < 6; i++) {
      const fx = 60 + i * (W - 120) / 5;
      const fy = H * 0.82 + Math.sin(i * 1.2) * 12;
      const fg = this.add.graphics();
      fg.lineStyle(2, 0x5DAF6E, 0.8);
      fg.beginPath();
      fg.moveTo(fx, fy);
      fg.lineTo(fx, fy + 18);
      fg.strokePath();
      const fc = flowerColors[i % flowerColors.length];
      fg.fillStyle(fc, 0.6);
      for (let p of [[0, -4], [6, 1], [-6, 1], [4, -8], [-4, -8]]) {
        fg.fillCircle(fx + p[0], fy + p[1], 5);
      }
      fg.fillStyle(0xFFF176, 0.8);
      fg.fillCircle(fx, fy - 3, 3);
    }
  }

  drawCloud(x, y, s) {
    const g = this.add.graphics();
    g.fillStyle(0xFFFFFF, 0.55);
    g.fillCircle(x, y, 32 * s);
    g.fillCircle(x + 28 * s, y - 5 * s, 28 * s);
    g.fillCircle(x + 52 * s, y + 2 * s, 25 * s);
    g.fillCircle(x + 24 * s, y + 8 * s, 22 * s);
  }

  createUI() {
    // Big back button (3-year-old friendly)
    const backBg = this.add.graphics();
    backBg.fillStyle(0x66BB6A, 1);
    backBg.fillCircle(34, 34, 28);
    backBg.fillStyle(0x81C784, 0.5);
    backBg.fillCircle(34, 34, 34);
    const backBtn = this.add.text(34, 34, "🏠", { fontSize: "26px" })
      .setOrigin(0.5).setInteractive({ useHandCursor: false });
    backBtn.on("pointerdown", () => { this.soundManager.playTap(); this.scene.start("MenuScene"); });
    this.tweens.add({ targets: backBg, alpha: 0.7, duration: 1200, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });

    const badgeBg = this.add.graphics();
    badgeBg.fillStyle(0xFFFFFF, 0.85);
    badgeBg.fillRoundedRect(this.gameW / 2 - 70, 8, 140, 34, 14);
    this.roundText = this.add.text(this.gameW / 2, 17, "", {
      fontSize: "14px",
      color: "#7B9C7B",
      fontFamily: "sans-serif",
      fontStyle: "bold",
    }).setOrigin(0.5, 0);

    const scoreBg = this.add.graphics();
    scoreBg.fillStyle(0xFFFFFF, 0.85);
    scoreBg.fillRoundedRect(this.gameW - 100, 8, 92, 34, 12);
    this.doneText = this.add.text(this.gameW - 54, 18, "", {
      fontSize: "15px",
      color: "#7B9C7B",
      fontFamily: "sans-serif",
      fontStyle: "bold",
    }).setOrigin(0.5, 0);

    this.hintText = this.add.text(this.gameW / 2, this.gameH - 18,
      "拖拽食物到小动物嘴边吧", {
      fontSize: "14px",
      color: "#6D8A6E",
      fontFamily: "sans-serif",
      backgroundColor: "#FFFFFF80",
      padding: { x: 10, y: 4 },
    }).setOrigin(0.5, 1).setAlpha(0.7);
  }

  newRound() {
    this.foodSprites.forEach(s => s.destroy());
    this.animalSprites.forEach(s => { s.sprite.destroy(); });
    this.foodSprites = [];
    this.animalSprites = [];
    this.isAnimating = false;
    this.currentRound = generateRound(this.difficulty);
    const round = this.currentRound;
    this.roundText.setText("☆ Lv." + this.difficulty + " ☆");

    round.animals.forEach((animal, i) => {
      const pos = round.animalPositions[i];
      const sprite = this.add.text(pos.x, pos.y, EMOJI_MAP[animal] || animal, { fontSize: "72px", fontFamily: "sans-serif" }).setOrigin(0.5);
      sprite.setScale(pos.scale * 1.3);
      this.tweens.add({
        targets: sprite,
        scaleX: pos.scale * 1.3 * 1.06,
        scaleY: pos.scale * 1.3 * 1.06,
        duration: 1800 + Math.random() * 400,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
      this.animalSprites.push({ sprite, animal, pos });
    });

    round.foods.forEach((food, i) => {
      const pos = round.foodPositions[i];
      const sprite = this.add.text(pos.x, pos.y, EMOJI_MAP[food.foodType] || food.foodType, { fontSize: "80px", fontFamily: "sans-serif" }).setOrigin(0.5);
      sprite.setScale(pos.scale * 1.1);
      sprite.setInteractive(new Phaser.Geom.Rectangle(-40, -40, 80, 80), Phaser.Geom.Rectangle.Contains);
      this.input.setDraggable(sprite);
      sprite.setInteractive({ useHandCursor: false, draggable: true });
      sprite.foodData = food;
      sprite.originalPos = { x: pos.x, y: pos.y };
      this.tweens.add({
        targets: sprite,
        y: pos.y - 6,
        duration: 1300 + Math.random() * 500,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
      this.setupFoodDrag(sprite);
      sprite.setAlpha(0);
      sprite.setScale(0);
      this.tweens.add({
        targets: sprite,
        alpha: 1,
        scaleX: pos.scale * 1.1,
        scaleY: pos.scale * 1.1,
        duration: 350,
        delay: i * 100,
        ease: "Back.easeOut",
      });
      this.foodSprites.push(sprite);
    });
    this.doneText.setText("0/" + round.foods.length);
  }

  setupFoodDrag(sprite) {
    sprite.on("pointerdown", () => {
      if (this.isAnimating) return;
      this.tweens.killTweensOf(sprite);
      sprite.setScale(sprite.scaleX * 1.15);
      sprite.setAlpha(1);
      this.children.bringToTop(sprite);
      this.showRing(sprite.x, sprite.y);
    });
    this.input.on("drag", (pointer, go, dragX, dragY) => {
      if (this.isAnimating || go !== sprite) return;
      go.x = dragX;
      go.y = dragY;
    });
    this.input.on("dragend", (pointer, go) => {
      if (go !== sprite) return;
      const hit = this.checkDrop(go);
      hit ? this.handleCorrect(go, hit) : this.handleWrong(go);
    });
  }

  showRing(x, y) {
    const ring = this.add.graphics();
    ring.lineStyle(3, 0x87CEEB, 0.6);
    ring.strokeCircle(x, y, 10);
    this.tweens.add({
      targets: ring,
      scaleX: 3, scaleY: 3, alpha: 0,
      duration: 400,
      onComplete: () => ring.destroy(),
    });
  }

  checkDrop(food) {
    for (const a of this.animalSprites) {
      if (Phaser.Math.Distance.Between(food.x, food.y, a.sprite.x, a.sprite.y) < 80
          && food.foodData.targetAnimal === a.animal) return a;
    }
    return null;
  }

  handleCorrect(food, animal) {
    this.isAnimating = true;
    food.disableInteractive();
    this.children.bringToTop(food);
    this.tweens.add({
      targets: food,
      x: animal.sprite.x, y: animal.sprite.y - 10,
      scaleX: 0.3, scaleY: 0.3, alpha: 0.6,
      duration: 180,
      ease: "Back.easeIn",
      onComplete: () => {
        food.setVisible(false);
        // Play animal happy sound
        this.soundManager.playAnimalHappy();
        this.tweens.add({
          targets: animal.sprite,
          scaleX: animal.sprite.scaleX * 1.25,
          scaleY: animal.sprite.scaleY * 1.25,
          duration: 120,
          yoyo: true,
          ease: "Bounce",
        });
        this.tweens.add({
          targets: animal.sprite,
          y: animal.sprite.y - 28,
          duration: 160,
          yoyo: true,
          ease: "Back.easeOut",
        });
        this.spawnStars(animal.sprite.x, animal.sprite.y - 20, 6);
        this.score++;
        this.doneText.setText(this.score + "/" + this.currentRound.foods.length);
        if (this.score >= this.currentRound.foods.length) {
          this.time.delayedCall(700, () => this.onRoundComplete());
        } else {
          this.time.delayedCall(350, () => { this.isAnimating = false; });
        }
      },
    });
  }

  handleWrong(food) {
    this.soundManager.playWrong();
    this.voicePrompt.say('再试试看！');
    this.isAnimating = true;
    const correct = this.currentRound.foods.find(
      f => f.targetAnimal === food.foodData.targetAnimal
    );
    this.tweens.add({
      targets: food,
      x: food.originalPos.x, y: food.originalPos.y,
      scaleX: 0.9, scaleY: 0.9,
      duration: 350,
      ease: "Back.easeOut",
      onComplete: () => {
        if (correct) {
          const target = this.animalSprites.find(a => a.animal === correct.targetAnimal);
          if (target) this.showBubble(food, target);
          else this.isAnimating = false;
        } else {
          this.isAnimating = false;
        }
        this.tweens.add({
          targets: food,
          y: food.originalPos.y - 6,
          duration: 1300,
          yoyo: true, repeat: -1,
          ease: "Sine.easeInOut",
        });
      },
    });
    this.cameras.main.shake(60, 0.002);
  }

  showBubble(food, target) {
    for (let i = 0; i < 3; i++) {
      const bubble = this.add.graphics();
      bubble.fillStyle([0x87CEEB, 0xAEE1F6, 0xFFB6C1][i], 0.5);
      bubble.fillCircle(0, 0, 8);
      bubble.setPosition(food.originalPos.x + (i-1) * 15, food.originalPos.y);
      this.children.bringToTop(bubble);
      this.tweens.add({
        targets: bubble,
        x: target.sprite.x + (i-1) * 10,
        y: target.sprite.y - 15,
        scaleX: 1.3, scaleY: 1.3, alpha: 0.2,
        duration: 1000 + i * 100,
        ease: "Sine.easeInOut",
        onComplete: () => {
          this.tweens.add({
            targets: bubble,
            scaleX: 2, scaleY: 2, alpha: 0,
            duration: 200,
            onComplete: () => { bubble.destroy(); if (i === 2) this.isAnimating = false; },
          });
        },
      });
    }
  }

  spawnStars(x, y, count) {
    for (let i = 0; i < count; i++) {
      const star = this.add.image(x, y, "star");
      star.setScale(0.6);
      star.setAlpha(0.9);
      const angle = (Math.PI * 2 / count) * i;
      const dist = 35 + Math.random() * 50;
      this.tweens.add({
        targets: star,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        scaleX: 0.1, scaleY: 0.1, alpha: 0,
        rotation: Math.random() * 4,
        duration: 400 + Math.random() * 200,
        ease: "Cubic.easeOut",
        onComplete: () => star.destroy(),
      });
    }
  }

  onRoundComplete() {
    for (let i = 0; i < 12; i++) {
      this.time.delayedCall(i * 70, () => {
        this.spawnStars(
          Math.random() * this.gameW,
          Math.random() * this.gameH,
          3
        );
      });
    }
    this.animalSprites.forEach((a, i) => {
      this.time.delayedCall(i * 80, () => {
        this.tweens.add({
          targets: a.sprite,
          y: a.sprite.y - 35,
          scaleX: a.sprite.scaleX * 1.15,
          duration: 250,
          yoyo: true,
          ease: "Bounce",
        });
      });
    });
    const celebrate = this.add.text(this.gameW / 2, this.gameH * 0.35,
      "✨ 太棒啦！ ✨", {
      fontSize: "38px",
      color: "#FF6B6B",
      fontFamily: "sans-serif",
      fontStyle: "bold",
      stroke: "#FFFFFF",
      strokeThickness: 8,
    }).setOrigin(0.5, 0.5).setAlpha(0);
    this.tweens.add({
      targets: celebrate,
      alpha: 1, scaleX: 1.15, scaleY: 1.15,
      duration: 400,
      ease: "Back.easeOut",
    });
    this.time.delayedCall(1800, () => {
      this.tweens.add({
        targets: celebrate,
        alpha: 0, scaleX: 0.5, scaleY: 0.5,
        duration: 250,
        onComplete: () => {
          celebrate.destroy();
          this.difficulty = Math.min(this.difficulty + 1, 10);
          try { localStorage.setItem('bg-feed-high', String(this.difficulty)); } catch(e) {}
          this.isAnimating = true;

          // Show completion buttons
          var btnY = this.gameH / 2 + 80;
          var playBtn = this.add.text(this.gameW / 2 - 100, btnY, '▶ 再玩一次', {
            fontSize: '24px', color: '#FFF', fontFamily: 'sans-serif', fontStyle: 'bold',
            backgroundColor: '#FF9800', padding: { x: 20, y: 10 }
          }).setOrigin(0.5).setInteractive();

          var homeBtn = this.add.text(this.gameW / 2 + 100, btnY, '🏠 返回', {
            fontSize: '24px', color: '#FFF', fontFamily: 'sans-serif', fontStyle: 'bold',
            backgroundColor: '#66BB6A', padding: { x: 20, y: 10 }
          }).setOrigin(0.5).setInteractive();

          var self = this;
          playBtn.on('pointerdown', function() {
            playBtn.destroy(); homeBtn.destroy();
            self.score = 0;
            self.newRound();
          });
          homeBtn.on('pointerdown', function() { self.scene.start('MenuScene'); });
        },
      });
    });
  }
}



