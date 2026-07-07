/**
 * AssetFactory - Game textures (AI images preferred, Canvas fallback)
 */

function generateAllTextures(scene) {
  if (!scene.textures.exists('sort_bowl')) {
    var c = scene.textures.createCanvas('sort_bowl', 100, 100);
    if (c) { var ctx = c.getContext(); ctx.fillStyle = '#5C6BC0'; ctx.beginPath(); ctx.ellipse(50,55,35,20,0,Math.PI,0); ctx.fill(); c.refresh(); }
  }
  if (!scene.textures.exists('sort_bed')) {
    var c = scene.textures.createCanvas('sort_bed', 100, 100);
    if (c) { var ctx = c.getContext(); ctx.fillStyle = '#8D6E63'; ctx.fillRect(8,40,84,42); ctx.fillStyle = '#E8EAF6'; ctx.fillRect(20,28,60,28); ctx.fillStyle = '#F8BBD0'; ctx.beginPath(); ctx.ellipse(72,34,10,8,0,0,Math.PI*2); ctx.fill(); c.refresh(); }
  }
  if (!scene.textures.exists('sort_chair')) {
    var c = scene.textures.createCanvas('sort_chair', 100, 100);
    if (c) { var ctx = c.getContext(); ctx.fillStyle = '#FFCC80'; ctx.fillRect(14,44,72,12); ctx.fillStyle = '#FFB74D'; ctx.fillRect(14,10,12,38); ctx.fillRect(74,10,12,38); c.refresh(); }
  }
  if (!scene.textures.exists('sort_coat')) {
    var c = scene.textures.createCanvas('sort_coat', 100, 100);
    if (c) { var ctx = c.getContext(); ctx.fillStyle = '#EF5350'; ctx.beginPath(); ctx.moveTo(50,30); ctx.lineTo(18,50); ctx.lineTo(22,90); ctx.lineTo(78,90); ctx.lineTo(82,50); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#FFF'; for (var y=40;y<80;y+=14) { ctx.beginPath(); ctx.arc(50,y,3,0,Math.PI*2); ctx.fill(); } c.refresh(); }
  }
  if (!scene.textures.exists('sort_backpack')) {
    var c = scene.textures.createCanvas('sort_backpack', 100, 100);
    if (c) { var ctx = c.getContext(); ctx.fillStyle = '#26A69A'; ctx.fillRect(2,18,96,60); c.refresh(); }
  }
  console.log("Assets ready (AI preferred + Canvas fallback)");
}

export function generateStarTexture(scene) {
  var g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0xFFD700, 1);
  var cx = 16, cy = 16, outerR = 14, innerR = 6;
  var points = [];
  for (var i = 0; i < 10; i++) {
    var angle = (Math.PI * 2 / 10) * i - Math.PI / 2;
    var r = i % 2 === 0 ? outerR : innerR;
    points.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
  }
  g.beginPath();
  g.moveTo(points[0].x, points[0].y);
  for (var i = 1; i < points.length; i++) g.lineTo(points[i].x, points[i].y);
  g.closePath();
  g.fillPath();
  g.generateTexture('star', 32, 32);
  g.destroy();
}

export const COLORS = {
  bg: 0xE8F4F8, grass: 0x98D8A0, grassDark: 0x7BC087,
  sky: 0xC5E5F7, cat: 0xFFB347, catDark: 0xE8942E, catLight: 0xFFD48A,
  dog: 0xC4956A, dogDark: 0xA67B52, dogLight: 0xD4AA7A,
  bunny: 0xFFF5EE, bunnyPink: 0xFFB6C1, bunnyDark: 0xE8D5CC,
  fish: 0x7DD3C0, fishDark: 0x5BBFA8, bone: 0xFFF8DC, boneDark: 0xE8D8A0,
  carrot: 0xFF7676, carrotGrn: 0x8BC98E, star: 0xFFD700, starOuter: 0xFFA500,
  white: 0xFFFFFF, darkTxt: 0x5D4037, pink: 0xFF8FAB, purple: 0xC39BD3, wood: 0xDEB887,
};

export default generateAllTextures;

/** Helper: get scale factor to fit texture to target width, works for both AI images and Canvas textures */
export function getFitScale(scene, key, targetWidth) {
  try {
    const tex = scene.textures.get(key);
    if (tex && tex.getSourceImage()) {
      const sw = tex.getSourceImage().width;
      if (sw > 0) return targetWidth / sw;
    }
  } catch(e) {}
  return 1;
}
