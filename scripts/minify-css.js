const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const cssnano = require('cssnano');

const distDir = `${path.dirname(__dirname)}/dist/css`;
const files = [
  'datepicker',
  'datepicker-bulma',
  'datepicker-bs4',
  'datepicker-bs5',
  'datepicker-foundation',
];

Promise.all(files.map((basename) => {
  return new Promise((resolve) => {
    const fileNameBase = `${distDir}/${basename}`;
    const from = `${fileNameBase}.css`;
    const file = fs.readFileSync(from, 'utf8');

    postcss([cssnano])
      .process(file, {from, map: false})
      .then((result) => {
        fs.writeFileSync(`${fileNameBase}.min.css`, result.css);
        resolve();
      })
      .catch((err) => {
        console.error(err);
      });
  });
}));
