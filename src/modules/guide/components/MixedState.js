import { html, nothing } from 'lit-html';
import { BaElement } from '../../BaElement';

export class MixedState extends BaElement {


	createView(state) {
		const { localData, globalData } = state;
		if (localData && globalData) {

			return html`<div>we have ${localData} and ${globalData}</div>`;
		}
		return nothing;
	}

	set localData(data) {
		this._localData = data;
		this.updateState();
	}

	extractState(globalState) {
		const { globalData } = globalState;
		const localData = this._localData;
		return { localData, globalData };
	}


	static get tag() {
		return 'guide-local-and-global-state';
	}
}