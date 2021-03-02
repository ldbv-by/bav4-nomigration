import { $injector } from './testsConfig';
let mockService =  { get: 'I\'m a mock. ' };
let debugService = { get: 'I\'m a debug service... ' };
let serverService = { get: 'I\'m a server service. ' };

$injector.registerSingleton({
	MockService: mockService,
	DebugService: debugService,
	ServerService: serverService
});


class RegistrationTest {
	constructor() {
		let { MockService, DebugService, ServerService } = $injector.inject('MockService', 'DebugService', 'ServerService');
		this.mock = MockService;
		this.debug = DebugService;
		this.server = ServerService;
	}
}

let testObj = new RegistrationTest();

//tests
describe('Multiple Dependency Registration Using .register()', () => {

	it('MockService Injected / Registered', () => {
		expect(testObj.mock).toBe(mockService);
	});

	it('DebugService Injected / Registered', () => {
		expect(testObj.debug).toBe(debugService);
	});

	it('ServerService Injected / Registered', () => {
		expect(testObj.server).toBe(serverService);
	});
});