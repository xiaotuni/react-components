/**
 * 图标 <XtnIcon IconType="iconDefault" IsSelect onClick = {this.__HandlerClick.bind(this)} /> 
 */
import React, { PropTypes, Component } from 'react';
import { Utility } from 'components';

export default class XtnIcon extends Component {
  static propTypes = {
    IconType: PropTypes.string,                                        // Icon类型
    DefaultIconSize: PropTypes.string,                                 // DefaultIconSize
    IsHidePadding: PropTypes.bool,                                     // 是否隐藏padding
    IsSelect: PropTypes.bool,                                          // 是否选中
    onClick: PropTypes.func,                                           // 单击事件
  }

  __HandlerClick(ee) {
    const { onClick } = this.props;
    if (!onClick || !Utility.isFunction(onClick)) {
      return;
    }
    onClick(ee);
  }

  __GetStyle(styles) {
    const { IconType } = this.props;
    if (!IconType) {
      return {};
    }
    const __style = {};
    let __IconImg = '';
    if (IconType) {
      __IconImg = styles[IconType];
    }
    if (!__IconImg) {
      __style.backgroundImage = 'url(' + IconType + ')';
      __style.backgroundSize = '100%';
      __style.borderRadius = '100%';
    }
    return __style;
  }


  render() {
    const styles = require('./scss/IconLib.scss');
    const { IconType, IsSelect, IsHidePadding, DefaultIconSize } = this.props;
    const __DefaultIcon = styles[DefaultIconSize] ? styles[DefaultIconSize] : ' ';
    const __IconImg = styles[IconType] ? styles[IconType] : styles.iconDefault;
    return (
      <div className={styles.iconCss + ' ' +
        (!!IsSelect ? styles.select : '') + ' ' +
        (!!IsHidePadding ? styles.hidePadding : '') + ' ' +
        __IconImg + ' ' + __DefaultIcon}
        onClick={this.__HandlerClick.bind(this)}
      >
        <div style={this.__GetStyle(styles)}></div>
      </div>
    );
  }
}

