import { html } from 'lit-html';
import { BaElement } from '../../../BaElement';
import css from './contentPanel.css';
import { toggleContentPanel } from '../../store/contentPanel.action';
import { $injector } from '../../../../injection';

/**
 *  
 * @class
 * @author alsturm
 */
export class ContentPanel extends BaElement {

	constructor() {
		super();
		const { EnvironmentService } = $injector.inject('EnvironmentService');
		this._environmentService = EnvironmentService;
		this._portrait = false;
		this._menueButtonLocked = false;
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

		// const getTitle = () => {
		// 	const { contentPanelIsOpen } = this._state;
		// 	return contentPanelIsOpen ? 'Close menue' : 'Open menue';
		// };


		// const toggleContentPanelGuarded = () => {

		// 	if (!this._menueButtonLocked) {
		// 		this._menueButtonLocked = true;
		// 		toggleContentPanel();
		// 		window.setTimeout(() => this._menueButtonLocked = false, Header.menueButtonLockDuration);
		// 	}
		// };


		const { open } = this._state;

		const getOrientationClass = () => {
			return this._portrait ? 'portrait' : 'landscape';
		};

		const getMinWidthClass = () => {
			return this._minWidth ? 'is-desktop' : 'is-tablet';
		};


		const getOverlayClass = () => {
			return open ? 'is-open' : '';
		};

		return html`
			<style>${css}</style>
			<div class="${getOrientationClass()} ${getMinWidthClass()}">
				<div class="content-panel ${getOverlayClass()}">            
					<button @click="${toggleContentPanel}" class="content-panel__close-button">
					<span class='arrow'></span>	
					</button>	
					<div class='content-panel__container'>
					<ul class="ba-list">
					<li class="ba-list-item  ba-list-item__header">
					<span class="ba-list-item__text ">
						<span class="ba-list-item__primary-text">
							Demo Content
						</span>
					</span>
				</li>
   
    <li class="ba-list-item">
        <span class="ba-list-item__pre">
            <span class="ba-list-item__icon">
            </span>
        </span>
        <span class="ba-list-item__text">
            <span class="ba-list-item__primary-text">
                Freizeit in Bayern
            </span>              
        </span>
    </li>
    <li class="ba-list-item">
        <span class="ba-list-item__pre">
            <span class="ba-list-item__icon">
            </span>
        </span>
        <span class="ba-list-item__text">
            <span class="ba-list-item__primary-text">
                Freizeit in Bayern
            </span>              
        </span>
    </li>
    <li class="ba-list-item">
        <span class="ba-list-item__pre">
            <span class="ba-list-item__icon">
            </span>
        </span>
        <span class="ba-list-item__text">
            <span class="ba-list-item__primary-text">
                Freizeit in Bayern
            </span>              
        </span>
    </li>          
    <li  class="ba-list-item">
        <span class="ba-list-item__text ">
            <span class="ba-list-item__primary-text">
                BayernAtlas-plus
            </span>
        </span>
    </li>
    <li  class="ba-list-item">
        <span class="ba-list-item__text ">
            <span class="ba-list-item__primary-text">
                Hilfe
            </span>
        </span>
    </li>
    <li  class="ba-list-item">
        <span class="ba-list-item__text ">
            <span class="ba-list-item__primary-text">
                Legende
            </span>
        </span>
    </li>
    <li class="ba-list-item  ba-list-item__header">
        <span class="ba-list-item__text ">
            <span class="ba-list-item__primary-text">
                weitere Links
            </span>
        </span>
    </li>
    <li class="ba-list-item">
        <span class="ba-list-item__text divider">
            <span class="ba-list-item__primary-text">
                Geoportal Bayern
            </span>
            <span class="ba-list-item__secondary-text">
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr
            </span>
        </span>
    </li>             
    <li class="ba-list-item">
        <span class="ba-list-item__text divider">
            <span class="ba-list-item__primary-text">
                Geodaten bestellen
            </span>
            <span class="ba-list-item__secondary-text">
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr
            </span>
        </span>
    </li>             
    <li class="ba-list-item">
        <span class="ba-list-item__text divider">
            <span class="ba-list-item__primary-text">
                weitere Portale
            </span>
            <span class="ba-list-item__secondary-text">
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr
            </span>
        </span>
    </li>             
</ul>
					
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
		const { contentPanel: { open } } = store;
		return { open };
	}

	static get tag() {
		return 'ba-content-panel';
	}
}
{/* <ul class="ba-list">
				<li  class="ba-list-item">
					<span class="ba-list-item__text ">
						<span class="ba-list-item__primary-text">
							BayernAtlas-plus
						</span>
					</span>
				</li>
				<li  class="ba-list-item">
					<span class="ba-list-item__text ">
						<span class="ba-list-item__primary-text">
							Hilfe
						</span>
					</span>
				</li>
				<li  class="ba-list-item">
					<span class="ba-list-item__text ">
						<span class="ba-list-item__primary-text">
							Legende
						</span>
					</span>
				</li>
				<li  class="ba-list-item">
					<span class="ba-list-item__text ">
						<span class="ba-list-item__primary-text">
							Vollbild
						</span>
					</span>
				</li>
				<li  class="ba-list-item">
					<span class="ba-list-item__text ">
						<span class="ba-list-item__primary-text">
							Dark Mode
						</span>
					</span>
					<span class="ba-list-item__after">
						<label class="switch">
							<input type="checkbox">
							<span class="slider round"></span>
						</label>
					</span>
				</li>
				<li  class="ba-list-item">
					<span class="ba-list-item__text ">
						<span class="ba-list-item__primary-text">
							Feedback zur Karte 
						</span>
					</span>
				</li>
				<li  class="ba-list-item">
					<span class="ba-list-item__text ">
						<span class="ba-list-item__primary-text">
							Datenschutzerklärung
						</span>
					</span>
				</li>
				<li class="ba-list-item">
					<span class="ba-list-item__text divider">
						<span class="ba-list-item__primary-text">
							Nutzungsbedingungen
						</span>
					</span>
				</li>

				<li class="ba-list-item  ba-list-item__header">
					<span class="ba-list-item__text ">
						<span class="ba-list-item__primary-text">
							weitere Links
						</span>
					</span>
				</li>




				<li class="ba-list-item">
					<!--                        <span class="ba-list-item__pre">
												<span class="ba-list-item__image">
												</span>
											</span>-->
					<span class="ba-list-item__text divider">
						<span class="ba-list-item__primary-text">
							Geoportal Bayern
						</span>
						<span class="ba-list-item__secondary-text">
							Lorem ipsum dolor sit amet, consetetur sadipscing elitr
						</span>
					</span>
				</li>             
				<li class="ba-list-item">
					<!--                        <span class="ba-list-item__pre">
												<span class="ba-list-item__image">
												</span>
											</span>-->
					<span class="ba-list-item__text divider">
						<span class="ba-list-item__primary-text">
							Geodaten bestellen
						</span>
						<span class="ba-list-item__secondary-text">
							Lorem ipsum dolor sit amet, consetetur sadipscing elitr
						</span>
					</span>
				</li>             
				<li class="ba-list-item">
					<!--                        <span class="ba-list-item__pre">
												<span class="ba-list-item__image">
												</span>
											</span>-->
					<span class="ba-list-item__text divider">
						<span class="ba-list-item__primary-text">
							weitere Portale
						</span>
						<span class="ba-list-item__secondary-text">
							Lorem ipsum dolor sit amet, consetetur sadipscing elitr
						</span>
					</span>
				</li>             
			</ul> */}