module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    sourceType: "module"
  },
  globals: {
  },
  rules: {
    semi: [2, 'always'],
    'no-console': 'off',
  },
  overrides: [
    {
      files: ['test/**'],
      env: {
        mocha: true,
      },
      globals: {
        expect: 'readonly',
        sinon: 'readonly',
        simulant: 'readonly',
        testContainer: 'readonly',
        dateUtils: 'readonly',
        dateValue: 'readonly',
        domUtils: 'readonly',
        parseHTML: 'readonly',
        isVisible: 'readonly',
        lastItemOf: 'readonly',
        createDP: 'readonly',
        createDRP: 'readonly',
        getParts: 'readonly',
        getViewSwitch: 'readonly',
        getCells: 'readonly',
        filterCells: 'readonly',
        datepicker: 'readonly',
        Datepicker: 'readonly',
        DateRangePicker: 'readonly',
      },
      rules: {
        'no-unused-vars': ["error", { "varsIgnorePattern": ".+Utils" }],
      }
    },
    {
      files: ['test/unit/**'],
      env: {
        node: true,
      },
      parser: '/usr/local/lib/node_modules/babel-eslint',
      globals: {
        JSDOM: 'readonly',
      },
    },
    {
      files: ['*.js'],
      env: {
        node: true,
      },
    },
    {
      files: ['demo/**'],
      globals: {
        datepicker: 'readonly',
        Datepicker: 'readonly',
        DateRangePicker: 'readonly',
      },
    },
  ],
};
