const fs = require('fs');
const path = require('path');
const {minify} = require('terser');

const distDir = `${path.dirname(__dirname)}/dist/js`;
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
