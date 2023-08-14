import * as readline from 'readline';
import { translateFromString } from './translate.js';

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

// We were not able to use express for some reason: https://github.com/stackblitz/webcontainer-core/issues/1159
// Using stdin/out to communicate between WC and browser instead.
const main = async (input: string) => {
  let res = '';
  try {
    const json = JSON.parse(input);
    const snippet = json.snippet;
    const language = json.language;
    const result = await translateFromString(snippet, language);
    res = JSON.stringify({ result, language });
  } catch (e: any) {
    res = JSON.stringify({ result: e.message });
  } finally {
    process.stdout.write('<START_MARKER>');
    process.stdout.write(res);
    process.stdout.write('<END_MARKER>');
  }
};
