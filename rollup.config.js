import resolve from '@rollup/plugin-node-resolve';

const plugins = [
  resolve(),
];

export default [
  {
    input: 'js/Datepicker.js',
    output: {
      file: 'dist/js/datepicker.js',
      format: 'iife',
      name: 'Datepicker',
      generatedCode: {
        constBindings: true,
      },
    },
    plugins,
  },
  {
    input: 'js/datepicker-full.js',
    output: {
      file: 'dist/js/datepicker-full.js',
      format: 'iife',
      generatedCode: {
        constBindings: true,
      },
    },
    plugins,
  },
  {
    input: 'js/lib/date.js',
    output: {
      file: 'test/main/_utils/date.js',
      name: 'dateUtils',
      format: 'iife'
    },
    plugins,
  },
  {
    input: 'js/lib/dom.js',
    output: {
      file: 'test/main/_utils/dom.js',
      name: 'domUtils',
      format: 'iife'
    },
    plugins,
  },
];
