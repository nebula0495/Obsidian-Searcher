import {
	App,
	Editor,
	getLanguage,
	MarkdownView,
	Menu,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from 'obsidian';
import {
	buildSearchUrl,
	DEFAULT_SETTINGS,
	normalizeSettings,
	SEARCH_ENGINES,
	SearcherSettings,
	validateSearchTemplate,
} from './search';

type Messages = typeof ENGLISH_MESSAGES;

const ENGLISH_MESSAGES = {
	commandName: 'Search selected text on the web',
	menuItem: 'Search on the web',
	emptySelection: 'Select text to search first.',
	invalidTemplate: 'The custom search URL must be a valid HTTP(S) URL.',
	couldNotOpen: 'Could not open the search result in your browser.',
	settingsHeading: 'Web Searcher settings',
	searchEngineName: 'Search engine',
	searchEngineDescription: 'Choose the search engine used for selected text.',
	customEngine: 'Custom',
	customUrlName: 'Custom search URL',
	customUrlDescription: 'Use {query} to place the encoded search text. Without it, the text is appended to the URL.',
	customUrlPlaceholder: 'https://www.google.com/search?q={query}',
	invalidCustomUrl: 'Enter a valid HTTP(S) URL.',
	usageHeading: 'Usage',
	usageDescription: 'Select text in an editor, then use the context menu or command palette to search the web.',
};

const CHINESE_MESSAGES: Messages = {
	commandName: '在网络上搜索选中文字',
	menuItem: '在网络上搜索',
	emptySelection: '请先选中要搜索的文字。',
	invalidTemplate: '自定义搜索 URL 必须是有效的 HTTP(S) 地址。',
	couldNotOpen: '无法在浏览器中打开搜索结果。',
	settingsHeading: 'Web Searcher 插件设置',
	searchEngineName: '搜索引擎',
	searchEngineDescription: '选择用于搜索选中文字的搜索引擎。',
	customEngine: '自定义',
	customUrlName: '自定义搜索 URL',
	customUrlDescription: '使用 {query} 插入编码后的搜索文字。未使用时，文字会追加到 URL 末尾。',
	customUrlPlaceholder: 'https://www.google.com/search?q={query}',
	invalidCustomUrl: '请输入有效的 HTTP(S) URL。',
	usageHeading: '使用说明',
	usageDescription: '在编辑器中选中文字，然后使用右键菜单或命令面板进行网络搜索。',
};

function getMessages(): Messages {
	return getLanguage().toLowerCase().startsWith('zh') ? CHINESE_MESSAGES : ENGLISH_MESSAGES;
}

export default class SearcherPlugin extends Plugin {
	settings: SearcherSettings = { ...DEFAULT_SETTINGS };

	async onload(): Promise<void> {
		await this.loadSettings();

		this.registerEvent(this.app.workspace.on('editor-menu', (menu: Menu, editor: Editor) => {
			const selectedText = editor.getSelection();
			if (!selectedText.trim()) return;

			menu.addItem((item) => item
				.setTitle(getMessages().menuItem)
				.setIcon('search')
				.onClick(() => this.searchOnWeb(selectedText)));
		}));

		this.addCommand({
			id: 'search-selected-text',
			name: getMessages().commandName,
			editorCallback: (editor: Editor) => this.searchOnWeb(editor.getSelection()),
		});

		this.addSettingTab(new SearcherSettingTab(this.app, this));
	}

	searchOnWeb(text: string): void {
		const query = text.trim();
		if (!query) {
			new Notice(getMessages().emptySelection);
			return;
		}

		const searchUrl = buildSearchUrl(this.settings, query);
		if (!searchUrl) {
			new Notice(getMessages().invalidTemplate);
			return;
		}

		try {
			window.open(searchUrl, '_blank', 'noopener');
		} catch {
			new Notice(getMessages().couldNotOpen);
		}
	}

	async loadSettings(): Promise<void> {
		this.settings = normalizeSettings(await this.loadData());
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}
}

class SearcherSettingTab extends PluginSettingTab {
	constructor(app: App, private readonly plugin: SearcherPlugin) {
		super(app, plugin);
	}

	display(): void {
		const { containerEl } = this;
		const messages = getMessages();
		containerEl.empty();
		containerEl.createEl('h2', { text: messages.settingsHeading });

		new Setting(containerEl)
			.setName(messages.searchEngineName)
			.setDesc(messages.searchEngineDescription)
			.addDropdown((dropdown) => {
				for (const engineId of Object.keys(SEARCH_ENGINES)) {
					dropdown.addOption(engineId, engineId[0].toUpperCase() + engineId.slice(1));
				}
				dropdown.addOption('custom', messages.customEngine);
				dropdown.setValue(this.plugin.settings.engineId);
				dropdown.onChange(async (engineId) => {
					this.plugin.settings.engineId = engineId as SearcherSettings['engineId'];
					await this.plugin.saveSettings();
					this.display();
				});
			});

		if (this.plugin.settings.engineId === 'custom') {
			const customUrlSetting = new Setting(containerEl)
				.setName(messages.customUrlName)
				.setDesc(messages.customUrlDescription)
				.addText((text) => {
					text
						.setPlaceholder(messages.customUrlPlaceholder)
						.setValue(this.plugin.settings.customUrl)
						.onChange(async (value) => {
							const customUrl = value.trim();
							const isValid = validateSearchTemplate(customUrl);
							text.inputEl.setCustomValidity(isValid ? '' : messages.invalidCustomUrl);
							customUrlSetting.setDesc(isValid ? messages.customUrlDescription : messages.invalidCustomUrl);
							if (!isValid) return;

							this.plugin.settings.customUrl = customUrl;
							await this.plugin.saveSettings();
						});
				});
		}

		containerEl.createEl('h3', { text: messages.usageHeading });
		containerEl.createEl('p', { text: messages.usageDescription });
	}
}
