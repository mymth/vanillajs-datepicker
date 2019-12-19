const fs = require('fs');
const path = require('path');
const {minify} = require('uglify-es');

const distDir = `${path.dirname(__dirname)}/dist/js`;
const files = ['datepicker', 'datepicker-full'];

files.forEach((basename) => {
  const fileNameBase = `${distDir}/${basename}`;
  const file = fs.readFileSync(`${fileNameBase}.js`, 'utf8');
  const {code, error} = minify(file);

  if (error) {
    throw error;
  }
  fs.writeFileSync(`${fileNameBase}.min.js`, code);
});
