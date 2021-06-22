import { html } from 'lit-html';
import { BaElement } from '../../BaElement';

export class NoState extends BaElement {


	createView() {
		const data = 'Hello World';
		return html`<div>${data}</div>`;
	}


	static get tag() {
		return 'guide-no-state';
	}
}