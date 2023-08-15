import { Box } from '@cloudscape-design/components';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight as theme } from 'react-syntax-highlighter/dist/esm/styles/prism';

type SnippetProps = {
  language: string;
  snippet: string;
};

const Snippet = (props: SnippetProps) => {
  return (
    <Box>
      <SyntaxHighlighter language={props.language} style={theme}>
        {props.snippet}
      </SyntaxHighlighter>
    </Box>
  );
};

export default Snippet;
