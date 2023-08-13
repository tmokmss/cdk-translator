import { WebContainer, WebContainerProcess } from '@webcontainer/api';
import { files } from './files';

// translator machine using jsii-rosetta inside WebContainer

let instance: WebContainer | undefined;
let process: WebContainerProcess | undefined;

export const initialize = async () => {
  if (instance !== undefined) return '';
  try {
    instance = await WebContainer.boot();

    await instance.mount(files);

    // Install dependencies
    const installProcess = await instance.spawn('npm', ['install']);

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

export const translate = async (snippet: string, target: string): Promise<string> => {
  await initialize();
  if (instance === undefined) {
    throw new Error('instance is not initialized');
  }
  await instance.fs.writeFile('temp.ts', snippet);
  const process = await instance.spawn('npx', ['jsii-rosetta', 'snippet', 'temp.ts', '-p'], {
    env: {
      JSII_SILENCE_WARNING_DEPRECATED_NODE_VERSION: '1',
    },
  });
  console.log(`translation complete: ${await process.exit}`);
  return await streamToString(process.output);
};

const startDevServer = async (): Promise<WebContainerProcess> => {
  if (instance === undefined) {
    throw new Error('instance is not initialized');
  }
  // Run `npm run start` to start the Express app
  const process = await instance.spawn('npm', ['run', 'start']);
  streamToString(process.output);

  return process;
  // return new Promise(function (resolve, reject) {
  //   // Wait for `server-ready` event
  //   instance!.on('server-ready', (port, url) => {
  //     console.log(`server is ready: ${url}`);
  //     resolve(url);
  //   });
  //   instance!.on('error', (e) => {
  //     reject(e);
  //   });
  // });
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
