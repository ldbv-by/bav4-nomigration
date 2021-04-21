import { provide } from '../../../../src/modules/menu/i18n/menu.provider';


describe('i18n for menu module', () => {

	it('provides translation for de', () => {

		const map = provide('de');

		expect(map.menu_toolbar_draw_button).toBe('Zeichnen');
		expect(map.menu_toolbar_share_button).toBe('Teilen');
		expect(map.menu_toolbar_measure_button).toBe('Messen');

	});

	it('provides translation for en', () => {

		const map = provide('en');

		expect(map.menu_toolbar_draw_button).toBe('Draw');
		expect(map.menu_toolbar_share_button).toBe('Share');
		expect(map.menu_toolbar_measure_button).toBe('Measure');

	});

	it('have the expected amount of translations', () => {
		const expectedSize = 3;
		const deMap = provide('de');
		const enMap = provide('en');

		const actualSize = (o) => Object.keys(o).length;

		expect(actualSize(deMap)).toBe(expectedSize);
		expect(actualSize(enMap)).toBe(expectedSize);
	});

	it('provides an empty map for a unknown lang', () => {

		const map = provide('unknown');

		expect(map).toEqual({});
	});
});