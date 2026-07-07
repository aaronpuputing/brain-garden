export default class ParentDashboardScene extends Phaser.Scene {
  constructor() { super({ key: 'ParentDashboardScene' }); }

  create() {
    var W = this.sys.game.config.width;
    var H = this.sys.game.config.height;
    this.gameW = W; this.gameH = H;
    this.drawBg();
    this.drawDashboard();
  }

  drawBg() {
    var W = this.gameW, H = this.gameH;
    var g = this.add.graphics();
    for (var y = 0; y < H; y++) {
      var t = y / H;
      g.fillStyle(Phaser.Display.Color.GetColor(
        Phaser.Math.Linear(0xF5, 0xEE, t),
        Phaser.Math.Linear(0xF0, 0xE5, t),
        Phaser.Math.Linear(0xE8, 0xD8, t)
      ), 1);
      g.fillRect(0, y, W, 1);
    }
  }

  drawDashboard() {
    var W = this.gameW, H = this.gameH;
    var self = this;

    // Back button
    var backBg = this.add.graphics();
    backBg.fillStyle(0x66BB6A, 1);
    backBg.fillCircle(34, 34, 28);
    var backBtn = this.add.text(34, 34, '🏠', { fontSize: '26px' })
      .setOrigin(0.5).setInteractive();
    backBtn.on('pointerdown', function() { self.scene.start('MenuScene'); });

    // Title
    this.add.text(W / 2, H * 0.06, '📊 成长看板', {
      fontSize: '28px', color: '#5D4037', fontFamily: 'sans-serif', fontStyle: 'bold'
    }).setOrigin(0.5, 0);

    this.add.text(W / 2, H * 0.12, '宝贝的思维花园成长记录', {
      fontSize: '14px', color: '#8D7B6B', fontFamily: 'sans-serif'
    }).setOrigin(0.5, 0);

    var games = [
      { name: '小动物喂食', emoji: '🐱', key: 'bg-feed-high', color: 0xFFB347 },
      { name: '彩色小火车', emoji: '🚂', key: 'bg-train-high', color: 0x42A5F5 },
      { name: '小熊排序', emoji: '🐻', key: 'bg-bearsort-high', color: 0xC4956A },
      { name: '水果配对', emoji: '🍎', key: 'bg-memory-high', color: 0xEF5350 },
      { name: '动物拼图', emoji: '🐰', key: 'bg-puzzle-high', color: 0x9467BD },
      { name: '谁混进来了', emoji: '🔍', key: 'bg-oddout-high', color: 0x26A69A },
      { name: '种花小园丁', emoji: '🌻', key: 'bg-gardener-high', color: 0x66BB6A },
    ];

    var startY = H * 0.2;
    var rowH = 50;
    var maxLevel = 10;

    games.forEach(function(g, i) {
      var y = startY + i * (rowH + 12);
      var level = 1;
      try {
        var v = localStorage.getItem(g.key);
        if (v) level = Math.min(parseInt(v) || 1, maxLevel);
      } catch(e) {}

      // Game icon + name
      self.add.text(50, y + rowH / 2, g.emoji, {
        fontSize: '28px', fontFamily: 'sans-serif'
      }).setOrigin(0, 0.5);

      self.add.text(120, y + rowH / 2 - 8, g.name, {
        fontSize: '18px', color: '#5D4037', fontFamily: 'sans-serif', fontStyle: 'bold'
      }).setOrigin(0, 0.5);

      self.add.text(120, y + rowH / 2 + 14, 'Lv. ' + level + ' / ' + maxLevel, {
        fontSize: '12px', color: '#9E8B7B', fontFamily: 'sans-serif'
      }).setOrigin(0, 0.5);

      // Progress bar background
      var barW = W - 280;
      var barX = 270;
      var barY = y + rowH / 2;
      var barH = 14;

      self.add.graphics()
        .fillStyle(0xE0E0E0, 1)
        .fillRoundedRect(barX - barW / 2, barY - barH / 2, barW, barH, 7);

      // Progress bar fill
      var pct = (level - 1) / (maxLevel - 1);
      var fillW = Math.max(barH, barW * pct);
      var fillColor = g.color;

      var fillBar = self.add.graphics();
      fillBar.fillStyle(fillColor, 0.8);
      fillBar.fillRoundedRect(barX - barW / 2, barY - barH / 2, fillW, barH, 7);

      // Level markers
      for (var l = 2; l <= maxLevel - 1; l += 2) {
        var mx = barX - barW / 2 + (barW * (l - 1) / (maxLevel - 1));
        self.add.graphics()
          .fillStyle(0xFFFFFF, 0.3)
          .fillCircle(mx, barY, 3);
      }

      // Total width bar bg
      self.add.graphics()
        .lineStyle(1, 0xDDDDDD, 0.5)
        .strokeRoundedRect(barX - barW / 2, barY - barH / 2, barW, barH, 7);
    });

    // Footer
    var fy = startY + games.length * (rowH + 12) + 20;
    this.add.text(W / 2, fy, '🔒 长按版本号返回此页面', {
      fontSize: '11px', color: '#BBBBBB', fontFamily: 'sans-serif'
    }).setOrigin(0.5, 0);

    // Version
    this.add.text(W - 10, H - 8, 'v1.0.0-beta', {
      fontSize: '10px', color: '#AAA', fontFamily: 'sans-serif'
    }).setOrigin(1, 1);
  }
}

