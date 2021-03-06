export const provide = (lang) => {
	switch (lang) {

		case 'en':
			return {
				//the first part of the snake_case key should be the name of the related module
				map_contextMenu_header: 'Location',					
				map_contextMenu_close_button: 'Close',
				map_contextMenuContent_altitude_label: 'Alt.',	
				map_contextMenuContent_community_label: 'Community',
				map_contextMenuContent_district_label: 'District',
				map_contextMenuContent_copy_icon: 'Copy to clipboard'				
			};
			
		case 'de':
			return {
				//the first part of the snake_case key should be the name of the related module
				map_contextMenu_header: 'Position',								
				map_contextMenu_close_button: 'Schließen',
				map_contextMenuContent_altitude_label: 'Höhe',
				map_contextMenuContent_community_label: 'Gemeinde',
				map_contextMenuContent_district_label: 'Gemarkung',
				map_contextMenuContent_copy_icon: 'In die Zwischenablage kopieren'		
			};

		default:
			return {};
	}
};