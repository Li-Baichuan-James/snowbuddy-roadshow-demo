# SnowBuddy Roadshow App 成熟方案

## 0. 已确认最终决策

以下决策已确认，后续实施不得再作为开放问题处理：

- 产品名统一使用 `SnowBuddy`。
- UI 语言使用全英文；中文只用于内部沟通和主持人口播准备。
- 首屏需要克制地标明这是 simulated demo / prototype，避免暗示真实硬件、实时定位或多人同步已经完成。
- Join 页面保留展示名输入，默认值为 `Alex`，点击后加入 Demo。
- 二维码最终指向 Vercel 正式 URL 的 `/join/DEMO`。
- 手机竖屏优先；桌面只需保证主持机和投影演示可用。
- 主持机默认从 Home 开始，但可在 Home、Map、Goggle 之间切换。
- SOS 允许选择任意队友触发，不固定为 James；如果未选择，则使用 James 作为默认演示对象。
- Meet 点击后立即进入集合状态，不需要确认弹窗。
- Voice 不播放真实声音，只显示模拟播放反馈，不使用浏览器音频。
- Map 使用抽象雪道雷达 / ski piste schematic 风格。
- 弱网兜底只要求页面加载后仍可继续操作，不做完整 PWA 离线缓存。
- Goggle / 硬件视觉先保留占位，不依赖最终硬件图片。
- UI 字体、配色、层级和交互细节遵循 `impeccable` 的 product UI 原则：高对比、克制、标准控件、状态清晰、避免装饰性过度设计。
- 本次交付物为 Web App、production 二维码、GitHub repo、Vercel production 部署和主持机本地 build 备份；不额外制作 PPT、脚本或离线评委手机方案。
- 路演日期确认为 2026-06-12。

## 1. 项目定位

SnowBuddy Roadshow App 是一个面向投资人和创业比赛评委的 Web 路演原型，用来展示 SnowBuddy 智能滑雪雪镜系统的核心价值。

本原型不是完整消费级 App，也不是通用滑雪社交产品。它的目标是在路演现场稳定、快速、清晰地讲明一个产品判断：滑雪队友协作不应该依赖复杂地图、电话、群聊或频繁掏手机，而应该通过低干扰的雪镜 HUD 给出最关键的信息。

核心产品句：

```text
SnowBuddy helps group skiers stay connected by showing who to follow, where to go, and how far away it is directly in a low-distraction goggle display.
```

中文表达：

```text
SnowBuddy 让组队滑雪者不用频繁看手机，也能通过雪镜看到队友、集合点和 SOS 的方向与距离。
```

## 2. 本次路演目标

路演原型的优先级是稳定演示，而不是真实环境完整还原。

评委扫码后，应在 30 秒内理解：

- SnowBuddy 解决的是组队滑雪中“找人、集合、求助、低干扰沟通”的问题。
- 手机 Web App 是控制中心。
- 雪镜 HUD 只显示最重要的方向、距离和状态。
- SOS 会覆盖所有普通导航状态。
- Meet 可以快速把全队引导到同一个集合点。
- Voice 是短语音提醒，不是实时通话。
- 这是稳定的 simulated prototype，不是宣称真实硬件、真实定位或多人实时同步已经完成。

演示成功标准：

- 评委无需下载 App。
- 评委无需注册登录。
- 评委无需授权 GPS。
- 评委无需等待网络实时同步。
- 评委扫码后能立即体验完整故事。
- 主持人可以用 5 分钟完成稳定演示。

## 3. 最终方案选择

采用方案 A：纯本地模拟，路演稳定优先。

### 3.1 为什么选择纯本地模拟

路演现场通常存在这些不确定因素：

- 室内 GPS 不准确或不可用。
- 场馆网络不稳定。
- iPhone 和 Android 的浏览器权限行为不同。
- 多人实时同步容易出现延迟或状态不一致。
- 真实录音、地图瓦片、硬件连接都会增加失败点。

因此本次 MVP 不以真实数据链路为目标，而以“可信地表达产品体验”为目标。每台设备运行独立本地 Demo，主持机或大屏负责统一叙事，评委手机负责个人沉浸式体验。

### 3.2 方案边界

本次必须做：

- Web App 原型。
- QR code 扫码进入。
- Join 页面。
- Home 控制中心。
- 模拟 Map 页面。
- Goggle Preview 页面。
- Goggle / 硬件视觉占位。
- 本地模拟队友移动。
- 本地模拟 Meet。
- 本地模拟 SOS。
- 本地模拟 Voice。
- 高端运动装备风格 UI。
- 移动端优先适配。

