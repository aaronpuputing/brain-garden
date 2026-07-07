/**
 * VoicePrompt — 语音提示系统
 * 使用 Web Speech API，零外部依赖
 * Safari/iPad 兼容：utter.onend fallback 定时器
 */
export default class VoicePrompt {
  constructor(scene) {
    this.scene = scene;
    this.synth = null;
    this.repeatTimer = null;
    this.fallbackTimer = null;
    this.enabled = true;
    this._boundInit = null;
    this._lastSayTime = 0;
    this._sayCooldown = 2000; // min ms between say() calls
  }

  start(initialText, repeatText, intervalMs) {
    if (!this.enabled) return;
    intervalMs = intervalMs || 20000;

    const doSpeak = () => {
      if (!this.synth) {
        this.synth = window.speechSynthesis;
      }
      if (!this.synth || !this.enabled) return;

      // Cancel ongoing speech
      this.synth.cancel();
      const utter = new SpeechSynthesisUtterance(initialText);
      utter.lang = 'zh-CN';
      utter.rate = 0.85;
      utter.pitch = 1.15;
      utter.volume = 0.8;
      this.synth.speak(utter);

      // Safari fix: use fallback timer alongside onend
      var self = this;
      var started = false;
      utter.onend = function() {
        if (started || !self.enabled) return;
        started = true;
        self._startRepeating(repeatText, intervalMs);
      };
      // Fallback: if onend doesn't fire within 10s, start anyway
      this.fallbackTimer = this.scene.time.delayedCall(10000, function() {
        if (started || !self.enabled) return;
        started = true;
        self._startRepeating(repeatText, intervalMs);
      });
    };

    try {
      doSpeak();
    } catch (e) {
      this._boundInit = doSpeak;
      this.scene.input.once('pointerdown', doSpeak);
    }
  }

  _startRepeating(text, intervalMs) {
    if (!this.enabled) return;
    if (this.fallbackTimer) { this.fallbackTimer.remove(); this.fallbackTimer = null; }
    this.repeatTimer = this.scene.time.addEvent({
      delay: intervalMs,
      callback: () => {
        if (!this.synth || !this.enabled) return;
        this.synth.cancel();
        const ru = new SpeechSynthesisUtterance(text);
        ru.lang = 'zh-CN';
        ru.rate = 0.85;
        ru.pitch = 1.15;
        ru.volume = 0.7;
        this.synth.speak(ru);
      },
      loop: true
    });
  }

  /** 立即播放一句提示（带冷却防止频繁打断） */
  say(text) {
    if (!this.synth || !this.enabled) return;
    var now = Date.now();
    if (now - this._lastSayTime < this._sayCooldown) return;
    this._lastSayTime = now;
    this.synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'zh-CN';
    utter.rate = 0.85;
    utter.pitch = 1.15;
    utter.volume = 0.8;
    this.synth.speak(utter);
  }

  stop() {
    this.enabled = false;
    if (this.repeatTimer) { this.repeatTimer.remove(); this.repeatTimer = null; }
    if (this.fallbackTimer) { this.fallbackTimer.remove(); this.fallbackTimer = null; }
    if (this.synth) { this.synth.cancel(); }
    if (this._boundInit) {
      this.scene.input.off('pointerdown', this._boundInit);
      this._boundInit = null;
    }
  }

  destroy() {
    this.stop();
    this.synth = null;
    this.scene = null;
  }
}

