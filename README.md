# Searcher

> 一款为 Obsidian 设计的轻量级搜索插件，让选中文本的网络检索触手可及。
>
> A lightweight Obsidian plugin that brings instant web search to your selected text.

---

## 中文文档

### 概述

Searcher 是一款 Obsidian 第三方插件，旨在简化笔记过程中对信息的快速查证与延伸阅读。安装并启用后，用户在编辑器中选中任意文本，即可通过右键上下文菜单或命令面板，一键调用系统默认浏览器执行网络搜索。插件支持多种主流搜索引擎，并允许用户自定义搜索入口，兼顾便捷性与灵活性。

### 核心功能

- **上下文菜单搜索** — 选中文本后右键，菜单中将出现"在网络上搜索"选项，点击即可在默认浏览器中打开搜索结果页面。
- **命令面板调用** — 通过 Obsidian 命令面板（`Ctrl/Cmd + P`）搜索"在网络上搜索选中文字"命令，快捷触发搜索操作。
- **多搜索引擎支持** — 内置 Google、Bing、百度、DuckDuckGo、Yahoo 五种预设搜索引擎，可在设置面板中自由切换。
- **自定义搜索入口** — 如预设选项无法满足需求，用户可填写自定义搜索引擎 URL，支持任意遵循 `https://example.com/search?q=` 查询参数格式的搜索引擎。
- **跨平台兼容** — 插件基于 Obsidian 标准 API 开发，同时兼容桌面端与移动端。

### 安装方法

**方式一：手动安装**

1. 将插件文件夹放入 Obsidian Vault 的 `.obsidian/plugins/obsidian-searcher/` 目录下。
2. 确保该目录下包含 `manifest.json`、`main.js`、`styles.css` 三个核心文件。
3. 打开 Obsidian，进入 **设置 → 第三方插件**（Settings → Community plugins）。
4. 在已安装插件列表中找到 **Searcher**，点击启用开关。

**方式二：从源码构建**

```bash
# 克隆仓库后进入项目目录
cd obsidian-searcher

# 安装依赖
npm install

# 构建生产版本
npm run build
```

构建完成后，生成的 `main.js` 文件将位于项目根目录。将其连同 `manifest.json`、`styles.css` 一并复制到 Vault 的插件目录即可。

### 使用指南

**通过右键菜单搜索**

在任意笔记的编辑模式下，用鼠标或键盘选中需要查询的文本，随后右键点击。在弹出的上下文菜单中选择"在网络上搜索"，系统默认浏览器（如 Microsoft Edge）将自动打开并展示搜索结果。

**通过命令面板搜索**

按下 `Ctrl + P`（Windows/Linux）或 `Cmd + P`（macOS）打开命令面板，输入"在网络上搜索"即可定位到对应命令。执行命令前需先在编辑器中选中目标文本，否则将收到"请先选中要搜索的文字"的提示通知。

### 配置说明

进入 **设置 → 第三方插件 → Searcher** 可对插件进行个性化配置。

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| 搜索引擎 | 从预设列表中选择，或切换为自定义模式 | Google |
| 自定义搜索引擎 URL | 当选择"自定义"时显示，用于填写搜索引擎的查询 URL | — |

自定义 URL 需遵循以下格式：搜索关键词将以 URL 参数的形式附加在地址末尾。例如，`https://www.google.com/search?q=` 即为一个合法的配置值，插件会在其后自动拼接经过 `encodeURIComponent` 编码的搜索词。

### 技术架构

插件采用 TypeScript 编写，使用 esbuild 进行打包构建，不依赖任何第三方运行时库。核心实现基于 Obsidian Plugin API 的以下能力：

- `editor-menu` 事件监听，用于在右键菜单中动态注入搜索选项
- `addCommand` 方法注册命令面板入口
- `PluginSettingTab` 构建可视化设置界面
- `window.open` 调用系统默认浏览器发起搜索

