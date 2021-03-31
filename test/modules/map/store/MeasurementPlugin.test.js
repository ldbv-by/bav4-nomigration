import { measurementReducer } from '../../../../src/modules/map/store/measurement.reducer';
import { MeasurementPlugin, MEASUREMENT_LAYER_ID } from '../../../../src/modules/map/store/MeasurementPlugin';

import { activate, deactivate } from '../../../../src/modules/map/store/measurement.action';
import { TestUtils } from '../../../test-utils.js';
import { layersReducer } from '../../../../src/modules/map/store/layers.reducer';



describe('MeasurementPlugin', () => {

	const setup = (state) => {
		const store = TestUtils.setupStoreAndDi(state, {
			measurement: measurementReducer,
			layers: layersReducer,
		});
		return store;
	};


	it('adds or removes the measurement layer', async () => {
		const store = setup();
		const instanceUnderTest = new MeasurementPlugin();
		await instanceUnderTest.register(store);
		
		activate();

		expect(store.getState().layers.active.length).toBe(1);
		expect(store.getState().layers.active[0].id).toBe(MEASUREMENT_LAYER_ID);
		
		deactivate();
		
		expect(store.getState().layers.active.length).toBe(0);
	});
});