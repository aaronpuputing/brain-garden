# AGENTS.md

## Build commands

  npm run dev          # 开发服务器 http://localhost:3000
  npm run build        # 生产构建 -> dist/（自动先跑 validate）
  npm run preview      # 预览 dist/
  npm run validate     # 源码完整性检查（构建前自动触发）
  npm run lint         # 代码规范检查

## Project structure

  index.html              # 入口 HTML，PWA meta
  src/main.js             # Phaser 游戏入口
  src/scenes/             # Phaser 场景(每个游戏一个场景)
  src/generators/         # 出题引擎(每种游戏一个 Generator)
  src/utils/              # 工具函数(纹理绘制等)
  scripts/validate.mjs    # 源码完整性验证脚本
  public/manifest.json    # PWA 配置
  dist/                   # 构建产物

## Key conventions

- 所有角色和物品用 Phaser Graphics/Canvas API 程序化绘制，零外部图片
- 每种游戏一个 Scene + 一个 Generator，在 MenuScene 注册新卡片即可接入
- 所有交互设计为触摸优先，适配 iPad 全屏
- 零惩罚原则：错误即有趣反馈，不倒计时、不失败画面、不扣分
- 出题引擎代替固定关卡：每次游戏元素随机，难度自适应

---

## ⚠️ 任务启动仪式（最高优先级 — 每次必读）

**收到任何开发任务后，在写任何代码之前，必须执行以下步骤。这是强制性行为约束，不是建议。**

### 第0步：读取状态文件

启动时先读取以下文件，了解项目当前状态：

```
1. VERSION — 当前版本号
2. GATE_LOG.md — 是否有未完成的门禁链
3. CHANGELOG.md — 最近变更记录
```

### 第1步：任务分类

收到用户请求后，立即判断变更类型：

- **新功能**：新增游戏、场景、组件、特性
- **Bug修复**：修复报错、白屏、交互异常、逻辑错误
- **重构**：架构改动、代码清理、性能优化、无功能变化
- **紧急修复**：生产环境白屏、部署失败

### 第2步：写入 GATE_LOG.md + 向用户汇报

**在写任何代码前**，必须：

**(a) 写入 GATE_LOG.md**：

```markdown
| # | 门禁 | 状态 | 时间 | 备注 |
|---|------|------|------|------|
| 1 | [第一个门禁] | ⏳ | - | - |
| 2 | [第二个门禁] | ❌ | - | - |
| ... | ... | ... | ... | ... |
```

**(b) 向用户汇报**：

```
📋 任务确认
- 需求：[一句话复述]
- 类型：[新功能/Bug修复/重构/紧急修复]
- 门禁链：[列出每一步]
- 当前版本：[从 VERSION 读取]
- 状态已写入 GATE_LOG.md

准备执行第1步：[门禁名称]
```

### 第3步：逐级执行门禁

每完成一个门禁：

1. **更新 GATE_LOG.md**：将该门禁状态改为 ✅，下一个改为 ⏳
2. **向用户汇报**：

```
✅ [门禁名称] 通过
→ 下一步：[下一个门禁名称]
继续？
```

**规则**：
- 当前门禁未通过，不得进入下一阶段
- 如果用户说"跳过"，在 GATE_LOG.md 中标注 ⏭️
- **所有门禁执行过程必须记录在 GATE_LOG.md 中**
- 如果 agent 中断，下一个 agent 读取 GATE_LOG.md 即可接续

### 第4步：全部门禁通过后，执行 /ship

/ship 前必须确认：

- [ ] npm run validate 通过（包括 GATE_LOG 检查）
- [ ] VERSION 文件已 bump
- [ ] CHANGELOG.md 已更新（引用 GATE_LOG 门禁记录）
- [ ] CONTINUATION.md 有架构变化时已更新
- [ ] dist/ 构建成功

### 模型适配说明

- **ChatGPT 5.5**：上述仪式与模型自然对话模式高度重合，执行应顺畅
- **DeepSeek 或其他模型**：上述仪式通过 GATE_LOG.md 实现文件系统级状态追踪，即使模型倾向于连续执行，GATE_LOG.md 和 validate.mjs 也会在 /ship 前强制检查门禁完整性

---

## 门禁链速查表

详见 GATES.md。快速参考：

| 变更类型 | 门禁链 |
|---------|--------|
| 新功能 | /plan-design-review → 实现 → /review → /qa → /ship |
| Bug修复 | /investigate → 修复 → /review → /qa → /ship |
| 重构 | /plan-eng-review → 实现 → /review → /qa → /ship |
| 紧急修复 | 修复 → /qa-only → /ship |

---

## ⚠️ 版本一致性规则

- VERSION 是唯一版本真相源
- package.json 的 version 字段必须与 VERSION 一致
- CHANGELOG.md 必须有当前版本的条目
- 每次 bump 同时更新 VERSION + package.json + CHANGELOG

## Context preservation

- 会话断开后读 CONTINUATION.md + DESIGN.md + 当前 VERSION + GATES.md + **GATE_LOG.md** 接续
- 完成一个迭代后更新 CHANGELOG.md 并 bump VERSION
- 在 DESIGN.md 的路线图中勾选已完成的 Phase
- 每次部署到阿里云后记录部署时间戳到 CHANGELOG

## Deploy

  # 构建(本地 Mac) — 自动先跑 validate
  cd /Users/tangannan/Documents/Codex/2026-07-06/wo-x/brain-garden
  npm run build          # Vite 构建 -> dist/

  # 上传到阿里云
  scp -r dist/* ecs-user@8.129.84.45:/var/www/brain-garden/

  # 访问
  http://8.129.84.45/brain-garden/