| 文件 | 用途 |
|------|------|
| `main.ts` | TypeScript 源代码，包含插件全部业务逻辑 |
| `manifest.json` | 插件元数据声明，包括 ID、名称、版本等 |
| `styles.css` | 插件样式表 |
| `esbuild.config.mjs` | esbuild 构建配置 |
| `tsconfig.json` | TypeScript 编译选项 |

### 许可证

MIT License

---

## English Documentation

### Overview

Searcher is a third-party Obsidian plugin designed to streamline the process of fact-checking and further exploration during note-taking. Once installed and enabled, users can select any text within the editor and trigger a web search through the right-click context menu or the command palette, launching the system's default browser with a single action. The plugin ships with support for multiple major search engines and allows users to define custom search endpoints, balancing convenience with flexibility.

### Key Features

- **Context Menu Search** — Select text, right-click, and choose "Search on Web" from the context menu. The default browser opens automatically with search results for the selected text.
- **Command Palette Integration** — Access the search function via the Obsidian command palette (`Ctrl/Cmd + P`) by searching for the "Search selected text on the web" command.
- **Multiple Search Engine Support** — Five preset search engines are included out of the box: Google, Bing, Baidu, DuckDuckGo, and Yahoo. Switch between them at any time from the settings panel.
- **Custom Search Endpoint** — For use cases not covered by the presets, users can specify a custom search engine URL. Any search engine following the `https://example.com/search?q=` query parameter format is supported.
- **Cross-Platform Compatibility** — Built on the standard Obsidian Plugin API, the plugin functions on both desktop and mobile platforms.

### Installation

**Option 1: Manual Installation**

1. Place the plugin folder inside your Obsidian Vault's `.obsidian/plugins/obsidian-searcher/` directory.
2. Ensure that the directory contains three essential files: `manifest.json`, `main.js`, and `styles.css`.
3. Open Obsidian and navigate to **Settings → Community plugins**.
4. Locate **Searcher** in the installed plugins list and toggle the enable switch.

**Option 2: Build from Source**

```bash
# Navigate to the project directory after cloning
cd obsidian-searcher

# Install dependencies
npm install

# Build the production version
npm run build
```

After the build completes, the generated `main.js` file will be located in the project root. Copy it along with `manifest.json` and `styles.css` into your Vault's plugin directory.

### Usage Guide

**Searching via the Context Menu**

In the editing mode of any note, select the text you wish to look up using your mouse or keyboard, then right-click. Choose "Search on Web" from the context menu that appears. The system's default browser (e.g., Microsoft Edge) will open automatically and display the search results.

**Searching via the Command Palette**

Press `Ctrl + P` (Windows/Linux) or `Cmd + P` (macOS) to open the command palette, then type "Search selected text on the web" to locate the corresponding command. Make sure to select the target text in the editor before executing the command; otherwise, a notification will appear prompting you to select text first.

### Configuration

Navigate to **Settings → Community plugins → Searcher** to personalize the plugin's behavior.

| Setting | Description | Default |
|---------|-------------|---------|
| Search Engine | Choose from the preset list or switch to custom mode | Google |
| Custom Search Engine URL | Visible when "Custom" is selected; used to specify the search engine's query URL | — |

The custom URL must follow a specific format: the search keyword will be appended as a URL parameter at the end of the address. For example, `https://www.google.com/search?q=` is a valid configuration value. The plugin automatically appends the search term, encoded via `encodeURIComponent`, to this URL.

### Technical Architecture

The plugin is written in TypeScript, bundled with esbuild, and has no third-party runtime dependencies. The core implementation relies on the following capabilities of the Obsidian Plugin API:

- `editor-menu` event listener for dynamically injecting the search option into the context menu
- `addCommand` method for registering the command palette entry
- `PluginSettingTab` for building the visual settings interface
- `window.open` for invoking the system's default browser to perform the search

| File | Purpose |
|------|---------|
| `main.ts` | TypeScript source code containing all plugin logic |
| `manifest.json` | Plugin metadata declaration, including ID, name, and version |
| `styles.css` | Plugin stylesheet |
| `esbuild.config.mjs` | esbuild build configuration |
| `tsconfig.json` | TypeScript compiler options |

### License

MIT License
