
import { Editor as MonacoEditor } from '@monaco-editor/react';


interface EditorProps {
  markdownText: string;
  setMarkdownText: (text: string) => void;
  stats?: {
    words: number;
    lines: number;
    characters: number;
  };
}

export default function Editor({ markdownText, setMarkdownText }: EditorProps) {

  return (
    <div className='editor-container' style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>


      <div style={{ flexGrow: 1 }}>
        <MonacoEditor
          height="100%"
          defaultLanguage="html"
          value={markdownText}
          onChange={(value) => setMarkdownText(value || '')}
          options={{
            automaticLayout: true,
            wordWrap: 'on',
            minimap: { enabled: false },
            tabSize: 2,
            fontFamily: 'monospace',
            fontSize: 14,
            scrollBeyondLastLine: false,
          }}
        />
      </div>
    </div>
  );
}
