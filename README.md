# 🌱 Brain Garden - 思维花园

> 3岁儿童逻辑思维训练游戏 | 纯前端 Web App | Phaser 3

给女儿做的逻辑思维游戏。第一关 **小动物喂食** 已完成，部署即可玩。

## 🎮 游戏设计

### 已完成的游戏

**小动物喂食**（分类逻辑）
- 三种小动物（猫🐱、狗🐶、兔🐰）张着嘴等吃的
- 拖拽食物（鱼🐟、骨头🦴、胡萝卜🥕）给对应的动物
- 出题引擎：每次游戏随机排列，永远不会重复
- 错误反馈：彩色泡泡温柔指引，零挫败感
- 难度自适应：从2种动物→4种，悄悄升级

### 核心设计原则
- ✅ 零文字（全靠图标和动画引导）
- ✅ 只支持触摸拖拽 + 点按
- ✅ 错误即有趣反馈，无惩罚
- ✅ 出题引擎代替固定关卡
- ✅ 难度自动适应（隐形爬楼梯）

### 后续计划
- 彩色小火车（模式识别）
- 小熊排序（比较）
- 动物拼图（部分与整体）

## 🛠 技术栈

- **Phaser 3** — 2D 游戏引擎（触摸、动画、场景管理）
- **Vite** — 构建工具
- **纯前端** — 无需后端，即开即用

## 🚀 部署指南

### 方式一：部署到阿里云（推荐）

```bash
# 1. 本地构建
cd brain-garden
npm install
npm run build   # 产出 dist/ 目录

# 2. scp 到阿里云服务器
scp -r dist/* root@你的服务器IP:/var/www/brain-garden/

# 3. 配置 Nginx（详见下方）
```

### Nginx 配置示例
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/brain-garden;
    
    location / {
        try_files $uri /index.html;
    }
}
```

### 方式二：本地预览

```bash
cd brain-garden
npm install
npm run dev
# 浏览器打开 http://localhost:3000
```

### 方式三：iPad 直接访问（最简单）

构建完成后，在阿里云配置好 Nginx，然后在 iPad Safari 上访问域名/IP，
点击 **"分享"→"添加到主屏幕"**，就会像原生 App 一样全屏运行。

## 📁 项目结构

```
brain-garden/
├── index.html          # 入口 HTML
├── vite.config.js      # Vite 配置
├── package.json        # 依赖
├── public/
│   └── manifest.json   # PWA 配置（添加到主屏幕用）
├── src/
│   ├── main.js         # 游戏入口 + Phaser 配置
│   ├── generators/
│   │   └── FeedAnimalsGenerator.js   # 出题引擎
│   ├── scenes/
│   │   ├── BootScene.js             # 加载场景
│   │   ├── MenuScene.js             # 花园菜单
│   │   └── FeedAnimalsScene.js      # 小动物喂食游戏
│   └── utils/
│       └── AssetFactory.js          # 程序化绘制所有角色
└── dist/               # 构建产物（可直接部署）
```

## 🎨 视觉风格

所有角色和物品都用 **Phaser Graphics API** 绘制，零外部图片依赖：

- 猫猫 — 暖橙色几何猫，圆头三角耳 + 胡须
- 狗狗 — 巧克力棕耷耳狗，大鼻头
- 兔兔 — 米白色长耳兔，粉色鼻子
- 鱼 — 薄荷绿小鱼
- 骨头 — 奶油色骨头
- 胡萝卜 — 橙红胡萝卜

色彩柔和明亮，大圆角、高对比度，3岁友好。

---

> 下次要做什么？运行 `npm run dev` 后开始开发新游戏！
