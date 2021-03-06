import { UnitsService } from '../../src/services/UnitsService';
import { $injector } from '../../src/injection';


describe('UnitsService', () => {

	let instanceUnderTest;
	const configService = {
		getValue: () => { }
	};

	beforeAll(() => {
		$injector
			.registerSingleton('ConfigService', configService);
	});

	beforeEach(() => {
		instanceUnderTest = new UnitsService();
	});

	it('provides default formatted distance', () => {
		spyOn(configService, 'getValue').and.returnValue(null);
		
		expect(instanceUnderTest.formatDistance(42.00)).toBe('42.00 m');		
	});

	it('provides default formatted area', () => {
		spyOn(configService, 'getValue').and.returnValue(null);
		
		expect(instanceUnderTest.formatArea(42)).toBe('42.00 m&sup2;');		
	});

	it('provides formatted distance', () => {
		const systemOfUnits = 'metric';
		
		spyOn(configService, 'getValue').and.returnValue(systemOfUnits);
		
		expect(instanceUnderTest.formatDistance(42, 0)).toBe('42 m');
		expect(instanceUnderTest.formatDistance(999, 0)).toBe('999 m');
		expect(instanceUnderTest.formatDistance(1000, 0)).toBe('1 km');
		expect(instanceUnderTest.formatDistance(1000, 2)).toBe('1.00 km');
		expect(instanceUnderTest.formatDistance(1234, 0)).toBe('1.23 km');
		expect(instanceUnderTest.formatDistance(1234, 2)).toBe('1.23 km');
		expect(instanceUnderTest.formatDistance(10000, 0)).toBe('10 km');
		expect(instanceUnderTest.formatDistance(10000, 2)).toBe('10.00 km');
	});

	it('provides formatted area', () => {
		const systemOfUnits = 'metric';
		
		spyOn(configService, 'getValue').and.returnValue(systemOfUnits);
		
		expect(instanceUnderTest.formatArea(42, 0)).toBe('42 m&sup2;');
		expect(instanceUnderTest.formatArea(999, 0)).toBe('999 m&sup2;');
		expect(instanceUnderTest.formatArea(1000000, 0)).toBe('1 km&sup2;');
		expect(instanceUnderTest.formatArea(1234567, 0)).toBe('1.23 km&sup2;');
		expect(instanceUnderTest.formatArea(1234567, 2)).toBe('1.23 km&sup2;');
		expect(instanceUnderTest.formatArea(100000, 0)).toBe('10 ha');
		expect(instanceUnderTest.formatArea(12345, 0)).toBe('1.23 ha');
		expect(instanceUnderTest.formatArea(12345, 2)).toBe('1.23 ha');
		expect(instanceUnderTest.formatArea(10000000, 0)).toBe('10 km&sup2;');
	});
});