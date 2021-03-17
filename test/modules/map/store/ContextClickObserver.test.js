import { TestUtils } from '../../../test-utils.js';
import { pointerReducer } from '../../../../src/modules/map/store/pointer.reducer';
import { mapReducer } from '../../../../src/modules/map/store/map.reducer';
import { setClick, setContextClick } from '../../../../src/modules/map/store/pointer.action';
import { setMoveStart } from '../../../../src/modules/map/store/map.action';
import { mapContextMenuReducer } from '../../../../src/modules/map/store/mapContextMenu.reducer';
import { MapContextMenu } from '../../../../src/modules/map/components/contextMenu/MapContextMenu';
import { ContextClickObserver } from '../../../../src/modules/map/store/ContextClickObserver.js';



describe('ContextClickObserver', () => {

	const setup = (state) => {
		const store = TestUtils.setupStoreAndDi(state, {
			pointer: pointerReducer,
			map: mapReducer,
			mapContextMenu: mapContextMenuReducer,
		});
	
		return store;
	};

	describe('on register', () => {
		it('it inserts the mapcontextmenu container', () => {
			const store = setup();

			new ContextClickObserver().register(store);

			const element = document.querySelector(MapContextMenu.tag);
			expect(element).toBeTruthy();
		});
	});

	describe('when context-click state changed', () => {

		it('updates the mapContextMenu store section', () => {
			const store = setup();
			new ContextClickObserver().register(store);


			setContextClick({ coordinate: [2121, 4242], screenCoordinate: [21, 42] });

			const { coordinate, id } = store.getState().mapContextMenu;
			expect(coordinate).toEqual([21, 42]);
			expect(id).toEqual('ba-map-context-menu-content_generatedByContextMenuEventHandler');
			const element = document.querySelector('ba-map-context-menu-content');
			expect(element).toBeTruthy();
			expect(element.id).toBe('ba-map-context-menu-content_generatedByContextMenuEventHandler');
		});
	});

	describe('when move-start state changed', () => {

		it('updates the mapContextMenu store section', () => {
			const store = setup();
			new ContextClickObserver().register(store);

			setContextClick({ coordinate: [2121, 4242], screenCoordinate: [21, 42] });

			expect(store.getState().mapContextMenu.coordinate).not.toBeNull();
			
			setMoveStart();
			
			expect(store.getState().mapContextMenu.coordinate).toBeNull();
		});
	});

	describe('when pointer-click state changed', () => {

		it('updates the mapContextMenu store section', () => {
			const store = setup();
			new ContextClickObserver().register(store);

			setContextClick({ coordinate: [2121, 4242], screenCoordinate: [21, 42] });

			expect(store.getState().mapContextMenu.coordinate).not.toBeNull();
			
			setClick({ coordinate: [2121, 4242], screenCoordinate: [21, 42] });
			
			expect(store.getState().mapContextMenu.coordinate).toBeNull();
		});
	});
});