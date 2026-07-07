/**
 * OddOutGenerator - "Who doesn't belong?" (Odd One Out)
 * Logic: Find the different one among 4 items
 * Difficulty 1-10: obvious → subtle differences
 */
function shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

// Easy: completely different categories
var EASY_SETS = [
  { same: ['🐱','🐱','🐱'], odd: '🐟' },
  { same: ['🐶','🐶','🐶'], odd: '🍎' },
  { same: ['🐰','🐰','🐰'], odd: '🚂' },
  { same: ['🦋','🦋','🦋'], odd: '🧦' },
  { same: ['🐸','🐸','🐸'], odd: '🌙' },
  { same: ['🐮','🐮','🐮'], odd: '⭐' },
];

// Medium: same category, different animal
var MED_SETS = [
  { same: ['🐱','🐱','🐱'], odd: '🐶' },
  { same: ['🐰','🐰','🐰'], odd: '🐱' },
  { same: ['🐸','🐸','🐸'], odd: '🐮' },
  { same: ['🦋','🦋','🦋'], odd: '🐝' },
  { same: ['🍎','🍎','🍎'], odd: '🍋' },
  { same: ['🌻','🌻','🌻'], odd: '🌳' },
];

// Hard: similar emojis
var HARD_SETS = [
  { same: ['🍎','🍎','🍎'], odd: '🍒' },
  { same: ['🐱','🐱','🐱'], odd: '🐯' },
  { same: ['🌙','🌙','🌙'], odd: '⭐' },
  { same: ['🌸','🌸','🌸'], odd: '🌺' },
];

export function generateRound(difficulty) {
  difficulty = difficulty || 1;
  var set;
  if (difficulty <= 3) set = EASY_SETS[Math.floor(Math.random() * EASY_SETS.length)];
  else if (difficulty <= 6) set = MED_SETS[Math.floor(Math.random() * MED_SETS.length)];
  else set = HARD_SETS[Math.floor(Math.random() * HARD_SETS.length)];

  var items = set.same.concat([set.odd]);
  var oddIdx = set.same.length; // last one is odd
  items = shuffle(items);
  // Find where odd ended up
  oddIdx = items.indexOf(set.odd);

  return {
    items: items,
    oddIdx: oddIdx,
    sameEmoji: set.same[0],
    oddEmoji: set.odd,
    difficulty: difficulty
  };
}