本次不做：

- 用户注册和登录。
- Supabase Realtime。
- 数据库持久化。
- 真实 GPS 位置共享。
- Leaflet 或 OpenStreetMap 瓦片地图。
- 浏览器真实录音。
- 语音上传。
- 多设备状态同步。
- Web Bluetooth。
- ESP32 或真实雪镜连接。
- 好友系统。
- 滑雪动态 feed。
- 完整聊天。
- 天气、雪场、缆车、路线规划。
- 运动记录、速度、海拔、历史轨迹。
- 支付或会员。

## 4. 用户与演示场景

### 4.1 主要用户

本次原型的主要用户是投资人和创业比赛评委。

他们关心：

- 产品是否解决真实痛点。
- Demo 是否能快速说明价值。
- 交互是否足够简单。
- 后续硬件产品是否有想象空间。
- 团队是否能把概念做成可信原型。

### 4.2 路演参与方式

现场可能有多名评委同时扫码。

每名评委打开的是独立本地 Demo。不同设备之间不共享状态，也不需要保持同步。

这种设计的好处：

- 不受网络同步影响。
- 不需要后端服务。
- 每个评委都能独立触发 Meet、SOS、Voice。
- 主持人可以稳定控制讲解节奏。

需要在话术中避免说“所有评委手机实时同步”。正确表述是：

```text
This prototype simulates a ski team session on each device, so every judge can experience the same SnowBuddy flow instantly.
```

中文话术：

```text
这个原型会在每台设备上模拟一支滑雪队，让每位评委都能立即体验 SnowBuddy 的完整流程。
```

### 4.3 主持机展示

主持机默认从 Home 页面开始讲解，并根据叙事节奏切换到 Map 和 Goggle。桌面投影只需要保持清晰、稳定、可操作；主要体验仍以评委手机竖屏为优先。

## 5. 产品叙事

SnowBuddy 的路演故事分为四层：

1. 问题：组队滑雪时，队友容易分散，电话和群聊不适合雪道环境。
2. 方案：手机负责队伍状态和控制，雪镜负责低干扰显示。
3. 关键体验：方向、距离、集合点、SOS、短语音。
4. 差异化：不是地图 App，而是智能雪镜的低干扰协作系统。

核心信息架构：

```text
Join -> Home -> Map -> Goggle
```

每个页面承担不同叙事任务：

- Join：说明无需下载和登录。
- Home：说明手机是控制中心。
- Map：说明系统知道队友相对位置。
- Goggle：说明真正的产品价值在低干扰 HUD。

## 6. 页面结构

只保留四个顶层页面：

```text
Join
Home
Map
Goggle
```

加入后使用底部导航：

```text
Home | Map | Goggle
```

页面不使用复杂路由。推荐路由：

```text
/
/join/DEMO
/app/home
/app/map
/app/goggle
```

也可以用单页状态管理实现，不强制使用复杂 router。

## 7. Join 页面

### 7.1 目标

让评委扫码后快速进入 Demo，不制造任何注册、权限或配置阻力。

### 7.2 推荐界面

```text
SnowBuddy

Smart goggle control for group skiing

Simulated roadshow prototype

Team Code
[ DEMO ]

Your Name
[ Alex ]

[ Join Demo Team ]

No app download. No account required.
```

### 7.3 功能

- 如果 URL 是 `/join/DEMO`，自动填入 `DEMO`。
- 用户输入展示名，默认值为 `Alex`。
- 点击 `Join Demo Team` 后创建本地参与者。
- 本地参与者只保存在浏览器 localStorage。
- 不请求 GPS 权限。
- 不请求麦克风权限。
- 不连接后端。

### 7.4 校验

- 展示名必填。
- 去掉前后空格。
- 最长 20 个字符。
- 默认队伍码为 `DEMO`。

### 7.5 本地参与者模型

```ts
type LocalParticipant = {
  id: string;
  roomCode: "DEMO";
  displayName: string;
  joinedAt: number;
};
```

## 8. Home 页面

### 8.1 目标

Home 是主控制中心，也是路演中最重要的页面。它要让评委立即理解：手机控制队伍状态，雪镜接收低干扰提示。

### 8.2 推荐界面

