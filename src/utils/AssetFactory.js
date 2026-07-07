/**
 * AssetFactory - 生成所有游戏素材纹理（V2 可爱版）
 * 用 Canvas 2D API 画更可爱的卡通动物
 */

const COLORS = {
  bg:       0xE8F4F8,
  grass:    0x98D8A0,
  grassDark:0x7BC087,
  sky:      0xC5E5F7,
  cat:      0xFFB347,
  catDark:  0xE8942E,
  catLight: 0xFFD48A,
  dog:      0xC4956A,
  dogDark:  0xA67B52,
  dogLight: 0xD4AA7A,
  bunny:    0xFFF5EE,
  bunnyPink:0xFFB6C1,
  bunnyDark:0xE8D5CC,
  fish:     0x7DD3C0,
  fishDark: 0x5BBFA8,
  bone:     0xFFF8DC,
  boneDark: 0xE8D8A0,
  carrot:   0xFF7676,
  carrotGrn:0x8BC98E,
  star:     0xFFD700,
  starOuter:0xFFA500,
  white:    0xFFFFFF,
  darkTxt:  0x5D4037,
  pink:     0xFF8FAB,
  purple:   0xC39BD3,
  wood:     0xDEB887,
};

function hexToRgba(hex, alpha) {
  const r = (hex >> 16) & 0xFF;
  const g = (hex >> 8) & 0xFF;
  const b = hex & 0xFF;
  return `rgba(${r},${g},${b},${alpha})`;
}

