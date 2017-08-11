/**
 * Created by admin on 2016-09-21.
 */
import React, { Component, PropTypes } from 'react';
import { Utility, XtnDefHref } from 'components';
import { connect } from 'react-redux';
import * as CommonActions from 'redux/modules/reduxCommon';

@connect(
  state => ({
    Title: state.Common.Title,                                          // 标题
    UrlParams: state.Common.UrlParams,                                  // URL参数
  }),
  { ...CommonActions })
export default class Default extends Component {
  static propTypes = {
    Title: PropTypes.string,                                              // 标题
    UrlParams: PropTypes.object,                                         // url 参数
  };

  constructor(props) {
    super(props);

    this.state = { RefreshComplete: true, NextDataComplete: true, UA: navigator.userAgent };
  }

  componentDidMount() {
  }

  /**
   * 跳转到商品详情里去。
   * @param params
   * @private
   */
  __HandlerGoToPage(url, params) {
    Utility.$toPage(url, params);
  }

  __OnLoading() {
    Utility.$loading();
    this.state.times = 5;
    this.setState({ times: this.state.times });
    const Intervalue = setInterval(() => {
      this.state.times--;
      this.setState({ times: this.state.times });
      if (this.state.times === 0) {
        clearInterval(Intervalue);
        Utility.$loadingHide();
        return;
      }
    }, 1000);
  }

  __OnAlert() {
    Utility.$alert('消息内容啦', '标题信息');
  }

  __OnConfirm() {
    Utility.$showDialog(<div>'您真的删除吗？'</div>, '确定取消弹框', () => {
      Utility.$alert('你点击的是确定', '标题信息');
    }, () => {
      Utility.$alert('你点击的是取消', '标题信息');
    });
  }

  render() {
    const styles = require('./scss/Default.scss');
    const { times } = this.state;
    return (
      <div className={styles.defaultCss}>
        <XtnDefHref />
        <div className={styles.components}>
          <div className={styles.title}>
            Component Demo
          </div>
          <div className={styles.demoItem}>
            <div className={styles.item} onClick={this.__OnLoading.bind(this)}>{times > 0 ? 'Loading(' + times + ')' : 'Loading'}</div>
            <div className={styles.item} onClick={this.__OnAlert.bind(this)}>Alert Message</div>
            <div className={styles.item} onClick={this.__OnConfirm.bind(this)}>Confirm</div>
            <div>

            </div>
            <div></div>
          </div>
        </div>
      </div>
    );
  }
}

