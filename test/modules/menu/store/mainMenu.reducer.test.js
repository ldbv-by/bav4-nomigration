import { TestUtils } from '../../../test-utils.js';
import { mainMenuReducer } from '../../../../src/modules/menu/store/mainMenu.reducer';
import { open, close, toggle, setTabIndex } from '../../../../src/modules/menu/store/mainMenu.action';


describe('mainMenuReducer', () => {

	const setup = (state) => {
		return TestUtils.setupStoreAndDi(state, {
			mainMenu: mainMenuReducer
		});
	};


	it('initiales the store with default values', () => {
		const store = setup();
		expect(store.getState().mainMenu.open).toBeTrue();
	});
	describe('changes the \'open\' property', () => {

		it('sets true', () => {
			const store = setup();


			open();

			expect(store.getState().mainMenu.open).toBeTrue();
		});

		it('sets false', () => {
			const store = setup({ mainMenu: { open: true } });

			expect(store.getState().mainMenu.open).toBeTrue();

			close();

			expect(store.getState().mainMenu.open).toBeFalse();
		});

		it('toggles current value', () => {
			const store = setup({ mainMenu: { open: true } });

			expect(store.getState().mainMenu.open).toBeTrue();

			toggle();

			expect(store.getState().mainMenu.open).toBeFalse();

			toggle();

			expect(store.getState().mainMenu.open).toBeTrue();
		});


	});
	describe('changes the \'tabIndex\' property', () => {

		it('set tabIndex 1', () => {
			const store = setup();

			setTabIndex(1);		
			expect(store.getState().mainMenu.tabIndex).toBe(1);
			setTabIndex(2);
			expect(store.getState().mainMenu.tabIndex).toBe(2);
		});

	});

});