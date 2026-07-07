# Brain Garden - 项目接续文档

> 阅读本文档 + DESIGN.md + CHANGELOG.md + ROADMAP.md 即可完全掌握项目状态。

## 一、项目快照

| 项目 | 值 |
|------|-----|
| 名称 | Brain Garden (思维花园) |
| 当前版本 | 1.0.0-beta |
| 技术栈 | Phaser 3 + Vite，纯前端 |
| 渲染方式 | Canvas 2D 程序化绘制 + emoji 面部（零外部图片） |
| 部署地址 | http://8.129.84.45/brain-garden/ |
| SSH 密钥 | /tmp/codex-deploy-keys/id_ed25519 |
| 构建命令 | npm run build（自动先跑 validate） |
| 文档最后更新 | 2026-07-06 |

## 二、已实现的七个游戏

| # | 游戏 | 场景 | 引擎 | 逻辑维度 | 交互 |
|---|------|------|------|---------|------|
| 1 | 小动物喂食 | FeedAnimalsScene.js | FeedAnimalsGenerator.js | 分类 | 拖放 |
| 2 | 彩色小火车 | ColorTrainScene.js | ColorTrainGenerator.js | 模式识别 | 点击 |
| 3 | 小熊排序 | BearSortScene.js | BearSortGenerator.js | 比较逻辑 | 点击 |
| 4 | 水果配对翻翻乐 | MemoryScene.js | MemoryGenerator.js | 配对 | 点击 |
| 5 | 动物拼图 | PuzzleScene.js | PuzzleGenerator.js | 部分与整体 | 拖放 |
| 6 | 种花小园丁 | GardenerScene.js | GardenerGenerator.js | 因果关系 | 点击 |
| 7 | 谁混进来了 | OddOutScene.js | OddOutGenerator.js | 异类识别 | 点击 |

## 三、UI 系统

### 花园主界面 (MenuScene.js)
- 栅格化花园布局，每个游戏是一朵花
- 游戏完成一定次数后花朵盛开（成长可视化）
- 未玩的游戏显示为种子/花苞
- 右上角家长入口（长按 3 秒解锁）

### 家长看板 (ParentDashboardScene.js)
- 各游戏完成统计 + 成长曲线
- 难度自适应引擎可视化
- 从主界面长按进入，普通点击不会触发

## 四、关键架构决策

1. **Canvas 2D + emoji 优先于 AI 图片** — v0.4.0 尝试 AI 精灵图但因白底、尺寸、体积问题撤回。编程绘制更可控，零外部依赖。
2. **每个游戏 = 1 Scene + 1 Generator** — 松耦合，新游戏只需在 MenuScene 注册卡片即可接入
3. **出题引擎代替固定关卡** — 每次随机生成，避免记忆，这是最大差异化优势
4. **触摸优先，iPad 全屏适配** — 3 岁小朋友用 iPad，触摸区域 >= 60px
5. **零惩罚原则** — 错误即有趣反馈，无倒计时、无失败画面、无扣分
6. **AssetFactory 统一绘制** — 所有动物、物品、装饰元素通过 AssetFactory.js 程序化生成纹理
7. **SoundManager 单例** — Web Audio API，覆盖正确/错误/庆祝/点击四类音效

## 五、门禁系统

见 GATES.md。每次代码变更必须通过对应门禁链：
- 新功能: /plan-design-review → 实现 → /review → /qa → /ship
- Bug修复: /investigate → 修复 → /review → /qa → /ship
- 重构: /plan-eng-review → 实现 → /review → /qa → /ship
- 紧急修复: 修复 → /qa-only → /ship

部署前 6 项强制检查（AGENTS.md 中定义）。

## 六、部署命令

```bash
cd /Users/tangannan/Documents/Codex/2026-07-06/wo-x/brain-garden
npm run build          # 自动先跑 validate，Vite 构建 -> dist/
scp -r dist/* ecs-user@8.129.84.45:/var/www/brain-garden/
```

## 七、文档结构

| 文档 | 用途 |
|------|------|
| AGENTS.md | 工程约定 + 门禁系统引用 |
| GATES.md | 强制门禁链定义 |
| DESIGN.md | 设计文档 + 设计哲学 |
| ROADMAP.md | 版本路线图 + 里程碑 |
| CHANGELOG.md | 版本历史 |
| CONTINUATION.md | 本文件，项目接续快照 |
| VERSION | 唯一版本真相源 |

---

上次更新: 2026-07-06 | 版本: 1.0.0-beta

