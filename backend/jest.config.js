module.exports = {
  preset: 'ts-jest',  // This tells Jest to use ts-jest for TypeScript files
  testEnvironment: 'node',  // Set test environment to Node.js
  transform: {
    '^.+\\.ts$': 'ts-jest',  // This will transform TypeScript files before testing
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],  // Extensions Jest will look for
};
