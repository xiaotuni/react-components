/**
 * Created by admin on 2016-10-23.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Utility } from 'components';
const styles = require('./scss/XtnScroll.scss');
/**
 * <XtnScroll 
 *   RefreshComplete={RefreshComplete} 
 *   NextDataComplete={NextDataComplete}
 *   onRefresh={()=>{....}}
 *   onNextData={()=>{....}}
 * />
 */
export default class XtnScroll extends Component {
  static propTypes = {
    children: PropTypes.any,                                             // 子项
    Percentage: PropTypes.number,                                        // 百分比
    LoadType: PropTypes.number,                                          // loading type
    RefreshComplete: PropTypes.bool,                                     // 刷新完成
    NextDataComplete: PropTypes.bool,                                    // 加载更多数据完成
    MarginBottom: PropTypes.number,                                      // 离下面距离
    MarginTop: PropTypes.number,                                         // 离上面距离
    onRefresh: PropTypes.func,                                           // 刷新操作
    onNextData: PropTypes.func,                                          // 更多数据
    onSlideLeft: PropTypes.func,                                         // 左边滑动
    onSlideRight: PropTypes.func,                                        // 右边滑动
    onSlideRange: PropTypes.func,                                        // 左右滑动距离
    onSlideRangeEnd: PropTypes.func,                                     // 
    onSlideRangeBegin: PropTypes.func,                                   // 
  };

  constructor(props) {
    super(props);
    const { RefreshComplete, NextDataComplete } = this.props;
    this.state = { IsShowRefresh: !RefreshComplete, IsShowLoadMore: !NextDataComplete };
  }

  componentDidMount() {
    this.__InitJudge();
  }

  componentWillReceiveProps(nextProps) {
    const { RefreshComplete, LoadType } = nextProps;
    if (!!RefreshComplete && LoadType > 0) {
      const { divOtherAniDesc, divOtherAni, divContent } = this.refs;
      divOtherAniDesc.innerHTML = '刷新完成';
      setTimeout(() => {
        divContent.style.transform = 'translate3d(0px, 0px, 0px)';
        divOtherAni.classList.add(styles.hide);
      }, 300);
    }
  }

  __InitJudge() {
    const { LoadType } = this.props;
    if (!LoadType) {
      return;
    }
    this.__ProcessAniEnd();
  }

  /**
   * 刷新
   * 
   * @returns
   * 
   * @memberOf Refresh
   */
  __HandlerRefresh() {
    const divXtnScroll = this.refs.divXtnScroll;
    const body = document.body;
    const __differenceValue = body.scrollHeight - divXtnScroll.scrollHeight;
    const __bodyScrollTop = body.scrollTop;
    if (__bodyScrollTop > __differenceValue) {
      return;
    }
    const { onRefresh, RefreshComplete } = this.props;
    if (!Utility.isFunction(onRefresh) || RefreshComplete === false) {
      return;
    }
    onRefresh();
  }

  /**
   * 下一页数据
   * 
   * @returns
   * 
   * @memberOf Refresh
   */
  __HandlerNextData() {
    const { onNextData, NextDataComplete } = this.props;
    if (!Utility.isFunction(onNextData) || NextDataComplete === false) {
      return;
    }
    const Percentage = this.props.Percentage || 1;
    const __bodyScrollTop = document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset;
    const __bodyScrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
    const __differValue = ((__bodyScrollHeight - __bodyScrollTop - screen.height) / __bodyScrollHeight) * 100;
    if (__differValue > (Percentage < 2 ? 2 : Percentage)) {
      return;
    }
    // Utility.$actionSheet('开始调用下一页数据');
    onNextData();
  }

  __HandlerSlideRight() {
    const { onSlideRight } = this.props;
    if (onSlideRight) {
      onSlideRight();
    }
  }

  __HandlerSlideLeft() {
    const { onSlideLeft } = this.props;
    if (onSlideLeft) {
      onSlideLeft();
    }
  }

  /**
   * 开始移动
   * 
   * @param {any} event
   * 
   * @memberOf Refresh
   */
  __HandlerStart(event) {
    const { clientX, clientY } = event.touches[0];
    this.state.startX = clientX;
    this.state.startY = clientY;

    this.__ProcessSlideBegin();
  }

  __HandlerMove(event) {
    this.__ProcessAniStart(event);
    this.__ProcessSlide(event);

    const { version } = Utility.$androidVersion() || {};
    if (!version) {
      return;
    }
    if (version > '5.0') {
      return;
    }
    this.__HandlerEnd(event);
  }
  __ProcessSlide(event) {
    const { clientX } = event.changedTouches[0];
    const { startX } = this.state;
    const { onSlideRange } = this.props;
    if (onSlideRange) {
      onSlideRange(clientX - startX);
    }
  }
  __ProcessSlideBegin() {
    const { onSlideRangeBegin } = this.props;
    if (onSlideRangeBegin) {
      onSlideRangeBegin();
    }
  }
  __ProcessSlideEnd() {
    const { onSlideRangeEnd } = this.props;
    if (onSlideRangeEnd) {
      onSlideRangeEnd();
    }
  }

