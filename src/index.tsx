import React from 'react'
// @ts-ignore
import styles from './styles.css'

type Props = {
  height: string;
}

export default class Scroll extends React.Component<Props> {
  private disabled: boolean = false
  private container: React.RefObject<HTMLDivElement>
  private parent: React.RefObject<HTMLDivElement>
  private child: React.RefObject<HTMLDivElement>
  private widthDiff: number = 0
  private parentWidth: number = 0
  private childWidth: number = 0
  private offset: number = 0

  public state = {
    ellipsis: false
  }

  constructor(props) {
    super(props)
    this.container = React.createRef()
    this.parent = React.createRef()
    this.child = React.createRef()
  }

  componentDidMount() {
    this.getWidths()
    if (this.widthDiff > 0) {
      this.setState({ showEllipsis: true })
    }
    if (this.widthDiff <= 0) {
      this.disabled = true
    }
  }

  getWidths = () => {
    this.parentWidth = this.getWidth(this.parent.current)
    this.childWidth = this.getWidth(this.child.current)
    this.widthDiff = this.childWidth - this.parentWidth
  }

  getWidth(el: HTMLElement | null) {
    if (!el) throw new Error("Element is null")
    return el.offsetWidth
  }

  onMouseOut = (event: React.MouseEvent<HTMLInputElement>) => {
    if (this.disabled) return
    if (event.target !== this.child.current) {
      this.resetPosition()
    }
  }

  onMouseMove = (event: React.MouseEvent<HTMLInputElement>) => {
    // If child already fits, we don't need to do anything
    if (this.disabled) return
    this.getWidths()

    // get the local X possition within the parent
    const parent = this.parent.current
    const parentRect = parent!.getBoundingClientRect()
    const x = event.clientX - parentRect.left // x position within the element.

    // Calculate offset; what local X maps to within bigger child. For ex:
    // if child is 200px wide, and parent is 50, then x of 25 should be 100 in child.
    this.offset = this.mapRange(x, 30, this.parentWidth - 30, 0, this.widthDiff)

    if (this.offset < 0) this.offset = 0
    if (this.offset > this.widthDiff) this.offset = this.widthDiff

    this.setPosition(-1 * this.offset)
  }

  setPosition(x:number) {
    const y = 0
    const style = `
      -ms-transform: translate(${x}px, ${y}px);]
      -webkit-transform: translate(${x}px, ${y}px);
      transform: translate(${x}px, ${y}px);
    `
    this.child.current!.setAttribute('style', style)
  }

  resetPosition = () => {
    this.setPosition(0)
  }

  // map value X in range a->b to rage c->d
  mapRange(x, a, b, c, d) {
    let y = (x - a) * ((d - c) / (b - a)) + c
    return y
  }

  render() {
    const parentStyles = {
      lineHeight: '20px',
      height: '20px'
    }
    const height = this.props.height
    if (height) {
      parentStyles.lineHeight = height
      parentStyles.height = height
    }
    return (
      <div
        id='container'
        className={styles.container}
        onMouseOut={this.onMouseOut}
        ref={this.container}
      >
        <div
          id='scroverflow-inner-parent'
          className={styles.innerParent}
          style={parentStyles}
          ref={this.parent}
          onMouseMove={this.onMouseMove}
        >
          <div id='scroverflow-child' className={styles.child} ref={this.child}>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}
