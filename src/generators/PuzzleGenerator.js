/**
 * PuzzleGenerator - Animal Jigsaw Puzzle
 * Logic: Part-whole, ordering. Each piece gets a unique identifier.
 */
function shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

// Each puzzle uses a set of ordered items (shape/color sequence)
var PUZZLE_SETS = [
  ['🔴','🟠','🟡','🟢','🔵','🟣'],  // color gradient
  ['🌱','🌿','🌷','🌸','🌺','🌻'],  // plant growth
  ['☀️','⛅','🌧️','🌈','⭐','🌙'],  // weather/ sky
  ['🥚','🐣','🐥','🐔','🍗','🍽️'], // chicken life (funny!)
  ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣'], // numbers
];

export function generateRound(difficulty) {
  difficulty = difficulty || 1;
  var pieces = Math.min(2 + Math.floor((difficulty - 1) / 2), 6);
  var set = PUZZLE_SETS[Math.floor(Math.random() * PUZZLE_SETS.length)];
  var selected = set.slice(0, pieces);

  var pieceData = [];
  for (var i = 0; i < pieces; i++) {
    pieceData.push({
      id: 'piece-' + i,
      emoji: selected[i],
      slot: i
    });
  }

  return {
    pieces: shuffle(pieceData.slice()),
    numPieces: pieces,
    difficulty: difficulty,
    theme: selected
  };
}

export { PUZZLE_SETS };

