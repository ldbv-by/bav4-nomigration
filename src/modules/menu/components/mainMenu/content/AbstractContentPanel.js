import { html } from 'lit-html';
import { BaElement } from '../../../../BaElement';
import baElementCss from './../../../../baElement.css';
import contentPanelCss from './abstractContentPanel.css';

/**
 * Base class for all content panels of the main menu.
 * Just prepends common CSS classes.
 * @class
 * @author taulinger
 * @abstract
 */
export class AbstractContentPanel extends BaElement {

	constructor() {
		super();
		if (this.constructor === AbstractContentPanel) {
			// Abstract class can not be constructed.
			throw new TypeError('Can not construct abstract class.');
		}
	}

	/**
    * @override
    */
	defaultCss() {
		return html`
		<style>
            ${baElementCss}
		</style>
		<style>
		    ${contentPanelCss}
		</style>
		`;
	}
}