const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const nodeSass = require('postcss-node-sass')({
  outputStyle: 'expanded',
});
const autoprefixer = require('autoprefixer');
const syntax = require('postcss-scss');

const rootDir = path.dirname(__dirname);
const srcDir = `${rootDir}/sass`;
const distDir = `${rootDir}/dist/css`;
const files = [
  {in: 'datepicker.scss', out: 'datepicker.css'},
  {in: 'index-bulma.scss', out: 'datepicker-bulma.css'},
  {in: 'index-bs4.scss', out: 'datepicker-bs4.css'},
  {in: 'index-bs5.scss', out: 'datepicker-bs5.css'},
  {in: 'index-foundation.scss', out: 'datepicker-foundation.css'},
];

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, {recursive: true});
}

Promise.all(files.map((entry) => {
  return new Promise((resolve) => {
    const from = `${srcDir}/${entry.in}`;
    const file = fs.readFileSync(from, 'utf8');
    postcss([nodeSass, autoprefixer])
      .process(file, {syntax, from, map: false})
      .then((result) => {
        fs.writeFileSync(`${distDir}/${entry.out}`, result.css);
        resolve();
      })
      .catch((err) => {
        console.error(err);
      });
  });
}));
