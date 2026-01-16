export default {
  // Entorno de pruebas
  testEnvironment: 'node',

  // Directorio de cobertura
  coverageDirectory: 'coverage',

  // Archivos para cobertura
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/*.spec.js',
    '!src/server.js',
    '!src/config/**'
  ],

  // Umbrales de cobertura
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },

  // Patrones de archivos de prueba
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],

  // No transformar (ES modules nativos)
  transform: {},

  // Timeout de tests
  testTimeout: 10000,

  // Configuración de cobertura
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov'
  ],

  // Limpieza automática de mocks
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  // Mensajes detallados
  verbose: true,

  // Archivos a ignorar
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/'
  ],

  // Setup para tests
  // setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Variables de entorno para tests
  testEnvironmentOptions: {
    NODE_ENV: 'test'
  }
};
