import React from 'react'
// @ts-ignore
import styles from './styles.css'

type Props = {
  height: string;
  speed: number
}

const BUMPER_PERCENT = 0.25

export default class Scroll extends React.Component<Props> {
  static defaultProps = {
    speed: 0.05
  }

  private disabled: boolean = false
  private container: React.RefObject<HTMLDivElement>
  private parent: React.RefObject<HTMLDivElement>
  private child: React.RefObject<HTMLDivElement>
  private widthDiff: number = 0
  private parentWidth: number = 0
  private childWidth: number = 0
  private offset: number = 0
  private childPosition: number = 0
  private childTarget: number = 0
  private bumper: number = 0
  private raf: number | null = null;

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
    window.addEventListener('resize', this.handleResize)

    this.getSizes()
    // this.addNoWrap();
    this.getSizes();
    if (this.widthDiff <= 0) {
      this.disabled = true
    }
  }

  componentWillUnmount(){
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.resizeParent()
  }

  resizeParent = () => {
    console.log(`resizing`);
    this.removeNoWrap()
    this.parentWidth = this.getWidth(this.parent.current)
    this.addNoWrap();
  }

  addNoWrap = () => {
    const style = `width: ${this.parentWidth}px; white-space: nowrap;`
    this.parent.current!.setAttribute('style', style)
  }

  removeNoWrap = () => {
    this.parent.current!.setAttribute('style', '')
  }

  getSizes = () => {
    this.parentWidth = this.getWidth(this.parent.current)
    this.addNoWrap();
    this.childWidth = this.getWidth(this.child.current)
    this.widthDiff = this.childWidth - this.parentWidth
    this.bumper = this.parentWidth * BUMPER_PERCENT
  }

  getWidth(el: HTMLElement | null) {
    if (!el) throw new Error('Element is null')
    return el.offsetWidth
  }

  onMouseOut = (event: React.MouseEvent<HTMLInputElement>) => {
    if (this.disabled) return
    this.resetPosition()
  }

  onMouseMove = (event: React.MouseEvent<HTMLInputElement>) => {
    // If child already fits, we don't need to do anything
    if (this.disabled) return

    this.getSizes()

    // get the local X possition within the parent
    const parent = this.parent.current
    const parentRect = parent!.getBoundingClientRect()
    const x = event.clientX - parentRect.left // x position within the element.

    // Calculate offset; what local X maps to within bigger child. For ex:
    // if child is 200px wide, and parent is 50, then x of 25 should be 100 in child.
    this.offset = this.mapRange(
      x,
      this.bumper,
      this.parentWidth - this.bumper,
      0,
      this.widthDiff
    )

    // Make sure the offset is within bounds
    if (this.offset < 0) this.offset = 0
    if (this.offset > this.widthDiff) this.offset = this.widthDiff

    // Start child sliding animation to the target offset
    this.childTarget = -1 * this.offset
    this.startSlide()
  }

  // Moves child back to 0
  resetPosition = () => {
    this.childTarget = 0
    this.startSlide()
  }

  startSlide = () => {
    // If there's already an animation in progress, don't do anything
    if (!this.raf) {
      this.raf = requestAnimationFrame(this.slide)
    }
  }

  slide = () => {
    const delta = this.childTarget - this.childPosition

    // each "frame" we move by SLIDE_SPEED percent of the distance
    // TODO: conver this to time based with animation curves
    this.childPosition = this.childPosition + delta * this.props.speed
    this.setChildPosition(this.childPosition)

    // end animation if we're less than 1px away
    if (Math.abs(delta) < 1) {
      cancelAnimationFrame(this.raf!)
      this.raf = null
      return
    }

    // Get next "frame"
    requestAnimationFrame(this.slide)
  }

  setChildPosition(x: number) {
    const y = 0
    const style = `
      -ms-transform: translate(${x}px, ${y}px);]
      -webkit-transform: translate(${x}px, ${y}px);
      transform: translate(${x}px, ${y}px);
    `
    this.child.current!.setAttribute('style', style)
  }

  // map value X in range a->b to rage c->d
  mapRange(x: number, a: number, b: number, c: number, d: number) {
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
        onMouseLeave={this.onMouseOut}
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
