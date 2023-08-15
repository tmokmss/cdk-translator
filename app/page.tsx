'use client';

import { SpaceBetween, Button, Tabs, Popover, StatusIndicator, Spinner, Box, TextContent } from '@cloudscape-design/components';
import Grid from '@cloudscape-design/components/grid';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Editor from '@/components/editor/Editor';
import * as translator from '@/components/translator';
import initialSnippets from '@/components/translator/initialValues.json';

import Header from '@/components/header/Header';
import Snippet from '@/components/snippet/Snippet';

export default function App() {
  const [status, setStatus] = useState('');
  const [activeTab, setActiveTab] = useState('python');
  const [snippet, setSnippet] = useState(initialSnippets.typescript);
  const [python, setPython] = useState(initialSnippets.python);
  const [java, setJava] = useState(initialSnippets.java);
  const [csharp, setCsharp] = useState(initialSnippets.csharp);
  const [go, setGo] = useState(initialSnippets.go);

  const languages: Record<string, { value: string; setter: Dispatch<SetStateAction<string>>; displayName: string }> = {
    python: { value: python, setter: setPython, displayName: 'Python' },
    java: { value: java, setter: setJava, displayName: 'Java' },
    csharp: { value: csharp, setter: setCsharp, displayName: 'C#' },
    go: { value: go, setter: setGo, displayName: 'Go' },
  };

  useEffect(() => {
    setStatus('initializing the environment...');
    const init = async () => {
      return await translator.initialize();
    };
    init().then((_) => setStatus(''));

    return translator.teardown();
  }, [setStatus]);

  const onTabSelectionChange = async (newTabId: string) => {
    setActiveTab(newTabId);
    await translate(snippet, newTabId);
  };

  const onSnippetChange = async (newSnippet: string) => {
    setSnippet(newSnippet);
    await translate(newSnippet, activeTab);
  };

  const translate = async (snippet: string, targetLanguage: string) => {
    // TODO: use some queue
    if (translator.isProcessing()) return;
    setStatus(`translating to ${languages[targetLanguage].displayName}...`);
    try {
      const res = await translator.translate(snippet, targetLanguage);
      if (res !== undefined) {
        languages[targetLanguage].setter(res);
      }
    } catch (e) {
      throw e;
    } finally {
      setStatus('');
    }
  };

  return (
    <>
      <SpaceBetween size="m">
        <Header />

        <Box padding={{ left: 's', right: 's' }}>
          <SpaceBetween size="xxs">
            <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
              <SpaceBetween size="s">
                <Editor initialValue={initialSnippets.typescript} onChange={(snippet) => onSnippetChange(snippet)} />
                <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
                  <Box margin={{ top: 'xs' }}>
                    <SpaceBetween direction="horizontal" size="s">
                      {status != '' ? <Spinner /> : <></>}
                      <TextContent>{status}</TextContent>
                    </SpaceBetween>
                  </Box>
                  <Box float="right">
                    <Popover
                      size="small"
                      position="top"
                      triggerType="custom"
                      dismissButton={false}
                      content={<StatusIndicator type="success">{activeTab} code copied!</StatusIndicator>}
                    >
                      <Button
                        iconName="copy"
                        onClick={() => {
                          navigator.clipboard.writeText(languages[activeTab].value);
                        }}
                      >
                        Copy Code
                      </Button>
                    </Popover>
                  </Box>
                </Grid>
              </SpaceBetween>
              <div>
                <Tabs
                  onChange={(event) => onTabSelectionChange(event.detail.activeTabId)}
                  tabs={Object.entries(languages).map(([id, language]) => ({
                    label: language.displayName,
                    id,
                    content: <Snippet language={id} snippet={language.value} />,
                  }))}
                />
              </div>
            </Grid>
          </SpaceBetween>
        </Box>
      </SpaceBetween>
    </>
  );
}
