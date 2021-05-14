/**
 * Action creators to update the current topic
 * @module topics/action
 */
import { TOPIC_CHANGED, TOPIC_RESOURCES_READY } from './topics.reducer';
import { $injector } from '../../injection';


const getStore = () => {
	const { StoreService: storeService } = $injector.inject('StoreService');
	return storeService.getStore();
};


/**
  * Sets the current topic.
  * @param {string} id id of the current topic
  * @function
  */
export const setCurrent = (id) => {
	getStore().dispatch({
		type: TOPIC_CHANGED,
		payload: id
	});
};

/**
 * Marks the topics state as ready. That means all needed resources are available, for example the GeoResourceService has been initialized.
 * @function
 */
export const setReady = () => {
	getStore().dispatch({
		type: TOPIC_RESOURCES_READY,
		payload: true
	});
};