/* eslint-disable no-undef */

import { HeaderElement } from '../../../src/components/header/HeaderElement';
import uiReducer from '../../../src/store/ui/reducer';
import { TestUtils } from '../../test-utils.js';
window.customElements.define(HeaderElement.tag, HeaderElement);

let store;


describe('HeaderElement', () => {
	let element;

	beforeAll(() => {
		window.classUnderTest = HeaderElement.name;
	});

	afterAll(() => {
		window.classUnderTest = undefined;

	});


	beforeEach(async () => {

		const state = {
			ui: {
				sidePanel: {
					open: false
				}
			}
		};
		store = TestUtils.setupStoreAndDi(state, { ui: uiReducer });

		element = await TestUtils.render(HeaderElement.tag);
	});


	describe('when initialized', () => {
		it('adds header css class and a icon with title attribute', () => {
			expect(element.querySelector('.some')).toBeTruthy();
			expect(element.querySelector('.toggle-side-panel')).toBeTruthy();
			expect(element.querySelector('.some').children[0].title).toBe('Open menue');
		});

	});

	describe('when menue button clicked', () => {

		it('it updates the store andtitle attribute', () => {
			expect(store.getState().ui.sidePanel.open).toBe(false);
			element.querySelector('.toggle-side-panel').click();
			expect(store.getState().ui.sidePanel.open).toBe(true);
			expect(element.querySelector('.some').children[0].title).toBe('Close menue');
			element.querySelector('.toggle-side-panel').click();
			expect(store.getState().ui.sidePanel.open).toBe(false);
			expect(element.querySelector('.some').children[0].title).toBe('Open menue');
		});

	});

});
