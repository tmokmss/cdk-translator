import { readFileSync, writeFileSync } from 'fs';

const dst = {
  'main.js': {
    file: {
      contents: readFileSync('main.js').toString(),
    },
  },
  'package.json': {
    file: {
      contents: JSON.stringify(JSON.parse(readFileSync('package.json').toString())),
    },
  },
  'package-lock.json': {
    file: {
      contents: JSON.stringify(JSON.parse(readFileSync('package-lock.json').toString())),
    },
  },
};

writeFileSync('../components/translator/files.json', JSON.stringify(dst, undefined, 2));

console.log("successfully created files.json");
