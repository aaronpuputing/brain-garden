# Roadmap - Brain Garden

> Project roadmap and milestone tracking for Brain Garden (思维花园).
> Target: 3-year-old girl's logical thinking training game.

---

## Current: Phase 1 - MVP (v0.1.0)

**Status: ✅ COMPLETE**

### Goal
Single game "Feed the Animals" (分类) working on iPad via Alibaba Cloud.

### Milestones

| # | Milestone | Status | Date |
|---|-----------|--------|------|
| 1.1 | Design doc complete | DONE | 2026-07-06 |
| 1.2 | MVP code complete (FeedAnimals game) | DONE | 2026-07-06 |
| 1.3 | Project docs suite (CONTINUATION, AGENTS, CHANGELOG, VERSION, ROADMAP) | DONE | 2026-07-06 |
| 1.4 | Deploy to Alibaba Cloud + iPad testing | DONE | 2026-07-06 |
| 1.5 | Play test with daughter + bug fixes | DONE | 2026-07-06 |

---

## Phase 2 - Expansion (v0.2.0-v1.0.0-beta)

**Status: ✅ COMPLETE**

Games added (6 new games — exceeded original 3-5 target):
1. 彩色小火车 (模式识别 / Pattern Recognition) ✅ DONE
2. 小熊排序 (比较逻辑 / Comparison) ✅ DONE
3. 动物拼图 (部分与整体 / Part-Whole) ✅ DONE
4. 水果配对翻翻乐 (配对 / Matching) ✅ DONE
5. 谁混进来了 (异类识别 / Odd One Out) ✅ DONE
6. 种花小园丁 (因果关系 / Cause-Effect) ✅ DONE

Features:
- Garden main screen with flower growth visualization ✅ DONE
- Each completed game adds a flower bloom ✅ DONE
- Difficulty persistence (localStorage) ✅ DONE

---

## Phase 3 - Polish (v1.0.0-beta+)

**Status: 🔨 IN PROGRESS**

已完成:
- ✅ Sound effects (Web Audio API)
- ✅ Parent dashboard (growth curve visualization)

待完成:
- [ ] Advanced adaptive difficulty engine (当前是基础难度递增，需要更智能的算法)
- [ ] Background music (可选背景音乐)
- [ ] Performance optimization (7 个场景的加载优化)
- [ ] More sound effect variety (动物叫声、环境音)
- [ ] Deploy to App Store via WebView

---

## Phase 4 - Community (v1.0.0+)

- GitHub open source (MIT)
- Game Generator API documentation
- Plugin-style game templates
- English translation + i18n

---

## Update: 2026-07-06 (v1.0.0-beta)

Phase 1 + Phase 2 complete! All 7 games implemented:

1. 小动物喂食 (分类) ✅
2. 彩色小火车 (模式识别) ✅
3. 小熊排序 (比较) ✅
4. 水果配对翻翻乐 (配对) ✅
5. 动物拼图 (部分与整体) ✅
6. 种花小园丁 (因果关系) ✅
7. 谁混进来了 (异类识别) ✅

Garden UI with flower growth visualization. Parent dashboard for growth tracking. GATES.md gate system in place. 7 个 Generator ↔ 7 个 Scene 全部注册在 MenuScene 中。

Next: Phase 3 Polish — 自适应难度引擎调优 → 背景音乐 → 性能优化 → App Store WebView 封装。

