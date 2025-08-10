// import React from 'react';
import { marked } from 'marked';

interface PreviewProps {
  markdownText: string;
}

export default function Preview({ markdownText }: PreviewProps) {
  // تبدیل Markdown به HTML
  const getMarkdownText = () => {
    const rawMarkup = marked(markdownText, { breaks: true, gfm: true });
    return { __html: rawMarkup };
  };

  return (
    <div
    id="preview"
    className="preview"
    dangerouslySetInnerHTML={getMarkdownText()}
  />
  );
}

