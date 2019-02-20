import React, { Component } from 'react'

import OverScroll from 'react-overscroll'

export default class App extends Component {
  render () {
    const text = "The quick brown fox jumps over the lazy dog"
    return (
      <div className="page">
      <h1>React over-scroll</h1>
      <p>Component description goes here</p>
      <p>Example:</p>
        <div className="test-container">
          <OverScroll>{text}</OverScroll>
        </div>
      </div>
    )
  }
}
