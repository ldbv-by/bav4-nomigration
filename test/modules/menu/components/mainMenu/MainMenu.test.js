/* eslint-disable no-undef */

import { MainMenu, MainMenuTabIndex } from '../../../../../src/modules/menu/components/mainMenu/MainMenu';
import { createNoInitialStateMainMenuReducer } from '../../../../../src/modules/menu/store/mainMenu.reducer';
import { toggle } from '../../../../../src/modules/menu/store/mainMenu.action';
import { TestUtils } from '../../../../test-utils';
import { $injector } from '../../../../../src/injection';
import { setTabIndex } from '../../../../../src/modules/menu/store/mainMenu.action';
import { DevInfo } from '../../../../../src/modules/utils/components/devInfo/DevInfo';
import { SearchResultsPanel } from '../../../../../src/modules/search/components/menu/SearchResultsPanel';
import { TopicsContentPanel } from '../../../../../src/modules/topics/components/menu/TopicsContentPanel';
import { highlightReducer } from '../../../../../src/store/highlight/highlight.reducer';
import { HightlightFeatureTypes, setHighlightFeature } from '../../../../../src/store/highlight/highlight.action';
import { createNoInitialStateMediaReducer } from '../../../../../src/store/media/media.reducer';
import { disableResponsiveParameterObservation, enableResponsiveParameterObservation } from '../../../../../src/store/media/media.action';

window.customElements.define(MainMenu.tag, MainMenu);

describe('MainMenuTabIndex', () => {

	it('is an enum with an id and a tag property', () => {

		expect(Object.entries(MainMenuTabIndex).length).toBe(6);
		expect(Object.isFrozen(MainMenuTabIndex)).toBeTrue();
		expect(MainMenuTabIndex.TOPICS).toEqual({ id: 0, component: TopicsContentPanel });
		expect(MainMenuTabIndex.MAPS).toEqual({ id: 1, component: null });
		expect(MainMenuTabIndex.MORE).toEqual({ id: 2, component: null });
		expect(MainMenuTabIndex.ROUTING).toEqual({ id: 3, component: null });
		expect(MainMenuTabIndex.SEARCH).toEqual({ id: 4, component: SearchResultsPanel });
		expect(MainMenuTabIndex.FEATUREINFO).toEqual({ id: 5, component: null });
	});
});


