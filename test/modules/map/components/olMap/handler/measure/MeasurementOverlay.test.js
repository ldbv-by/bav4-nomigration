import { MeasurementOverlay, MeasurementOverlayTypes } from '../../../../../../../src/modules/map/components/olMap/handler/measure/MeasurementOverlay';
import { LineString, Polygon } from 'ol/geom';
import { $injector } from '../../../../../../../src/injection';
import { TestUtils } from '../../../../../../test-utils.js';

import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
window.customElements.define(MeasurementOverlay.tag, MeasurementOverlay);

describe('MeasurementOverlay', () => {

	beforeEach(async () => {
		TestUtils.setupStoreAndDi({});		
		// eslint-disable-next-line no-unused-vars
		$injector.registerSingleton('UnitsService', { formatDistance(distance, decimals) {
			return 'THE DISTANCE IN m';
		},
		// eslint-disable-next-line no-unused-vars
		formatArea(area, decimals) {
			return 'THE AREA IN m²';
		} });
		proj4.defs('EPSG:25832', '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +axis=neu');
		register(proj4);
	});
    
	const setup = async ( properties = {}) => {
		const element = await TestUtils.render(MeasurementOverlay.tag);

		// transform test-geometries from assumed default geodetic projection to default map-projection
		if (properties.geometry) {
			properties.geometry.transform('EPSG:25832', 'EPSG:3857');
		}
		for (const property in properties) {
			element[property] = properties[property];
		}
		return element;
	};


	describe('when initialized with type property', () => {
		it('renders the text view', async () => {
			const element = await setup();

			expect(element.type).toBe(MeasurementOverlayTypes.TEXT);
			expect(element.static).toBeFalse();
			expect(element.value).toBe('');			
		});

		it('renders the help view', async () => {
			const properties = { type:MeasurementOverlayTypes.HELP, value:'foo' };
			const element = await setup(properties);
			const div = element.shadowRoot.querySelector('div');

			expect(div.classList.contains('help')).toBeTrue();
			expect(div.classList.contains('floating')).toBeFalse();
			expect(div.classList.contains('static')).toBeFalse();
			expect(element.type).toBe(MeasurementOverlayTypes.HELP);			
			expect(element.static).toBeFalse();
			expect(element.value).toBe('foo');			
		});

		it('renders the distance view', async () => {
			const geodeticGeometry = new LineString([[0, 0], [1, 0]]);			
			const properties = { type:MeasurementOverlayTypes.DISTANCE, geometry:geodeticGeometry, projectionHints:{ fromProjection:'EPSG:3857', toProjection:'EPSG:25832' } };
			const element = await setup(properties);			
			const div = element.shadowRoot.querySelector('div');

			expect(div.classList.contains('distance')).toBeTrue();
			expect(div.classList.contains('floating')).toBeTrue();
			expect(element.type).toBe(MeasurementOverlayTypes.DISTANCE);			
			expect(element.static).toBeFalse();
			expect(div.innerText).toBe('90.00°/THE DISTANCE IN m');			
		});

		it('renders the area view', async () => {
			const geodeticGeometry = new Polygon([[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]]);
			const properties = { type:MeasurementOverlayTypes.AREA, 
				geometry:geodeticGeometry, 
				projectionHints:{ fromProjection:'EPSG:3857', toProjection:'EPSG:25832' } };
			const element = await setup(properties);			
			const div = element.shadowRoot.querySelector('div');

			expect(div.classList.contains('area')).toBeTrue();
			expect(div.classList.contains('floating')).toBeTrue();
			expect(element.type).toBe(MeasurementOverlayTypes.AREA);			
			expect(element.static).toBeFalse();
			expect(div.innerText).toBe('THE AREA IN m²');			
		});

		it('renders the distance-partition view', async () => {
			const geodeticGeometry = new LineString([[0, 0], [100, 0]]);
			const properties = {
				type:MeasurementOverlayTypes.DISTANCE_PARTITION, 
				geometry:geodeticGeometry, 
				value:0.1, 
				projectionHints:{ fromProjection:'EPSG:3857', toProjection:'EPSG:25832' }
			};
			const element = await setup(properties);
			const div = element.shadowRoot.querySelector('div');

			expect(div.classList.contains('partition')).toBeTrue();
			expect(div.classList.contains('floating')).toBeTrue();
			expect(element.type).toBe(MeasurementOverlayTypes.DISTANCE_PARTITION);			
			expect(element.static).toBeFalse();
			expect(div.innerText).toBe('THE DISTANCE IN m');			
		});

		it('renders the static distance view', async () => {
			const geodeticGeometry = new LineString([[0, 0], [1, 0]]);
			const properties = { type:MeasurementOverlayTypes.DISTANCE, geometry:geodeticGeometry, static:true, projectionHints:{ fromProjection:'EPSG:3857', toProjection:'EPSG:25832' } };
			const element = await setup(properties);			
			const div = element.shadowRoot.querySelector('div');

			expect(div.classList.contains('distance')).toBeTrue();
			expect(div.classList.contains('static')).toBeTrue();
			expect(div.classList.contains('floating')).toBeFalse();
			expect(element.type).toBe(MeasurementOverlayTypes.DISTANCE);			
			expect(div.innerText).toBe('90.00°/THE DISTANCE IN m');			
		});

		it('renders formatted distance', async () => {
			const geodeticGeometry = new LineString([[0, 0], [1, 0]]);
			const properties = { type:MeasurementOverlayTypes.DISTANCE, geometry:geodeticGeometry, projectionHints:{ fromProjection:'EPSG:3857', toProjection:'EPSG:25832' } };
			const element = await setup(properties);			
			const div = element.shadowRoot.querySelector('div');

			expect(div.innerText).toBe('90.00°/THE DISTANCE IN m');
		});

		it('renders formatted area', async () => {
			const geodeticGeometry = new Polygon([[[0, 0], [120, 0], [120, 120], [0, 120], [0, 0]]]);
			const properties = { type:MeasurementOverlayTypes.AREA, geometry:geodeticGeometry, projectionHints:{ fromProjection:'EPSG:3857', toProjection:'EPSG:25832' } };
			const element = await setup(properties);			
			const div = element.shadowRoot.querySelector('div');

			expect(div.classList.contains('area')).toBeTrue();
			expect(div.classList.contains('floating')).toBeTrue();
			expect(element.type).toBe(MeasurementOverlayTypes.AREA);			
			expect(element.static).toBeFalse();
			expect(div.innerText).toBe('THE AREA IN m²');			
		});
	});

	describe('when type changed', () => {
		it('renders the changed view', async () => {
		
			const element = await setup();			
			const div = element.shadowRoot.querySelector('div');

			expect(element.type).toBe(MeasurementOverlayTypes.TEXT);
			expect(element.static).toBeFalse();
			expect(element.value).toBe('');			

			element.type = MeasurementOverlayTypes.DISTANCE;

			expect(div.classList.contains('distance')).toBeTrue();
			expect(div.classList.contains('floating')).toBeTrue();
			expect(element.type).toBe(MeasurementOverlayTypes.DISTANCE);			
			expect(element.static).toBeFalse();
		});
	});
});