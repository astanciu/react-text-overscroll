import React from 'react'
// import PropTypes from 'prop-types'
import styles from './styles.css'

export default class Scroll extends React.Component {
  offset = 0;
  endGap = 20;
  state = {
    ellipsis: false
  };
  constructor() {
    super();
    this.container = React.createRef();
    this.parent = React.createRef();
    this.child = React.createRef();
  }

  componentDidMount() {
    this.getWidths();
    if (this.widthDiff > 0) {
      this.container.current.className = "container ellipsis";
    }
  }

  getWidths = () => {
    this.parentWidth = this.getWidth(this.parent.current);
    this.childWidth = this.getWidth(this.child.current);
    this.widthDiff = this.childWidth - this.parentWidth;
  };

  getWidth(el) {
    return el.offsetWidth;
  }

  //   onMouseOver = el => {
  //     this.hover = true;
  //   };
  onMouseOut = el => {
    this.resetPosition();
  };
  onMouseMove = el => {
    this.getWidths();
    let parent = this.parent.current;
    var rect = parent.getBoundingClientRect();
    var x = el.clientX - rect.left; //x position within the element.
    // console.log("Parent: ", this.parentWidth);
    // console.log("Child:  ", this.childWidth);
    // console.log("Diff:  ", this.widthDiff);
    // console.log("ParentWidth: ", this.parentWidth);
    // console.log("X: ", x);
    this.offset = this.mapRange(
      x,
      this.parentWidth,
      this.widthDiff + this.endGap * 2
    );

    this.child.current.setAttribute(
      "style",
      `margin-left: ${-1 * this.offset}px`
    );

    if (this.offset >= this.widthDiff - this.endGap) {
      this.container.current.className = styles.container;
    } else {
      this.container.current.className = styles.container + ' ' + styles.ellipsis;
    }
  };

  resetPosition = () => {
    this.child.current.setAttribute("style", `margin-left: 0px`);
  };

  mapRange(x, b, d) {
    const y = (x - 0) * ((d - 0) / (b - 0));
    return y;
  }

  render() {
    return (
      <div
        id="container"
        className={styles.container}
        onMouseOut={this.onMouseOut}
        ref={this.container}
      >
        <div
          id="scroverflow-inner-parent"
          className={styles.innerParent}
          ref={this.parent}
          onMouseOver={this.onMouseOver}
          onMouseMove={this.onMouseMove}
        >
          <div id="scroverflow-child" className={styles.child} ref={this.child}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