describe('MainMenu', () => {

	let store;

	const setup = (state = {}, config = {}) => {

		const { embed = false } = config;

		const initialState = {
			mainMenu: {
				open: true,
				tabIndex: 0
			},
			media: {
				portrait: false,
				minWidth: true,
				observeResponsiveParameter: true
			},
			...state

		};
		store = TestUtils.setupStoreAndDi(initialState, {
			mainMenu: createNoInitialStateMainMenuReducer(),
			highlight: highlightReducer,
			media: createNoInitialStateMediaReducer()
		});
		$injector
			.registerSingleton('EnvironmentService', {
				isEmbedded: () => embed
			})
			.registerSingleton('TranslationService', { translate: (key) => key });

		return TestUtils.render(MainMenu.tag);
	};

	describe('responsive layout ', () => {

		it('layouts for landscape and width >= 80em', async () => {
			const state = {
				media: {
					portrait: false,
					minWidth: true
				}
			};

			const element = await setup(state);

			expect(element.shadowRoot.querySelector('.is-landscape')).toBeTruthy();
			expect(element.shadowRoot.querySelector('.is-desktop')).toBeTruthy();
			expect(element.shadowRoot.querySelector('.main-menu')).toBeTruthy();
		});

		it('layouts for portrait and width >= 80em', async () => {
			const state = {
				media: {
					portrait: true,
					minWidth: true
				}
			};

			const element = await setup(state);

			expect(element.shadowRoot.querySelector('.is-portrait')).toBeTruthy();
			expect(element.shadowRoot.querySelector('.is-desktop')).toBeTruthy();
			expect(element.shadowRoot.querySelector('.main-menu')).toBeTruthy();
		});

		it('layouts for landscape and width < 80em', async () => {
			const state = {
				media: {
					portrait: false,
					minWidth: false
				}
			};

			const element = await setup(state);

			expect(element.shadowRoot.querySelector('.is-landscape')).toBeTruthy();
			expect(element.shadowRoot.querySelector('.is-tablet')).toBeTruthy();
			expect(element.shadowRoot.querySelector('.main-menu')).toBeTruthy();
		});

		it('layouts for portrait and width < 80em', async () => {
			const state = {
				media: {
					portrait: true,
					minWidth: false
				}
			};

			const element = await setup(state);

			expect(element.shadowRoot.querySelector('.is-portrait')).toBeTruthy();
			expect(element.shadowRoot.querySelector('.is-tablet')).toBeTruthy();
			expect(element.shadowRoot.querySelector('.main-menu')).toBeTruthy();
		});
	});


	describe('when initialized', () => {

		it('adds a div which holds the main menu and a close button', async () => {

			const element = await setup();
			expect(element.shadowRoot.querySelector('.main-menu.is-open')).toBeTruthy();
			expect(element.shadowRoot.querySelector('.main-menu__close-button')).toBeTruthy();
			expect(element.shadowRoot.querySelector('.main-menu__close-button-text').innerText).toBe('menu_main_open_button');
		});

		it('adds a container for content and shows demo content', async () => {
			const element = await setup();

			expect(element.shadowRoot.querySelector('.main-menu__container')).toBeTruthy();
			expect(element.shadowRoot.querySelector('.main-menu__container').children.length > 0).toBeTrue();
		});

		it('renders nothing when embedded', async () => {
			const element = await setup({}, { embed: true });

			expect(element.shadowRoot.children.length).toBe(0);
		});

		it('renders the content panels', async () => {
			const element = await setup();

			const contentPanels = element.shadowRoot.querySelectorAll('.tabcontent');
			expect(contentPanels.length).toBe(Object.keys(MainMenuTabIndex).length);
			for (let i = 0; i < contentPanels.length; i++) {
				// Todo check all content panels when implemented
				switch (i) {
					case MainMenuTabIndex.SEARCH.id:
						expect(contentPanels[i].innerHTML.toString().includes(SearchResultsPanel.tag)).toBeTrue();
						break;
					case MainMenuTabIndex.TOPICS.id:
						expect(contentPanels[i].innerHTML.toString().includes(TopicsContentPanel.tag)).toBeTrue();
						break;
				}
			}
		});

		it('display the content panel for default index = 0', async () => {
			const element = await setup();

			const contentPanels = element.shadowRoot.querySelectorAll('.tabcontent');
			expect(contentPanels.length).toBe(Object.keys(MainMenuTabIndex).length);
			for (let i = 0; i < contentPanels.length; i++) {
				expect(contentPanels[i].style.display).toBe(i === 0 ? 'block' : 'none');
			}
		});

		it('displays the content panel for non default index', async () => {
			const activeTabIndex = 2;
			const state = {
				mainMenu: {
					open: true,
					tabIndex: activeTabIndex
				},
			};
			const element = await setup(state);

			const contentPanels = element.shadowRoot.querySelectorAll('.tabcontent');
			expect(contentPanels.length).toBe(Object.keys(MainMenuTabIndex).length);
			for (let i = 0; i < contentPanels.length; i++) {
				expect(contentPanels[i].style.display).toBe(i === activeTabIndex ? 'block' : 'none');
			}
		});

		it('contains a dev info', async () => {
			const element = await setup();

			expect(element.shadowRoot.querySelector('.main-menu').querySelector(DevInfo.tag)).toBeTruthy();
		});

		it('does not add the prevent-transition css class', async () => {
			const state = {
				media: {
					portrait: true,
					minWidth: false,
					observeResponsiveParameter: true
				}
			};

			const element = await setup(state);

			expect(element.shadowRoot.querySelector('.main-menu').parentElement.classList.contains('prevent-transition')).toBeFalse();
		});
	});

	describe('when tab-index changes', () => {

		const check = (index, panels) => {
			for (let i = 0; i < panels.length; i++) {
				expect(panels[i].style.display).toBe(i === index.id ? 'block' : 'none');
			}
		};

		it('displays the corresponding content panel', async () => {
			const element = await setup();
			const contentPanels = element.shadowRoot.querySelectorAll('.tabcontent');

			setTabIndex(MainMenuTabIndex.MAPS);
			check(MainMenuTabIndex.MAPS, contentPanels);

			setTabIndex(MainMenuTabIndex.MORE);
			check(MainMenuTabIndex.MORE, contentPanels);

			setTabIndex(MainMenuTabIndex.ROUTING);
			check(MainMenuTabIndex.ROUTING, contentPanels);

			setTabIndex(MainMenuTabIndex.SEARCH);
			check(MainMenuTabIndex.SEARCH, contentPanels);

			setTabIndex(MainMenuTabIndex.FEATUREINFO);
			check(MainMenuTabIndex.FEATUREINFO, contentPanels);

			setTabIndex(MainMenuTabIndex.TOPICS);
			check(MainMenuTabIndex.TOPICS, contentPanels);
		});

		it('clears highlight features', async () => {
			await setup();
			const highlightFeature = { type: HightlightFeatureTypes.DEFAULT, data: { coordinate: [21, 42] } };

			setHighlightFeature(highlightFeature);

			expect(store.getState().highlight.feature).toEqual(highlightFeature);

			setTabIndex(MainMenuTabIndex.SEARCH);

			expect(store.getState().highlight.feature).toEqual(highlightFeature);

			setTabIndex(MainMenuTabIndex.MAPS);

			expect(store.getState().highlight.feature).toBeNull();
		});
	});

	describe('when close button clicked', () => {

		it('closes the main menu', async () => {
			const element = await setup();

			toggle();

			expect(element.shadowRoot.querySelector('.main-menu.is-open')).toBeNull();
			expect(element.shadowRoot.querySelector('.main-menu__close-button')).toBeTruthy();
		});
	});

	describe('when responsive parameter observation state changes', () => {

		it('adds or removes the prevent-transition css class', async () => {
			const state = {
				media: {
					portrait: true,
					minWidth: false,
					observeResponsiveParameter: true
				}
			};

			const element = await setup(state);

			expect(element.shadowRoot.querySelector('.main-menu').parentElement.classList.contains('prevent-transition')).toBeFalse();
			
			disableResponsiveParameterObservation();
			
			expect(element.shadowRoot.querySelector('.main-menu').parentElement.classList.contains('prevent-transition')).toBeTrue();
			
			enableResponsiveParameterObservation();
			
			expect(element.shadowRoot.querySelector('.main-menu').parentElement.classList.contains('prevent-transition')).toBeFalse();
		});
	});
});
