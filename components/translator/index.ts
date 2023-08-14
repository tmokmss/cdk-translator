import { WebContainer, WebContainerProcess } from '@webcontainer/api';
import files from './files.json';

// translation machine using jsii-rosetta inside WebContainer

let instance: WebContainer | undefined;
let process: WebContainerProcess | undefined;

export const initialize = async () => {
  if (instance !== undefined) return '';
  try {
    instance = await WebContainer.boot();

    await instance.mount(files);

    // Install dependencies
    const installProcess = await instance.spawn('npm', ['install', '--omit=dev']);

    installProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log(data);
        },
      })
    );

    // Wait for install command to exit
    const exitCode = await installProcess.exit;
    if (exitCode !== 0) {
      throw new Error('Installation failed');
    }

    instance = instance;
    return await startDevServer();
  } catch (e: any) {
    console.log(e.message);
    throw e;
  }
};

export const teardown = () => {
  // instance?.teardown();
  // instance = undefined;
};

let processing = false;

export const translate = async (snippet: string, target: string): Promise<string | undefined> => {
  if (processing) return;
  processing = true;

  if (instance === undefined || process === undefined) {
    throw new Error('instance or process is not initialized');
  }

  try {
    const writer = process.input.getWriter();
    writer.write(JSON.stringify({ snippet, language: target }) + '\n');
    writer.write('<END_MARKER>' + '\n');
    writer.releaseLock();
  } catch (e) {
    console.log(e);
    processing = false;
    throw e;
  }

  const promise: Promise<string> = new Promise((resolve, reject) => {
    // the process is exclusively used by this translation.
    const reader = process!.output.getReader();
    let started = false;
    let res = '';
    const readChunk = ({ done, value }: { done: boolean; value?: string }) => {
      if (done) {
        // stream ended for some reason
        reject(res);
        return;
      }
      if (value !== undefined) {
        res += value;
      }
      if (!started) {
        // searching for start marker
        const startMarker = '<START_MARKER>';
        const search = res.indexOf(startMarker);
        if (search != -1) {
          started = true;
          res = res.substring(search + startMarker.length);
        }
      } else {
        // searching for end marker
        const endMarker = '<END_MARKER>';
        if (res.endsWith(endMarker)) {
          res = res.substring(0, res.length - endMarker.length);
          reader.releaseLock();
          resolve(JSON.parse(res).result as string);
          // no more read required
          return;
        }
      }
      reader.read().then(readChunk);
    };
    reader.read().then(readChunk);
  });
  promise.finally(() => {
    processing = false;
  });
  return promise;
};

const startDevServer = async (): Promise<void> => {
  if (instance === undefined) {
    throw new Error('instance is not initialized');
  }
  if (process !== undefined) {
    console.log('process already initialized.');
    return;
  }
  process = await instance.spawn('npm', ['run', 'start'], {
    env: {
      JSII_SILENCE_WARNING_DEPRECATED_NODE_VERSION: '1',
    },
  });

  // streamToString(process.output);

  return;
};

// const streamToString = async (stream: ReadableStream<string>) => {
//   const string = await new Response(stream).text();
//   return string;
// };
async function streamToString(stream: ReadableStream<string>): Promise<string> {
  let res = '';

  await stream.pipeTo(
    new WritableStream({
      write(data) {
        console.log(data);
      },
    })
  );

  // const readChunk = ({ done, value }: { done: boolean; value: string }) => {
  //   if (done) {
  //     return;
  //   }
  //   res += value;
  //   reader.read().then(readChunk);
  // };
  // reader.read().then(readChunk);
  return res;
}
