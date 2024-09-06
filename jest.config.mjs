import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const commonTestConfig = {
  setupFilesAfterEnv: ["<rootDir>/src/config/jest.setup.ts"],
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/src/$1",
  },
};

const clientTestConfig = {
  ...commonTestConfig,
  displayName: "client",
  testEnvironment: "jest-environment-jsdom",
  testMatch: ["**/__tests__/client/*.[jt]s?(x)", "**/__tests__/*.[jt]s?(x)"],
};

const serverTestConfig = {
  ...commonTestConfig,
  displayName: "server",
  testEnvironment: "node",
  testMatch: ["**/__tests__/server/*.[jt]s?(x)"],
};

/** @type {import('jest').Config} */
const config = {
  projects: [
    await createJestConfig(clientTestConfig)(),
    await createJestConfig(serverTestConfig)(),
  ],
};

export default config;
