module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    // Ignore the setup and teardown files so Jest doesn't run them as tests
    '/src/__tests__/jest.setup.ts',
    '/src/__tests__/globalSetup.ts',
    '/src/__tests__/globalTeardown.ts',
  ],
  globalSetup: './src/__tests__/globalSetup.ts',
  globalTeardown: './src/__tests__/globalTeardown.ts',
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['./src/__tests__/jest.setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
