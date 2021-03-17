/* eslint-disable no-undef */

import { ToolBox } from '../../../../../src/modules/menue/components/toolBox/ToolBox';
import { toolBoxReducer } from '../../../../../src/modules/menue/store/toolBox.reducer';
import { toggleToolBox } from '../../../../../src/modules/menue/store/toolBox.action';
import { TestUtils } from '../../../../test-utils';
import { $injector } from '../../../../../src/injection';

window.customElements.define(ToolBox.tag, ToolBox);


describe('ToolBoxElement', () => {

	const setup = async (config = {}) => {

		const { embed = false } = config;

		const state = {
			toolBox: {
				open: true
			}
		};
		TestUtils.setupStoreAndDi(state, { toolBox: toolBoxReducer });
		$injector
			.registerSingleton('EnvironmentService', {
				isEmbedded: () => embed
			})
			.registerSingleton('SearchResultProviderService', { getGeoresourceSearchResultProvider: () => { } });
		return TestUtils.render(ToolBox.tag);
	};


	describe('when initialized', () => {
		it('adds a div which holds the toolbox', async () => {

			const element = await setup();
			expect(element.shadowRoot.querySelector('.tool-box.is-open')).toBeTruthy();
			expect(element.shadowRoot.querySelector('.action-button')).toBeTruthy();


		});

		it('it closes the toolbox', async () => {

			const element = await setup();
			expect(element.shadowRoot.querySelector('.tool-box.is-open')).toBeTruthy();
			toggleToolBox();
			expect(element.shadowRoot.querySelector('.tool-box.is-open')).toBeFalsy();

		});

		it('renders nothing when embedded', async () => {
			const element = await setup({ embed: true });
			expect(element.shadowRoot.children.length).toBe(0);
		});



		it('layouts for landscape', async () => {

			const matchMediaSpy = spyOn(window, 'matchMedia')
				//mock portrait
				.withArgs('(orientation: portrait)').and.returnValue(TestUtils.newMediaQueryList(false));
			const element = await setup();
			expect(element.shadowRoot.querySelector('.landscape')).toBeTruthy();
			expect(element.shadowRoot.querySelector('.tool-box')).toBeTruthy();
			expect(matchMediaSpy).toHaveBeenCalledTimes(1);
		});

		it('layouts for portrait', async () => {

			const matchMediaSpy = spyOn(window, 'matchMedia')
				//mock 
				.withArgs('(orientation: portrait)').and.returnValue(TestUtils.newMediaQueryList(true));
			const element = await setup();
			expect(element.shadowRoot.querySelector('.portrait')).toBeTruthy();
			expect(element.shadowRoot.querySelector('.tool-box')).toBeTruthy();
			expect(matchMediaSpy).toHaveBeenCalledTimes(1);
		});
	});
});