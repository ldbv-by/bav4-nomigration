/**
 * @module service/provider
 */
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';

/**
 * A function that registers proj4 definitions. 
 *
 * @typedef {function(coordinate) : (Promise<number>)} proj4Provider
 */


/**
 * Registers BVV specific proj4 definitions.
 * @function
 */
export const loadBvvDefinitions = () => {
	proj4.defs('EPSG:25832', '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +axis=neu');
	proj4.defs('EPSG:25833', '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +axis=neu');
	register(proj4);
};