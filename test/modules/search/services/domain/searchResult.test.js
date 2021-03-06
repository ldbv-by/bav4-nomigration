import { SearchResult, SearchResultTypes } from '../../../../../src/modules/search/services/domain/searchResult';

describe('searchResult', () => {
	
	describe('SearchResultTypes', () => {

		it('provides an enum of all available types', () => {

			expect(SearchResultTypes.LOCATION).toBeTruthy();
			expect(SearchResultTypes.GEORESOURCE).toBeTruthy();
		});
	});
});

describe('SearchResult', () => {

	it('test constructor and getters', () => {
		const searchResult = new SearchResult('id', 'label', 'labelFormated', SearchResultTypes.LOCATION);
		expect(searchResult.id).toBe('id');
		expect(searchResult.label).toBe('label');
		expect(searchResult.labelFormated).toBe('labelFormated');
		expect(searchResult.type).toEqual(SearchResultTypes.LOCATION);
		expect(searchResult.center).toBeNull();
		expect(searchResult.extent).toBeNull();

		const searchResult2 = new SearchResult('id1', 'label1', 'labelFormated1',  SearchResultTypes.GEORESOURCE, [0, 0], [0, 0, 1, 1]);
		expect(searchResult2.extent).toEqual([0, 0, 1, 1]);

		const searchResult3 = new SearchResult(undefined, 'label1', 'labelFormated1',  SearchResultTypes.GEORESOURCE);
		expect(searchResult3.id).toBeNull();
	});
});

