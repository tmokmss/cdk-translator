import { FileSystemTree } from '@webcontainer/api';

export const files = {
  'index.js': {
    file: {
      contents: `
      import { translateTypeScript } from "jsii-rosetta";
      import { TARGET_LANGUAGES, TargetLanguage } from "./node_modules/jsii-rosetta/lib/languages/index.js";
      import * as fs from "fs";
      import * as readline from "readline";
      import { randomBytes } from "crypto";
      process.stdin.setEncoding("utf8");
      const lines = [];
      const reader = readline.createInterface({
        input: process.stdin
      });
      reader.on("line", (line) => {
        if (line == "<END_MARKER>") {
          const json = JSON.parse(lines.join("\n"));
          main(json.language, json.snippet);
        }
        lines.push(line);
      });
      const main = async (language, snippet) => {
        const fileName = \`translate_\${randomBytes(16).toString("hex")}.ts\`;
        fs.writeFileSync(fileName, snippet);
        const result = await translate(language, fileName);
        fs.rmSync(fileName);
        process.stdout.write(JSON.stringify({ result, language }) + "\n");
        process.stdout.write("<END_MARKER>\n");
      };
      const translate = async (language, file) => {
        let lang = language.toUpperCase();
        lang = Object.entries(TargetLanguage).find(([k]) => k === lang)?.[1];
        if (lang == null) {
          throw new Error(\`Unknown target language: \${lang}. Expected one of \${Object.keys(TargetLanguage).join(", ")}\`);
        }
        const result = translateTypeScript(await makeFileSource(file), makeVisitor(lang));
        return result.translation;
      };
      function makeVisitor(language) {
        return TARGET_LANGUAGES[language].createVisitor();
      }
      async function makeFileSource(fileName) {
        return {
          contents: fs.readFileSync(fileName, { encoding: "utf-8" }),
          fileName
        };
      }
      `,
    },
  },

  'package.json': {
    file: {
      contents: `
  {
    "name": "example-app",
    "type": "module",
    "dependencies": {
      "aws-cdk-lib": "2.91.0",
      "jsii-rosetta": "5.1.9",
      "cors": "2.8.5",
      "express": "4.18.2"
    },
    "scripts": {
      "start": "node index.js"
    }
  }`,
    },
  },
};
