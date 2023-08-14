import { translateTypeScript } from 'jsii-rosetta';
import { File } from './node_modules/jsii-rosetta/lib/util';
import { TARGET_LANGUAGES, TargetLanguage } from './node_modules/jsii-rosetta/lib/languages/index.js';
import * as fs from 'fs';
import * as readline from 'readline';
import { randomBytes } from 'crypto';

// import express from 'express';
// import cors from 'cors';

// const app = express();
// app.use(express.json());
// app.use(cors());

// app.post('/', async (req, res) => {
//   try {
//     console.log(req);
//     const snippet = req.body.snippet;
//     const language = req.body.language;
//     const fileName = `translate_${randomBytes(16).toString('hex')}.ts`;
//     fs.writeFileSync(fileName, snippet);
//     const result = await translate(language, fileName);
//     fs.rmSync(fileName);
//     res.send({ result });
//   } catch (e) {
//     console.log(e);
//     res.status(500).send({ error: e });
//   }
// });

// const port = 3111;
// app.listen(port, () => {
//   console.log(`App is live at http://localhost:${port}`);
// });

process.stdin.setEncoding('utf8');

let lines: string[] = [];
const reader = readline.createInterface({
  input: process.stdin,
});

reader.on('line', (line) => {
  if (line == '<END_MARKER>') {
    main(lines.join('\n'));
    lines = [];
    return;
  }
  lines.push(line);
});

const main = async (input: string) => {
  let res = '';
  let fileName = '';
  try {
    const json = JSON.parse(input);
    const snippet = json.snippet;
    const language = json.language;
    fileName = `translate_${randomBytes(16).toString('hex')}.ts`;
    fs.writeFileSync(fileName, snippet);
    const result = await translate(language, fileName);
    res = JSON.stringify({ result, language });
  } catch (e: any) {
    res = JSON.stringify({ result: e.message });
  } finally {
    if (fileName !== '') {
      fs.rmSync(fileName);
    }
    process.stdout.write('<START_MARKER>');
    process.stdout.write(res);
    process.stdout.write('<END_MARKER>');
  }
};

const translate = async (language: string, file: string) => {
  let lang = language.toUpperCase();
  lang = Object.entries(TargetLanguage).find(([k]) => k === lang)?.[1] as TargetLanguage;
  if (lang == null) {
    throw new Error(`Unknown target language: ${lang}. Expected one of ${Object.keys(TargetLanguage).join(', ')}`);
  }
  const result = translateTypeScript(await makeFileSource(file), makeVisitor(lang as TargetLanguage));
  return result.translation;
};

function makeVisitor(language: TargetLanguage) {
  return TARGET_LANGUAGES[language].createVisitor();
}

async function makeFileSource(fileName: string): Promise<File> {
  return {
    contents: fs.readFileSync(fileName, { encoding: 'utf-8' }),
    fileName: fileName,
  };
}
