import React, { Component } from 'react';
import "./progress.scss"
class Progress extends Component {
  constructor(props) {
    super()
  }
  render() {
    const progressNum = this.props.num;
    console.log(progressNum, 'progressNum')
    const progressWidth = progressNum * 60;
    return (
      <div className="progress-content" style={{ "width": `${progressWidth}px` }}>
      </div>
    )
  }
}
export default Progress;
