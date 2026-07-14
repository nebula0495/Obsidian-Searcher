# Searcher

Search selected text from an Obsidian editor with your preferred web search engine.

## Features

- Search an editor selection from the context menu or command palette.
- Works on desktop and mobile. On mobile, use the command palette.
- Includes Google, Bing, Baidu, DuckDuckGo, and Yahoo.
- Supports validated custom HTTP(S) search URLs.
- Uses `{query}` as an optional placeholder for the URL-encoded selection.
- Follows Obsidian's Chinese or English interface language.
- Migrates settings from Searcher 1.0 without losing a selected search engine.

## Install

### Community Plugins

Install **Searcher** from Obsidian's Community Plugins browser after the plugin is published.

### Manual installation

1. Create `.obsidian/plugins/obsidian-searcher/` in your vault.
2. Copy `manifest.json`, `main.js`, and `styles.css` into that directory.
3. Enable **Searcher** under **Settings > Community plugins**.

## Use

1. Select text in an editor.
2. On desktop, right-click and choose **Search on the web**.
3. Or open the command palette and run **Search selected text on the web**.

Choose a search engine in **Settings > Community plugins > Searcher**. For a custom engine, enter an HTTP(S) URL such as:

```text
https://www.google.com/search?q={query}
```

`{query}` is replaced with the encoded selected text. If it is omitted, Searcher appends the encoded text to the URL, which supports existing URLs such as `https://www.google.com/search?q=`.

## Development

Requires a supported Node.js LTS release.

```bash
npm install
npm test
npm run build
```

`npm run dev` watches source files and rebuilds `main.js`. CI runs tests and a production build on every push and pull request.

## License

MIT

---

# Searcher 中文说明

在 Obsidian 编辑器中选中文字后，使用你偏好的搜索引擎进行网络搜索。

## 功能

- 可通过右键菜单或命令面板搜索编辑器中的选中文字。
- 支持桌面端和移动端；移动端请通过命令面板调用。
- 内置 Google、Bing、百度、DuckDuckGo 和 Yahoo。
- 支持经过校验的自定义 HTTP(S) 搜索 URL。
- 自定义 URL 可使用 `{query}` 插入经过 URL 编码的选中文字。
- 插件界面会跟随 Obsidian 显示中文或英文。
- 可自动迁移 Searcher 1.0 的搜索引擎设置。

## 安装

### 社区插件

插件发布后，可在 Obsidian 的社区插件浏览器中搜索并安装 **Searcher**。

### 手动安装

1. 在 Vault 中创建 `.obsidian/plugins/obsidian-searcher/`。
2. 将 `manifest.json`、`main.js` 和 `styles.css` 复制到该目录。
3. 在 **设置 > 第三方插件** 中启用 **Searcher**。

## 使用方法

1. 在编辑器中选中要搜索的文字。
2. 桌面端右键点击，选择 **在网络上搜索**。
3. 或打开命令面板，执行 **在网络上搜索选中文字**。

在 **设置 > 第三方插件 > Searcher** 中选择搜索引擎。使用自定义引擎时，请填写 HTTP(S) URL，例如：

```text
https://www.google.com/search?q={query}
```

`{query}` 会被替换为经过 URL 编码的选中文字。若未使用该占位符，Searcher 会把编码后的文字追加到 URL 末尾，因此也兼容 `https://www.google.com/search?q=` 这类地址。

## 开发

需要受支持的 Node.js LTS 版本。

```bash
npm install
npm test
npm run build
```

`npm run dev` 会监听源文件并重新构建 `main.js`。每次 push 和 pull request 都会由 CI 执行测试与生产构建。

## 许可证

MIT
