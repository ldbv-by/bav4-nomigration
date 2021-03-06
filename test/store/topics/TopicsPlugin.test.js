import { TopicsPlugin } from '../../../src/store/topics/TopicsPlugin';
import { TestUtils } from '../../test-utils.js';
import { $injector } from '../../../src/injection';
import { Topic } from '../../../src/services/domain/topic';
import { topicsReducer } from '../../../src/store/topics/topics.reducer';
import { QueryParameters } from '../../../src/services/domain/queryParameters';


describe('TopicsPlugin', () => {

	const topicsServiceMock = {
		async init() { },
		default() { },
		byId() {}
	};
	const windowMock = {
		location: {
			get search() {
				return null;
			}
		}
	};

	const setup = (state) => {

		const store = TestUtils.setupStoreAndDi(state, {
			topics: topicsReducer
		});
		$injector
			.registerSingleton('TopicsService', topicsServiceMock)
			.registerSingleton('EnvironmentService', { getWindow: () => windowMock });

		return store;
	};

	describe('register', () => {

		it('calls #_init and awaits its completion', async () => {
			const store = setup();
			const instanceUnderTest = new TopicsPlugin();
			const spy = spyOn(instanceUnderTest, '_init').and.returnValue(Promise.resolve(true));

			const result = await instanceUnderTest.register(store);

			expect(result).toBeTrue();
			expect(spy).toHaveBeenCalledTimes(1);
		});
	});

	describe('_init', () => {

		it('initializes the topics service and calls #_addTopicFromConfig', async () => {
			const store = setup();
			const instanceUnderTest = new TopicsPlugin();
			const addTopicFromQueryParamsSpy = spyOn(instanceUnderTest, '_addTopicFromQueryParams');
			const addTopicFromConfigSpy = spyOn(instanceUnderTest, '_addTopicFromConfig');
			const topicServiceSpy = spyOn(topicsServiceMock, 'init').and.returnValue(Promise.resolve());

			await instanceUnderTest._init();

			expect(topicServiceSpy).toHaveBeenCalledTimes(1);
			expect(addTopicFromQueryParamsSpy).not.toHaveBeenCalled();
			expect(addTopicFromConfigSpy).toHaveBeenCalledTimes(1);
			expect(store.getState().topics.ready).toBeTrue();
		});

		it('initializes the topics service and calls #_addTopicFromQueryParams', async () => {
			const store = setup();
			const queryParam = QueryParameters.TOPIC + '=some';
			const instanceUnderTest = new TopicsPlugin();
			const addTopicFromQueryParamsSpy = spyOn(instanceUnderTest, '_addTopicFromQueryParams');
			const addTopicFromConfigSpy = spyOn(instanceUnderTest, '_addTopicFromConfig');
			const topicServiceSpy = spyOn(topicsServiceMock, 'init').and.returnValue(Promise.resolve());
			spyOnProperty(windowMock.location, 'search').and.returnValue(queryParam);

			await instanceUnderTest._init();

			expect(topicServiceSpy).toHaveBeenCalledTimes(1);
			expect(addTopicFromQueryParamsSpy).toHaveBeenCalledOnceWith(new URLSearchParams(queryParam));
			expect(addTopicFromConfigSpy).not.toHaveBeenCalled();
			expect(store.getState().topics.ready).toBeTrue();
		});
	});


	describe('_addTopicFromConfig', () => {

		it('initializes the topics service and update the store', async() => {
			
			const store = setup();
			const topicId = 'someId';
			const topic = new Topic(topicId, 'label', 'description', ['someLayerId']);
			const instanceUnderTest = new TopicsPlugin();
			spyOn(topicsServiceMock, 'default').and.returnValue(topic);

			await instanceUnderTest._addTopicFromConfig();

			expect(store.getState().topics.current).toBe(topicId);
		});
	});

	describe('_addTopicFromQueryParams', () => {

		it('updates current topic', () => {
			
			const store = setup();
			const topicId = 'someId';
			const queryParam = `${QueryParameters.TOPIC}=${topicId}`;
			const topic = new Topic(topicId, 'label', 'description', ['someLayerId']);
			const instanceUnderTest = new TopicsPlugin();
			const topicServiceSpy = spyOn(topicsServiceMock, 'byId').withArgs(topicId).and.returnValue(topic);

			instanceUnderTest._addTopicFromQueryParams(new URLSearchParams(queryParam));

			expect(topicServiceSpy).toHaveBeenCalledTimes(1);
			expect(store.getState().topics.current).toBe(topicId);
		});

		it('updates current topic by calling #_addTopicFromConfig as fallback', () => {
			
			setup();
			const topicId = 'someId';
			const queryParam = `${QueryParameters.TOPIC}=${topicId}`;
			const instanceUnderTest = new TopicsPlugin();
			const topicServiceSpy = spyOn(topicsServiceMock, 'byId').withArgs(topicId).and.returnValue(null);
			const addTopicFromConfigSpy = spyOn(instanceUnderTest, '_addTopicFromConfig');

			instanceUnderTest._addTopicFromQueryParams(new URLSearchParams(queryParam));

			expect(topicServiceSpy).toHaveBeenCalledTimes(1);
			expect(addTopicFromConfigSpy).toHaveBeenCalledTimes(1);
		});
	});
});
