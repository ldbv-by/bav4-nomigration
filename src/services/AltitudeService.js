import { loadBvvAltitude } from './provider/altitude.provider';
import { isCoordinate } from '../utils/checks';

/**
 * @class
 */
export class AltitudeService {

	/**
	 * 
	 * @param {altitudeProvider} [altitudeProvider=loadBvvAltitude] 
	 */
	constructor(altitudeProvider = loadBvvAltitude) {
		this._altitudeProvider = altitudeProvider;
	} 

	/**
     * 
     * @param {Coordinate} coordinate3857 
	 * @returns {Number} altitude
     */
	async getAltitude(coordinate3857) {
		if (!isCoordinate(coordinate3857)) {
			throw new TypeError('Parameter \'coordinate3857\' must be a coordinate');
		}
		try {
			const altitude = await this._altitudeProvider(coordinate3857);
			return altitude;
		}
		catch (e) {
			throw new Error('Could not load altitude from provider: ' + e.message);
		} 
	}
} 