```text
SnowBuddy DEMO

Current Target
Leader Ava

        ↗
       84m

Signal simulated

[ Meet ] [ SOS ]
[ Voice Check ]

Team
● You        Ready
● Ava        Leader · 84m
● James      142m
● Hank       210m
○ Tim        Last seen 2 min ago
```

### 8.3 功能

- 显示当前目标。
- 显示大号方向箭头。
- 显示距离。
- 显示模拟信号状态。
- 显示团队成员列表。
- 允许选择队友作为普通追踪目标。
- 提供 Meet 按钮。
- 提供 SOS 按钮。
- 提供 Voice Check 按钮。

### 8.4 目标优先级

目标显示遵循固定优先级：

```text
SOS > Meet Point > Voice Notification > Selected Teammate > Leader
```

解释：

- SOS 是最高优先级，必须覆盖所有状态。
- Meet Point 是集合指令，覆盖普通追踪。
- Voice Notification 是短暂提示，不长期占用目标。
- Selected Teammate 是用户主动选择。
- Leader 是默认目标。

### 8.5 方向箭头

使用八方向箭头：

```text
↑  ahead
↗  ahead right
→  right
↘  back right
↓  behind
↙  back left
←  left
↖  ahead left
```

由于本次是模拟 Demo，箭头不需要真实罗盘计算。每个模拟队友和事件携带一个 `bearingDeg` 或直接携带 `arrow`。

### 8.6 Home 状态

Normal：

```text
FOLLOW AVA
↗ 84m
```

Meet：

```text
MEET POINT
→ 120m
```

SOS：

```text
SOS FROM JAMES
← 45m
```

Voice：

```text
VOICE FROM AVA
[ Play simulated message ]
```

## 9. Map 页面

### 9.1 目标

Map 页面用于辅助理解位置关系，但不能成为产品主角。SnowBuddy 的核心不是复杂地图，而是把地图复杂度压缩成雪镜里的方向和距离。

### 9.2 地图策略

本次不使用真实地图瓦片。Map 页面使用自绘模拟地图，风格类似 ski piste radar 或 resort schematic。

推荐视觉元素：

- 深浅分层的雪道线条。
- 当前用户位置点。
- 队友位置点。
- Leader 标识。
- Meet Point 标识。
- SOS 高亮标识。
- 轻量网格或海拔线装饰。

### 9.3 推荐界面

```text
Team Map

[ simulated slope map ]

Selected
James
142m away
[ Track in Goggle ]
```

### 9.4 功能

- 显示模拟雪道背景。
- 显示当前用户位置。
- 显示模拟队友位置。
- 显示 Meet Point。
- 显示 SOS 位置。
- 点击队友后出现底部信息区。
- 点击 `Track in Goggle` 后把该队友设为 Home 和 Goggle 的普通目标。

## 10. Goggle Preview 页面

### 10.1 目标

Goggle Preview 是路演中的价值落点。它要让评委看见真正的产品形态：不是再做一个手机 App，而是把滑雪时需要的信息压缩进雪镜 HUD。

### 10.2 推荐界面

```text
Goggle Preview

┌────────────────────┐
│                    │
│    SOS JAMES       │
│                    │
│        ←           │
│       45m          │
│                    │
└────────────────────┘

Display Mode
Arrow + Distance

Simulated goggle output
```

### 10.3 功能

- 显示与 Home 一致的当前目标状态。
- 使用黑底或近黑底模拟 OLED/HUD。
- 显示模式标签：FOLLOW、MEET、SOS、VOICE。
- 显示方向箭头。
- 显示距离。
- 不显示真实连接按钮。
- 不显示 Web Bluetooth。
- 不暗示硬件已经完成。

### 10.4 HUD payload

前端内部可以把当前 HUD 状态抽象为：

```ts
type HudPayload = {
  mode: "follow" | "meet" | "sos" | "voice";
  label: string;
  arrow: "↑" | "↗" | "→" | "↘" | "↓" | "↙" | "←" | "↖";
  distanceMeters?: number;
};
```

这个模型只用于页面状态，不发送给真实硬件。

## 11. 本地模拟系统

### 11.1 模拟原则

模拟数据必须服务路演叙事，而不是追求物理真实性。

好的模拟状态应该：

- 让箭头和距离持续变化。
- 让队友列表看起来像真实团队。
- 让 Meet 和 SOS 的优先级清楚。
- 让 Goggle Preview 始终有强表达力。

### 11.2 模拟队友

默认队伍：

```text
Ava    Leader
James  Teammate
Hank   Teammate
Tim    Offline teammate
```

当前用户使用 Join 页面输入的名字。

