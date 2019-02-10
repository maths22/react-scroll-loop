import React, {Component} from 'react';
import Swipe from './swipe';

import styles from './style.css';

class ScrollLoop extends Component {

  constructor(props) {
    super(props);
    this.reset = false;
  }

  setContainerRef = (ref) => {
    const {speed, minSpeed = 10, auto = 1, transitionEnd} = this.props;
    var swipeOptions = {speed, minSpeed, transitionEnd, auto};

    this.swipe = Swipe(ref, swipeOptions);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.children.length != this.props.children.length) {
      this.reset = true;
    }
  }

  componentDidUpdate() {
    if (this.reset) {
      this.reset = false;
      if (this.swipe) {
        this.swipe.stop();
        this.swipe.setup();
        this.swipe.begin(this.props.auto);
      }
    }
  }

  componentWillUnmount() {
    this.swipe.kill();
    this.swipe = void 0;
  }

  render() {
    const {height = 200, id, className, children, style} = this.props;

    return (
        <div ref={this.setContainerRef} id={id} className={`${styles.container} ${className}`} style={{height: height + 'px', ...style}}>
            <div className={styles.swipeWrap}>
                {React.Children.map(children, (child) => {
                  if (!child) {
                    return null;
                  }

                  const childStyle = child.props.style ? child.props.style : {};

                  return React.cloneElement(child, {style: childStyle, className: child.props.className + ' ' + styles.itemWrap});
                })}
                {
                  children && children.length === 2 && React.Children.map(children, (child) => {
                    if (!child) {
                      return null;
                    }

                    const childStyle = child.props.style ? child.props.style : {};

                    return React.cloneElement(child, {style: childStyle, className: child.props.className + ' ' + styles.itemWrap});
                  })
                }
            </div>
        </div>
    );
  }
}

export default ScrollLoop;
