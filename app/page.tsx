'use client';

import { SpaceBetween, Header, Container, Input, Button, Textarea, Tabs, Popover, StatusIndicator, Spinner } from '@cloudscape-design/components';
import Grid from '@cloudscape-design/components/grid';
import { useEffect, useState } from 'react';
import 'ace-builds/css/ace.css';
import 'ace-builds/css/theme/dawn.css';
import 'ace-builds/css/theme/tomorrow_night_bright.css';
import Editor from '@/components/editor/Editor';
import * as translator from '@/components/translator';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState('');

  useEffect(() => {
    const init = async () => {
      return await translator.initialize();
    };
    const ff = async () => {
      if (url =='') return;
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          snippet: "import * from 'path';",
          language: 'java',
        }),
      });
      const js = await res.text();
      console.log(js);
    };
    init()
      .then((newUrl) => setUrl(newUrl ?? url))
      .then((_) => setLoading(false))
      .then((_) => ff());

    return translator.teardown();
  });

  const translate = async (snippet: string) => {
    console.log(snippet);
    const res = await translator.translate(snippet, 'Python');
    console.log(res);
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
                  tabs={[
                    {
                      label: 'Python',
                      id: 'python',
                      content: 'aa',
                    },
                    {
                      label: 'Java',
                      id: 'java',
                      content: 'Second tab content area',
                    },
                    {
                      label: 'C#',
                      id: 'csharp',
                      content: 'Third tab content area',
                    },
                    {
                      label: 'Go',
                      id: 'go',
                      content: 'Third tab content area',
                    },
                  ]}
                />
                <div>
                  <Popover
                    size="small"
                    position="top"
                    triggerType="custom"
                    dismissButton={false}
                    content={<StatusIndicator type="success">[Name of the content] copied</StatusIndicator>}
                  >
                    <Button
                      iconName="copy"
                      onClick={() => {
                        navigator.clipboard.writeText('[text to be copied]');
                      }}
                    ></Button>
                  </Popover>
                </div>
              </Grid>
              <Container
                fitHeight
                header={
                  <Header variant="h2" description="Container description">
                    Container title
                  </Header>
                }
              >
                Container content
              </Container>
            </div>
          </Grid>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
