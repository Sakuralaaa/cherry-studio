# Cherry Studio Lite（精简版）

基于 [CherryHQ/cherry-studio](https://github.com/CherryHQ/cherry-studio) v2.2.0 的个人自用精简分支，遵循 AGPL-3.0，保留原作者署名与许可证。

## 目标
保留原界面风格，只留单纯对话与服务商/模型管理；与对话直接相关的功能（话题/历史、对话搜索、助手设置、消息渲染、附件、联网搜索、导出、主题/语言、备份恢复）不受影响。

## 阶段一：移除入口（已完成）
- [x] 侧边栏只保留「对话」；新标签页默认打开对话而不是启动台
- [x] 设置页移除：本地模型、API 网关、MCP、技能、Computer Use、内置浏览器、语音、频道、设备互联、快捷助手、划词助手、截图、依赖管理、快捷短语、快捷键
- [x] 输入框工具移除：语音听写、知识库、MCP、笔记引用、快捷短语
- [x] 助手编辑移除知识库 / MCP / 快捷短语绑定页
- [x] 托盘移除快捷助手与划词助手开关；全局快捷键（快捷助手/划词/截图）不再注册处理器，截图快捷键默认关闭
- [x] 自动更新不再连接官方更新源；遥测（PostHog）与 Sentry 永久关闭
- [x] GitHub Actions：windows-latest 打 x64 NSIS 安装包，上传 Artifact 并发布 Release

## 阶段二：真正删除代码（已完成主要部分）

### 预置服务商
- 从 `packages/provider-registry` 删除 41 个中转 / 赞助 / 本地运行时 / 编码代理类预置服务商的源文件，并同步裁剪 `data/providers.json`、`data/provider-models.json`（模型目录 `models.json` 保留）：302ai aihubmix aionly alayanew burncloud cerebras cherryin claude-code comfyui copilot dmxapi fireworks gateway gpustack grok-cli groq huggingface lanyun litellm lmstudio modelscope new-api nvidia ocoolai ollama omlx openai-codex opencode openrouter ovms ph8 poe ppio qiniu radeon-cloud silicon sophnet together tokendance tokenhub xirang
- `presetProviderSeeder` 在现有数据库中删除上述服务商的 `user_provider` 行（模型随外键级联删除）；若其模型仍被知识库用作嵌入模型则保留该服务商，避免破坏知识库
- 删除渲染进程的隐藏过滤（`liteProviders.ts`、`useProviders` 过滤）——不再需要
- 删除服务商专属设置：CherryIN 登录/设置、GitHub Copilot、OVMS（含模型下载）、LM Studio、GPUStack、DMXAPI、Claude Code、Codex / Grok CLI 登录面板、"一键获取 API Key" OAuth 按钮与其 renderer `services/oauth`
- 删除 main 进程：`CopilotService`（含 IPC 与 preload `window.api.copilot`）、`OvmsManager` + `ovms` IPC、`CherryInOAuthService`/配置、`cherryin` IPC 与 OAuth 运行时 provider、TokenDance OAuth
- 新手引导不再提供 CherryIN 登录按钮
- 绘画：去掉 OVMS 可用性检测，供应商列表完全由剩余服务商的图像模型能力决定

### 页面 / 路由 / 窗口
- 删除路由与页面：智能体（agents）、内置浏览器、Code 工具、文件、启动台、市场、小程序、定时任务；设置页 API 网关、浏览器、频道、代码执行、Computer Use、依赖管理、设备互联、本地模型、MCP（全部子页）、快捷助手、定时任务、截图、划词助手、快捷键、技能、订阅、语音
- `routeTree.gen.ts` 已用 TanStack 生成器重新生成
- 侧边栏注册表只剩 对话 / 绘画 / 翻译 / 知识库 / 笔记，删除 LITE 过滤层
- 删除快捷助手、截图、划词（toolbar/action/agent/capsule）独立窗口及其 vite 入口
- 删除小程序前端（`components/MiniApp`、`useMiniApps` 等）与输入框里的截图入口

### main 进程
- 删除：`OpenClawService`、`HermesDashboardService`、`QuickAssistantService`、`ScreenshotChatService`、`services/screenshot`、`services/selection`、小程序运行时 `features/miniApp`、`DeepSeekHarness`、`OfficialAnnouncementService`、`AnalyticsService`（PostHog）、`SentryLogService` / `sentry.ts` / `crashTelemetry` / 渲染端 Sentry、`remoteDebugging`、`AppUpdaterService`、`ProviderRegistryUpdaterService`（不再从官方仓库拉取服务商目录）
- 对应 IPC 域删除：openclaw、hermesDashboard、quickAssistant、screenshot、screenshotChat、selection、miniApp、ovms、cherryin、codeCli、deepSeekHarness、oauth.tokendance
- 自动更新：`app.updater.*` IPC 变为空实现（不检查、不下载、无官方更新地址）；electron-builder 去掉 `publish`；诊断里的更新/目录端点检查直接通过
- Sentry：删除 `@sentry/electron`、`@sentry/vite-plugin` 与构建配置中的 sourcemap 上传

### 依赖与打包
- 删除依赖：`@sentry/electron`、`@sentry/vite-plugin`、`posthog-node`、`selection-hook`、`node-screenshots`（及 8 个平台包）；`pnpm-lock.yaml` 已更新
- 删除 `native/selection-panel`；`before-pack.js` 不再构建划词面板，也不再下载 mise / bun / uv / ripgrep / MinGit
- electron-builder：Windows 只保留 NSIS 目标（去掉 portable）

### 有意保留（与对话耦合过深）
- 智能体运行时（`packages/agent-runtime*`、`agent-behavior`、`main/ai/agents`、`agentSession`）：对话流、流管理器与共享类型直接依赖，删除会破坏对话；仅删除了界面入口
- `remote-protocol` / `remote-transport` 与 `RemoteAccessService`、`ApiGatewayService`：内部网关被智能体运行时与 PDF 翻译使用，远程访问与网关耦合；仅删除设置页
- `ComputerUseService`、`BrowserSessionService`、自动化 REPL、`CodeCliService`、频道（ChannelManager）：属于智能体工具链，随智能体运行时一并保留，界面已删除
- MCP 运行时：对话输入框的 MCP 工具与联网搜索仍依赖，保留
- 语音（`ai/voice`、`native/system-speech`）：消息朗读、翻译、笔记的 TTS 依赖，保留（语音听写入口已在阶段一移除）
- `ShortcutService`（缩放等窗口快捷键）、`webview` 服务（HTML 文件预览依赖）、本地推理（知识库嵌入 / OCR）保留
- `main/ai/provider` 中的协议适配器（ollama、new-api、gateway 等）保留，因用户自定义服务商仍可选用这些协议类型；`packages/ui` 中的服务商图标保留
