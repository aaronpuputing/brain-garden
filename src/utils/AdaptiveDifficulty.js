/**
 * AdaptiveDifficulty — 自适应难度引擎
 * 跟踪成功率，平滑调整难度
 * Key insight: 保持 ~70% 成功率在"最近发展区"
 */
export default class AdaptiveDifficulty {
  constructor() {
    this.level = 1;
    this.maxLevel = 10;
    this.window = [];        // Last N results: 1=correct, 0=wrong
    this.windowSize = 5;
    this._ema = null;        // Exponential moving average of success rate
    this._alpha = 0.3;       // EMA smoothing factor
  }

  /** Record a result and return new difficulty */
  record(correct) {
    this.window.push(correct ? 1 : 0);
    if (this.window.length > this.windowSize) this.window.shift();

    // Calculate success rate
    var sum = 0;
    for (var i = 0; i < this.window.length; i++) sum += this.window[i];
    var rate = sum / this.window.length;

    // EMA smoothing
    if (this._ema === null) this._ema = rate;
    else this._ema = this._alpha * rate + (1 - this._alpha) * this._ema;

    // Zone of proximal development: target ~70% success
    // If too easy (>85%) → increase difficulty
    // If too hard (<55%) → decrease
    // Otherwise → maintain
    if (this._ema > 0.85 && this.window.length >= 3) {
      this.level = Math.min(this.level + 1, this.maxLevel);
    } else if (this._ema < 0.55 && this.window.length >= 3) {
      this.level = Math.max(this.level - 1, 1);
    }
    // Between 55%-85%: stay in comfort zone, tiny random drift
    else if (this.window.length >= 5 && Math.random() < 0.15) {
      this.level += this._ema > 0.7 ? 1 : -1;
      this.level = Math.max(1, Math.min(this.maxLevel, this.level));
    }

    return this.level;
  }

  /** Get current level */
  getLevel() { return this.level; }

  /** Reset */
  reset() {
    this.level = 1;
    this.window = [];
    this._ema = null;
  }
}

