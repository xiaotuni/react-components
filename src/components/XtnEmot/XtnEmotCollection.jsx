/**
 * 图标 <XtnEmoticon IconType="iconDefault" IsSelect onClick = {this.__HandlerClick.bind(this)} /> 
 */
import React, { PropTypes, Component } from 'react';
import { Utility } from 'components';
const styles = require('./scss/XtnEmoticon.scss');

export default class XtnEmoticon extends Component {
  static propTypes = {
    IconType: PropTypes.string,                                        // Icon类型
    IsHidePadding: PropTypes.bool,                                     // 是否隐藏padding
    IsSelect: PropTypes.bool,                                          // 是否选中
    onSelect: PropTypes.func,                                          // 单击事件
  }
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
  }

  __HandlerSelect(item) {
    const { onSelect } = this.props;
    if (!Utility.isFunction(onSelect)) {
      return;
    }
    onSelect(item);
  }
  __BuildHTML() {
    const __EmotInfo = Utility.$emoticonCollection;
    return Object.keys(__EmotInfo).map((key, index) => {
      return (<div key={index} className={styles.emot}>
        <div className={styles['emot_' + index]} onClick={this.__HandlerSelect.bind(this, __EmotInfo[key])}></div>
      </div >
      );
    });
  }

  render() {
    return (
      <div className={styles.emoticonCss} >
        <div className={styles.groups}>
          {
            this.__BuildHTML()
          }
        </div>
      </div>
    );
  }
}

