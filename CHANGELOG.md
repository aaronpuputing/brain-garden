## [1.0.0-beta.3] - 2026-07-07

### Added
- **Agnes AI 图片素材** — 18 张高质量儿童绘本风格素材（FeedAnimals/Memory/Gardener/BearSort）
- **AI 图片集成** — FeedAnimalsScene 动物和食物用 AI 图片替换 emoji
- **MemoryScene 水果卡片** — 优先使用 AI 图片，无图片时 emoji 回退
- **BootScene 图片预加载** — 扩展到 38 张素材完整列表

### Fixed
- **BearSortScene 尺寸差异** — 小熊/物品缩放范围 0.55→1.45 扩大到 0.35→2.2 (5 倍视觉差异)
- **MemoryScene 崩溃 bug** — FRUIT_TO_IMAGE 未定义导致 ReferenceError

### Infrastructure
- generate_assets.py — 扩展覆盖全部 7 个游戏 38 个素材

## [1.0.0-beta.2] - 2026-07-07

### Fixed
- FeedAnimalsScene/ColorTrainScene localStorage 数据持久化缺失（花永远不开、看板永远 1/10）
- FeedAnimalsScene onRoundComplete 缺完成按钮（无限循环无法退出）
- ColorTrainScene 语音分号重复 (;;)
- generators/index.js PuzzleGenerator 导出名 PUZZLE_ANIMALS → PUZZLE_SETS

### Infrastructure
- gstack 完整门禁链跑通：/review (0 issues) → /qa (HTTP 200) → /ship (v1.0.0-beta.2)
- Git 仓库初始化，首次 commit b663227

---

# Changelog

All notable changes to Brain Garden will be documented in this file.


## [1.0.0-beta.1] - 2026-07-07

### Fixed — Critical Bugs
- **PuzzleScene 完全重写** — 修复两个致命 Bug：所有拼图块完全相同的问题（现在每个槽显示线索 emoji），任意块可放入任意槽的问题（现在校验 slot.idx 匹配）
- **BootScene 纹理缺失** — 加入 `generateAllTextures()` 调用，BearSort 的 Canvas 物品纹理现已正常生成
- **MemoryScene 翻牌尺寸** — 修复硬编码 100×114 卡片尺寸，改为动态 cardW/cardH
- **VoicePrompt Safari 兼容** — 增加 `onend` fallback 定时器（10 秒），解决 iPad 上重复语音不触发的问题
- **ParentDashboard 版本号** — 0.5.0 → 1.0.0-beta
- **MemoryScene 语音反馈** — 正确/错误操作增加即时语音

### Added — 增强功能
- **BackgroundMusic** — Web Audio API 生成五声音阶柔和循环旋律，可开关
- **AdaptiveDifficulty** — 自适应难度引擎，基于 EMA 平滑成功率，目标 ~70% 在最近发展区，平滑调整替代 ±1 跳跃
- **VoicePrompt.say() 冷却** — 2 秒最小间隔，防止语音重叠
- **全部 7 游戏即时语音反馈** — FeedAnimals/ColorTrain/Memory/Puzzle/Gardener/OddOut/BearSort 正确/错误操作均有语音

### Changed — 设计改进
- **PuzzleGenerator** — 改用有序图案序列（🔴🟠🟡🟢/🌱🌿🌷🌸/1️⃣2️⃣3️⃣4️⃣），每块 puzzle 有唯一视觉标识
- **PuzzleScene** — 槽位显示淡色线索 emoji（alpha 0.25），匹配后消失

### Technical
- 新增 `src/utils/BackgroundMusic.js` — Web Audio 五声音阶循环
- 新增 `src/utils/AdaptiveDifficulty.js` — EMA 自适应难度引擎
- VoicePrompt 重构 — fallback 定时器 + say() 冷却
- 构建产物从 1536KB 小幅增至 1549KB（+0.8%）

---

## [1.0.0-beta] - 2026-07-06

### Added
- **种花小园丁 (Gardener)** — 因果关系游戏，浇水→花开互动序列
- **谁混进来了 (Odd One Out)** — 异类识别，4个元素中找不同
- **小熊排序 (BearSort)** — 比较逻辑，按大小排列3-5个对象
- **水果配对翻翻乐 (Memory)** — 配对游戏，2x2→3x2 网格
- **动物拼图 (Puzzle)** — 部分与整体，2-6片拼图
- **花园主界面 (Garden Menu)** — 栅格化花园，每朵花代表一个游戏，花开进度可视化
- **家长看板 (Parent Dashboard)** — 成长曲线可视化，各游戏完成统计
- **AssetFactory** — 统一 Canvas 2D 程序化纹理绘制工具
- **SoundManager** — Web Audio API 音效管理系统（正确/错误/庆祝/点击）

### Changed
- **游戏矩阵完整** — 7 个逻辑维度游戏全部实现（分类/配对/模式识别/排序比较/部分与整体/因果关系/异类识别）
- **文档大扫除** — CONTINUATION、ROADMAP、DESIGN 全部对齐实际代码状态
- **版本号统一** — VERSION + package.json + CHANGELOG 三源合一

### Technical
- 全部角色和物品用 Canvas 2D Graphics API 程序化绘制，零外部图片
- 每个游戏独立 Scene + Generator，通过 MenuScene 注册卡片即可接入
- 触摸优先，适配 iPad 全屏
- 零惩罚原则：错误即有趣反馈，无倒计时/失败画面/扣分

### Infrastructure
- GATES.md 门禁系统（四种变更类型的强制门禁链）
- scripts/validate.mjs 源码完整性验证（prebuild hook）
- 部署目标：阿里云 ECS http://8.129.84.45/brain-garden/

