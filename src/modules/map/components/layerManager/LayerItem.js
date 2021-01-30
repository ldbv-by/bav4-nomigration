import { html } from 'lit-html';
import { BaElement } from '../../../BaElement';
import css from './layerItem.css';
import { $injector } from '../../../../injection';
import { classMap } from 'lit-html/directives/class-map.js';
import { modifyLayer } from './../../store/layers/layers.action';

export class LayerItem extends BaElement {

	constructor() {
		super();        
		const { TranslationService } = $injector.inject('TranslationService');
		this._translationService = TranslationService;
		this._onOpacityChanged = () => { };
		this._opacity = parseInt(this.getAttribute('opacity')) || 100;
		this._title = this.getAttribute('title') || '';
		this._draggable = this.getAttribute('draggable') === 'true';
		this._visible = this.getAttribute('visible') === 'true';
		this._onVisibilityChanged = () => {};
		this._collapsed = this.getAttribute('collapsed') === 'true';
		this._onCollapsed = () => { };       
		this._onMove = () => {}; 
	}
    
    
	/**
	 * @override
	 */
	createView() {
		const translate = (key) => this._translationService.translate(key);
        
		
		const getCollapseTitle = () => {				
			return  translate('layer_item_collapse');
		};
        
		const changeOpacity = (event) => {
			//state store change -> implicit call of #render()
			modifyLayer(this._layer.id, { opacity: parseInt(event.target.value) / 100 });
		};
		const toggleVisibility = (event) => {
			//state store change -> implicit call of #render()
			modifyLayer(this._layer.id, { visible: event.detail.checked });
		};
		const toggleCollapse = () => {
			//change of local state -> explicit call of #render() 
			this._layer.collapsed = !this._layer.collapsed ;
			this.render();
		};
		const increaseIndex = () => {
			//state store change -> implicit call of #render()
			modifyLayer(this._layer.id, { zIndex: this._layer.zIndex + 1 });
		};
		const decreaseIndex = () => {
			//state store change -> implicit call of #render()
			modifyLayer(this._layer.id, { zIndex: this._layer.zIndex - 1 });
		};

		const getSlider = () => {
			
			const onPreventDragging = (e) => {
				e.preventDefault();
				e.stopPropagation();
			};

			return html`<div class='slider-container'>
				<input  
					type="range" 
					min="1" 
					max="100" 
					value=${this._opacity} 
					class="opacity-slider" 
					draggable=${this._draggable} 
					@input=${changeOpacity} 
					@dragstart=${onPreventDragging}
					id="opacityRange"></div>`;
		};
        
        
		const getVisibilityTitle = () => {
			return this.title + ' - ' + translate('layer_item_change_visibility');
		};
        
		const iconCollapseClass = {
			iconexpand:!this._layer.collapsed
		};
        
		const bodyCollapseClass = {
			expand:!this._layer.collapsed
		};
        
		return html`
        <style>${css}</style>
        <div class='layer'>
            <div class='layer-header'>
                <div class='collapse-button'>
                    <a title="${getCollapseTitle()}" @click="${toggleCollapse}">
                        <i class='icon chevron ${classMap(iconCollapseClass)}'></i>
                    </a>
                </div>
                <span class='layer-label'>${this.title}</span>
                <ba-toggle title='${getVisibilityTitle()}' checked=${this._visible} @toggle=${toggleVisibility}></ba-toggle>
            </div>
			<div class='layer-body ${classMap(bodyCollapseClass)}'>
			
				${getSlider()}
				<div class='layer-move-buttons'> 
					<a class='button' title="move up" @click="${increaseIndex}">
						<i class='arrow-icon arrow-up'></i>
					</a>
					<a class='button' title="move down" @click="${decreaseIndex}">
						<i class='arrow-icon arrow-down'></i>
					</a>
				</div>
            </div>
        </div>`;
	}

	static get tag() {
		return 'ba-layer-item';
	}

	set layer(value) {
		this._layer = value;
		this.render();
	}
}