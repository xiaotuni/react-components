/**
 * Created by admin on 2016-09-22.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Utility } from 'components';

export default class XtnDefHref extends Component {
  static propTypes = {
    IsShowBackArrow: PropTypes.bool,                                 // 是否显示返回按键
    Title: PropTypes.string,                                          // 标题
    UrlParams: PropTypes.object,                                      // url 参数
  }

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  __HandlerToPage(param) {
    const UrlItem = Utility.constItem.UrlItem;
    const __keys = Object.keys(UrlItem);
    for (let __index = 0; __index < __keys.length; __index++) {
      const __key = __keys[__index];
      if (__key.toLowerCase() === param.name.toLowerCase()) {
        Utility.setContent('__CurrentSelectHref', '/' + param.name);
        // console.log(UrlItem[__key]);
        Utility.$toPage(UrlItem[__key]);
        // 页面进行跳转
        return;
      }
    }
  }

  __BuildHref(styles) {
    const _currentSelectHref = Utility.getContent('__CurrentSelectHref');
    const __obj = Utility.constItem.UrlTitle;
    // const __item = Object.keys(__obj).reverse().map((key, __index)=> {
    const __item = Object.keys(__obj).map((key, __index) => {
      const __row = __obj[key];
      return (
        <div key={'My_Href_Index_' + __index}
          className={styles.item + ' ' + (_currentSelectHref === key ? styles.select : '')}
          onClick={this.__HandlerToPage.bind(this, Object.assign({ name: key.substr(1) }, __row))}>
          <div>{__index + ':' + __row.Title}</div>
        </div>
      );
    });

    return __item;
  }

  __HandlerBuildDemo(item) {
    const { txtIconDemo } = this.refs;
    txtIconDemo.value = `<VepIcon IconType="${item.IconType}" IsHidePadding={false} onClick={this.__HandlerClickIcon.bind(this)}/>`;
  }
  render() {
    const styles = require('./scss/MyHref.scss');

    return (
      <div className={styles.myHref}>
        {this.__BuildHref(styles)}
      </div>
    );
  }
}
