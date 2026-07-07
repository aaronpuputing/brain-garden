/**
 * MemoryGenerator - Fruit Memory Match
 * Logic: Matching, 2x2 to 4x3 grid
 */
function shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

var FRUITS = ['🍎', '🍊', '🍋', '🍇', '🍓', '🍒', '🍑', '🥝', '🍌', '🍐', '🥭', '🍍'];
var CARD_BACK = '🌿';

export function generateRound(difficulty) {
  difficulty = difficulty || 1;
  var gridCols = Math.min(2 + Math.floor(difficulty / 3), 4);
  var gridRows = Math.min(2 + Math.floor(difficulty / 4), 3);
  var numPairs = (gridCols * gridRows) / 2;
  var selected = shuffle(FRUITS).slice(0, numPairs);
  var cards = [];
  selected.forEach(function(fruit) {
    cards.push({ fruit: fruit, id: 'card-' + cards.length, flipped: false, matched: false });
    cards.push({ fruit: fruit, id: 'card-' + cards.length, flipped: false, matched: false });
  });
  return { cards: shuffle(cards), cols: gridCols, rows: gridRows, difficulty: difficulty };
}

export { FRUITS, CARD_BACK };
