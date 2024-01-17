import type { Config } from '@jest/types';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.paths.json';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig: Config.InitialOptions = {
  moduleDirectories: ['node_modules', '<rootDir>/testing/'],
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/testing/setupTests.tsx'],
  //https://stackoverflow.com/questions/55488882/modulenamemapper-settings-in-jest-config-js-doesnt-work-on-circleci
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/components/UserProfile/ActivityChart.tsx',
    '<rootDir>/components/StravaEntries/HeartRateChart.tsx',
  ],
  testPathIgnorePatterns:
    process.env.TEST_ENV === 'client'
      ? ['<rootDir>/testing/tests/__server_tests__', '<rootDir>/iac']
      : [],
  coverageThreshold: {
    global: {
      lines: 65,
      statements: 65,
      branches: 50,
      functions: 50,
    },
  },
};

module.exports = async function () {
  const makeConfig = createJestConfig(customJestConfig);
  const finalJestConfig = await makeConfig();

  return finalJestConfig;
};
