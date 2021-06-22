import { html } from 'lit-html';
import { BaElement } from '../../BaElement';

export class LocalState extends BaElement {

	constructor() {
		super();
		this._data = 'Hello World';
	}


	set data(data) {
		this._data = data;
		this.render();
	}


	createView() {
		return html`<div>${this._data}</div>`;
	}


	static get tag() {
		return 'guide-local-state';
	}
}