// @ts-nocheck
import path from 'path';

import { extendJestWithArchMatchers } from '@rocket.chat/fuel/dist/testing/unit/arch/arch-custom-matchers';

extendJestWithArchMatchers();

describe('Architecture Unit test', () => {
	it('It must respect the "shared" folder architectural boundary', () => {
		expect({ tsConfigRootPath: path.resolve('tsconfig-arch-tests.json') }).toHaveSharedLayerComplianceAsync();
	});
	it('It must respect the "domain" folder architectural boundary', () => {
		expect({ tsConfigRootPath: path.resolve('tsconfig-arch-tests.json') }).toHaveDomainLayerComplianceAsync();
	});
	it('It must respect the "services" folder architectural boundary', () => {
		expect({ tsConfigRootPath: path.resolve('tsconfig-arch-tests.json') }).toHaveServicesLayerComplianceAsync();
	});
	it('It must respect the "infrastructure" folder architectural boundary', () => {
		expect({ tsConfigRootPath: path.resolve('tsconfig-arch-tests.json') }).toHaveInfrastructureLayerComplianceAsync();
	});
	it('It must have NO cycles between files', () => {
		expect({ tsConfigRootPath: path.resolve('tsconfig-arch-tests.json') }).toNotHaveAnyCyclesComplianceAsync();
	});
	it('It must follow the filename convention "kebab-case"', () => {
		expect({ tsConfigRootPath: path.resolve('tsconfig-arch-tests.json') }).toHaveFilenamesComplianceAsync();
	});
});
