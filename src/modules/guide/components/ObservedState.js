import { html } from 'lit-html';
import { BaElement } from '../../BaElement';

export class ObservedState extends BaElement {

	//update the view on changes of a portion of state
	//also suitable for async updates

	// (1)
	initialize() {
		this.observe('data', () => {
			this.render();
		});
	}


	createView(state) {
		const { data, otherData } = state;
		return html`<div>${data} and ${otherData}</div>`;
	}


	onStateChanged() {
		//noop, our observer calls #render on state changes
	}


	extractState(globalState) {
		const { data } = globalState;
		return { data };
	}


	static get tag() {
		return 'guide-global-state';
	}
}