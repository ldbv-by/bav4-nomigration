export const ZOOM_CHANGED = 'position/zoom';
export const CENTER_CHANGED = 'position/center';
export const ZOOM_CENTER_CHANGED = 'position/zoom_center';
export const ZOOM_CENTER_ROTATION_CHANGED = 'position/zoom_center_rotation';
export const ROTATION_CHANGED = 'position/rotation';
export const LIVE_ROTATION_CHANGED = 'position/live_rotation';
export const FIT_REQUESTED = 'position/fit';


export const initialState = {
	zoom: 12,
	center: [1288239.2412306187, 6130212.561641981],
	rotation: 0,
	liveRotation: 0,
	fitRequest : null
};

export const positionReducer = (state = initialState, action) => {

	const { type, payload } = action;
	switch (type) {
		case ZOOM_CHANGED: {

			return {
				...state,
				zoom: payload

			};
		}
		case CENTER_CHANGED: {

			return {
				...state,
				center: payload
			};
		}
		case ZOOM_CENTER_CHANGED: {
			const { zoom, center } = payload;

			return {
				...state,
				zoom: zoom,
				center: center
			};
		}
		case ZOOM_CENTER_ROTATION_CHANGED: {
			const { zoom, center, rotation } = payload;

			return {
				...state,
				zoom: zoom,
				center: center,
				rotation: rotation
			};
		}
		case ROTATION_CHANGED: {

			return {
				...state,
				rotation: payload
			};
		}
		case LIVE_ROTATION_CHANGED: {

			return {
				...state,
				liveRotation: payload
			};
		}

		case FIT_REQUESTED: {

			return {
				...state,
				fitRequest: payload
			};
		}
	}

	return state;
};
