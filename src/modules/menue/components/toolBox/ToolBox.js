import { html } from 'lit-html';
import { BaElement } from '../../../BaElement';
import css from './toolBox.css';
import { toggleToolBox } from '../../store/toolBox.action';
import { $injector } from '../../../../injection';


/**
 * Container for Tools 
 *  
 * @class
 * @author alsturm
 */
export class ToolBox extends BaElement {

	constructor() {
		super();
		const { EnvironmentService } = $injector.inject('EnvironmentService');
		this._environmentService = EnvironmentService;
		this._portrait = false;
		this._minWidth = false;
	}

	initialize() {

		//MediaQuery for 'orientation'
		const mediaQuery = window.matchMedia('(orientation: portrait)');
		const handleOrientationChange = (e) => {
			this._portrait = e.matches;
			//trigger a re-render
			this.render();
		};
		mediaQuery.addEventListener('change', handleOrientationChange);
		//initial set of local state
		handleOrientationChange(mediaQuery);


		//MediaQuery for 'min-width'
		const mediaQueryMinWidth = window.matchMedia('(min-width: 80em)');
		const handleMinWidthChange = (e) => {
			this._minWidth = e.matches;
			//trigger a re-render
			this.render();
		};
		mediaQueryMinWidth.addEventListener('change', handleMinWidthChange);
		//initial set of local state
		handleMinWidthChange(mediaQueryMinWidth);
	}

	/**
	 * @override
	 */
	createView() {

		const { open } = this._state;

		const getOrientationClass = () => {
			return this._portrait ? 'portrait' : 'landscape';
		};

		const getMinWidthClass = () => {
			return this._minWidth ?  'is-desktop'  : 'is-tablet';
		};

		const getOverlayClass = () => {
			return open ? 'is-open' : '';
		};

		return html`
			<style>${css}</style>		
			<div class="${getOrientationClass()} ${getMinWidthClass()}">  
				<button  @click="${toggleToolBox}"  class="action-button">
					<div class="action-button__icon">
					</div>
				</button>
				<div class="tool-box ${getOverlayClass()}">    		
					<div class="tool-box__button">
						<div class="tool-box__button_icon pencil">							
						</div>
						<div class="tool-box__button-text">
							Messen
						</div>  
					</div>  				               
					<div  class="tool-box__button">
						<div class="tool-box__button_icon share">							
						</div>
						<div class="tool-box__button-text">
							Teilen
						</div>  
					</div>  				               				               				 				           					 				               				               				 				            				               				               				 				           
				</div>		
			</div>		
		`;
	}

	isRenderingSkipped() {
		return this._environmentService.isEmbedded();
	}

	/**
	 * @override
	 * @param {Object} store 
	 */
	extractState(store) {
		const { toolBox: { open } } = store;
		return { open };
	}

	static get tag() {
		return 'ba-tool-box';
	}
}
