import React, { useRef, useEffect } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import useUndo from 'use-undo';

const defaultMarkdown = `<!DOCTYPE html>
<html>
  <head>
    <title>soleymannzhad</title>
  </head>
  <body>
    <h1>soleymannzhad</h1>
  </body>
</html>`;

function getTextStats(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const lines = text.split('\n').length;
  const characters = text.length;
  return { words, lines, characters };
}

export default function App() {
const [state, { set: setMarkdownText, undo, redo, canUndo, canRedo }] = useUndo(defaultMarkdown);

const markdownText = state.present;

  const [editorWidth, setEditorWidth] = React.useState(50);

  const containerRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      let newEditorWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

      if (newEditorWidth < 20) newEditorWidth = 20;
      if (newEditorWidth > 80) newEditorWidth = 80;

      setEditorWidth(newEditorWidth);
    };

    const handleMouseUp = () => {
      isResizing.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const startResizing = () => {
    isResizing.current = true;
  };

  // محاسبه آمار متن
  const stats = getTextStats(markdownText);

  // کنترل کلیدهای Ctrl+Z و Ctrl+Y برای undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (canUndo) undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        if (canRedo) redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, undo, redo]);

  return (
    <div ref={containerRef} className="app-container" style={{ height: '100vh', display: 'flex' }}>
      <div style={{ width: `${editorWidth}%`, height: '100%' }}>
        <Editor markdownText={markdownText} setMarkdownText={setMarkdownText} stats={stats} />
        <div style={{ marginTop: 8 }}>
          <button onClick={undo} disabled={!canUndo} style={{ marginRight: 8 }}>
            Undo (Ctrl+Z)
          </button>
          <button onClick={redo} disabled={!canRedo}>
            Redo (Ctrl+Y)
          </button>
        </div>
      </div>

      <div
        onMouseDown={startResizing}
        style={{
          width: 5,
          cursor: 'col-resize',
          backgroundColor: '#ddd',
          height: '100%',
          userSelect: 'none',
        }}
      />

      <div style={{ width: `${100 - editorWidth}%`, height: '100%' }}>
        <Preview markdownText={markdownText} />
      </div>
    </div>
  );
}