### 11.3 模拟成员模型

```ts
type DemoMember = {
  id: string;
  name: string;
  role: "leader" | "teammate";
  status: "online" | "offline";
  distanceMeters: number;
  arrow: HudPayload["arrow"];
  mapX: number;
  mapY: number;
  color: string;
  lastSeenLabel?: string;
};
```

### 11.4 模拟行为

- 每 2 到 3 秒轻微更新在线队友的位置、方向和距离。
- 距离变化保持平滑，避免跳动过大。
- Tim 固定为离线成员，用来展示 last seen 状态。
- Leader Ava 默认作为初始追踪目标。
- James 默认适合作为 SOS 触发对象。

### 11.5 Meet 模拟

触发方式：

```text
用户点击 Meet -> 进入 Meet 状态 -> 当前目标变为 MEET POINT
```

Meet 状态：

- 模拟集合点距离 80 到 180 米。
- 箭头固定或缓慢变化。
- Home 和 Goggle 都显示 `MEET POINT`。
- 用户可以点击 `Clear Meet` 返回普通追踪。

### 11.6 SOS 模拟

触发方式：

```text
用户点击 SOS -> 选择或确认模拟求助队友 -> 进入 SOS 状态
```

SOS 状态：

- 可从在线队友中选择 SOS 来源。
- 如果用户未选择，默认显示 `SOS FROM JAMES`，保证演示节奏稳定。
- 距离建议为 45 到 90 米，便于制造紧迫感。
- SOS 使用红色或高对比警示样式。
- Home、Map、Goggle 必须同步显示 SOS 视觉状态。
- 用户可以点击 `I'm OK` 或 `Resolve SOS` 返回普通追踪。

### 11.7 Voice 模拟

触发方式：

```text
用户点击 Voice Check -> 显示 simulated voice notification
```

Voice 状态：

- 不录音。
- 不请求麦克风权限。
- 不上传文件。
- 显示 `Voice from Ava` 或 `Voice from Leader`。
- 提供 `Play` 按钮，点击后只显示模拟播放反馈。
- 不播放真实声音，避免浏览器音频限制和现场环境风险。
- Goggle 短暂显示 `VOICE AVA`，几秒后回到原目标。

## 12. 状态模型

### 12.1 AppState

```ts
type AppState = {
  participant: LocalParticipant | null;
  members: DemoMember[];
  selectedMemberId: string | null;
  activeMeet: DemoMeet | null;
  activeSos: DemoSos | null;
  activeVoice: DemoVoice | null;
  currentPage: "home" | "map" | "goggle";
};
```

### 12.2 DemoMeet

```ts
type DemoMeet = {
  id: string;
  label: "MEET POINT";
  distanceMeters: number;
  arrow: HudPayload["arrow"];
  mapX: number;
  mapY: number;
  createdAt: number;
};
```

### 12.3 DemoSos

```ts
type DemoSos = {
  id: string;
  senderName: string;
  distanceMeters: number;
  arrow: HudPayload["arrow"];
  mapX: number;
  mapY: number;
  createdAt: number;
};
```

### 12.4 DemoVoice

```ts
type DemoVoice = {
  id: string;
  senderName: string;
  messageLabel: string;
  createdAt: number;
  expiresAt: number;
};
```

## 13. 目标选择逻辑

目标选择集中在一个函数中，避免页面各自写判断。

```ts
function getCurrentHudPayload(state: AppState): HudPayload {
  if (state.activeSos) return sosToHud(state.activeSos);
  if (state.activeMeet) return meetToHud(state.activeMeet);
  if (state.activeVoice) return voiceToHud(state.activeVoice);
  if (state.selectedMemberId) return memberToHud(selectedMember);
  return memberToHud(leader);
}
```

要求：

- Home 和 Goggle 必须使用同一个 `HudPayload`。
- Map 的高亮状态也应来自同一个目标选择结果。
- SOS 优先级不能被 Meet、Voice 或手动选择覆盖。

## 14. 技术栈

推荐技术栈：

- Vite。
- React。
- TypeScript。
- Tailwind CSS。
- 本地状态管理，优先使用 React state 和自定义 hooks。
- localStorage 只保存参与者名字和是否已加入 DEMO。

不需要：

- Supabase。
- Firebase。
- 后端 API。
- 数据库。
- 地图 SDK。
- 录音 SDK。
- 蓝牙 SDK。

## 15. 推荐文件结构

