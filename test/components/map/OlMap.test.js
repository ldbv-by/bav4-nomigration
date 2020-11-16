/* eslint-disable no-undef */
import { OlMap } from '../../../src/components/map/OlMap';
import { fromLonLat } from 'ol/proj';
import { TestUtils } from '../../test-utils.js';
import mapReducer from '../../../src/components/map/store/olMap.reducer';
import { MapBrowserEvent,MapEvent } from 'ol';
import MapBrowserEventType from 'ol/MapBrowserEventType';
import MapEventType from 'ol/MapEventType';
import Event from 'ol/events/Event';

window.customElements.define(OlMap.tag, OlMap);


describe('OlMap', () => {

	const initialPosition = fromLonLat([11.57245, 48.14021]);
	
	let store;
	let element;

	beforeEach(async () => {

		const state = {
			map: {
				zoom: 10,
				position: initialPosition
			}
		};

		store = TestUtils.setupStoreAndDi(state, {
			map: mapReducer
		});

		element = await TestUtils.render(OlMap.tag);
	});

	function simulateMouseEvent(type, x, y, dragging) {
		const map = element.map;
		const eventType = type;

		const event = new Event(eventType);
		event.target = map.getViewport().firstChild;
		event.clientX = x;
		event.clientY = y;
		event.shiftKey = false;
		event.preventDefault = function () {};


		let mapEvent = new MapBrowserEvent(eventType, map, event);
		mapEvent.dragging = dragging ? dragging : false;
		map.dispatchEvent(mapEvent);
	}

	function simulateMapEvent(type) {
		const map = element.map;
		const mapEvent = new MapEvent(type, map, map.frameState);

		map.dispatchEvent(mapEvent);
	}

	describe('when initialized', () => {
		it('configures the map and adds a div which contains the ol-map', async () => {
			// nothing for arrange and act

			// assert
			expect(element.view.getZoom()).toBe(10);
			expect(element.view.getCenter()).toEqual(initialPosition);
			expect(element.querySelector('#ol-map')).toBeTruthy();
		});
	});


	describe('when clicked', () => {
		it('emits event', async () => {
			// arrange
			spyOn(element, 'emitEvent');

			// act
			simulateMouseEvent(MapBrowserEventType.SINGLECLICK, 0, 0);

			// assert
			expect(element.emitEvent).toHaveBeenCalledWith('map_clicked', null);
		});
	});

	describe('when map move', () => {
		it('change state from view properties', async () => {
			// arange
			const view = element.view;
			spyOn(view, 'getZoom');
			spyOn(view, 'getCenter');

			// act
			simulateMapEvent(MapEventType.MOVEEND);

			// assert
			expect(view.getZoom).toHaveBeenCalledTimes(1);
			expect(view.getCenter).toHaveBeenCalledTimes(1);
		});
	});

	describe('when pointer move', () => {
		it('pointer position store is updated', async () => {
			// arrange
			const map = element.map;
			const pointerPosition = ['foo', 'bar'];
			spyOn(map, 'getEventCoordinate').and.returnValue(pointerPosition);

			// act
			simulateMouseEvent(MapBrowserEventType.POINTERMOVE, 10, 0);

			// assert
			expect(store.getState().map.pointerPosition).toBe(pointerPosition);
		});
	});

	describe('when mouse is dragging', () => {
		it('do NOT store pointerPosition', async () => {
			// arrange
			const map = element.map;
			const pointerPosition = [99, 99];
			spyOn(map, 'getEventCoordinate').and.returnValue(pointerPosition);

			// act
			simulateMouseEvent(MapBrowserEventType.POINTERMOVE, 10, 0, true);

			// assert
			expect(store.getState().map.pointerPosition).toBeUndefined();
		});
	});
});