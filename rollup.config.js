import resolve from '@rollup/plugin-node-resolve';

const plugins = [
  resolve(),
];

module.exports = [
  {
    input: 'js/Datepicker.js',
    output: {
      file: 'dist/js/datepicker.js',
      format: 'iife',
      name: 'Datepicker',
    },
    plugins,
  },
  {
    input: 'js/datepicker-full.js',
    output: {
      file: 'dist/js/datepicker-full.js',
      format: 'iife',
    },
    plugins,
  },
  {
    input: 'js/lib/date.js',
    output: {
      file: 'test/_utils/date.js',
      name: 'dateUtils',
      format: 'iife'
    },
    plugins,
  },
  {
    input: 'js/lib/dom.js',
    output: {
      file: 'test/_utils/dom.js',
      name: 'domUtils',
      format: 'iife'
    },
    plugins,
  },
];