### Design
- 核心设计哲学落地：无惩罚环境 + 出题引擎代替固定关卡 + 隐形爬楼梯难度自适应
- 花园隐喻完整实现：每种能力是一朵花，玩得越多花开得越盛

---

## [0.5.0] - 2026-07-06

### Added
- **门禁系统 (GATES.md)** — 四种变更类型的强制门禁链，gstack router 执行层
  - 新功能: /plan-design-review → /review → /qa → /ship
  - Bug修复: /investigate → /review → /qa → /ship
  - 重构: /plan-eng-review → /review → /qa → /ship
  - 紧急修复: /qa-only → /ship
- **源码验证脚本 (scripts/validate.mjs)** — 构建前自动检查
  - 版本一致性 (VERSION ↔ package.json)
  - 必要文档完整性
  - Generator ↔ Scene 对应关系
  - SoundManager 重复方法检测
  - CHANGELOG 版本记录检查
- **npm scripts** — validate / lint / test / prebuild
  - `npm run build` 自动先跑 validate

### Changed
- **AGENTS.md** — 加入强制性门禁规则和部署前 6 项检查
- **package.json** — version 从 0.1.0 更新为 0.5.0，与 VERSION 统一
- **loop engineering** — 从 code→build→deploy 升级为 validate→build→deploy

### Fixed
- 版本号三头马车: VERSION、package.json、CONTINUATION.md 现在 VERSION 为唯一真相源


## [0.3.2] - 2026-07-06

### Changed
- **Canvas 2D 身体绘图** — 动物 emoji 下方添加身体绘图（椭圆身体+耳朵+尾巴）
  - 猫🐱: 橙色身体 + 三角耳 + 弯曲尾巴
  - 狗🐶: 棕色身体 + 耷拉耳 + 短尾巴
  - 兔🐰: 白色身体 + 粉色内耳 + 毛球尾巴
- drawAnimalBody() 方法添加在 FeedAnimalsScene.js 中

### Reverted
- 撤回 v0.4.0 AI 图片方案（Agnes AI 生成的精灵图）
  - 原因: 图片 1024x1024 缩放不对、白底问题、5MB 太大
  - 决策: Canvas 2D 编程绘制优先于 AI 生成，零外部依赖

### Fixed
- 修复错误的 animal scale `(72/512)` 残留，恢复为 `pos.scale * 1.3`
- 清理服务器上遗留的旧 JS bundle 文件

### Note
- AI 图片素材保留在 public/assets/images/，未删除，可后续研究
## [0.4.0] - 2026-07-06

### Added
- **Agnes AI 游戏精灵图生成** — 使用 agnes-image-2.1-flash 模型生成 11 张高质量游戏素材
  - 动物全身图：猫、狗、兔（各 2 张：正常 + 开心状态）
  - 食物素材：鱼、骨头、胡萝卜
  - 装饰素材：星星、火车
- **精灵图替换 emoji 文本** — FeedAnimalsScene 中的动物和食物从系统 emoji 切换为 PNG 精灵图
- **动物表情变化** — 喂正确后动物切换为开心状态纹理（从 normal → happy）
- 新场景 BootScene 预加载所有 PNG 图片素材

### Technical
- API key 使用临时配置文件存储，不写入源代码（安全）
- 精灵图为 512x512 PNG，缩放计算公式适配原 emoji 尺寸（72px/80px）
- 图片存储路径: public/assets/images/，Vite 构建自动复制到 dist
- 所有精灵图风格统一：扁平矢量、柔和色彩、儿童绘本风格

### Infrastructure
- 更新部署流程包含图片素材目录

## [0.3.1] - 2026-07-06

### Fixed
- SoundManager.js 完全重写: 修复类结构损坏（花括号缺失、方法重复8次），重构为干净的5方法类
- FeedAnimalsScene.js: 移除5处多余的new SoundManager()（复制粘贴错误），统一使用单例
- 动物开心音效: handleCorrect() 正确喂食后调用 playAnimalHappy()，小动物发出上升音效
- 部署: 移除 Vite 构建的 crossorigin 属性修复白屏问题
- 清理: 删除服务器上6个旧版 bundle 节省 ~10MB

### Infrastructure
- 自动部署能力建立: SSH deploy key 已授权到服务器
- 一键部署: npm run build && scp tar 到服务器

## [0.3.0] - 2026-07-06

### Added
- New game: 彩色小火车 (Color Train) — pattern recognition logic game
- Garden menu now shows both games as selectable cards

### Infrastructure
- SSH deploy key authorized for automatic deployment

## [0.2.1] - 2026-07-06

### Fixed
- Round completion shows two large buttons: play again and home
- Added sound effects via Web Audio API (correct/wrong/celebrate/tap sounds)
- Back button redesigned as large green circle with home emoji (toddler-friendly)

## [0.2.0] - 2026-07-06

### Changed
- Complete visual overhaul: cuter animal drawings with bigger eyes, blush, soft shapes
- Background changed from flat colors to gradient sky + gradient grass
- Added decorative elements (sun, clouds, flowers)
- All character textures replaced with emoji for instant recognition by toddler

### Technical
- Switched from image textures to Phaser Text objects with emoji
- Deployed to Alibaba Cloud at http://8.129.84.45/brain-garden/

## [0.1.0] - 2026-07-06

### Added
- First game: "小动物喂食" (Feed the Animals) - classification logic game
- Three animals (cat, dog, bunny) with drag-and-drop feeding interaction
- Puzzle generator with random layout (never repeats)
- Self-adapting difficulty (2 types -> 4 types of animals)
- Touch-only interaction (iPad optimized)
- Phaser 3 + Vite build pipeline
