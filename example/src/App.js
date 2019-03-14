import React, { Component } from 'react';
import OverScroll from 'react-text-overscroll';

// import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import { ghcolors as theme } from 'react-syntax-highlighter/dist/esm/styles/prism';

SyntaxHighlighter.registerLanguage('jsx', jsx);

export default class App extends Component {
  render() {
    const sample = `
<OverScroll height="30px">
  The quick brown fox jumps over the lazy dog
</OverScroll>
  `;
    const text = 'The quick brown fox jumps over the lazy dog';
    return (
      <div className="page">
        <h1>react-text-overscroll</h1>
        <p>
          Instead of cutting off overflow'ed text with ellipsis, this components
          will scroll the text when the mouse moves
        </p>
        <p>Examples:</p>
        <div className="test-container" style={{ width: '150px' }}>
          <OverScroll height="30px">{text}</OverScroll>
        </div>

        <div className="test-container">
          <OverScroll height="30px">
            Call me Ishmael. Some years ago - never mind how long precisely -
            having little or no money in my purse, and nothing particular to
            interest me on shore, I thought I would sail about a little and see
            the watery part of the world.
          </OverScroll>
        </div>

        <div className="code">
          <SyntaxHighlighter language="jsx" style={theme}>
            {sample}
          </SyntaxHighlighter>
        </div>
      </div>
    );
  }
}
