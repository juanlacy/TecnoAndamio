import js from '@eslint/js';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  prettier,
  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        // Node.js globals
        process: 'readonly',
        console: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        setImmediate: 'readonly',
        clearImmediate: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        
        // Jest globals (for tests)
        describe: 'readonly',
        test: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly'
      }
    },
    rules: {
      // Errores
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_' 
      }],
      'no-var': 'error',
      'no-undef': 'error',
      
      // Best practices
      'prefer-const': 'error',
      'prefer-arrow-callback': 'warn',
      'prefer-template': 'warn',
      'object-shorthand': 'warn',
      'no-useless-return': 'warn',
      'no-else-return': 'warn',
      
      // ES6+
      'arrow-body-style': ['warn', 'as-needed'],
      'prefer-destructuring': ['warn', { object: true, array: false }],
      
      // Code quality
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
      'curly': ['error', 'all'],
      'no-lonely-if': 'warn',
      'no-nested-ternary': 'warn',
      
      // Async
      'no-async-promise-executor': 'error',
      'require-atomic-updates': 'error'
    }
  },
  {
    // Archivos a ignorar
    ignores: [
      'node_modules/',
      'dist/',
      'coverage/',
      'build/',
      '*.config.js',
      '.sequelizerc'
    ]
  }
];
