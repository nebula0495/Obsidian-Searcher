import { describe, expect, it } from 'vitest';
import {
	buildSearchUrl,
	DEFAULT_SETTINGS,
	normalizeSettings,
	validateSearchTemplate,
} from './search';

describe('normalizeSettings', () => {
	it('migrates a legacy preset URL', () => {
		expect(normalizeSettings({ searchEngine: 'https://www.bing.com/search?q=' })).toEqual({
			engineId: 'bing',
			customUrl: DEFAULT_SETTINGS.customUrl,
		});
	});

	it('migrates a valid legacy custom URL', () => {
		expect(normalizeSettings({ searchEngine: 'https://search.example.com/?q=' })).toEqual({
			engineId: 'custom',
			customUrl: 'https://search.example.com/?q=',
		});
	});

	it('falls back when persisted data is invalid', () => {
		expect(normalizeSettings({ engineId: 'custom', customUrl: 'javascript:alert(1)' })).toEqual(DEFAULT_SETTINGS);
	});
});

describe('search URL construction', () => {
	it('encodes and substitutes every query placeholder', () => {
		expect(buildSearchUrl({ engineId: 'custom', customUrl: 'https://example.com/?q={query}&copy={query}' }, 'C++ & Markdown'))
		.toBe('https://example.com/?q=C%2B%2B%20%26%20Markdown&copy=C%2B%2B%20%26%20Markdown');
	});

	it('appends the encoded query for legacy-style templates', () => {
		expect(buildSearchUrl({ engineId: 'custom', customUrl: 'https://example.com/?q=' }, 'a b'))
		.toBe('https://example.com/?q=a%20b');
	});

	it('rejects unsupported URL schemes', () => {
		expect(validateSearchTemplate('javascript:alert(1)')).toBe(false);
		expect(buildSearchUrl({ engineId: 'custom', customUrl: 'file:///tmp/search' }, 'text')).toBeNull();
	});
});
