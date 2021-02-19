/* eslint-disable no-undef */
import { MapContextMenu } from '../../../../../src/modules/map/components/contextMenu/MapContextMenu';
import { initialState, mapContextMenuReducer } from '../../../../../src/modules/map/store/mapContextMenu.reducer';
import { TestUtils } from '../../../../test-utils.js';
import { close, open } from '../../../../../src/modules/map/store/mapContextMenu.action';
import { $injector } from '../../../../../src/injection';
window.customElements.define(MapContextMenu.tag, MapContextMenu);

describe('MapContextMenu', () => {

	const setup = (state = initialState) => {
		const mapContextMenuState = {
			mapContextMenu: state
		};

		TestUtils.setupStoreAndDi(mapContextMenuState, { mapContextMenu: mapContextMenuReducer });
		$injector
			.registerSingleton('TranslationService', { translate: (key) => key });
		return TestUtils.render(MapContextMenu.tag);
	};

	describe('when initialized', () => {
		it('adds a div which is not visible', async () => {
			const element = await setup();
			const container = element.shadowRoot.querySelector('.context-menu');

			expect(container).toBeTruthy();
			expect(window.getComputedStyle(container).display).toBe('none');
		});
	});

	describe('store changed', () => {
		it('shows/hides the context menu', async () => {
			const element = await setup();
			const container = element.shadowRoot.querySelector('.context-menu');

			open([10, 10], 'unknownId');

			expect(window.getComputedStyle(container).display).toBe('block');

			close();

			expect(window.getComputedStyle(container).display).toBe('none');
		});
	});
	describe('when opened', () => {


		it('shows a header and a close button which closes the menu', async () => {
			const element = await setup();
			const container = element.shadowRoot.querySelector('.context-menu');

			const header = element.shadowRoot.querySelector('.header');
			expect(header).toBeTruthy();
			expect(header.innerText).toBe('map_context_menu_header');


			const icon = element.shadowRoot.querySelector('ba-icon');
			expect(icon).toBeTruthy();
			expect(icon.title).toBe('map_context_menu_close_button');

			icon.click();

			expect(window.getComputedStyle(container).display).toBe('none');
		});


		it('renders a content html element', async () => {
			const element = await setup();
			const contentElementId = 'mockContentId';
			const container = element.shadowRoot.querySelector('.context-menu');
			const mockContent = document.createElement('div');
			mockContent.innerText = 'mockContentText';
			mockContent.id = contentElementId;
			document.body.appendChild(mockContent);


			open([10, 10], contentElementId);

			expect(element.shadowRoot.querySelector('#' + contentElementId).parentElement).toEqual(container);
		});

		it('calls the calculateParameter()', async () => {
			const element = await setup();
			const clickEvent = [10, 10];
			const spy = spyOn(element, '_calculateParameter').and.callThrough();
			const container = element.shadowRoot.querySelector('.context-menu');

			open(clickEvent);

			expect(spy).toHaveBeenCalledWith(clickEvent, container);
		});

		it('adds css classes and stylings', async () => {
			const element = await setup();
			const clickEvent = [10, 20];
			const container = element.shadowRoot.querySelector('.context-menu');

			open(clickEvent);

			expect(window.getComputedStyle(container).left).toBeTruthy('10px');
			expect(window.getComputedStyle(container).top).toBe('40px');
			expect(container.classList.contains('top-left')).toBeTrue();
		});
	});

	describe('calculateParameter', () => {
		it('returns  default parameter when event coordinate or element is missing', async () => {
			const element = await setup();
			const expectedParameter = { left: 0, top: 0, vAlignment: 'left', hAlignment: 'top' };

			let parameter = element._calculateParameter();

			expect(parameter).toEqual(expectedParameter);

			parameter = element._calculateParameter([10, 10]);

			expect(parameter).toEqual(expectedParameter);
		});

		it('returns parameter for top-left click position', async () => {
			const element = await setup();
			const expectedParameter = { left: '10px', top: '30px', vAlignment: 'left', hAlignment: 'top' };
			spyOnProperty(window, 'innerWidth', 'get').and.returnValue(400);
			spyOnProperty(window, 'innerHeight', 'get').and.returnValue(400);
			spyOnProperty(element, 'offsetWidth', 'get').and.returnValue(50);
			spyOnProperty(element, 'offsetHeight', 'get').and.returnValue(50);

			const parameter = element._calculateParameter([10, 10], element);

			expect(parameter).toEqual(expectedParameter);
		});

		it('returns parameter for top-right click position', async () => {
			const element = await setup();
			const expectedParameter = { left: '250px', top: '30px', vAlignment: 'right', hAlignment: 'top' };
			spyOnProperty(window, 'innerWidth', 'get').and.returnValue(400);
			spyOnProperty(window, 'innerHeight', 'get').and.returnValue(400);
			spyOnProperty(element, 'offsetWidth', 'get').and.returnValue(50);
			spyOnProperty(element, 'offsetHeight', 'get').and.returnValue(50);

			const parameter = element._calculateParameter([300, 10], element);

			expect(parameter).toEqual(expectedParameter);
		});

		it('returns parameter for bottom-left click position', async () => {
			const element = await setup();
			const expectedParameter = { left: '10px', top: '230px', vAlignment: 'left', hAlignment: 'bottom' };
			spyOnProperty(window, 'innerWidth', 'get').and.returnValue(400);
			spyOnProperty(window, 'innerHeight', 'get').and.returnValue(400);
			spyOnProperty(element, 'offsetWidth', 'get').and.returnValue(50);
			spyOnProperty(element, 'offsetHeight', 'get').and.returnValue(50);

			const parameter = element._calculateParameter([10, 300], element);

			expect(parameter).toEqual(expectedParameter);
		});

		it('returns parameter for bottom-right click position', async () => {
			const element = await setup();
			const expectedParameter = { left: '250px', top: '230px', vAlignment: 'right', hAlignment: 'bottom' };
			spyOnProperty(window, 'innerWidth', 'get').and.returnValue(400);
			spyOnProperty(window, 'innerHeight', 'get').and.returnValue(400);
			spyOnProperty(element, 'offsetWidth', 'get').and.returnValue(50);
			spyOnProperty(element, 'offsetHeight', 'get').and.returnValue(50);

			const parameter = element._calculateParameter([300, 300], element);

			expect(parameter).toEqual(expectedParameter);
		});

	});

});