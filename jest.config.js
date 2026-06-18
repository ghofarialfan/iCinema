export default {
  testEnvironment: "node",
  transform: {},
  testMatch: ["**/__tests__/**/*.test.js"],
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup/testSetup.js"],
  globalSetup: "<rootDir>/__tests__/setup/globalSetup.js",
  globalTeardown: "<rootDir>/__tests__/setup/globalTeardown.js",
  moduleNameMapper: {
    "^(\\.\\./)+utils/cloudinary\\.js$": "<rootDir>/__tests__/mocks/cloudinary.js",
    "^(\\.\\./)+utils/nodemailer\\.js$": "<rootDir>/__tests__/mocks/nodemailer.js",
  },
  collectCoverageFrom: [
    "controller/**/*.js",
    "middleware/**/*.js",
    "models/**/*.js",
    "utils/connectDB.js",
    "!utils/seed.js",
    "!utils/cloudinary.js",
    "!utils/nodemailer.js",
  ],
  coverageThreshold: {
    global: {
      lines: 60,
      branches: 55,
      functions: 60,
      statements: 60,
    },
  },
};
