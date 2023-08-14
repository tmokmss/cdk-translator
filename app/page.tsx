'use client';

import { SpaceBetween, Header, Container, Input, Button, Textarea, Tabs, Popover, StatusIndicator, Spinner } from '@cloudscape-design/components';
import Grid from '@cloudscape-design/components/grid';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Editor from '@/components/editor/Editor';
import * as translator from '@/components/translator';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight as theme } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('python');
  const [python, setPython] = useState('');
  const [java, setJava] = useState('');
  const [csharp, setCsharp] = useState('');
  const [go, setGo] = useState('');

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

  const translate = async (snippet: string) => {
    setProcessing(true);
    console.log(snippet);
    const res = await translator.translate(snippet, activeTab);
    languages[activeTab][1](res);
    setProcessing(false);
  };

  return (
    <SpaceBetween size="m">
      <Container>
        {loading ? <Spinner /> : <></>}
        <SpaceBetween size="s">
          <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
            <div>
              <Editor onChange={(snippet) => translate(snippet)} />
            </div>
            <div>
              <Grid gridDefinition={[{ colspan: 11 }, { colspan: 1 }]}>
                <Tabs
                  onChange={(event) => setActiveTab(event.detail.activeTabId)}
                  tabs={[
                    {
                      label: 'Python',
                      id: 'python',
                      content: (
                        <Container fitHeight>
                          <SyntaxHighlighter language="python" style={theme}>
                            {python}
                          </SyntaxHighlighter>
                        </Container>
                      ),
                    },
                    {
                      label: 'Java',
                      id: 'java',
                      content: (
                        <Container fitHeight>
                          <pre>{java}</pre>
                        </Container>
                      ),
                    },
                    {
                      label: 'C#',
                      id: 'csharp',
                      content: (
                        <Container fitHeight>
                          <pre>{csharp}</pre>
                        </Container>
                      ),
                    },
                    {
                      label: 'Go',
                      id: 'go',
                      content: (
                        <Container fitHeight>
                          <pre>{go}</pre>
                        </Container>
                      ),
                    },
                  ]}
                />
                <div>
                  <Popover
                    size="small"
                    position="top"
                    triggerType="custom"
                    dismissButton={false}
                    content={<StatusIndicator type="success">{activeTab} code copied!</StatusIndicator>}
                  >
                    {processing ? <Spinner /> : <></>}
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
      </Container>
    </SpaceBetween>
  );
}
