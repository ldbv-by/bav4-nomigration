/**
 * Action creators to activate/deactive the measurement tool
 * @module map/action
 */
import { ACTIVE_CHANGED, STATISTIC_CHANGED, MODE_CHANGED, RESET_REQUESTED, FINISH_REQUESTED, REMOVE_REQUESTED, LATEST_STORE_ID_CHANGED } from './measurement.reducer';
import { $injector } from '../../../injection';
import { EventLike } from '../../../utils/storeUtils';


const getStore = () => {
	const { StoreService: storeService } = $injector.inject('StoreService');
	return storeService.getStore();
};


/**
 * Activates the measurement tool.
 * @function
 */
export const activate = () => {
	getStore().dispatch({
		type: ACTIVE_CHANGED,
		payload: true
	});
};

/**
 * Deactivates the measurement tool.
 * @function
 */
export const deactivate = () => {
	getStore().dispatch({
		type: ACTIVE_CHANGED,
		payload: false
	});
};


/**
 * set the statistic of a measurement.
 * @function
 */
export const setStatistic = (stat) => {
	getStore().dispatch({
		type: STATISTIC_CHANGED,
		payload: stat
	});
};

/**
 * set the mode of a measurement.
 * @function
 */
export const setMode = (mode) => {
	getStore().dispatch({
		type: MODE_CHANGED,
		payload: mode
	});
};


/**
 * set the mode of a measurement.
 * @function
 */
export const setLatestStoreId = (storeId) => {
	getStore().dispatch({
		type: LATEST_STORE_ID_CHANGED,
		payload: storeId
	});
};



/**
 * set the reset request.
 * @function
 */
export const reset = () => {
	getStore().dispatch({
		type: RESET_REQUESTED,
		payload: new EventLike('reset')
	});
};


/**
 * set the reset request.
 * @function
 */
export const finish = () => {
	getStore().dispatch({
		type: FINISH_REQUESTED,
		payload: new EventLike('finish')
	});
};


/**
 * set the delete request.
 * @function
 */
export const remove = () => {
	getStore().dispatch({
		type: REMOVE_REQUESTED,
		payload: new EventLike('remove')
	});
};