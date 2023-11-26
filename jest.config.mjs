import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

const clientTestConfig = {
  displayName: 'client',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/config/jest.setup.ts'],
  testMatch: ['**/__tests__/client/*.[jt]s?(x)', '**/__tests__/*.[jt]s?(x)'],
}

const serverTestConfig = {
  displayName: 'server',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/config/jest.setup.ts'],
  testMatch: ['**/__tests__/server/*.[jt]s?(x)'],
}

/** @type {import('jest').Config} */
const config = {
  projects: [
    await createJestConfig(clientTestConfig)(),
    await createJestConfig(serverTestConfig)(),
  ],
}

export default config
