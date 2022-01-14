import fs from 'fs';
import path from 'path';
import rootDir from './lib/rootDir.js';

const usage = `USAGE:

node ${path.basename(process.argv[1])} [options] source_dir

  source_dir:   path to the locale directory of bootstrap-datepicker's source

Options:
  -h|--help   print this help
`;

const src = process.argv[2];
if (!src || src === '-h' || src === '--help') {
  console.log(usage);
  process.exit();
}
if (!fs.existsSync(src) || !fs.statSync(src).isDirectory()) {
  console.error(`${src} is not a directory.`);
  process.exit(1);
}

const reFilename = /^bootstrap-datepicker\.([a-z]+(-[A-Za-z]+)?)\.js$/;
const files = fs.readdirSync(src);

if (files.length < 2 || !reFilename.test(files[1])) {
  console.error(`${src} is not a bootstrap-datepicker's locale directory.`);
  process.exit(1);
}

const destDir = `${rootDir}/js/i18n/locales`;
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, {recursive: true});
}

files.forEach(file => {
  const matched = file.match(reFilename);
  if (!matched) {
    return;
  }
  const lang = matched[1].replace('latin', 'latn');
  if (lang === 'en-US') {
    return;
  }
  const langKey = lang.indexOf('-') > -1 ? `'${lang}'` : lang;

  let contents = fs.readFileSync(path.resolve(src, file), 'utf8');
  if (contents.indexOf('DEPRECATED') > -1) {
    return;
  }

  contents = contents
    .replace(/\t/g, '  ')
    .replace(/; *\( *function *\( *\$ *\) *\{/, 'export default {')
    .replace(/ *\$\.fn\.datepicker\.dates\[.+?\] =/, `  ${langKey}:`)
    .replace(/ *};/, '  }')
    .replace(/ *\} *\( *jQuery *\) *\);\s*/, '};\n')
    .replace(/ {5,}/g, '    ')
    .replace(/: *(\S)/g, ': $1')
    .replace(/ +\n/g, '\n')
    .replace(/(titleFormat:.+)yyyy/, '$1y');

  fs.writeFileSync(path.resolve(destDir, `${lang}.js`), contents);
});
