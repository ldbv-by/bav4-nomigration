import { html } from 'lit-html';
import { BaElement } from '../../../BaElement';
import css from './toolBar.css';
import { DrawToolContent } from '../../../toolbox/components/drawToolContent/DrawToolContent';
import { MeasureToolContent } from '../../../toolbox/components/measureToolContent/MeasureToolContent';
import { toggleToolBar } from '../../store/toolBar.action';
import { toggleToolContainer, setContainerContent, openToolContainer } from '../../../toolbox/store/toolContainer.action';
import { $injector } from '../../../../injection';


/**
 * Container for Tools 
 *  
 * @class
 * @author alsturm
 */
export class ToolBar extends BaElement {

	constructor() {
		super();

		const {
			EnvironmentService: environmentService,
			TranslationService: translationService
		}
			= $injector.inject('EnvironmentService', 'TranslationService');

		this._environmentService = environmentService;
		this._translationService = translationService;
		this._portrait = false;
		this._minWidth = false;
	}

	initialize() {

		const _window = this._environmentService.getWindow();
		//MediaQuery for 'orientation'
		const mediaQuery = _window.matchMedia('(orientation: portrait)');
		const handleOrientationChange = (e) => {
			this._portrait = e.matches;
			//trigger a re-render
			this.render();
		};
		mediaQuery.addEventListener('change', handleOrientationChange);
		//initial set of local state
		handleOrientationChange(mediaQuery);


		//MediaQuery for 'min-width'
		const mediaQueryMinWidth = _window.matchMedia('(min-width: 80em)');
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

		const { toolBar, toolContainer } = this._state;
		const toolBarOpen = toolBar.open;
		const activeToolId = toolContainer.contentId;
		const getOrientationClass = () => {
			return this._portrait ? 'is-portrait' : 'is-landscape';
		};

		const getMinWidthClass = () => {
			return this._minWidth ? 'is-desktop' : 'is-tablet';
		};

		const getOverlayClass = () => {
			return toolBarOpen ? 'is-open' : '';
		};

		const toggleTool = (toolId) => {
			setContainerContent(toolId);
			if (activeToolId === toolId) {
				toggleToolContainer();
			}
			else {
				openToolContainer();
			}
		};
		const toggleDrawTool = () => {
			const toolId = DrawToolContent.tag;
			toggleTool(toolId);
		};

		const toggleMeasureTool = () => {
			const toolId = MeasureToolContent.tag;
			toggleTool(toolId);
		};

		const translate = (key) => this._translationService.translate(key);

		return html`
			<style>${css}</style>		
			<div class="${getOrientationClass()} ${getMinWidthClass()}">  
				<button  @click="${toggleToolBar}"  class="action-button">
					<div class="action-button__icon">
					</div>
				</button>
				<div class="tool-bar ${getOverlayClass()}">    	
					<div  @click="${toggleMeasureTool}" class="tool-bar__button">
						<div class="tool-bar__button_icon measure">							
						</div>
						<div class="tool-bar__button-text">
							${translate('menu_toolbar_measure_button')}
						</div>  
					</div>  	
					<div  @click="${toggleDrawTool}" class="tool-bar__button">
						<div class="tool-bar__button_icon pencil">							
						</div>
						<div class="tool-bar__button-text">
							${translate('menu_toolbar_draw_button')}
						</div>  
					</div>  				               
					<div  class="tool-bar__button">
						<div class="tool-bar__button_icon share">							
						</div>
						<div class="tool-bar__button-text">
							${translate('menu_toolbar_share_button')}
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
	 * @param {Object} state 
	 */
	extractState(state) {
		const { toolBar, toolContainer } = state;
		return { toolBar: toolBar, toolContainer: toolContainer };
	}

	static get tag() {
		return 'ba-tool-bar';
	}
}