```text
snowbuddy-roadshow-demo/
  index.html
  package.json
  vercel.json
  vite.config.ts
  tsconfig.json
  tailwind.config.js
  postcss.config.js
  src/
    main.tsx
    App.tsx
    styles.css
    types.ts
    lib/
      demoData.ts
      demoMotion.ts
      hud.ts
      storage.ts
    hooks/
      useLocalParticipant.ts
      useDemoSession.ts
      useHudPayload.ts
    components/
      BottomNav.tsx
      HudDisplay.tsx
      TeamList.tsx
      DemoMap.tsx
      GogglePreview.tsx
      ActionPanel.tsx
      StatusPill.tsx
    pages/
      JoinPage.tsx
      HomePage.tsx
      MapPage.tsx
      GogglePage.tsx
```

实现时，Vite app 代码放在 repo 根目录，不再额外嵌套一个 `snowbuddy-roadshow-app/` 子目录。这样 Vercel 可直接从 repo root 构建，减少路径配置风险。

职责说明：

- `types.ts`：共享类型。
- `demoData.ts`：默认队友、默认距离、默认颜色。
- `demoMotion.ts`：模拟位置和距离变化。
- `hud.ts`：目标优先级和 HUD payload 转换。
- `storage.ts`：localStorage 读写。
- `useLocalParticipant.ts`：加入状态和本地身份。
- `useDemoSession.ts`：模拟队伍、Meet、SOS、Voice。
- `useHudPayload.ts`：给 Home 和 Goggle 提供统一 HUD 数据。
- `DemoMap.tsx`：自绘模拟地图。
- `HudDisplay.tsx`：大号方向和距离组件。
- `GogglePreview.tsx`：雪镜 HUD 模拟。

## 16. 视觉方向

### 16.1 设计气质

视觉方向为高端运动装备感。

关键词：

- 精密。
- 克制。
- 低干扰。
- 专业户外装备。
- 智能硬件控制器。

避免：

- 社交 App 风格。
- 游戏化雪地界面。
- 普通 SaaS Dashboard。
- 过度霓虹科技感。
- 信息密度过高。

设计执行遵循 `impeccable` product UI 原则：产品界面应服务任务，不做营销页式装饰；使用标准、可信、可理解的控件；每个交互状态都要清楚；动效只表达状态变化，不做表演。

### 16.2 使用场景句

设计应服务这个场景：

```text
A skier checks a compact control surface before putting the phone away, then relies on a refined goggle HUD while moving on a bright, high-glare mountain slope.
```

这意味着：

- 界面必须高对比。
- 信息必须稀疏。
- 主视觉必须集中在方向和距离。
- 触控目标必须足够大。
- 不能依赖细碎文字完成理解。

### 16.3 色彩建议

使用深色运动装备底色，但不要做廉价霓虹。

色彩策略为 restrained product UI。主色锚定在 OKLCH hue 约 200° 的 glacier cyan / ice blue 区间，作为主要行动、选中状态和 HUD 重点信息。背景以 near-black graphite 为主，辅以冷 slate surface。SOS 使用 alpine red，但必须同时依赖文字、布局和图标强调，不能只靠红色传达。

建议使用 OKLCH 或接近以下方向的色彩：

```text
Base: near-black blue graphite
Surface: cold slate graphite
Primary: glacier cyan
Secondary: muted ice blue
Meet: controlled amber
SOS: alpine red
Online: restrained green
Text: tinted off-white
Muted text: blue-gray
```

字体建议使用一套清晰的现代 sans 字体栈，例如 Inter / SF Pro / system-ui。标题、按钮、标签、数据统一使用同一字体家族，通过字重、字号和间距建立层级。不要使用展示字体或夸张字号；移动端 UI 文本必须稳定可读，不随视口宽度任意缩放。

### 16.4 排版和布局

- Home 的箭头和距离是最大层级。
- 页面标题应短，不写营销长句。
- 按钮文案使用动词。
- 列表只显示必要信息。
- Map 页面不要塞满控件。
- Goggle 页面应该像硬件预览，不像普通卡片。
- Goggle / 硬件区域先保留高质量占位：可以是精简的雪镜轮廓、HUD 视窗或设备占位框，但不得暗示真实硬件已经完成连接。
- 按钮、输入框、状态 pill、底部导航使用统一组件语言；避免同类控件在不同页面长得不一样。
- 所有交互组件必须考虑 default、hover、focus、active、disabled 状态。
- 动效控制在 150 到 250ms，用于状态反馈和 HUD 切换；必须支持 reduced motion。