  __ProcessAniStart(event) {
    const { LoadType, RefreshComplete, NextDataComplete } = this.props;
    if (!LoadType || !RefreshComplete || !NextDataComplete) {
      return;
    }
    const { clientY } = event.changedTouches[0];
    this.state.moveY = clientY;
    const { startY } = this.state;
    const abs = clientY - startY;
    const { divContent, divOtherAni, divOtherAniDesc, divLoading } = this.refs;
    const __MaxValue = 200;
    if (abs > 0) {
      divLoading.classList.remove(styles.loading);
      divOtherAni.classList.remove(styles.hide);
      if (abs <= __MaxValue) {
        const __3d = 'translate3d(0px, ' + abs + 'px, 0px)';
        divContent.style.transform = __3d;
        divContent.style.webkitTransform = __3d;
        divOtherAni.style.transform = __3d;
        divOtherAni.style.webkitTransform = __3d;
        divOtherAniDesc.innerHTML = '下拉刷新';
      }
      if (abs > __MaxValue) {
        divOtherAniDesc.innerHTML = '释放立即更新';
      }
    }
  }

  __ProcessAniEnd() {
    const { LoadType } = this.props;
    if (!LoadType) {
      return;
    }
    const { divContent, divOtherAni, divOtherAniDesc, divLoading } = this.refs;
    divLoading.classList.add(styles.loading);
    const __3d = 'translate3d(0px, 50px, 0px)';
    divContent.style.transform = __3d;
    divOtherAni.style.transform = __3d;
    divContent.style.webkitTransform = __3d;
    divOtherAni.style.webkitTransform = __3d;
    divOtherAniDesc.innerHTML = '正在获取数据...';
  }

  /**
   * 移动结束
   * 
   * @param {any} event
   * @returns
   * 
   * @memberOf Refresh
   */
  __HandlerEnd(event) {
    this.__ProcessSlideEnd();
    const { RefreshComplete, NextDataComplete } = this.props;
    if (!RefreshComplete || !NextDataComplete) {
      return;
    }
    const { startX, startY } = this.state;
    const { clientY, clientX } = event.changedTouches[0];

    const xes = clientX - startX;
    const yes = clientY - startY;

    const absXes = Math.abs(xes);
    const absYes = Math.abs(yes);

    if (absXes < 10 && absYes < 10) {
      return;
    }
    this.__ProcessAniEnd();
    if (xes > 0) {
      // 右
      if (yes > 0) {
        // 向下
        // 判断主向
        if (absXes > absYes) {
          // 向右。
          this.__HandlerSlideRight();
        } else {
          // 向下。
          this.__HandlerRefresh();
        }
      } else {
        // 向上
        if (absXes > absYes) {
          // 向右。
          this.__HandlerSlideRight();
        } else {
          // 向上。
          this.__HandlerNextData();
        }
      }
    } else {
      // 左边
      if (yes > 0) {
        // 向下
        if (absXes > absYes) {
          // 向左。
          this.__HandlerSlideLeft();
        } else {
          // 向下。
          this.__HandlerRefresh();
        }
      } else {
        // 向上
        if (absXes > absYes) {
          this.__HandlerSlideLeft();
        } else {
          this.__HandlerNextData();
        }
      }
    }
  }

  /**
   * 鼠标滚动事件
   * 
   * @memberOf Refresh
   */
  __HandlerWheel() {
    // console.log(event);
  }

  /**
   * 获取样式
   * 
   * @returns
   * 
   * @memberOf Refresh
   */
  __GetStyle() {
    const { MarginBottom, MarginTop } = this.props;
    const __styles = {};
    if (MarginBottom && MarginBottom > 0) {
      __styles.borderBottom = MarginBottom + 'px' + 'solid #f4f5f6';
    }
    if (MarginTop && MarginTop > 0) {
      __styles.marginTop = MarginTop + 'px';
    }
    return __styles;
  }

  render() {
    const { LoadType, RefreshComplete, NextDataComplete } = this.props;
    return (
      <div ref="divXtnScroll" className={styles.refreshCss} style={this.__GetStyle()}
        onScroll={this.__HandlerNextData.bind(this)} onTouchStart={this.__HandlerStart.bind(this)}
        onTouchEnd={this.__HandlerEnd.bind(this)} onTouchMove={this.__HandlerMove.bind(this)}
        onWheel={this.__HandlerWheel.bind(this)} >
        {
          !LoadType ?
            <div className={styles.refreshAnimation + ' ' + (RefreshComplete ? styles.hideRefresh : styles.showRefresh)}>
              <div></div>
            </div>
            :
            <div ref="divOtherAni" className={styles.otherAni}>
              <div>
                <div ref="divLoading"></div>
                <div ref="divOtherAniDesc"></div>
              </div>
            </div>
        }
        <div className={styles.content} ref="divContent">
          {this.props.children}
        </div>
        <div
          className={styles.loadingMoreDataAnimation + ' ' + (NextDataComplete ? styles.hideLoadMore : styles.showLoadMore)}>
          <div className={styles.spinner}>
            <div className={styles.bounce1}></div>
            <div className={styles.bounce2}></div>
            <div className={styles.bounce3}></div>
          </div>
        </div>
      </div>
    );
  }
}
