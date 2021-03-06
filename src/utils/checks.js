
/**
 * Checks if a value is a string (primitive or object).
 * @function
 * @param {*} val 
 * @returns {boolean} true if it is a string
 */
export const isString = (val) => {
	return typeof val === 'string' || val instanceof String;
};

/**
 * Checks if a value is a string (primitive or object).
 * @function
 * @param {*} val 
 * @param {boolean} [strict=true] false if strings representing a number should be allowed
 * @returns {boolean} true if it is a number
 */
export const isNumber = (val, strict = true) => {
	if (strict) {
		return val != null && !isString(val) && !isNaN(val);
	}
	return val !== null && !Number.isNaN(Number(val)) && val.length !== 0;
};

/**
 * Checks if a value is a {@link Coordinate}.
 * @function
 * @param {*} val 
 * @returns {boolean} true if it is a coordinate
 */
export const isCoordinate = (val) => {
	return Array.isArray(val) && val.length === 2 && isNumber(val[0]) && isNumber(val[1]);
};


/**
 * Checks if a value is a Promise.
 * @param {*} val
 * @returns boolean} true if it is a Promise
 */
export const isPromise = (val) => {
	return Boolean(val && typeof val.then === 'function');
};
