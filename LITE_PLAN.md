# Cherry Studio Lite（精简版）

基于 [CherryHQ/cherry-studio](https://github.com/CherryHQ/cherry-studio) v2.2.0 的个人自用精简分支，遵循 AGPL-3.0，保留原作者署名与许可证。

## 目标
保留原界面风格，只留单纯对话与服务商/模型管理；与对话直接相关的功能（话题/历史、对话搜索、助手设置、消息渲染、附件、联网搜索、导出、主题/语言、备份恢复）不受影响。

## 阶段一：移除入口（进行中）
- [x] 侧边栏只保留「对话」；新标签页默认打开对话而不是启动台
- [x] 设置页移除：本地模型、API 网关、MCP、技能、Computer Use、内置浏览器、语音、频道、设备互联、快捷助手、划词助手、截图、依赖管理、快捷短语、快捷键
- [x] 输入框工具移除：语音听写、知识库、MCP、笔记引用、快捷短语
- [x] 助手编辑移除知识库 / MCP / 快捷短语绑定页
- [x] 托盘移除快捷助手与划词助手开关；全局快捷键（快捷助手/划词/截图）不再注册处理器，截图快捷键默认关闭
- [x] 自动更新不再连接官方更新源；遥测（PostHog）与 Sentry 永久关闭
- [x] GitHub Actions：windows-latest 打 x64 NSIS 安装包，上传 Artifact 并发布 Release

## 阶段二：删除残留（待做）
- 移除 agent / MCP / 本地模型 / 渠道 / 远程访问 / 浏览器 / 划词 / 截图 / 快捷助手等 main 进程服务与 IPC
- 删除对应 packages（agent-runtime*、remote-*）与 node 依赖、原生模块（selection-hook、node-screenshots 等）
- 打包时不再下载 bun/uv 等二进制，去掉 portable 目标，压缩安装包体积
