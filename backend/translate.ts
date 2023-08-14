import { translateTypeScript } from 'jsii-rosetta';
import { File } from './node_modules/jsii-rosetta/lib/util';
import { TARGET_LANGUAGES, TargetLanguage } from './node_modules/jsii-rosetta/lib/languages/index.js';
import * as fs from 'fs';
import { randomBytes } from 'crypto';

export const translateFromString = async (snippet: string, targetLanguage: string) => {
  let fileName = `translate_${randomBytes(16).toString('hex')}.ts`;
  try {
    fs.writeFileSync(fileName, snippet);
    return await translate(targetLanguage, fileName);
  } finally {
    fs.rmSync(fileName);
  }
};

export const translate = async (targetLanguage: string, file: string) => {
  let lang = targetLanguage.toUpperCase();
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
