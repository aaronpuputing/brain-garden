// validate.mjs — 源码完整性检查
// 在每次构建和部署前运行，确保基本质量门禁通过

import { readFileSync, readdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = resolve(ROOT, 'src');

let errors = 0;
let warnings = 0;

function fail(msg) { console.error('❌ ' + msg); errors++; }
function warn(msg) { console.warn('⚠️  ' + msg); warnings++; }
function ok(msg) { console.log('✅ ' + msg); }

// 1. 版本一致性
console.log('\n--- 版本一致性 ---');
const versionFile = readFileSync(resolve(ROOT, 'VERSION'), 'utf-8').trim();
const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf-8'));
if (versionFile !== pkg.version) {
  fail('VERSION (' + versionFile + ') ≠ package.json (' + pkg.version + ')');
} else {
  ok('VERSION = package.json = ' + versionFile);
}

// 2. 必要文档存在
console.log('\n--- 必要文档 ---');
for (const f of ['README.md', 'AGENTS.md', 'CONTINUATION.md', 'DESIGN.md', 'ROADMAP.md', 'CHANGELOG.md', 'VERSION', 'GATES.md']) {
  if (existsSync(resolve(ROOT, f))) {
    ok(f + ' exists');
  } else {
    fail(f + ' missing');
  }
}

// 3. 源码结构完整性
console.log('\n--- 源码结构 ---');
const generators = readdirSync(resolve(SRC, 'generators')).filter(f => f.endsWith('.js') && f !== 'index.js');
const scenes = readdirSync(resolve(SRC, 'scenes')).filter(f => f.endsWith('.js'));

// 检查每个 Generator 是否有对应的 Scene
for (const g of generators) {
  const baseName = g.replace('Generator.js', '');
  const expectedScene = baseName + 'Scene.js';
  if (scenes.includes(expectedScene)) {
    ok(g + ' ↔ ' + expectedScene);
  } else {
    warn(g + ' 缺少对应 Scene: ' + expectedScene);
  }
}

// 检查 index.js 导出是否完整
const indexContent = readFileSync(resolve(SRC, 'generators', 'index.js'), 'utf-8');
for (const g of generators) {
  const baseName = g.replace('.js', '');
  if (!indexContent.includes(baseName)) {
    fail('generators/index.js 缺少导出: ' + baseName);
  }
}
if (errors === 0) ok('generators/index.js 导出完整');

// 4. 检查重复方法（SoundManager 事故预防）
console.log('\n--- 重复代码检查 ---');
const soundManagerPath = resolve(SRC, 'utils', 'SoundManager.js');
if (existsSync(soundManagerPath)) {
  const content = readFileSync(soundManagerPath, 'utf-8');
  const methodNames = content.match(/(\w+)\s*\([^)]*\)\s*\{/g) || [];
  const counts = {};
  for (const m of methodNames) {
    const name = m.match(/(\w+)\s*\(/)[1];
    counts[name] = (counts[name] || 0) + 1;
  }
  let dupFound = false;
  for (const [name, count] of Object.entries(counts)) {
    if (count > 1) {
      fail('SoundManager.js 方法重复: ' + name + ' ×' + count);
      dupFound = true;
    }
  }
  if (!dupFound) ok('SoundManager.js 无重复方法');
}

// 5. 检查 CHANGELOG 是否记录了当前版本
console.log('\n--- CHANGELOG 版本记录 ---');
const changelog = readFileSync(resolve(ROOT, 'CHANGELOG.md'), 'utf-8');
if (changelog.includes('[' + versionFile + ']')) {
  ok('CHANGELOG 已记录版本 ' + versionFile);
} else {
  warn('CHANGELOG 未找到版本 ' + versionFile + ' 的记录');
}


// 6. 检查门禁日志（GATE_LOG.md）
console.log('\n--- 门禁状态 ---');
const gateLogPath = resolve(ROOT, 'GATE_LOG.md');
if (existsSync(gateLogPath)) {
  const gateLog = readFileSync(gateLogPath, 'utf-8');
  const hasTask = gateLog.includes('任务描述') && !gateLog.includes('（待填充）');
  if (hasTask) {
    // Check if all gates are completed
    const pendingGates = (gateLog.match(/❌|⏳/g) || []).length;
    const completedGates = (gateLog.match(/✅/g) || []).length;
    if (pendingGates > 0) {
      fail('GATE_LOG 有 ' + pendingGates + ' 个门禁未通过（共 ' + (pendingGates + completedGates) + ' 个）');
      warn('在完成所有门禁前，不应执行 /ship');
    } else if (completedGates > 0) {
      ok('GATE_LOG 全部门禁已通过（' + completedGates + ' 个）');
    } else {
      ok('GATE_LOG 无活跃门禁链');
    }
  } else {
    ok('GATE_LOG 无活跃门禁链');
  }
} else {
  fail('GATE_LOG.md 不存在');
}

// Summary
console.log('\n' + '='.repeat(40));
if (errors === 0) {
  console.log('✅ VALIDATE PASSED (' + warnings + ' warnings)');
} else {
  console.log('❌ VALIDATE FAILED: ' + errors + ' errors, ' + warnings + ' warnings');
  process.exit(1);
}


