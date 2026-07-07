import { generateRound, COLOR_PALETTE } from "../generators/ColorTrainGenerator.js";
import SoundManager from "../utils/SoundManager.js";
import VoicePrompt from "../utils/VoicePrompt.js";

export default class ColorTrainScene extends Phaser.Scene {
  constructor() {
    super({ key: "ColorTrainScene" });
  }

  init() {
    this.difficulty = 1;
    this.sound = new SoundManager();
    this.carSprites = [];
    this.optionSprites = [];
    this.roundData = null;
    this.isAnimating = false;
    this.voicePrompt = null;
  }

  create() {
    const W = this.gameW = this.sys.game.config.width;
    const H = this.gameH = this.sys.game.config.height;
    this.drawBackground(W, H);
    this.drawBackButton(W);
    this.newRound();

    this.voicePrompt = new VoicePrompt(this);
    this.voicePrompt.start(
      '把缺的颜色补上去！看看小火车的颜色规律……',
      '红色后面是什么颜色呢？想一想！',
      18000
    );
  }

  drawBackground(W, H) {
    const g = this.add.graphics();
    const skyT = Phaser.Display.Color.HexStringToColor("#9FD4F0");
    const skyB = Phaser.Display.Color.HexStringToColor("#D4EAF7");
    for (let y = 0; y < H * 0.6; y++) {
      const t = y / (H * 0.6);
      g.fillStyle(Phaser.Display.Color.GetColor(
        Phaser.Math.Linear(skyT.red, skyB.red, t),
        Phaser.Math.Linear(skyT.green, skyB.green, t),
        Phaser.Math.Linear(skyT.blue, skyB.blue, t)), 1);
      g.fillRect(0, y, W, 1);
    }
    const gT = Phaser.Display.Color.HexStringToColor("#7BC88A");
    const gB = Phaser.Display.Color.HexStringToColor("#5DAF6E");
    for (let y = H * 0.6; y < H; y++) {
      const t = (y - H * 0.6) / (H * 0.4);
      g.fillStyle(Phaser.Display.Color.GetColor(
        Phaser.Math.Linear(gT.red, gB.red, t),
        Phaser.Math.Linear(gT.green, gB.green, t),
        Phaser.Math.Linear(gT.blue, gB.blue, t)), 1);
      g.fillRect(0, y, W, 1);
    }
    // Track
    g.lineStyle(6, 0x8D6E63, 0.6);
    g.beginPath();
    g.moveTo(0, H * 0.52);
    g.lineTo(W, H * 0.52);
    g.strokePath();
    // Track ties
    g.lineStyle(3, 0xA1887F, 0.3);
    for (let x = 0; x < W; x += 40) {
      g.beginPath();
      g.moveTo(x, H * 0.50);
      g.lineTo(x, H * 0.54);
      g.strokePath();
    }
  }

  shutdown() {
    if (this.voicePrompt) { this.voicePrompt.stop(); this.voicePrompt = null; }
  }

