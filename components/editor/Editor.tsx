import CodeEditor, { CodeEditorProps } from '@cloudscape-design/components/code-editor';
import { useEffect, useState } from 'react';

type EditorProps = {
  onChange: (value: string) => void;
};

const Editor = (props: EditorProps) => {
  const [preferences, setPreferences] = useState({});
  const [loading, setLoading] = useState(true);
  const [ace, setAce] = useState<any>();

  useEffect(() => {
    async function loadAce() {
      const ace = await import('ace-builds');
      await import('ace-builds/webpack-resolver');
      await import('ace-builds/src-noconflict/ace');
      await import('ace-builds/src-noconflict/theme-dawn');
      await import('ace-builds/src-noconflict/theme-tomorrow_night_bright');
      ace.config.set('useStrictCSP', true);

      return ace;
    }

    loadAce()
      .then((ace) => setAce(ace))
      .finally(() => setLoading(false));
  }, []);

  const i18nStrings: CodeEditorProps.I18nStrings = {
    loadingState: 'Loading code editor',
    errorState: 'There was an error loading the code editor.',
    errorStateRecovery: 'Retry',

    editorGroupAriaLabel: 'Code editor',
    statusBarGroupAriaLabel: 'Status bar',

    cursorPosition: (row, column) => `Ln ${row}, Col ${column}`,
    errorsTab: 'Errors',
    warningsTab: 'Warnings',
    preferencesButtonAriaLabel: 'Preferences',

    paneCloseButtonAriaLabel: 'Close',

    preferencesModalHeader: 'Preferences',
    preferencesModalCancel: 'Cancel',
    preferencesModalConfirm: 'Confirm',
    preferencesModalWrapLines: 'Wrap lines',
    preferencesModalTheme: 'Theme',
    preferencesModalLightThemes: 'Light themes',
    preferencesModalDarkThemes: 'Dark themes',
  };

  return (
    <CodeEditor
      ace={ace}
      language="javascript"
      value={`import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigw from 'aws-cdk-lib/aws-apigateway';

class TestStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const api = new apigw.RestApi(this, 'cors-api-test', {
        cloudWatchRole: true,
    });

    const handler = new lambda.Function(this, 'handler', {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: 'index.handler',
        code: lambda.Code.fromAsset(path.join(__dirname, 'integ.cors.handler')),
    });

    const twitch = api.root.addResource('twitch');
    const backend = new apigw.LambdaIntegration(handler);
    if (true) {
        twitch.addMethod('GET', backend); // GET /twitch
    }
    twitch.addMethod('GET', backend); // GET /twitch
    twitch.addMethod('POST', backend); // POST /twitch
    twitch.addMethod('DELETE', backend); // DELETE /twitch
    twitch.addCorsPreflight({ allowOrigins: ['https://google.com', 'https://www.test-cors.org'] });
    }
}
`}
      preferences={{
        wrapLines: true,
        theme: 'dawn',
      }}
      onPreferencesChange={(e) => setPreferences(e.detail)}
      i18nStrings={i18nStrings}
      loading={loading}
      onDelayedChange={(event) => props.onChange(event.detail.value)}
      themes={{ light: ['dawn'], dark: ['tomorrow_night_bright'] }}
    />
  );
};

export default Editor;
