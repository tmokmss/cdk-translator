import { translate } from './translate.js';
import { readFileSync, writeFileSync } from 'fs';

const files = {
  'main.js': {
    file: {
      contents: readFileSync('main.js').toString(),
    },
  },
  'translate.js': {
    file: {
      contents: readFileSync('translate.js').toString(),
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

writeFileSync('../components/translator/files.json', JSON.stringify(files, undefined, 2));

console.log('successfully created files.json');

const writeSnippets = async () => {
  const snippets = {
    typescript: readFileSync('test.ts').toString(),
    python: await translate('python', 'test.ts'),
    go: await translate('go', 'test.ts'),
    java: await translate('java', 'test.ts'),
    csharp: await translate('csharp', 'test.ts'),
  };
  writeFileSync('../components/translator/initialValues.json', JSON.stringify(snippets, undefined, 2));
  console.log('successfully created initialValues.json');
};

writeSnippets()
