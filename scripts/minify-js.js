import fs from 'fs';
import {minify} from 'terser';
import rootDir from './lib/rootDir.js';

const distDir = `${rootDir}/dist/js`;
const files = ['datepicker', 'datepicker-full'];

Promise.all(files.map((basename) => {
  return new Promise((resolve) => {
    const fileNameBase = `${distDir}/${basename}`;
    const file = fs.readFileSync(`${fileNameBase}.js`, 'utf8');

    minify(file)
      .then((result) => {
        fs.writeFileSync(`${fileNameBase}.min.js`, result.code);
        resolve();
      });
  })
  .catch((err) => {
    console.error(err);
    return err;
  });
}));
