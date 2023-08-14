'use client';

import { SpaceBetween, Button, Tabs, Popover, StatusIndicator, Spinner, Box } from '@cloudscape-design/components';
import Grid from '@cloudscape-design/components/grid';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Editor from '@/components/editor/Editor';
import * as translator from '@/components/translator';
import initialSnippets from '@/components/translator/initialValues.json';

import Header from '@/components/header/Header';
import Snippet from '@/components/snippet/Snippet';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('python');
  const [snippet, setSnippet] = useState(initialSnippets.typescript);
  const [python, setPython] = useState(initialSnippets.python);
  const [java, setJava] = useState(initialSnippets.java);
  const [csharp, setCsharp] = useState(initialSnippets.csharp);
  const [go, setGo] = useState(initialSnippets.go);

  const languages: Record<string, [string, Dispatch<SetStateAction<string>>]> = {
    python: [python, setPython],
    java: [java, setJava],
    csharp: [csharp, setCsharp],
    go: [go, setGo],
  };

  useEffect(() => {
    const init = async () => {
      return await translator.initialize();
    };
    init().then((_) => setLoading(false));

    return translator.teardown();
  });

  const onTabSelectionChange = async (newTabId: string) => {
    setActiveTab(newTabId);
    await translate(snippet, newTabId);
  };

  const onCodeChange = async (newSnippet: string) => {
    setSnippet(newSnippet);
    await translate(newSnippet, activeTab);
  };

  const translate = async (snippet: string, targetLanguage: string) => {
    // TODO: use some queue
    if (processing) return;
    setProcessing(true);
    try {
      const res = await translator.translate(snippet, targetLanguage);
      if (res !== undefined) {
        languages[targetLanguage][1](res);
      }
    } catch (e) {
      throw e;
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <SpaceBetween size="m">
        <Header />

        <Box padding={{ left: 's', right: 's' }}>
          <SpaceBetween size="xxs">
            <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
              <div>
                <Editor initialValue={initialSnippets.typescript} onChange={(snippet) => onCodeChange(snippet)} />
              </div>
              <div>
                <Tabs
                  onChange={(event) => onTabSelectionChange(event.detail.activeTabId)}
                  tabs={[
                    {
                      label: 'Python',
                      id: 'python',
                      content: <Snippet language="python" snippet={python} />,
                    },
                    {
                      label: 'Java',
                      id: 'java',
                      content: <Snippet language="java" snippet={java} />,
                    },
                    {
                      label: 'C#',
                      id: 'csharp',
                      content: <Snippet language="csharp" snippet={csharp} />,
                    },
                    {
                      label: 'Go',
                      id: 'go',
                      content: <Snippet language="go" snippet={go} />,
                    },
                  ]}
                />
                <Grid gridDefinition={[{ colspan: 9 }, { colspan: 1 }, { colspan: 1 }, { colspan: 1 }]}>
                  <div></div>
                  <div></div>
                  <div>{processing || loading ? <Spinner /> : <></>}</div>
                  <div>
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
                          navigator.clipboard.writeText(languages[activeTab][0]);
                        }}
                      ></Button>
                    </Popover>
                  </div>
                </Grid>
              </div>
            </Grid>
          </SpaceBetween>
        </Box>
      </SpaceBetween>
    </>
  );
}
