import CodeEditor, { CodeEditorProps } from '@cloudscape-design/components/code-editor';
import { useEffect, useState } from 'react';

// https://github.com/cloudscape-design/components/issues/703
import ace from 'ace-builds';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox'; // Optional - adds searchbox (Cmd+F)
import 'ace-builds/css/ace.css';

// Theme - Dawn
import 'ace-builds/src-noconflict/theme-dawn';
import 'ace-builds/css/theme/dawn.css';

// Theme - Tomorrow Night Bright
import 'ace-builds/src-noconflict/theme-tomorrow_night_bright';
import 'ace-builds/css/theme/tomorrow_night_bright.css';

// Language support - JavaScript
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/snippets/typescript';
import 'ace-builds/src-noconflict/snippets/javascript';

import javascriptWorkerPath from 'ace-builds/src-noconflict/worker-javascript';
import { useWindowSize } from '@/components/editor/dimension';
ace.config.setModuleUrl('ace/mode/javascript_worker', javascriptWorkerPath);

// CSP-compliant mode support
// From: https://cloudscape.design/components/code-editor/?tabId=api
ace.config.set('useStrictCSP', true);
ace.config.set('loadWorkerFromBlob', false);

type EditorProps = {
  onChange: (value: string) => void;
  initialValue?: string;
  loading?: boolean;
};

const Editor = (props: EditorProps) => {
  const [preferences, setPreferences] = useState({});
  const [loading, setLoading] = useState(false);
  const { height, width } = useWindowSize();

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
      language="typescript"
      value={props.initialValue ?? ''}
      preferences={{
        wrapLines: false,
        theme: 'dawn',
      }}
      onPreferencesChange={(e) => setPreferences(e.detail)}
      i18nStrings={i18nStrings}
      loading={props.loading ?? false}
      editorContentHeight={height - 180}
      onDelayedChange={(event) => props.onChange(event.detail.value)}
      themes={{ light: ['dawn'], dark: ['tomorrow_night_bright'] }}
    />
  );
};

export default Editor;
