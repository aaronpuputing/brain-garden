/**
 * ColorTrainGenerator — 彩色小火车出题引擎
 * 模式识别逻辑训练
 */

const COLOR_PALETTE = [
  { key: "red",    hex: 0xFF5252, light: 0xFF8A80 },
  { key: "blue",   hex: 0x448AFF, light: 0x82B1FF },
  { key: "yellow", hex: 0xFFD740, light: 0xFFF176 },
  { key: "green",  hex: 0x69F0AE, light: 0xA7FFEB },
  { key: "purple", hex: 0xCE93D8, light: 0xE1BEE7 },
  { key: "orange", hex: 0xFFAB40, light: 0xFFD180 },
];

const PATTERNS = [
  { seq: [0, 1, 0, 1, 0, 1], name: "AB" },
  { seq: [0, 1, 0, 1, 0, 1, 0, 1], name: "AB" },
  { seq: [0, 0, 1, 1, 0, 0, 1, 1], name: "AABB" },
  { seq: [0, 1, 1, 0, 1, 1, 0, 1, 1], name: "ABB" },
  { seq: [0, 0, 1, 0, 0, 1], name: "AAB" },
  { seq: [0, 1, 2, 0, 1, 2], name: "ABC" },
  { seq: [0, 1, 2, 0, 1, 2, 0, 1, 2], name: "ABC" },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateRound(difficulty = 1) {
  const idx = Math.min(Math.floor(difficulty / 2), PATTERNS.length - 1);
  const template = PATTERNS[idx];
  const unique = [...new Set(template.seq)];
  const picked = shuffle(COLOR_PALETTE).slice(0, unique.length);
  const sequence = template.seq.map(i => picked[i]);
  const missPos = difficulty >= 4
    ? Math.floor(Math.random() * sequence.length)
    : sequence.length - 1;
  const correct = sequence[missPos];
  const others = COLOR_PALETTE.filter(c => c.key !== correct.key);
  const dist = shuffle(others).slice(0, Math.min(1, others.length));
  const options = shuffle([correct, ...dist]);
  return { sequence, missPos, correct, options, difficulty, totalCars: sequence.length };
}

export { COLOR_PALETTE };
