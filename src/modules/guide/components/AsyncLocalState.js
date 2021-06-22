import { html, nothing } from 'lit-html';
import { BaElement } from '../../BaElement';

export class AsyncLocalState extends BaElement {

	constructor() {
		super();
		this._data = null;
	}


	async _getDataAsynchronously(id) {
		return `Hello World from ${id}`;
	}


	set id(id) {
		//we can't use await in a setter
		this._getDataAsynchronously(id)
			.then(data => {
				this._data = data;
				this.render();
			});
	}


	createView() {
		if (this._data) {
			return html`<div>${this._data}</div>`;
		}
		return nothing;
	}


	static get tag() {
		return 'guide-async-local-state';
	}

}