/* eslint-disable no-undef */

import { Header } from '../../../src/components/header/Header';
import { sidePanelReducer } from '../../../src/components/menue/sidePanel/store/sidePanel.reducer';
import { TestUtils } from '../../test-utils.js';
import { $injector } from '../../../src/injection';
import { OlCoordinateService } from '../../../src/utils/OlCoordinateService';

window.customElements.define(Header.tag, Header);

let store;


describe('Header', () => {

	const setup = () => {
		const state = {
			sidePanel: {
				open: false
			}
		};
		store = TestUtils.setupStoreAndDi(state, { sidePanel: sidePanelReducer });
		$injector
			.register('CoordinateService', OlCoordinateService);


		return TestUtils.render(Header.tag);
	};


	describe('when initialized', () => {
		it('adds header bar', async () => {
			const element = await setup();
			expect(element.shadowRoot.querySelector('.header')).toBeTruthy();
			expect(element.shadowRoot.querySelector('.toggle-side-panel')).toBeTruthy();
			expect(element.shadowRoot.querySelector('a').title).toBe('Open menue');
			expect(element.shadowRoot.querySelector('a').children[0].className).toBe('icon toggle-side-panel');
			expect(element.shadowRoot.querySelector('.ci-text')).toBeTruthy();
			expect(element.shadowRoot.querySelector('.ci-logo')).toBeTruthy();
			expect(element.shadowRoot.querySelector('ba-autocomplete-search')).toBeTruthy();

		});

	});

	describe('when menue button clicked', () => {
		beforeEach(function () {
			jasmine.clock().install();
		});

		afterEach(function () {
			jasmine.clock().uninstall();
		});

		it('it updates the store and title attribute', async () => {
			const element = await setup({ mobile: false });

			expect(element._menueButtonLocked).toBeFalse();

			expect(store.getState().sidePanel.open).toBe(false);
			element.shadowRoot.querySelector('.toggle-side-panel').click();
			expect(store.getState().sidePanel.open).toBe(true);
			expect(element._menueButtonLocked).toBeTrue();
			// expect(element.shadowRoot.querySelector('.content').children[0].title).toBe('Close menue');

			// we wait 500ms in order to have an unlocked menue button
			jasmine.clock().tick(500);
			expect(element._menueButtonLocked).toBeFalse();

			element.shadowRoot.querySelector('.toggle-side-panel').click();
			expect(store.getState().sidePanel.open).toBe(false);
			// expect(element.shadowRoot.querySelector('.content').children[0].title).toBe('Open menue');
		});
	});

});
