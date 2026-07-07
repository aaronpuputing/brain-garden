/**
 * BackgroundMusic — 背景音乐系统
 * Web Audio API 生成柔和的循环旋律
 */
export default class BackgroundMusic {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this._playing = false;
    this._nodes = [];
    this._timer = null;
  }

  _ensure() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch(e) { this.enabled = false; }
  }

  /** 播放柔和循环音乐 — 五声音阶随机音符 */
  start() {
    if (!this.enabled || this._playing) return;
    this._ensure();
    if (!this.ctx) return;
    this._playing = true;
    this._playLoop();
  }

  _playLoop() {
    if (!this._playing || !this.ctx) return;
    var self = this;
    // Pentatonic scale frequencies (C4 pentatonic)
    var notes = [262, 294, 330, 392, 440, 523, 588, 660, 784, 880];
    var freq = notes[Math.floor(Math.random() * notes.length)];

    var osc = this.ctx.createOscillator();
    var gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 0.3);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 2.5);
    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 2.8);

    // Schedule next note
    this._timer = setTimeout(function() { self._playLoop(); }, 2200 + Math.random() * 1500);
  }

  stop() {
    this._playing = false;
    if (this._timer) { clearTimeout(this._timer); this._timer = null; }
    if (this.ctx) this.ctx.close().catch(function() {});
    this.ctx = null;
  }
}

