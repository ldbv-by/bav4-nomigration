import { html } from 'lit-html';
import BaElement from '../BaElement';
import { toggleSidePanel } from '../../store/ui/actions';
import './style.css';


/**
 * Container element for header stuff. 
 * @class
 * @author aul
 */
export class HeaderElement extends BaElement {


	createView() {

		const getTitle = () => {
			const { sidePanelIsOpen } = this.state;
			return sidePanelIsOpen ? 'Close menue' : 'Open menue';
		};

		return html`
			<div class="some">
				<a title="${getTitle()}" @click="${toggleSidePanel}">
					<span class="icon toggle-side-panel"></span>
				</a>
				<h3> BAv4 (#nomigration)</h3>
			</div>
		`;
	}

	/**
	 * 
	 * @param {@override} store 
	 */
	extractState(store) {
		const { ui: { sidePanel: { open } } } = store;
		return { sidePanelIsOpen: open };
	}

	static get tag() {
		return 'ba-header';
	}
}