    drawBackButton() {
    const bg = this.add.graphics();
    bg.fillStyle(0x66BB6A, 1);
    bg.fillCircle(34, 34, 28);
    bg.fillStyle(0x81C784, 0.5);
    bg.fillCircle(34, 34, 34);
    const btn = this.add.text(34, 34, "\ud83c\udfe0", { fontSize: "26px" })
      .setOrigin(0.5).setInteractive({ useHandCursor: false });
    btn.on("pointerdown", () => { this.sound.playTap(); this.scene.start("MenuScene"); });
    this.tweens.add({ targets: bg, alpha: 0.7, duration: 1200, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
  }

  newRound() {
    this.carSprites.forEach(s => s.destroy());
    this.optionSprites.forEach(s => s.destroy());
    this.carSprites = [];
    this.optionSprites = [];
    this.isAnimating = false;
    this.roundData = generateRound(this.difficulty);
    const rd = this.roundData;
    const W = this.gameW, H = this.gameH;

    // Difficulty badge
    this.add.text(W / 2, 14, "\u2b50 " + rd.difficulty + " \u2b50", {
      fontSize: "14px", color: "#7B9C7B", fontFamily: "sans-serif", fontStyle: "bold",
    }).setOrigin(0.5, 0);

    // Train cars & engine
    const carW = Math.min(70, W / (rd.totalCars + 2));
    const carH = carW * 0.9;
    const engW = carW * 1.1;
    const totalW = engW + rd.totalCars * (carW + 6);
    const startX = (W - totalW) / 2;
    const trainY = H * 0.32;

    // Engine
    const eng = this.add.text(startX + engW / 2, trainY, "\ud83d\ude82", {
      fontSize: Math.round(carW * 0.9) + "px",
    }).setOrigin(0.5);

    // Connecting bar
    const bar = this.add.graphics();
    bar.lineStyle(4, 0x8D6E63, 0.5);
    bar.beginPath();
    bar.moveTo(startX + engW, trainY);
    bar.lineTo(startX + engW + rd.totalCars * (carW + 6), trainY);
    bar.strokePath();

    // Build each car
    rd.sequence.forEach((color, i) => {
      const cx = startX + engW + 6 + i * (carW + 6) + carW / 2;
      const isMiss = i === rd.missPos;
      const car = this.add.graphics();

      // Car body
      car.fillStyle(isMiss ? 0xE8E8E8 : 0xFFFFFF, 0.9);
      car.fillRoundedRect(cx - carW / 2, trainY - carH / 2, carW, carH, 8);
      car.lineStyle(2, isMiss ? 0xCCCCCC : 0xDDDDDD, 0.8);
      car.strokeRoundedRect(cx - carW / 2, trainY - carH / 2, carW, carH, 8);

      // Color circle
      const r = carW * 0.32;
      if (isMiss) {
        // Missing - dashed/pulsing
        car.lineStyle(3, 0xAAAAAA, 0.7);
        car.strokeCircle(cx, trainY, r);
        const q = this.add.text(cx, trainY, "\u2753", {
          fontSize: Math.round(r * 1.2) + "px",
        }).setOrigin(0.5);
        this.tweens.add({
          targets: q, alpha: 0.3, duration: 600, yoyo: true, repeat: -1,
        });
      } else {
        // Filled color
        car.fillStyle(color.hex, 1);
        car.fillCircle(cx, trainY, r);
        car.fillStyle(color.light, 0.4);
        car.fillCircle(cx - r * 0.25, trainY - r * 0.25, r * 0.35);
      }

      // Wheels
      for (let wx of [-carW * 0.25, carW * 0.25]) {
        car.fillStyle(0x555555, 1);
        car.fillCircle(cx + wx, trainY + carH / 2 - 6, 6);
      }
      this.carSprites.push(car);
    });

    // Color options at bottom
    const optW = 60;
    const optGap = 20;
    const optStartX = (W - (rd.options.length * optW + (rd.options.length - 1) * optGap)) / 2 + optW / 2;
    const optY = H * 0.72;

    rd.options.forEach((color, i) => {
      const ox = optStartX + i * (optW + optGap);
      // Shadow (drawn at local 0,0, positioned at ox+3, optY+3)
      const shadow = this.add.graphics();
      shadow.setPosition(ox + 3, optY + 3);
      shadow.fillStyle(0x000000, 0.1);
      shadow.fillCircle(0, 0, optW / 2);
      // Color circle (drawn at local 0,0, positioned at ox, optY)
      const opt = this.add.graphics();
      opt.setPosition(ox, optY);
      opt.fillStyle(color.hex, 1);
      opt.fillCircle(0, 0, optW / 2);
      opt.fillStyle(color.light, 0.3);
      opt.fillCircle(-4, -4, optW / 4);
      // Click zone
      const hit = this.add.zone(ox, optY, optW * 1.2, optW * 1.2)
        .setInteractive({ useHandCursor: false });
      hit.colorData = color;
      hit.origX = ox;
      hit.origY = optY;
      hit.visualRefs = [shadow, opt];
      this.setupDrag(hit, shadow, opt);
      this.optionSprites.push(hit);
    });
  }

  setupDrag(hit, shadow, opt) {
    // Click-only: tap a color chip to select it
    hit.on("pointerdown", () => {
      if (this.isAnimating) return;
      const rd = this.roundData;
      const W = this.gameW, H = this.gameH;
      const carW = Math.min(70, W / (rd.totalCars + 2));
      const engW = carW * 1.1;
      const totalW = engW + rd.totalCars * (carW + 6);
      const startX = (W - totalW) / 2;
      const missX = startX + engW + 6 + rd.missPos * (carW + 6) + carW / 2;
      if (hit.colorData.key === rd.correct.key) {
        this.handleCorrect(hit, shadow, opt, missX, H * 0.32, carW);
      } else {
        this.handleWrong(hit, shadow, opt);
      }
    });
  }

  handleCorrect(hit, shadow, opt, targetX, targetY, carW) {
    this.isAnimating = true;
    this.sound.playCorrect();
        this.voicePrompt.say('答对啦！');
    const rd = this.roundData;
    // Fly the color chip and shadow to the train
    this.tweens.add({
      targets: [shadow, opt],
      x: targetX, y: targetY,
      scaleX: 1.5, scaleY: 1.5,
      duration: 250, ease: "Back.easeOut",
      onComplete: () => {
        // Draw the filled color permanently in the train car
        const g = this.add.graphics();
        const r = carW * 0.32;
        g.fillStyle(rd.correct.hex, 1);
        g.fillCircle(targetX, targetY, r);
        g.fillStyle(rd.correct.light, 0.35);
        g.fillCircle(targetX - r * 0.2, targetY - r * 0.2, r * 0.35);
        // Clean up
        shadow.destroy();
        opt.destroy();
        hit.destroy();
        this.spawnStars(targetX, targetY, 5);
        this.isAnimating = false;
        this.showCompletion();
      },
    });
  }

  handleWrong(hit, shadow, opt) {
    this.isAnimating = true;
    this.sound.playWrong();
        this.voicePrompt.say('不太对哦，再想想！');
    // Shake the visible color chip
    const origShadX = hit.origX + 3;
    const origShadY = hit.origY + 3;
    const origOptX = hit.origX;
    const origOptY = hit.origY;
    this.tweens.add({
      targets: [shadow, opt],
      x: hit.origX + 8,
      duration: 50,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        shadow.x = origShadX;
        shadow.y = origShadY;
        opt.x = origOptX;
        opt.y = origOptY;
        this.isAnimating = false;
      },
    });
    this.cameras.main.shake(60, 0.002);
  }

  showCompletion() {
    // Check if we need more rounds (all cars filled)
    // Since we only have one missing per round, round is complete after one correct
    const W = this.gameW, H = this.gameH;
    this.sound.playCelebrate();
    // Stars
    for (let i = 0; i < 12; i++) {
      this.time.delayedCall(i * 60, () => {
        this.spawnStars(Math.random() * W, Math.random() * H, 3);
      });
    }
    // Celebrate text
    const celebrate = this.add.text(W / 2, H * 0.15,
      "\u2728 \u592a\u68d2\u5566\uff01 \u2728", {
      fontSize: "32px", color: "#FF6B6B",
      fontFamily: "sans-serif", fontStyle: "bold",
      stroke: "#FFFFFF", strokeThickness: 7,
    }).setOrigin(0.5).setAlpha(0);
    this.tweens.add({
      targets: celebrate,
      alpha: 1, scaleX: 1.1, scaleY: 1.1,
      duration: 300, ease: "Back.easeOut",
    });

    // Continue button
    const cont = this.add.graphics();
    cont.fillStyle(0x66BB6A, 1);
    cont.fillRoundedRect(W / 2 - 65, H * 0.50 - 28, 130, 56, 20);
    cont.fillStyle(0x81C784, 0.4);
    cont.fillRoundedRect(W / 2 - 70, H * 0.50 - 33, 140, 66, 24);
    const ct = this.add.text(W / 2, H * 0.50, "\u25b6\ufe0f \u518d\u6765\uff01", {
      fontSize: "24px", color: "#FFF", fontFamily: "sans-serif", fontStyle: "bold",
    }).setOrigin(0.5).setInteractive({ useHandCursor: false });
    ct.on("pointerdown", () => {
      this.sound.playTap();
      celebrate.destroy();
      cont.destroy();
      ct.destroy();
      homeBg.destroy();
      homeT.destroy();
      this.difficulty = Math.min(this.difficulty + 1, 10);
        try { localStorage.setItem('bg-train-high', String(this.difficulty)); } catch(e) {}
      this.newRound();
    });

    // Home button
    const homeBg = this.add.graphics();
    homeBg.fillStyle(0xFF8A65, 1);
    homeBg.fillRoundedRect(W / 2 - 65, H * 0.63 - 28, 130, 56, 20);
    homeBg.fillStyle(0xFFAB91, 0.4);
    homeBg.fillRoundedRect(W / 2 - 70, H * 0.63 - 33, 140, 66, 24);
    const homeT = this.add.text(W / 2, H * 0.63, "\ud83c\udfe0 \u56de\u82b1\u56ed", {
      fontSize: "20px", color: "#FFF", fontFamily: "sans-serif", fontStyle: "bold",
    }).setOrigin(0.5).setInteractive({ useHandCursor: false });
    homeT.on("pointerdown", () => {
      this.sound.playTap();
      this.scene.start("MenuScene");
    });
  }

  spawnStars(x, y, count) {
    for (let i = 0; i < count; i++) {
      const star = this.add.text(x, y, "\u2728", { fontSize: "20px" }).setOrigin(0.5);
      const angle = (Math.PI * 2 / count) * i;
      const dist = 30 + Math.random() * 40;
      this.tweens.add({
        targets: star,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0, scaleX: 0.3, scaleY: 0.3,
        duration: 350 + Math.random() * 150,
        ease: "Cubic.easeOut",
        onComplete: () => star.destroy(),
      });
    }
  }
}




