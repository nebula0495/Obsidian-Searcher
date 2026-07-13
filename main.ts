import { Plugin, Editor, MarkdownView, Menu, App, PluginSettingTab, Setting, Notice } from 'obsidian';

interface ResearcherSettings {
	searchEngine: string;
}

const DEFAULT_SETTINGS: ResearcherSettings = {
	searchEngine: 'https://www.google.com/search?q='
}

const SEARCH_ENGINES: { [key: string]: string } = {
	'Google': 'https://www.google.com/search?q=',
	'Bing': 'https://www.bing.com/search?q=',
	'Baidu': 'https://www.baidu.com/s?wd=',
	'DuckDuckGo': 'https://duckduckgo.com/?q=',
	'Yahoo': 'https://search.yahoo.com/search?p='
}

export default class ResearcherPlugin extends Plugin {
	settings: ResearcherSettings;

	async onload() {
		await this.loadSettings();

		// 注册右键菜单事件
		this.registerEvent(
			this.app.workspace.on('editor-menu', (menu: Menu, editor: Editor, view: MarkdownView) => {
				const selectedText = editor.getSelection();

				if (selectedText && selectedText.trim().length > 0) {
					menu.addItem((item) => {
						item
							.setTitle('在网络上搜索')
							.setIcon('search')
							.onClick(() => {
								this.searchOnWeb(selectedText);
							});
					});
				}
			})
		);

		// 添加命令面板命令
		this.addCommand({
			id: 'search-selected-text',
			name: '在网络上搜索选中文字',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				const selectedText = editor.getSelection();
				if (selectedText && selectedText.trim().length > 0) {
					this.searchOnWeb(selectedText);
				} else {
					new Notice('请先选中要搜索的文字');
				}
			}
		});

		// 添加设置面板
		this.addSettingTab(new ResearcherSettingTab(this.app, this));
	}

	searchOnWeb(text: string) {
		const trimmedText = text.trim();
		if (!trimmedText) return;

		const searchUrl = this.settings.searchEngine + encodeURIComponent(trimmedText);
		window.open(searchUrl, '_blank');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class ResearcherSettingTab extends PluginSettingTab {
	plugin: ResearcherPlugin;

	constructor(app: App, plugin: ResearcherPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Researcher 插件设置' });

		new Setting(containerEl)
			.setName('搜索引擎')
			.setDesc('选择用于搜索的搜索引擎')
			.addDropdown((dropdown) => {
				// 添加预设搜索引擎
				for (const [name, url] of Object.entries(SEARCH_ENGINES)) {
					dropdown.addOption(url, name);
				}
				// 添加自定义选项
				dropdown.addOption('custom', '自定义');

				// 设置当前值
				const currentValue = this.plugin.settings.searchEngine;
				const isPreset = Object.values(SEARCH_ENGINES).includes(currentValue);
				dropdown.setValue(isPreset ? currentValue : 'custom');

				dropdown.onChange(async (value) => {
					if (value !== 'custom') {
						this.plugin.settings.searchEngine = value;
						await this.plugin.saveSettings();
						// 刷新设置面板
						this.display();
					} else {
						this.plugin.settings.searchEngine = 'https://www.google.com/search?q=';
						await this.plugin.saveSettings();
						this.display();
					}
				});
			});

		// 显示自定义URL输入框（当选择自定义或当前不是预设时）
		const currentValue = this.plugin.settings.searchEngine;
		const isPreset = Object.values(SEARCH_ENGINES).includes(currentValue);

		if (!isPreset) {
			new Setting(containerEl)
				.setName('自定义搜索引擎 URL')
				.setDesc('输入搜索引擎的URL（搜索关键词会附加在URL后面，例如：https://www.google.com/search?q=）')
				.addText((text) => {
					text
						.setPlaceholder('https://www.google.com/search?q=')
						.setValue(currentValue)
						.onChange(async (value) => {
							this.plugin.settings.searchEngine = value;
							await this.plugin.saveSettings();
						});
				});
		}

		// 说明信息
		containerEl.createEl('h3', { text: '使用说明' });
		const desc = containerEl.createEl('p');
		desc.innerHTML = '在编辑器中选中文字，然后右键点击，在弹出的菜单中选择"在网络上搜索"，即可用默认浏览器打开搜索结果页面。';
	}
}
