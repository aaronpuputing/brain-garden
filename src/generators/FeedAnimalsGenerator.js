/**
 * FeedAnimalsGenerator — 小动物喂食出题引擎
 * 
 * 每次产生：随机布局 + 随机排列，确保每次游戏体验不同
 * 难度参数控制：动物数量、干扰项数量、食物是否混入无关项
 * 
 * 动物-食物 配对映射
 */

const EMOJI_MAP = {
  cat: "🐱",
  dog: "🐶",
  bunny: "🐰",
  fish: "🐟",
  bone: "🦴",
  carrot: "🥕",
  star: "⭐",
};

const ANIMAL_FOOD_MAP = {
  cat:   { foods: ['fish'],      label: '小猫', color: 0xF4A460 },
  dog:   { foods: ['bone'],      label: '小狗', color: 0x8B7355 },
  bunny: { foods: ['carrot'],    label: '小兔', color: 0xF5F5DC },
};

const ANIMALS = Object.keys(ANIMAL_FOOD_MAP);
const ALL_FOODS = ['fish', 'bone', 'carrot'];

/**
 * 洗牌（Fisher-Yates）
 */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * 随机选 N 个
 */
function pickN(arr, n) {
  return shuffle(arr).slice(0, n);
}

/**
 * 生成本轮的题目
 * @param {number} difficulty 1-10
 * @returns {Object} { animals, foods, correctPairs, animalPositions, foodPositions }
 */
export function generateRound(difficulty = 1) {
  // 难度映射
  const animalCount = Math.min(Math.floor(difficulty / 3) + 2, 4); // 2→4 只动物
  const foodPerRound = Math.min(Math.floor(difficulty / 2) + 2, 6); // 2→6 个食物轮次
  const addDistractors = difficulty >= 5; // >=5级加入无关干扰项

  // 选动物
  const selectedAnimals = pickN(ANIMALS, Math.min(animalCount, ANIMALS.length));
  
  // 出食物序列
  let foods = [];
  for (let i = 0; i < foodPerRound; i++) {
    const targetAnimal = selectedAnimals[i % selectedAnimals.length];
    const animalFoods = ANIMAL_FOOD_MAP[targetAnimal].foods;
    foods.push({
      foodType: animalFoods[0],
      targetAnimal: targetAnimal,
    });
  }

  // 如果是高难度，混入无关食物
  if (addDistractors) {
    const extraFoods = ALL_FOODS.filter(f => !selectedAnimals.some(a => ANIMAL_FOOD_MAP[a].foods.includes(f)));
    if (extraFoods.length > 0) {
      for (let i = 0; i < Math.min(2, foodPerRound); i++) {
        foods.push({
          foodType: pickN(extraFoods, 1)[0],
          targetAnimal: null, // 没有匹配的动物
        });
      }
    }
  }

  foods = shuffle(foods);

  // 布局位置
  const positions = getLayout(selectedAnimals.length, foods.length);

  return {
    difficulty: difficulty || 1,
    animals: selectedAnimals,
    foods: foods,
    foodSequence: foods.map(f => f.foodType),
    correctAnswers: foods.map(f => f.targetAnimal),
    animalPositions: positions.animals,
    foodPositions: positions.foods,
  };
}

/**
 * 根据动物数量和食物数量生成布局坐标
 */
function getLayout(animalCount, foodCount) {
  const W = 1024, H = 768; // 参考尺寸，实际会自适应

  // 动物均匀分布在屏幕上半部分
  const animals = [];
  const gap = W / (animalCount + 1);
  for (let i = 0; i < animalCount; i++) {
    animals.push({
      x: gap * (i + 1),
      y: H * 0.3,
      scale: 1.1,
    });
  }

  // 食物分布在屏幕下半部分
  const foods = [];
  const cols = Math.min(foodCount, 4);
  const rows = Math.ceil(foodCount / cols);
  const colGap = W / (cols + 1);
  const rowGap = H * 0.2;
  const startY = H * 0.65;

  for (let i = 0; i < foodCount; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    foods.push({
      x: colGap * (col + 1) + (row % 2 === 0 ? -30 : 30), // 错位排列
      y: startY + row * rowGap,
      scale: 0.8,
    });
  }

  return { animals, foods };
}

export function getFoodTextureKey(foodType) {
  return foodType; // 'fish', 'bone', 'carrot'
}

export { ANIMALS, ALL_FOODS, ANIMAL_FOOD_MAP, EMOJI_MAP };

