/**
 * BearSortGenerator - Bear Sort puzzle (Comparison)
 * Difficulty 1-10: sort 3-5 items by size
 */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const BEAR_SIZES = [0.7, 0.85, 1.0, 1.15, 1.35];
const BEAR_COLORS = [0xC4956A, 0x9C6B4A, 0xD4AA7A, 0x7B4E32, 0xE8C5A0];
const ITEM_EMOJI = ['🥣', '🛏️', '🪑', '🧥', '🎒'];

export function generateRound(difficulty) {
  difficulty = difficulty || 1;
  var numBears = Math.min(3 + Math.floor((difficulty - 1) / 3), 5);
  var sizes = BEAR_SIZES.slice(0, numBears);
  var colors = BEAR_COLORS.slice(0, numBears);
  var itemE = ITEM_EMOJI[Math.floor(Math.random() * ITEM_EMOJI.length)];

  var bears = sizes.map(function(s, i) {
    return { size: s, color: colors[i], id: 'bear-' + i };
  });

  var items = sizes.map(function(s, i) {
    return { size: s, emoji: itemE, id: 'item-' + i, targetBearId: 'bear-' + i };
  });

  return {
    bears: shuffle(bears.slice()),
    items: shuffle(items.slice()),
    numBears: numBears,
    difficulty: difficulty
  };
}

export { BEAR_SIZES, ITEM_EMOJI };
