import { html } from 'lit-html';
import { BaElement } from '../../BaElement';

export class GlobalState extends BaElement {


	createView(state) {
		const { data } = state;
		return html`<div>${data}</div>`;
	}


	extractState(globalState) {
		const { data } = globalState;
		return { data };
	}


	static get tag() {
		return 'guide-global-state';
	}

}