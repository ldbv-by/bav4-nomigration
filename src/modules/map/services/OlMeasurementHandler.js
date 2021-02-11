import Draw from 'ol/interaction/Draw';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Fill, Stroke, Style } from 'ol/style';
import { unByKey } from 'ol/Observable';
import { LineString, Polygon, Circle, LinearRing } from 'ol/geom';
import Overlay from 'ol/Overlay';
import { getLength } from 'ol/sphere';
import { $injector } from '../../../injection';
import { OlLayerHandler } from '../components/olMap/handler/OlLayerHandler';


const ZPOLYGON = 10;
const ZLINE = 20;

//todo: find a better place....move to utils
export const getGeometryLength = (geometry) => {
	let lineString;
	if(geometry instanceof LineString) {
		lineString = geometry;
	}
	else if(geometry instanceof LinearRing) {
		lineString = new LineString(geometry.getCoordinates());
	}
	else if(geometry instanceof Polygon) {
		lineString = new LineString(geometry.getLinearRing(0).getCoordinates());
	}	
	
	if(lineString) {
		return lineString.getLength();
	}
	return 0;
};


//todo: find a better place....move to utils
export const canShowAzimuthCircle = (geometry) => {
	if(geometry instanceof LineString) {
		const coords = geometry.getCoordinates();
		if(coords.length === 2 || 
			(coords.length === 3 && coords[1][0] === coords[2][0] && coords[1][1] === coords[2][1])) {
			return true;
		}
	}
	return false;
};

//todo: find a better place....maybe StyleService
export const measureStyleFunction = (feature) => {
	
	const color = [255, 0, 0];
	const stroke = new Stroke({
		color:color.concat([1]),
		width:1
	});

	const dashedStroke = new Stroke({
		color:color.concat([1]),
		width:3,
		lineDash:[8]
	});
	
	const zIndex = (feature.getGeometry() instanceof LineString) ?	ZLINE : ZPOLYGON;

	const styles = [
		new Style({
			fill: new Fill({ 
				color:color.concat([0.4]) 
			}),
			stroke:dashedStroke,
			zIndex:zIndex
		}),
		new Style({
			stroke:stroke,
			geometry: feature => {
				
				if(canShowAzimuthCircle(feature.getGeometry())) {					
					const coords = feature.getGeometry().getCoordinates();
					const radius = getGeometryLength(feature.getGeometry());
					const circle = new Circle(coords[0], radius);
					return circle;
				}
			},
			zIndex:0
		})];

	return styles;
};
export class OlMeasurementHandler extends OlLayerHandler {
	//this handler could be statefull
	constructor() {
		super();
		const { TranslationService } = $injector.inject('TranslationService');
		this._translationService = TranslationService;
		this._vectorLayer = null;
		this._draw = false;			
		this._activeSketch = null;	
		this._measureTooltip;		
		this._helpTooltip;
		this._overlays = [];
	}

	/**
	 * Activates the Handler.
	 * @override
	 */	
	activate(olMap) {
		const prepareInteraction = () => {
			const source = new VectorSource({ wrapX: false });	
			const layer = new VectorLayer({
				source: source,
				style: measureStyleFunction				
			});
			return layer;
		};

		const prepareHelp = () => {		
			const overlayOptions = { offset: [15, 0], positioning: 'center-left' };
			const styleClasses = ['ol-tooltip', 'hidden'];
			return this._createOverlay(styleClasses, overlayOptions);			
		};

		const pointerMoveHandler = (event) => {
			const translate = (key) => this._translationService.translate(key);
			const continuePolygonMsg = translate('draw_measure_continue_polygon');
			const continueLineMsg = translate('draw_measure_continue_line');

			if (event.dragging) {
				return;
			}
			/** @type {string} */
			let helpMsg =  translate('draw_measure_start');

			if (this._activeSketch) {
				var geom = this._activeSketch.getGeometry();
				if (geom instanceof Polygon) {
					helpMsg = continuePolygonMsg;
				}
				else if (geom instanceof LineString) {
					helpMsg = continueLineMsg;
				}
			}
			
			const helpTooltipElement = this._helpTooltip.getElement();
			helpTooltipElement.innerHTML = helpMsg;
			helpTooltipElement.classList.remove('hidden');
			this._helpTooltip.setPosition(event.coordinate);
		};

		if(this._draw === false) {
			this._vectorLayer = prepareInteraction();
			this._helpTooltip = prepareHelp();
			const source = this._vectorLayer.getSource();			
			this._draw = this._createInteraction(source);	

			this._addOverlayToMap(olMap, this._helpTooltip);			
			this._pointeMoveListener = olMap.on('pointermove', pointerMoveHandler);

			olMap.addInteraction(this._draw);	
		}		
		return this._vectorLayer;
	}	

	/**
	 *  @override
	 *  @param {Map} olMap
	 */
	deactivate(olMap) {
		//use the map to unregister event listener, interactions, etc
		//olLayer currently undefined, will be fixed later		
		olMap.removeInteraction(this._draw);
		this._overlays.forEach(o => olMap.removeOverlay(o));
		unByKey(this._pointeMoveListener);
		this._helpTooltip = null;
		this._draw = false;
	}	

	_addOverlayToMap(map, overlay) {
		this._overlays.push(overlay);
		map.addOverlay(overlay);
	}

	_createInteraction(source) {		
		const draw = new Draw({
			source: source,
			type: 'LineString',
			style: measureStyleFunction
		});						

		const formatLength = (line) => {
			const length = getLength(line);
			let output;
			if (length > 100) {
				output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
			}
			else {
				output = Math.round(length * 100) / 100 + ' ' + 'm';
			}
			return output;
		};
		const updateMeasureTooltip = (content, coordinate) => {
			this._measureTooltip.getElement().innerHTML = content;
			this._measureTooltip.setPosition(coordinate);
		};
		let listener;
		
		const finishMeasurementTooltip = () => {			
			this._measureTooltip.getElement().className = 'ol-tooltip ol-tooltip-static';
			this._measureTooltip.setOffset([0, -7]);		
			this._activeSketch = null;						
			unByKey(listener);
		};
		
		draw.on('drawstart', event =>  {	
			this._measureTooltip = this._createMeasureTooltip();			
			let tooltipCoord = event.coordinate;	
			this._activeSketch = event.feature;

			listener = event.feature.getGeometry().on('change', event => {
				const geom = event.target;
				const output = formatLength(geom);
				tooltipCoord = geom.getLastCoordinate();
				updateMeasureTooltip(output, tooltipCoord);
			});
			const map = draw.getMap();
			if(map) {
				this._addOverlayToMap(map, this._measureTooltip);				
			}			
		});

		draw.on('drawend', () => finishMeasurementTooltip());

		return draw;
	}


	/**
	 * Creates a new measure tooltip
	 */
	_createMeasureTooltip() {	
		const overlayOptions = { offset: [0, -15], positioning: 'bottom-center' };
		const styleClasses = ['ol-tooltip', 'ol-tooltip-measure'];
		return this._createOverlay(styleClasses, overlayOptions);
	}

	_createOverlay(styleClasses = [], overlayOptions = {}) {
		const contentElement = document.createElement('div');
		styleClasses.forEach(styleClass => contentElement.classList.add(styleClass));
		const overlay = new Overlay({ ...overlayOptions, element:contentElement });
		return overlay;
	}
}