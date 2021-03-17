import { $injector } from '../../src/injection';
import { StoreService } from '../../src/services/StoreService';

describe('StoreService', () => {

	describe('constructor', () => {

		const measurementObserverMock = {
			register: () => { }
		};
		const geolocationObserverMock = {
			register: () => { }
		};
		const layersObserverMock = {
			register: () => { }
		};
		const positionObserverMock = {
			register() { }
		};
		const windowMock = {
			history: {
				replaceState() { }
			}
		};

		it('registers all reducers', () => {

			const instanceUnderTest = new StoreService();

			const store = instanceUnderTest.getStore();
			expect(store).toBeDefined();

			const reducerKeys = Object.keys(store.getState());
			expect(reducerKeys.length).toBe(11);
			expect(reducerKeys.includes('map')).toBeTrue();
			expect(reducerKeys.includes('pointer')).toBeTrue();
			expect(reducerKeys.includes('sidePanel')).toBeTrue();
			expect(reducerKeys.includes('contextMenue')).toBeTrue();
			expect(reducerKeys.includes('modal')).toBeTrue();
			expect(reducerKeys.includes('uiTheme')).toBeTrue();
			expect(reducerKeys.includes('layers')).toBeTrue();
			expect(reducerKeys.includes('mapContextMenu')).toBeTrue();
			expect(reducerKeys.includes('measurement')).toBeTrue();
			expect(reducerKeys.includes('geolocation')).toBeTrue();
		});

		it('registers all observers', () => {

			const measurementObserverSpy = spyOn(measurementObserverMock, 'register');
			const geolocationObserverSpy = spyOn(geolocationObserverMock, 'register');
			const layersObserverSpy = spyOn(layersObserverMock, 'register');
			const positionObserverSpy = spyOn(positionObserverMock, 'register');
			const instanceUnderTest = new StoreService();

			$injector
				.reset()
				.registerSingleton('MeasurementObserver', measurementObserverMock)
				.registerSingleton('GeolocationObserver', geolocationObserverMock)
				.registerSingleton('LayersObserver', layersObserverMock)
				.registerSingleton('PositionObserver', positionObserverMock)
				.registerSingleton('EnvironmentService', { getWindow: () => windowMock })
				.ready();

			const store = instanceUnderTest.getStore();
			expect(measurementObserverSpy).toHaveBeenCalledWith(store);
			expect(geolocationObserverSpy).toHaveBeenCalledWith(store);
			expect(layersObserverSpy).toHaveBeenCalledWith(store);
			expect(positionObserverSpy).toHaveBeenCalledWith(store);
		});

		it('removes all query params by calling #replaceState on history', (done) => {
			const replaceStateMock = spyOn(windowMock.history, 'replaceState');
			new StoreService();
			
			$injector
				.reset()
				.registerSingleton('MeasurementObserver', measurementObserverMock)
				.registerSingleton('GeolocationObserver', geolocationObserverMock)
				.registerSingleton('LayersObserver', layersObserverMock)
				.registerSingleton('PositionObserver', positionObserverMock)
				.registerSingleton('EnvironmentService', { getWindow: () => windowMock })
				.ready();

			setTimeout(() => {
				expect(replaceStateMock).toHaveBeenCalled();
				done();
			});
		});
	});
});