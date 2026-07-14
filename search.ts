export const SEARCH_ENGINES = {
	google: 'https://www.google.com/search?q=',
	bing: 'https://www.bing.com/search?q=',
	baidu: 'https://www.baidu.com/s?wd=',
	duckduckgo: 'https://duckduckgo.com/?q=',
	yahoo: 'https://search.yahoo.com/search?p=',
} as const;

export type PresetSearchEngineId = keyof typeof SEARCH_ENGINES;
export type SearchEngineId = PresetSearchEngineId | 'custom';

export interface SearcherSettings {
	engineId: SearchEngineId;
	customUrl: string;
}

interface LegacySettings {
	engineId?: unknown;
	customUrl?: unknown;
	searchEngine?: unknown;
}

export const DEFAULT_SETTINGS: SearcherSettings = {
	engineId: 'google',
	customUrl: 'https://www.google.com/search?q={query}',
};

const QUERY_PLACEHOLDER = '{query}';

export function isPresetSearchEngineId(value: unknown): value is PresetSearchEngineId {
	return typeof value === 'string' && value in SEARCH_ENGINES;
}

export function validateSearchTemplate(template: string): boolean {
	if (!template.trim()) return false;

	try {
		const url = new URL(template.split(QUERY_PLACEHOLDER).join('query'));
		return url.protocol === 'https:' || url.protocol === 'http:';
	} catch {
		return false;
	}
}

export function buildSearchUrl(settings: SearcherSettings, query: string): string | null {
	const encodedQuery = encodeURIComponent(query);
	const template = settings.engineId === 'custom'
		? settings.customUrl.trim()
		: SEARCH_ENGINES[settings.engineId];
	const url = template.includes(QUERY_PLACEHOLDER)
		? template.split(QUERY_PLACEHOLDER).join(encodedQuery)
		: `${template}${encodedQuery}`;

	return validateSearchTemplate(url) ? url : null;
}

export function normalizeSettings(data: unknown): SearcherSettings {
	if (!isRecord(data)) return { ...DEFAULT_SETTINGS };

	if (isPresetSearchEngineId(data.engineId)) {
		return {
			engineId: data.engineId,
			customUrl: getValidCustomUrl(data.customUrl) ?? DEFAULT_SETTINGS.customUrl,
		};
	}

	if (data.engineId === 'custom') {
		const customUrl = getValidCustomUrl(data.customUrl);
		if (customUrl) return { engineId: 'custom', customUrl };
	}

	if (typeof data.searchEngine === 'string') {
		const preset = getPresetIdByUrl(data.searchEngine);
		if (preset) return { engineId: preset, customUrl: DEFAULT_SETTINGS.customUrl };

		const customUrl = getValidCustomUrl(data.searchEngine);
		if (customUrl) return { engineId: 'custom', customUrl };
	}

	return { ...DEFAULT_SETTINGS };
}

function getPresetIdByUrl(url: string): PresetSearchEngineId | null {
	for (const [id, presetUrl] of Object.entries(SEARCH_ENGINES)) {
		if (url === presetUrl) return id as PresetSearchEngineId;
	}

	return null;
}

function getValidCustomUrl(value: unknown): string | null {
	if (typeof value !== 'string') return null;
	const url = value.trim();
	return validateSearchTemplate(url) ? url : null;
}

function isRecord(value: unknown): value is LegacySettings {
	return typeof value === 'object' && value !== null;
}
