/**
 * 图标 <XtnEmotSingle EmotType="emot_0"/> 
 */
import React, { PropTypes, Component } from 'react';
import { } from 'components';
const styles = require('./scss/XtnEmoticon.scss');

export default class XtnEmotSingle extends Component {
  static propTypes = {
    EmotType: PropTypes.string,                                        // Icon类型
  }
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
  }

  render() {
    const { EmotType } = this.props;
    const __class = styles[EmotType] ? styles[EmotType] : styles.emot_default;
    return (
      <span className={styles.emoticonCss + ' ' + styles.emotClear} >
        <img className={styles.emotSingle + ' ' + __class} />
      </span>
    );
  }
}