## 17. 交互细节

### 17.1 Meet

按钮文案：

```text
Meet
```

点击后不弹确认，直接进入模拟集合状态。使用 inline 状态反馈。

状态反馈：

```text
Meet point sent to team
```

### 17.2 SOS

按钮文案：

```text
SOS
```

点击后需要确认，避免误触。

确认层中允许选择模拟求助队友。默认选中 James，以保证主持人不操作额外选项也能稳定完成演示。

确认文案：

```text
Simulate SOS alert?
Your team will see the selected teammate as the emergency target.
```

进入 SOS 后提供：

```text
Resolve SOS
```

### 17.3 Voice

按钮文案：

```text
Voice Check
```

点击后显示：

```text
Voice from Ava
Regroup near the blue run.
[ Play ]
```

这是模拟语音，不要显示正在录音，也不要请求麦克风权限。

点击 `Play` 后只显示播放中 / 已播放的 UI 反馈，不播放真实声音。

### 17.4 Track in Goggle

Map 或 Team List 中选择成员后显示：

```text
Track in Goggle
```

点击后 Home 和 Goggle 的普通目标切换到该成员。如果当前有 SOS 或 Meet，手动选择只作为后备目标保存，不能覆盖高优先级状态。

## 18. 路演 Demo 流程

### 18.1 准备

准备内容：

- 一台主持电脑连接投影。
- 一个二维码，指向 Vercel 正式 URL 的 `/join/DEMO`。
- 一个预加载好的浏览器页面作为主持机。
- 多名评委可用手机扫码。

不需要准备：

- Supabase 项目。
- GPS 测试环境。
- 真实雪镜硬件。
- 蓝牙配对。
- 麦克风权限。

### 18.2 演示步骤

1. 展示二维码。

话术：

```text
Scan this to join a simulated SnowBuddy ski team. No app download and no account required.
```

2. 评委输入名字并加入 DEMO。

预期：

```text
Join Demo Team -> Home
```

3. 展示 Home。

话术：

```text
The phone is the control hub. It manages the team session, while the goggle only shows the next useful cue.
```

4. 展示队友方向和距离变化。

预期：

```text
FOLLOW AVA
↗ 84m
```

5. 点击 Meet。

预期：

```text
MEET POINT
→ 120m
```

话术：

```text
Instead of calling everyone or opening a full map, the leader sends one meeting cue. The goggle turns it into a direction and distance.
```

6. 点击 SOS。

预期：

```text
SOS FROM JAMES
← 45m
```

话术：

```text
SOS overrides everything. The team immediately knows who needs help and where to go.
```

7. 点击 Voice Check。

预期：

```text
Voice from Ava
[ Play ]
```

话术：

```text
SnowBuddy uses short voice check-ins instead of always-on calls, keeping communication lightweight and less distracting.
```

8. 打开 Goggle 页面。

预期：

```text
SOS JAMES
←
45m
```

话术：

```text
This is the product point: no feed, no full map, no distraction. Just the information a skier needs in the moment.
```

## 19. 实施阶段

### Phase 1：项目搭建

任务：

1. 创建 Vite React TypeScript 项目。
2. 配置 Tailwind CSS。
3. 建立页面结构。
4. 建立基础状态模型。
5. 完成移动端布局基础。

验收：

- 本地能启动。
- Join、Home、Map、Goggle 可导航。
- 手机尺寸下可用。

### Phase 2：静态 UI

任务：

1. 完成 Join 页面视觉。
2. 完成 Home 静态视觉。
3. 完成模拟 Map 静态视觉。
4. 完成 Goggle Preview 静态视觉。
5. 完成底部导航。

验收：

- 不接任何动态数据也能讲清产品故事。
- Home 箭头和距离在手机上足够醒目。
- Goggle 页面明确像雪镜 HUD。

### Phase 3：本地 Demo 状态

任务：

1. 实现本地参与者。
2. 实现默认模拟队友。
3. 实现队友距离和位置轻微变化。
4. 实现目标优先级。
5. 实现 Home、Map、Goggle 共用同一 HUD 状态。

验收：

- 页面状态一致。
- 队友看起来在移动。
- 默认目标是 Leader。

### Phase 4：Meet / SOS / Voice

任务：

1. 实现 Meet 状态。
2. 实现 SOS 状态和解除。
3. 实现 Voice 模拟通知。
4. 确保优先级正确。
5. 确保 Map 和 Goggle 反映当前状态。

