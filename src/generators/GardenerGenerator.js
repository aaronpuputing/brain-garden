/**
 * GardenerGenerator - Little Gardener (Cause-Effect)
 * Logic: Simple sequence - pick seed, dig, plant, water, flower grows
 * Difficulty 1-10: 3 steps → 5 steps
 */
function shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

var FLOWERS = ['🌸', '🌻', '🌺', '🌷', '🌼', '💐', '🌹', '🪷'];
var GARDEN_NAME = ['小花', '向日葵', '红花', '郁金香', '菊花', '花束', '玫瑰', '莲花'];

// Steps: each has emoji + action description
var ALL_STEPS = [
  { id: 'seed', emoji: '🌱', action: '选种子' },
  { id: 'dig', emoji: '⛏️', action: '挖土' },
  { id: 'plant', emoji: '🌿', action: '种下' },
  { id: 'water', emoji: '💧', action: '浇水' },
  { id: 'sun', emoji: '☀️', action: '晒太阳' },
];

export function generateRound(difficulty) {
  difficulty = difficulty || 1;
  var numSteps = Math.min(3 + Math.floor(difficulty / 2), 5);
  var steps = ALL_STEPS.slice(0, numSteps);
  var flowerIdx = Math.floor(Math.random() * FLOWERS.length);
  var flowerEmoji = FLOWERS[flowerIdx];
  var flowerName = GARDEN_NAME[flowerIdx];

  return {
    steps: steps,
    flowerEmoji: flowerEmoji,
    flowerName: flowerName,
    numSteps: numSteps,
    difficulty: difficulty
  };
}
