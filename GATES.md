# GATES.md — 开发门禁系统

> gstack router 执行层：每次变更必须通过对应门禁，未通过视为未完成。

---

## 变更类型 → 强制门禁链

### 新功能（新增游戏、场景、组件）

```
/plan-design-review  →  实现  →  /review  →  /qa  →  /ship
```

| 门禁 | 触发时机 | 通过标准 |
|------|---------|---------|
| /plan-design-review | 写第一行代码前 | 设计评分 ≥ 7/10 |
| /review | 代码写完、自测通过后 | 无 critical issue |
| /qa | review 通过后 | 无 high+ bug |
| /ship | QA 通过后 | deploy + CHANGELOG 更新 |

### Bug 修复

```
/investigate  →  修复  →  /review  →  /qa  →  /ship
```

| 门禁 | 触发时机 | 通过标准 |
|------|---------|---------|
| /investigate | 开始修复前 | 根因已确认 |
| /review | 修复完成后 | 无回归风险 |
| /qa | review 后 | 原 bug 复现失败 |

### 重构（架构改动、代码清理）

```
/plan-eng-review  →  实现  →  /review  →  /qa  →  /ship
```

| 门禁 | 触发时机 | 通过标准 |
|------|---------|---------|
| /plan-eng-review | 动手前 | 架构评分 ≥ 7/10 |
| /review | 实现后 | 无结构性问题 |

### 紧急热修复（白屏、部署失败）

```
修复  →  /qa-only  →  /ship
```

可跳过 /review，但必须跑 /qa-only（仅报告，不修改）。

---

## 门禁执行规则

1. **逐级放行** — 当前门禁未通过，不得进入下一阶段
2. **AI agent 自主判断** — agent 根据门禁结果自主决定是否继续
3. **门禁记录** — 每次通过后在 CHANGELOG 中标注（例：`✅ /review passed`）
4. **跳过声明** — 如跳过某门禁，必须在 commit message 中说明原因

---

## 部署前固定检查

每次 /ship 前，agent 必须确认：

- [ ] `npm run validate` 通过
- [ ] VERSION 文件已 bump
- [ ] CHANGELOG.md 已更新
- [ ] CONTINUATION.md 如有架构变化已更新
- [ ] dist/ 构建成功
- [ ] 对应门禁链已全部通过

---

## 门禁状态追踪

当前版本: 从 VERSION 文件读取
最近门禁: 从 CHANGELOG 最新条目读取

> 每次有新的 code change，检查是否已通过对应门禁。如果还没有，在开始写代码前先触发门禁。

