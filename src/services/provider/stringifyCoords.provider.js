/**
 * @module service/provider
 */
import { createStringXY } from 'ol/coordinate';
import { $injector } from '../../injection';

/**
 * A function that returns a function which itsself takes a coordinate and returns a string representation.
 *
 * @typedef {function():(function(Coordinate) : (string))} stringifyCoordProvider
 */


/**
 * @function
 * @param {number} srid 
 * @param {object} options 
 * @returns {stringifyCoordProvider}
 */
export const defaultStringifyFunction = (srid, options = { digits: 3 }) => {
	return createStringXY(options.digits);
};

/**
 * @function
 * @param {number} srid 
 * @param {object} options 
 * @returns {stringifyCoordProvider}
 */
export const bvvStringifyFunction = (srid, options = {}) => {
	if (srid !== 4326) {
		return createStringUTM(srid, options.digits || 0);
	}
	return createStringXY(options.digits || 3);

};

const createStringUTM = (srid, digits) => {
	const { CoordinateService: coordinateService } = $injector.inject('CoordinateService');

	return (coordinate) => {
		const zoneNumber = (srid === 25832) ? '32' : '33';
		const zoneBand = determineUtmZoneBand(coordinateService.transform(coordinate, srid, 4326));

		const coord = createStringXY(digits)(coordinate).
			replace(/\B(?=(\d{3})+(?!\d))/g, '');
		return zoneNumber + zoneBand + ' ' + coord;
	};
};

const determineUtmZoneBand = (coord4326) => {
	if (coord4326[1] < 54 && coord4326[1] >= 48) {
		return 'U';
	}
	else if (coord4326[1] < 48 && coord4326[1] >= 42) {
		return 'T';
	}
	return '';
};