验收：

- SOS 覆盖 Meet 和普通追踪。
- Meet 覆盖普通追踪。
- Voice 短暂提示后回到原目标。
- 解除 SOS 后回到 Meet 或普通目标。

### Phase 5：路演打磨

任务：

1. 优化移动端细节。
2. 优化按钮触控面积。
3. 优化文案和演示状态。
4. 部署到 Vercel。
5. 生成 `/join/DEMO` 二维码。
6. 确认 2026-06-12 路演前的手机实机测试。

验收：

- 评委扫码后可以顺利进入。
- 5 分钟演示不需要刷新或手动修复。
- 所有核心状态都能在主持机和评委手机上独立演示。

## 20. Repo、部署与交付

### 20.1 GitHub repo

本项目使用独立 GitHub repo 管理代码。

Repo 决策：

```text
Repository name: snowbuddy-roadshow-demo
Visibility: Public
Purpose: SnowBuddy roadshow prototype only
```

Repo 原则：

- 仓库只放本次路演 Web Demo 相关代码和素材。
- 不放 API key、账号密码、私有素材或未授权资源。
- `main` 分支作为 production 部署分支。
- 每次路演前只使用已验证的 `main` 分支版本。

推荐 repo 初始化内容：

```text
README.md
.gitignore
package.json
src/
public/
docs/
images/
exports/
references/
```

README 至少说明：

- 项目定位：SnowBuddy roadshow demo。
- 本地运行命令。
- build 命令。
- Vercel deployment URL。
- 路演入口 URL：`/join/DEMO`。
- 本项目不依赖 GPS、后端、录音或硬件。

### 20.2 Vercel 部署

部署方式：GitHub 自动部署。

Vercel 项目决策：

```text
Vercel project name: snowbuddy-roadshow-demo
Production branch: main
Custom domain: not required
Primary demo URL: https://snowbuddy-roadshow-demo.vercel.app/join/DEMO
```

如果 Vercel 默认 URL 因命名占用发生变化，以 Vercel 实际生成的 production URL 为准，并更新 README、二维码和路演文档。