function drawCatOnCanvas(ctx) {
  const w = 220, h = 200;
  ctx.clearRect(0, 0, w, h);
  // Tail
  ctx.strokeStyle = hexToRgba(COLORS.catDark, 0.7);
  ctx.lineWidth = 8;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(180, 150);
  ctx.quadraticCurveTo(210, 130, 195, 90);
  ctx.quadraticCurveTo(185, 60, 200, 40);
  ctx.stroke();
  // Body
  ctx.fillStyle = hexToRgba(COLORS.cat);
  ctx.beginPath();
  ctx.ellipse(110, 138, 52, 48, 0, 0, Math.PI * 2);
  ctx.fill();
  // Belly
  ctx.fillStyle = hexToRgba(COLORS.catLight, 0.6);
  ctx.beginPath();
  ctx.ellipse(110, 148, 30, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  // Head
  ctx.fillStyle = hexToRgba(COLORS.cat);
  ctx.beginPath();
  ctx.arc(110, 68, 52, 0, Math.PI * 2);
  ctx.fill();
  // Left ear
  ctx.fillStyle = hexToRgba(COLORS.cat);
  ctx.beginPath();
  ctx.moveTo(68, 45);
  ctx.lineTo(55, 5);
  ctx.lineTo(90, 30);
  ctx.closePath();
  ctx.fill();
  // Right ear
  ctx.beginPath();
  ctx.moveTo(152, 45);
  ctx.lineTo(165, 5);
  ctx.lineTo(130, 30);
  ctx.closePath();
  ctx.fill();
  // Inner ears
  ctx.fillStyle = hexToRgba(COLORS.bunnyPink, 0.7);
  ctx.beginPath();
  ctx.moveTo(71, 40);
  ctx.lineTo(62, 14);
  ctx.lineTo(87, 30);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(149, 40);
  ctx.lineTo(158, 14);
  ctx.lineTo(133, 30);
  ctx.closePath();
  ctx.fill();
  // Eyes - big and cute
  ctx.fillStyle = "#3D2B1F";
  ctx.beginPath();
  ctx.arc(92, 62, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(128, 62, 11, 0, Math.PI * 2);
  ctx.fill();
  // Eye highlights
  ctx.fillStyle = "#FFF";
  ctx.beginPath();
  ctx.arc(96, 58, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(132, 58, 5, 0, Math.PI * 2);
  ctx.fill();
  // Small highlight
  ctx.beginPath();
  ctx.arc(89, 65, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(125, 65, 2, 0, Math.PI * 2);
  ctx.fill();
  // Nose
  ctx.fillStyle = hexToRgba(COLORS.bunnyPink);
  ctx.beginPath();
  ctx.moveTo(110, 76);
  ctx.lineTo(105, 82);
  ctx.lineTo(115, 82);
  ctx.closePath();
  ctx.fill();
  // Mouth
  ctx.strokeStyle = "rgba(80,60,50,0.3)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(110, 82);
  ctx.lineTo(110, 86);
  ctx.stroke();
  // Blush
  ctx.fillStyle = hexToRgba(COLORS.bunnyPink, 0.35);
  ctx.beginPath();
  ctx.ellipse(76, 76, 12, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(144, 76, 12, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  // Whiskers
  ctx.strokeStyle = "rgba(136,136,136,0.4)";
  ctx.lineWidth = 1.5;
  for (let flip of [-1, 1]) {
    const cx = 110 + flip * 12;
    for (let dy of [-4, 4]) {
      ctx.beginPath();
      ctx.moveTo(cx, 78 + dy);
      ctx.lineTo(cx + flip * 25, 74 + dy * 0.5);
      ctx.stroke();
    }
  }
  // Front paws
  ctx.fillStyle = hexToRgba(COLORS.cat);
  ctx.beginPath();
  ctx.ellipse(85, 185, 14, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(135, 185, 14, 10, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawDogOnCanvas(ctx) {
  const w = 220, h = 200;
  ctx.clearRect(0, 0, w, h);
  // Tail
  ctx.strokeStyle = hexToRgba(COLORS.dogDark, 0.7);
  ctx.lineWidth = 7;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(175, 135);
  ctx.quadraticCurveTo(195, 115, 190, 85);
  ctx.stroke();
  // Body
  ctx.fillStyle = hexToRgba(COLORS.dog);
  ctx.beginPath();
  ctx.ellipse(110, 140, 48, 42, 0, 0, Math.PI * 2);
  ctx.fill();
  // Belly
  ctx.fillStyle = hexToRgba(COLORS.dogLight, 0.5);
  ctx.beginPath();
  ctx.ellipse(110, 152, 28, 25, 0, 0, Math.PI * 2);
  ctx.fill();
  // Head
  ctx.fillStyle = hexToRgba(COLORS.dog);
  ctx.beginPath();
  ctx.arc(110, 65, 50, 0, Math.PI * 2);
  ctx.fill();
  // Floppy ears
  ctx.fillStyle = hexToRgba(COLORS.dogDark);
  ctx.beginPath();
  ctx.ellipse(62, 68, 16, 36, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(158, 68, 16, 36, 0.2, 0, Math.PI * 2);
  ctx.fill();
  // Eyes
  ctx.fillStyle = "#3D2B1F";
  ctx.beginPath();
  ctx.arc(92, 60, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(128, 60, 10, 0, Math.PI * 2);
  ctx.fill();
  // Highlights
  ctx.fillStyle = "#FFF";
  ctx.beginPath();
  ctx.arc(96, 56, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(132, 56, 5, 0, Math.PI * 2);
  ctx.fill();
  // Nose
  ctx.fillStyle = "#3D2B1F";
  ctx.beginPath();
  ctx.ellipse(110, 74, 8, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  // Nose highlight
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.beginPath();
  ctx.ellipse(108, 72, 3, 2, 0, 0, Math.PI * 2);
  ctx.fill();
  // Mouth
  ctx.strokeStyle = "rgba(80,60,50,0.3)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(110, 80);
  ctx.lineTo(110, 85);
  ctx.moveTo(110, 85);
  ctx.lineTo(98, 90);
  ctx.moveTo(110, 85);
  ctx.lineTo(122, 90);
  ctx.stroke();
  // Tongue
  ctx.fillStyle = hexToRgba(COLORS.bunnyPink, 0.6);
  ctx.beginPath();
  ctx.ellipse(110, 89, 6, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  // Blush
  ctx.fillStyle = hexToRgba(COLORS.bunnyPink, 0.3);
  ctx.beginPath();
  ctx.ellipse(76, 74, 11, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(144, 74, 11, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  // Front paws
  ctx.fillStyle = hexToRgba(COLORS.dog);
  ctx.beginPath();
  ctx.ellipse(85, 183, 13, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(135, 183, 13, 9, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawBunnyOnCanvas(ctx) {
  const w = 220, h = 200;
  ctx.clearRect(0, 0, w, h);
  // Left ear
  ctx.fillStyle = hexToRgba(COLORS.bunny);
  ctx.beginPath();
  ctx.ellipse(82, 25, 15, 42, -0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = hexToRgba(COLORS.bunnyPink, 0.5);
  ctx.beginPath();
  ctx.ellipse(82, 25, 8, 32, -0.1, 0, Math.PI * 2);
  ctx.fill();
  // Right ear
  ctx.fillStyle = hexToRgba(COLORS.bunny);
  ctx.beginPath();
  ctx.ellipse(138, 25, 15, 42, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = hexToRgba(COLORS.bunnyPink, 0.5);
  ctx.beginPath();
  ctx.ellipse(138, 25, 8, 32, 0.1, 0, Math.PI * 2);
  ctx.fill();
  // Body
  ctx.fillStyle = hexToRgba(COLORS.bunny);
  ctx.beginPath();
  ctx.ellipse(110, 140, 45, 38, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = hexToRgba(COLORS.bunnyDark, 0.3);
  ctx.beginPath();
  ctx.ellipse(110, 150, 25, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  // Head
  ctx.fillStyle = hexToRgba(COLORS.bunny);
  ctx.beginPath();
  ctx.arc(110, 68, 46, 0, Math.PI * 2);
  ctx.fill();
  // Eyes
  ctx.fillStyle = "#3D2B1F";
  ctx.beginPath();
  ctx.arc(92, 62, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(128, 62, 10, 0, Math.PI * 2);
  ctx.fill();
  // Highlights
  ctx.fillStyle = "#FFF";
  ctx.beginPath();
  ctx.arc(96, 58, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(132, 58, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(89, 65, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(125, 65, 2, 0, Math.PI * 2);
  ctx.fill();
  // Nose
  ctx.fillStyle = hexToRgba(COLORS.bunnyPink);
  ctx.beginPath();
  ctx.moveTo(110, 75);
  ctx.lineTo(106, 80);
  ctx.lineTo(114, 80);
  ctx.closePath();
  ctx.fill();
  // Mouth
  ctx.strokeStyle = "rgba(80,60,50,0.3)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(110, 80);
  ctx.lineTo(106, 84);
  ctx.moveTo(110, 80);
  ctx.lineTo(114, 84);
  ctx.stroke();
  // Blush
  ctx.fillStyle = hexToRgba(COLORS.bunnyPink, 0.35);
  ctx.beginPath();
  ctx.ellipse(76, 76, 11, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(144, 76, 11, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  // Tail
  ctx.fillStyle = hexToRgba(COLORS.bunnyDark, 0.5);
  ctx.beginPath();
  ctx.beginPath(); ctx.arc(58, 128, 12, 0, 2 * Math.PI); ctx.fill();
  ctx.fill();
  ctx.fillStyle = hexToRgba(COLORS.bunny);
  ctx.beginPath();
  ctx.arc(60, 126, 10, 0, Math.PI * 2);
  ctx.fill();
  // Paws
  ctx.fillStyle = hexToRgba(COLORS.bunny);
  ctx.beginPath();
  ctx.ellipse(85, 180, 12, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(135, 180, 12, 9, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawFishOnCanvas(ctx) {
  const w = 120, h = 80;
  ctx.clearRect(0, 0, w, h);
  // Body
  ctx.fillStyle = hexToRgba(COLORS.fish);
  ctx.beginPath();
  ctx.ellipse(48, 40, 30, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  // Tail
  ctx.fillStyle = hexToRgba(COLORS.fishDark);
  ctx.beginPath();
  ctx.moveTo(75, 30);
  ctx.lineTo(105, 20);
  ctx.lineTo(105, 60);
  ctx.closePath();
  ctx.fill();
  // Dorsal fin
  ctx.fillStyle = hexToRgba(COLORS.fishDark, 0.7);
  ctx.beginPath();
  ctx.moveTo(45, 24);
  ctx.lineTo(55, 8);
  ctx.lineTo(65, 24);
  ctx.closePath();
  ctx.fill();
  // Eye
  ctx.fillStyle = "#FFF";
  ctx.beginPath();
  ctx.arc(34, 38, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#333";
  ctx.beginPath();
  ctx.arc(34, 38, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#FFF";
  ctx.beginPath();
  ctx.arc(36, 36, 2, 0, Math.PI * 2);
  ctx.fill();
  // Mouth
  ctx.fillStyle = hexToRgba(COLORS.fishDark, 0.5);
  ctx.beginPath();
  ctx.ellipse(18, 42, 3, 2, 0, 0, Math.PI * 2);
  ctx.fill();
  // Scales hint
  ctx.strokeStyle = "rgba(58,175,158,0.2)";
  ctx.lineWidth = 1;
  for (let angle of [-0.3, 0, 0.3]) {
    ctx.beginPath();
    ctx.arc(55, 38 + angle * 5, 8, -0.5, 0.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(65, 36 + angle * 5, 7, -0.5, 0.5);
    ctx.stroke();
  }
}

function drawBoneOnCanvas(ctx) {
  const w = 120, h = 70;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = hexToRgba(COLORS.bone);
  ctx.strokeStyle = hexToRgba(COLORS.boneDark, 0.5);
  ctx.lineWidth = 2;
  // Shaft
  ctx.beginPath();
  ctx.moveTo(25 + 8, 25);
  ctx.lineTo(25 + 70 - 8, 25);
  ctx.quadraticCurveTo(25 + 70, 25, 25 + 70, 25 + 8);
  ctx.lineTo(25 + 70, 25 + 16 - 8);
  ctx.quadraticCurveTo(25 + 70, 25 + 16, 25 + 70 - 8, 25 + 16);
  ctx.lineTo(25 + 8, 25 + 16);
  ctx.quadraticCurveTo(25, 25 + 16, 25, 25 + 16 - 8);
  ctx.lineTo(25, 25 + 8);
  ctx.quadraticCurveTo(25, 25, 25 + 8, 25);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // Left knobs
  for (let y of [22, 39]) {
    ctx.fillStyle = hexToRgba(COLORS.bone);
    ctx.beginPath();
    ctx.arc(25, y, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = hexToRgba(COLORS.boneDark, 0.5);
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  // Right knobs
  for (let y of [22, 39]) {
    ctx.fillStyle = hexToRgba(COLORS.bone);
    ctx.beginPath();
    ctx.arc(95, y, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = hexToRgba(COLORS.boneDark, 0.5);
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  // Highlight
  ctx.fillStyle = hexToRgba(COLORS.boneDark, 0.08);
  ctx.fillRect(40, 27, 40, 6);
}

function drawCarrotOnCanvas(ctx) {
  const w = 90, h = 80;
  ctx.clearRect(0, 0, w, h);
  // Body
  ctx.fillStyle = hexToRgba(COLORS.carrot);
  ctx.beginPath();
  ctx.moveTo(45, 68);
  ctx.lineTo(24, 22);
  ctx.lineTo(66, 22);
  ctx.closePath();
  ctx.fill();
  // Lines
  ctx.strokeStyle = "rgba(224,85,85,0.3)";
  ctx.lineWidth = 1.5;
  for (const yf of [0.7, 1.0, 1.3]) {
    const midY = 22 + (68 - 22) * yf / 2;
    const halfW = (midY - 22) * 21 / 46;
    ctx.beginPath();
    ctx.moveTo(45 - halfW, midY);
    ctx.lineTo(45 + halfW, midY);
    ctx.stroke();
  }
  // Leaves
  ctx.fillStyle = hexToRgba(COLORS.carrotGrn);
  for (let angle of [-0.3, 0, 0.3]) {
    ctx.beginPath();
    ctx.ellipse(45 + angle * 12, 12, 4, 14, angle, 0, Math.PI * 2);
    ctx.fill();
  }
  // Highlight
  ctx.fillStyle = hexToRgba(COLORS.white, 0.15);
  ctx.beginPath();
  ctx.moveTo(38, 22);
  ctx.lineTo(32, 55);
  ctx.lineTo(44, 55);
  ctx.closePath();
  ctx.fill();
}

function drawStarOnCanvas(ctx) {
  const w = 60, h = 60;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = hexToRgba(COLORS.star, 0.95);
  ctx.beginPath();
  const spikes = 5, outerR = 25, innerR = 10;
  for (let i = 0; i < 2 * spikes; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = i * Math.PI / spikes - Math.PI / 2;
    const px = 30 + r * Math.cos(angle);
    const py = 30 + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  // Glow
  ctx.fillStyle = hexToRgba(COLORS.starOuter, 0.2);
  ctx.beginPath();
  ctx.arc(30, 30, 22, 0, Math.PI * 2);
  ctx.fill();
}

// ===== 小熊排序物品绘制 =====

const SORT_ITEM_DRAWERS = {
  bowl(ctx) {
    ctx.fillStyle = '#5C6BC0';
    ctx.beginPath(); ctx.ellipse(50, 55, 35, 20, 0, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#7986CB';
    ctx.beginPath(); ctx.ellipse(50, 55, 38, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#9FA8DA60';
    ctx.beginPath(); ctx.ellipse(50, 52, 28, 14, 0, Math.PI, 0); ctx.fill();
  },
  bed(ctx) {
    ctx.fillStyle = '#8D6E63'; ctx.fillRect(8, 40, 84, 42);
    ctx.fillStyle = '#A1887F'; ctx.fillRect(8, 10, 12, 72); ctx.fillRect(80, 10, 12, 72); ctx.fillRect(8, 8, 84, 10);
    ctx.fillStyle = '#E8EAF6'; ctx.fillRect(20, 28, 60, 28);
    ctx.fillStyle = '#F8BBD0'; ctx.beginPath(); ctx.ellipse(72, 34, 10, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#C5E1A5'; ctx.fillRect(22, 42, 48, 22);
  },
  chair(ctx) {
    ctx.strokeStyle = '#795548'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(20, 50); ctx.lineTo(20, 82); ctx.moveTo(80, 50); ctx.lineTo(80, 82); ctx.moveTo(20, 82); ctx.lineTo(80, 82); ctx.stroke();
    ctx.fillStyle = '#FFCC80'; ctx.fillRect(14, 44, 72, 12);
    ctx.fillStyle = '#FFB74D'; ctx.fillRect(14, 10, 12, 38); ctx.fillRect(74, 10, 12, 38); ctx.fillRect(14, 8, 72, 8);
    ctx.fillStyle = '#FFCC8060';
    for (var y = 20; y < 42; y += 8) ctx.fillRect(16, y, 68, 3);
  },
  coat(ctx) {
    ctx.strokeStyle = '#78909C'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(50, 10); ctx.lineTo(50, 20); ctx.moveTo(20, 28); ctx.lineTo(80, 28);
    ctx.moveTo(32, 28); ctx.lineTo(50, 20); ctx.moveTo(68, 28); ctx.lineTo(50, 20); ctx.stroke();
    ctx.fillStyle = '#EF5350';
    ctx.beginPath(); ctx.moveTo(50, 30); ctx.lineTo(18, 50); ctx.lineTo(22, 90); ctx.lineTo(78, 90); ctx.lineTo(82, 50); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#FFF';
    for (var y = 40; y < 80; y += 14) { ctx.beginPath(); ctx.arc(50, y, 3, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = '#FFF'; ctx.beginPath(); ctx.moveTo(36, 30); ctx.lineTo(50, 40); ctx.lineTo(64, 30); ctx.fill();
  },
  backpack(ctx) {
    ctx.fillStyle = '#26A69A'; ctx.fillRect(2, 18, 96, 60); ctx.beginPath(); ctx.roundRect(2, 18, 96, 60, 12); ctx.fill();
    ctx.fillStyle = '#4DB6AC'; ctx.fillRect(10, 34, 80, 30); ctx.beginPath(); ctx.roundRect(10, 34, 80, 30, 6); ctx.fill();
    ctx.strokeStyle = '#26A69A'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(35, 18); ctx.quadraticCurveTo(50, 6, 65, 18); ctx.stroke();
    ctx.strokeStyle = '#009688'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(16, 22); ctx.lineTo(10, 68); ctx.moveTo(84, 22); ctx.lineTo(90, 68); ctx.stroke();
    ctx.fillStyle = '#FFF176'; ctx.fillRect(42, 44, 16, 10);
  }
};

function drawSortItemOnCanvas(ctx, itemType) {
  ctx.clearRect(0, 0, 100, 100);
  if (SORT_ITEM_DRAWERS[itemType]) SORT_ITEM_DRAWERS[itemType](ctx);
}

function generateAllTextures(scene) {
  let canvas;
  const drawFns = {
    cat: { fn: drawCatOnCanvas, w: 220, h: 200 },
    dog: { fn: drawDogOnCanvas, w: 220, h: 200 },
    bunny: { fn: drawBunnyOnCanvas, w: 220, h: 200 },
    fish: { fn: drawFishOnCanvas, w: 120, h: 80 },
    bone: { fn: drawBoneOnCanvas, w: 120, h: 70 },
    carrot: { fn: drawCarrotOnCanvas, w: 90, h: 80 },
    star: { fn: drawStarOnCanvas, w: 60, h: 60 },
    sort_bowl: { fn: function(ctx) { drawSortItemOnCanvas(ctx, 'bowl'); }, w: 100, h: 100 },
    sort_bed: { fn: function(ctx) { drawSortItemOnCanvas(ctx, 'bed'); }, w: 100, h: 100 },
    sort_chair: { fn: function(ctx) { drawSortItemOnCanvas(ctx, 'chair'); }, w: 100, h: 100 },
    sort_coat: { fn: function(ctx) { drawSortItemOnCanvas(ctx, 'coat'); }, w: 100, h: 100 },
    sort_backpack: { fn: function(ctx) { drawSortItemOnCanvas(ctx, 'backpack'); }, w: 100, h: 100 },
  };
  for (const [key, { fn, w, h }] of Object.entries(drawFns)) {
    canvas = scene.textures.createCanvas(key, w, h);
    if (canvas) {
      fn(canvas.getContext());
      canvas.refresh();
    }
  }
  console.log("V2 textures generated - cute animals! (ﾉ｡［｡)ﾉ");
}

export { COLORS };


/** 生成星星纹理 */
export function generateStarTexture(scene) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0xFFD700, 1);
  // 5-pointed star
  const cx = 16, cy = 16, outerR = 14, innerR = 6;
  const points = [];
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI * 2 / 10) * i - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    points.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
  }
  g.beginPath();
  g.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) g.lineTo(points[i].x, points[i].y);
  g.closePath();
  g.fillPath();
  g.generateTexture('star', 32, 32);
  g.destroy();
}

export default generateAllTextures;

