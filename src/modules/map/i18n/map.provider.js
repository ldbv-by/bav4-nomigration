export const provide = (lang) => {
	switch (lang) {

		case 'en':
			return {
				//the first part of the snake_case key should be the name of the related module
				map_zoom_in_button: 'Zoom in',
				map_zoom_out_button: 'Zoom out',
			};

		case 'de':
			return {
				//the first part of the snake_case key should be the name of the related module
				map_zoom_in_button: 'Vergrößere Kartenausschnitt',
				map_zoom_out_button: 'Verkleinere Kartenausschnitt'
			};

		default:
			return {};
	}
};