Vercel 配置：

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Environment Variables: none required for MVP
```

由于 `/join/DEMO`、`/app/home`、`/app/map`、`/app/goggle` 都是前端路由，Vercel 必须配置 SPA rewrite，避免直接访问深链接时返回 404。repo 根目录需要包含：

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

文件名：

```text
vercel.json
```

部署规则：

- 连接 GitHub repo 后，`main` 分支自动部署 production。
- Pull request 或非 main 分支产生 preview deployment，但不作为路演入口。
- 路演二维码只指向 production URL。
- 本 MVP 不需要配置 Supabase、地图 token、录音服务或硬件相关环境变量。

### 20.3 QR code

二维码目标链接：

```text
https://snowbuddy-roadshow-demo.vercel.app/join/DEMO
```

如果 Vercel production URL 变化，二维码必须重新生成。

二维码文件保存位置：

```text
exports/qr/snowbuddy-demo-join-demo.png
exports/qr/snowbuddy-demo-join-demo.svg
```

二维码使用原则：

- 路演 PPT、海报和主持机都使用同一个 production URL 二维码。
- 二维码旁边显示短文字：`Scan to join SnowBuddy Demo`。
- 路演前必须用 iPhone Safari 和 Android Chrome 扫码测试。
- 不使用 preview deployment URL 生成二维码。

### 20.4 本地 build 备份

现场备份方案：本地 build 备份。

备份目标：即使现场网络或 Vercel 临时不可用，主持人仍能在电脑上展示完整 Demo。

备份方式：

```text
npm run build
npm run preview -- --host 127.0.0.1
```

也可以使用任何已经提前安装并测试过的本地静态服务器运行 `dist`。不要在路演现场依赖临时 `npx` 下载。

备份文件建议保存到：

```text
exports/demo/local-build/
```

备份要求：

- 本地 build 必须在路演前完成。
- 本地 build 版本必须与 Vercel production 版本一致。
- 主持电脑必须提前测试本地运行。
- 本地备份主要用于主持机演示，不要求评委手机扫码访问。
- 如果需要让评委手机访问本地备份，需要额外配置同一局域网访问地址，本次不作为必做项。

### 20.5 部署前检查清单

发布到 Vercel production 前检查：

- `npm install` 成功。
- `npm run build` 成功。
- 本地预览可打开 Join、Home、Map、Goggle。
- `/join/DEMO` 直接进入 Join 页面并预填 DEMO。
- App 不请求 GPS、麦克风或蓝牙权限。
- Meet、SOS、Voice 模拟功能可用。
- Goggle Preview 与 Home 当前状态一致。
- 手机视口下按钮可点击，文字可读。

Vercel production 部署后检查：

- production URL 可访问。
- `/join/DEMO` 可访问。
- iPhone Safari 可扫码进入。
- Android Chrome 可扫码进入。
- 二维码指向 production URL。
- README 中的部署 URL 已更新。
- 路演 PPT 中的二维码和 URL 已更新。

### 20.6 不采用的部署方案

本次不采用：

- GitHub Pages 第二线上备份。
- 自定义域名。
- 后端部署。
- Serverless API。
- Supabase 项目配置。
- 需要环境变量的部署流程。

## 21. 测试清单

### 21.1 设备测试

必须测试：

- iPhone Safari。
- Android Chrome。
- Desktop Chrome。

### 21.2 功能测试

Join：

- `/join/DEMO` 可以打开。
- 队伍码默认是 DEMO。
- 名字为空不能加入。
- 名字过长会被限制。
- 加入后刷新仍保留本地身份。

Home：

- 默认显示 Leader 目标。
- 队友距离会变化。
- 点击队友可切换普通目标。
- Meet 按钮可用。
- SOS 按钮可用。
- Voice Check 按钮可用。

Map：

- 显示模拟雪道。
- 显示用户和队友。
- Meet 状态有集合点。
- SOS 状态有警示点。
- Track in Goggle 可切换目标。

Goggle：

- 显示与 Home 一致的 HUD。
- SOS 状态醒目。
- Meet 状态清楚。
- Voice 状态短暂显示。

优先级：

- SOS 覆盖所有状态。
- Meet 覆盖普通追踪。
- Voice 不应永久覆盖 SOS 或 Meet。
- 解除 SOS 后状态恢复合理。

视觉：

- Home 箭头在一臂距离可读。
- SOS 足够醒目。
- 按钮易点击。
- 界面不像普通社交 App。
- Goggle Preview 能明确传达硬件愿景。

### 21.3 现场测试

- 关闭 GPS 权限后仍可完整演示。
- 关闭麦克风权限后仍可完整演示。
- 弱网环境下，页面已加载后仍可操作。
- 多名评委同时扫码不会互相影响。
- 主持人无需解释技术限制即可讲完故事。

## 22. 最终验收标准

本次原型完成的标准：

- 有可访问的 Vercel URL。
- 二维码可以打开 `/join/DEMO`。
- GitHub repo 为 public 独立仓库 `snowbuddy-roadshow-demo`。
- Vercel 通过 GitHub `main` 分支自动部署 production。
- 本地 build 备份已生成并在主持电脑测试通过。
- 用户可以输入名字并进入 Demo。
- App 不请求 GPS、麦克风或蓝牙权限。
- Home 显示当前目标、方向、距离、团队和操作按钮。
- Map 显示模拟雪道和队友位置。
- Goggle 显示当前 HUD 状态。
- Meet 能切换目标为集合点。
- SOS 能覆盖所有状态。
- Voice 能展示模拟短语音提醒。
- 页面适配手机屏幕。
- 主持机默认可从 Home 开始，并可切换到 Map 和 Goggle。
- 多名评委可同时独立体验。
- 5 分钟路演不依赖后端、真实地图、真实定位或硬件。

## 23. 后续阶段，不属于本次 MVP

如果路演后继续推进，可以按以下顺序扩展：

1. 真实 GPS 位置共享。
2. Supabase Realtime 多人同步。
3. 真实地图或雪场地图。
4. 真实 Push-to-talk 录音和上传。
5. Web Bluetooth 或原生硬件连接。
6. ESP32 HUD 原型。
7. 雪场实地测试。
8. 消费级 App 信息架构。

这些能力不应进入本次路演 MVP，以免破坏稳定性和交付速度。

## 24. 产品决策原则

后续实施时必须保留这些决策：

- Demo 稳定性优先于真实技术完整度。
- Home 是控制中心，不是地图首页。
- Goggle Preview 是价值落点。
- SOS 永远最高优先级。
- Meet 覆盖普通追踪。
- Voice 是短语音概念展示，不是真实通话。
- Map 是辅助理解，不是核心体验。
- 不要求评委下载、注册或授权敏感权限。
- 每个功能都必须能在 5 秒内解释清楚。
