/**
 * Created by admin on 2016-09-21.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { Utility, XtnDefHref, XtnScroll } from 'components';
import { Utility } from 'components';
// import { connect } from 'react-redux';
// import * as CommonActions from 'redux/modules/reduxCommon';

const styles = require('./scss/Default.scss');

// @connect(
//   state => ({
//     Title: state.Common.Title,                                          // 标题
//     UrlParams: state.Common.UrlParams,                                  // URL参数
//   }),
//   { ...CommonActions })
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
  __OnActionSheet() {
    Utility.$actionSheet('这是内容啦', '这是标题啦');
  }

  __OnActionSheetBtns() {
    const __CallBack = (args) => {
      console.log(args);
      Utility.$actionSheetHide();
    };
    Utility.$actionSheet(null, null, null, null, [
      { Title: '标题1', funName: __CallBack.bind(this) },
      { Title: '标题2', funName: __CallBack.bind(this) },
      { IsSplitLine: true },
      { Title: '标题3', funName: __CallBack.bind(this) },
    ]);
  }

  __UpdateRender() {
    this.setState({ __CURRENT_DATE_: new Date() });
  }

  __BuildScroll() {
    const { ScrollList } = this.state;
    if (!Utility.$isArray(ScrollList)) {
      return null;
    }
    return ScrollList.map((row, index) => {
      return (<div className={styles.scrollRow} key={index}>
        {row}
      </div>);
    });
  }

  __InitDataByScroll(pageIndex) {
    const _pageSize = 10;
    let { ScrollList } = this.state;
    if (pageIndex === 0) {
      ScrollList = [];
      this.state.ScrollList = ScrollList;
    }
    for (let i = pageIndex * _pageSize; i < (pageIndex + 1) * _pageSize; i++) {
      ScrollList.push(i + 1);
    }
  }
  __HandlerScrollRefresh() {
    this.state.ScrollIndex = 0;
    this.state.RefreshComplete = false;
    this.__UpdateRender();
    setTimeout(() => {
      this.__InitDataByScroll(this.state.ScrollIndex);
      this.state.RefreshComplete = true;
      this.__UpdateRender();
    }, 2000);
  }

  __HandlerScrollNextData() {
    this.state.ScrollIndex++;

    this.state.NextDataComplete = false;
    this.__UpdateRender();
    setTimeout(() => {
      this.__InitDataByScroll(this.state.ScrollIndex);
      this.state.NextDataComplete = true;
      this.__UpdateRender();
    }, 2000);
  }

  __txtFocus() {
    const { divFooter } = this.refs;
    if (!divFooter) {
      return;
    }
    divFooter.scrollIntoView();
  }

        // <XtnDefHref />
  render() {
    // const { times, IsShowScroll, RefreshComplete, NextDataComplete } = this.state;
    const { times } = this.state;
    return (
      <div className={styles.defaultCss}>
        <div className={styles.components}>
          <div className={styles.title}>
            Component Demo
          </div>
          <div className={styles.demoItem}>
            <div className={styles.item} onClick={this.__OnLoading.bind(this)}>{times > 0 ? 'Loading(' + times + ')' : 'Loading'}</div>
            <div className={styles.item} onClick={this.__OnAlert.bind(this)}>Alert Message</div>
            <div className={styles.item} onClick={this.__OnActionSheet.bind(this)}>Action Sheet</div>
            <div className={styles.item} onClick={this.__OnActionSheetBtns.bind(this)}>Action Sheet Buttons</div>
            <div className={styles.item} onClick={this.__OnConfirm.bind(this)}>Confirm</div>
            <div className={styles.item} onClick={() => {
              this.state.IsShowScroll = !this.state.IsShowScroll;
              if (!!this.state.IsShowScroll) {
                this.__HandlerScrollRefresh();
              }
            }}>XtnScroll</div>
          

          </div>

        </div>

        <div ref="divFooter" className={styles.footer}>
          <input type="text" onFocus={this.__txtFocus.bind(this)} />
        </div>
      </div>
    );
  }
}

// {
//   !!IsShowScroll && <div className={styles.xtnScroll}> <XtnScroll RefreshComplete={RefreshComplete}
//     NextDataComplete={NextDataComplete}
//     onRefresh={this.__HandlerScrollRefresh.bind(this)}
//     onNextData={this.__HandlerScrollNextData.bind(this)}
//   >
//     {
//       this.__BuildScroll()
//     }
//   </XtnScroll></div>
// }

