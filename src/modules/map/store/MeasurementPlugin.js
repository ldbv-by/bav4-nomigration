import { observe } from '../../../utils/storeUtils';
import { addLayer, removeLayer } from '../../../store/layers/layers.action';
import { BaPlugin } from '../../../store/BaPlugin';

/**
 * Id of the layer used for measurement interaction.  
 * LayerHandler of a map implementation will also use this id as their key.
 */
export const MEASUREMENT_LAYER_ID = 'measurement_layer';


/**
 * Id of the tool used for measurement interaction.  
 * Feature of a layer will also use this id as part their id.
 */
export const MEASUREMENT_TOOL_ID = 'measure';

/**
 * This plugin observes the 'active' property of the measurements store.
 * On changes, it adds a layer with a specific and constant id 
 * to the layers store or removes this layer from the store (see: {@link MEASUREMENT_LAYER_ID}).   
 * 
 * As a result of the change of the layers store, a map implementation will search for a handler registered for that id,
 * and, if found, will activate or deactivate this handler.
 * 
 * @class
 * @author taulinger
 */
export class MeasurementPlugin extends BaPlugin {


	/**
	 * @override
	 * @param {Store} store 
	 */
	async register(store) {

		const extract = (state) => {
			return state.measurement.active;

		};
		const onChange = (changedState) => {
			if (changedState) {
				addLayer(MEASUREMENT_LAYER_ID, { constraints: { hidden: true, alwaysTop: true } });
			}
			else {
				removeLayer(MEASUREMENT_LAYER_ID);
			}
		};

		observe(store, extract, onChange);
	}
}