import fs from 'fs';
import sass from 'sass';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import prettify from 'postcss-prettify';
import rootDir from './lib/rootDir.js';

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
    const css = sass.renderSync({file: from}).css.toString();

    postcss([autoprefixer, prettify])
      .process(css, {from, map: false})
      .then((result) => {
        fs.writeFileSync(`${distDir}/${entry.out}`, result.css);
        resolve();
      });
  })
  .catch((err) => {
    console.error(err);
    return err;
  });
}));
