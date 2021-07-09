import { mainMenuReducer } from '../../../../../../../src/modules/menu/store/mainMenu.reducer';
import { LocationResultItem } from '../../../../../../../src/modules/search/components/menu/types/location/LocationResultItem';
import { SearchResult, SearchResultTypes } from '../../../../../../../src/modules/search/services/domain/searchResult';
import { HightlightFeatureTypes } from '../../../../../../../src/store/highlight/highlight.action';
import { highlightReducer } from '../../../../../../../src/store/highlight/highlight.reducer';
import { createNoInitialStateMediaReducer } from '../../../../../../../src/store/media/media.reducer';
import { positionReducer } from '../../../../../../../src/store/position/position.reducer';
import { TestUtils } from '../../../../../../test-utils.js';
window.customElements.define(LocationResultItem.tag, LocationResultItem);


describe('LocationResultItem', () => {

	let store;

	const setup = (state = {}) => {

		const initialState = {
			media: {
				portrait: false,
			},
			...state
		};

		store = TestUtils.setupStoreAndDi(initialState, {
			highlight: highlightReducer,
			position: positionReducer,
			mainMenu: mainMenuReducer,
			media: createNoInitialStateMediaReducer()
		});

		return TestUtils.render(LocationResultItem.tag);
	};

	describe('static properties', () => {

		it('_maxZoomValue', async () => {

			expect(LocationResultItem._maxZoomLevel).toBe(19);
		});
	});

	describe('when initialized', () => {

		it('renders nothing when no data available', async () => {
			const element = await setup();
			
			expect(element.shadowRoot.children.length).toBe(0);
		});

		it('renders the view', async () => {
			const data = new SearchResult('id', 'label', 'labelFormated', SearchResultTypes.LOCATION);
			const element = await setup();

			element.data = data;

			expect(element.shadowRoot.querySelector('li').innerText).toBe('labelFormated');
		});
	});

	describe('events', () => {

		describe('on mouse enter', () => {

			it('sets a temporary highlight feature', async () => {
				const coordinate = [21, 42];
				const id = 'id';
				const data = new SearchResult(id, 'label', 'labelFormated', SearchResultTypes.LOCATION, coordinate);
				const element = await setup();
				element.data = data;

				const target = element.shadowRoot.querySelector('li');
				target.dispatchEvent(new Event('mouseenter'));

				expect(store.getState().highlight.temporaryFeature.data.coordinate).toEqual(coordinate);
				expect(store.getState().highlight.temporaryFeature.type).toBe(HightlightFeatureTypes.DEFAULT);
			});
		});

		describe('on mouse leave', () => {

			it('removes a temporary highlight feature', async () => {
				const coordinate = [21, 42];
				const id = 'id';
				const data = new SearchResult(id, 'label', 'labelFormated', SearchResultTypes.LOCATION, coordinate);
				const element = await setup({
					highlight: {
						temporaryFeature: { data: coordinate }
					}
				});
				element.data = data;


				const target = element.shadowRoot.querySelector('li');
				target.dispatchEvent(new Event('mouseleave'));

				expect(store.getState().highlight.temporaryFeature).toBeNull();
			});
		});

		describe('on click', () => {

			const previousCoordinate = [1, 2];
			const coordinate = [21, 42];
			const extent = [0, 1, 2, 3];
			const id = 'id';

			const setupOnClickTests = async (portraitOrientation, extent = null) => {

				const data = new SearchResult(id, 'label', 'labelFormated', SearchResultTypes.LOCATION, coordinate, extent);
				const element = await setup({
					highlight: {
						feature: { data: coordinate },
						temporaryFeature: { data: previousCoordinate }
					},
					mainMenu: {
						open: true
					},
					media: {
						portrait: portraitOrientation,
					}
				});
				element.data = data;
				return element;
			};


			describe('result has NO extent', () => {

				it('removes the temporary highlight feature and set the permanent highlight feature', async () => {
					const element = await setupOnClickTests();

					const target = element.shadowRoot.querySelector('li');
					target.click();

					expect(store.getState().highlight.temporaryFeature).toBeNull();
					expect(store.getState().highlight.feature.data.coordinate).toEqual(coordinate);
					expect(store.getState().highlight.feature.type).toBe(HightlightFeatureTypes.DEFAULT);
				});

				it('fits the map by a coordinate', async () => {
					const element = await setupOnClickTests();

					const target = element.shadowRoot.querySelector('li');
					target.click();

					expect(store.getState().position.fitRequest.payload.extent).toEqual([...coordinate, ...coordinate]);
					expect(store.getState().position.fitRequest.payload.options.maxZoom).toBe(LocationResultItem._maxZoomLevel);
				});


			});

			describe('result has an extent', () => {

				it('removes the temporary highlight feature and sets NO highlight feature when we have an extent', async () => {
					const element = await setupOnClickTests(false, extent);

					const target = element.shadowRoot.querySelector('li');
					target.click();

					expect(store.getState().highlight.temporaryFeature).toBeNull();
					expect(store.getState().highlight.feature).toBeNull();
				});

				it('fits the map by an extent', async () => {
					const element = await setupOnClickTests(false, extent);

					const target = element.shadowRoot.querySelector('li');
					target.click();

					expect(store.getState().position.fitRequest.payload.extent).toEqual(extent);
					expect(store.getState().position.fitRequest.payload.options.maxZoom).toBe(LocationResultItem._maxZoomLevel);
				});

			});

			it('closes the main menu in portrait orientation', async () => {
				const element = await setupOnClickTests(true);

				const target = element.shadowRoot.querySelector('li');
				target.click();

				expect(store.getState().mainMenu.open).toBeFalse();
			});
		});
	});
});