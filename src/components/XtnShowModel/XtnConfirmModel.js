/**
 * Created by admin on 2016-08-24.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Utility, XtnIcon } from 'components';
const styles = require('./scss/XtnConfirmModel.scss');
/**
 * 确定--取消
 *
 *  <XtnConfirmModel
 *      Title="订单管理"
 *      Content = "真的删除订单吗？"
 *      okButton = {this.handler.bind(this)}
 *      cancelButton = {this.handler.bind(this)}   --> 如果没有传此方法的时候，就是
 *      okButtonTitle = "确定" --> 不填写时：默认为 “确定”
 *      cancelButtonTitle = "取消"  --> 不填写时：默认为“取消”
 *      />
 *
 */
export default class XtnConfirmModel extends Component {
  static propTypes = {
    children: PropTypes.object,                                     // 子项
    Content: PropTypes.string,                                      // 内容
    Title: PropTypes.string,                                        // 标题
    Options: PropTypes.object,                                      // 选项
    DialogIndex: PropTypes.number,                                  // 隐藏动画
    okButtonTitle: PropTypes.string,                                // 确定 button标题
    cancelButtonTitle: PropTypes.string,                            // 取消 button 标题
    okButton: PropTypes.func,                                       // 确定 button 事件
    cancelButton: PropTypes.func,                                   // 取消 button 事件
  };

  constructor(props) {
    super(props);
    this.state = { index: 0 };
  }

  componentDidMount() {
    const __self = this;
    setTimeout(() => {
      __self.setState({ isShowAction: true });
    }, 50);
    const { DialogIndex } = this.props;
    if (Number(DialogIndex)) {
      Utility.$on(Utility.constItem.Events.ShowModel.OnShowDialogClose + '_' + DialogIndex, () => {
        __self.__HandlerCancelButton(false);
      });
    }

    this.refs.divContent.addEventListener('touchmove', this.__HandlerTouchMove.bind(this), { passive: false });
    this.refs.divContent.addEventListener('touchstart', this.__HandlerStart.bind(this), { passive: false });
    this.refs.divContent.addEventListener('touchend', this.__HandlerEnd.bind(this), { passive: false });
  }
  componentWillUnmount() {
    this.state.IsUnmount = true;
  }

  __AddOrRemoveTouchAction(IsAdd, target) {
    const __div = this.refs.divContent;
    const __className = styles.touchAction;
    if (!!IsAdd) {
      __div.classList.remove(__className);
      if (target && target.classList) {
        target.classList.remove(__className);
      }
    } else {
      __div.classList.add(styles.touchAction);
      if (target && target.classList) {
        target.classList.add(__className);
      }
    }
  }

  /**
   * 关闭窗体
   * @private
   */
  __HandlerCancelButton(isCallCancel) {
    const { cancelButton, DialogIndex } = this.props;
    if (!!this.state.IsUnmount) {
      return;
    }
    this.setState({ isShowAction: false });
    setTimeout(() => {
      Utility.$emit(Utility.constItem.Events.ShowModel.OnConfirmHide);
      if (Number(DialogIndex)) {
        Utility.$showDialogHide(Number(DialogIndex));
      }
      if (!Utility.isFunction(cancelButton)) {
        return;
      }
      if (!!isCallCancel) {
        cancelButton();
      }
    }, 200);
  }

  /**
   * 点击确定按钮后，关闭当前窗体。
   * @private
   */
  __HandlerOkButton() {
    this.__HandlerCancelButton(false);
    if (Utility.isFunction(this.props.okButton)) {
      this.props.okButton();
    }
  }

  /**
   * 移动事件
   * 
   * @param {any} ee 
   * 
   * @memberOf ConfirmModel
   */
  __HandlerTouchMove(ee) {
    const { target, path } = ee;
    if (path.length > 13) {
      this.__HandlerEnd(ee, true);
    } else {
      this.__AddOrRemoveTouchAction(false, target);
      ee.stopPropagation();
      ee.preventDefault();
    }
  }

  /**
   * 向下
   * 
   * @param {any} ee
   * 
   * @memberOf ConfirmModel
   */
  __HandlerDown(ee) {
    const { target, path } = ee;
    if (path.length > 13) {
      const { scrollTop } = target;
      if (scrollTop === 0 || this.__JudgeIsTextAreaBottom(target, true)) {
        this.__AddOrRemoveTouchAction(false, target);
        ee.stopPropagation();
        ee.preventDefault();
      } else {
        this.__AddOrRemoveTouchAction(true, target);
      }
    } else {
      this.__AddOrRemoveTouchAction(false, target);
      ee.stopPropagation();
      ee.preventDefault();
    }
    this.__CheckIsCloseButton(target);
  }

  /**
   * 向上
   * 
   * @param {any} ee
   * 
   * @memberOf ConfirmModel
   */
  __HandlerUp(ee) {
    const { target, path } = ee;
    if (path.length > 13) {
      const { scrollTop, scrollHeight, clientHeight } = target;
      if (scrollHeight === clientHeight) {
        this.__AddOrRemoveTouchAction(false, target);
        ee.stopPropagation();
        ee.preventDefault();
      } else if (scrollHeight > clientHeight && scrollTop === scrollHeight - clientHeight) {
        this.__AddOrRemoveTouchAction(false, target);
        ee.stopPropagation();
        ee.preventDefault();
      } else {
        this.__AddOrRemoveTouchAction(true, target);
      }
    } else {
      this.__AddOrRemoveTouchAction(false, target);
      ee.stopPropagation();
      ee.preventDefault();
    }
    this.__CheckIsCloseButton(target);
  }

  __JudgeIsTextAreaBottom(target, isDown) {
    const { scrollTop, clientHeight, scrollHeight } = target || {};
    const __Min = scrollTop + clientHeight;
    const __Max = __Min + 12;
    if (isDown === false && ((__Min <= scrollHeight) || (__Max >= scrollHeight))) {
      return true;
    }
    return false;
  }

  __CheckIsCloseButton(target) {
    const { divClose, divCloseIcon } = this.refs;
    const pEle = target.parentElement || {};
    const ppEle = pEle.parentElement || {};
    if (target === divClose || divCloseIcon === target ||
      pEle === divClose || pEle === target ||
      ppEle === divClose || ppEle === target
    ) {
      this.__HandlerCancelButton(true);
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
    // this.setState({ startX: event.touches[0].clientX, startY: event.touches[0].clientY });
    this.state.startX = event.touches[0].clientX;
    this.state.startY = event.touches[0].clientY;
  }

  /**
   * 移动结束
   * 
   * @param {any} event
   * @returns
   * 
   * @memberOf Refresh
   */
  __HandlerEnd(event, IsMove) {
    const { startX, startY } = this.state;
    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;

    const xes = endX - startX;
    const yes = endY - startY;

    const absXes = Math.abs(xes);
    const absYes = Math.abs(yes);
    if (!!IsMove) {
      if (absXes < 5 && absYes < 5) {
        return;
      }
    } else {
      if (absXes < 15 && absYes < 20) {
        return;
      }
    }
    if (xes > 0) {
      // 右
      if (yes > 0) {
        // 向下
        // 判断主向
        if (absXes > absYes) {
          // 向右。
        } else {
          // 向下。
          this.__HandlerDown(event);
        }
      } else {
        // 向上
        if (absXes > absYes) {
          // 向右。
        } else {
          // 向上。
          this.__HandlerUp(event);
        }
      }
    } else {
      // 左边
      if (yes > 0) {
        // 向下
        if (absXes > absYes) {
          // 向右。
        } else {
          // 向下。
          this.__HandlerDown(event);
        }
      } else {        // 向上
        if (absXes > absYes) { // 向左
        } else {
          this.__HandlerUp(event);
        }
      }
    }
  }

  __BuildChildrenEvent(parent) {
    if (!parent) {
      return null;
    }
    if (!parent.length) {
      // 获取子
      if (parent.props) {
        const { children } = parent.props;
        if (children && children.constructor.name === 'Array') {
          return this.__BuildChildrenEvent(children);
        }

        this.state.index = this.state.index + 1;
        return React.cloneElement(parent, { ...parent.props, key: 'cfm_' + this.state.index });
      }
    }
    if (parent.constructor.name !== 'Array') {
      return null;
    }
    const Result = parent.map((sub) => {
      const __ChildResult = this.__BuildChildrenEvent(sub);
      // const __children = sub.props.children;
      this.state.index = this.state.index + 1;
      return React.cloneElement(<div>{__ChildResult}</div>, { ...sub.props, key: 'cfm_' + this.state.index });
      // return __ChildResult;
    });
    return Result;
  }

  __BuildChildren(children) {
    const html = this.__BuildChildrenEvent(children);
    if (Utility.$isArray(children)) {
      return html;
    }
    const { className } = children.props;
    return <div className={className || ''}>{html}</div>;
  }

  // onTouchStart={this.__HandlerStart.bind(this)}
  // onTouchEnd={this.__HandlerEnd.bind(this)}
  // onTouchMove={this.__HandlerTouchMove.bind(this)}


  render() {
    const { Title, Content, okButtonTitle, cancelButtonTitle, Options, children, DialogIndex } = this.props;
    const { isShowAction } = this.state;
    const { IsHideCancel, IsHideOk, IsMaxWidth, ChildrenIsComponent, StyleName, DialogHeight } = Options || {};
    return (
      <div className={styles.content} ref="xtnConfirmModel">
        <div className={styles.background}></div>
        <div ref="divContent" className={styles.leilong} style={{ height: DialogHeight ? DialogHeight : '100%' }}>
          <div className={styles.subLeiLong + ' ' + (!!isShowAction ? styles.showAction : '') + ' '
            + (!!IsMaxWidth ? styles.isMaxWidth : '') + ' ' + styles[StyleName]}>
            {
              DialogIndex && Number(DialogIndex) >= 0 && !!IsHideOk && IsHideCancel &&
              <div className={styles.closeIcon} ref="divClose" >
                <XtnIcon ref="divCloseIcon" IconType="iconDelete10" onClick={this.__HandlerCancelButton.bind(this, true)} />
              </div>
            }
            {
              Title && <div className={styles.title}>{Title}</div>
            }
            <div className={styles.splitLine}></div>
            <div ref="divTemplate" className={styles.template} style={{ backgroundColor: '#FFFFFF' }}>{
              !!ChildrenIsComponent ? children : Content || this.__BuildChildren(children)
            }</div>
            <div className={styles.buttonInfo + ' ' + (!!IsHideOk && IsHideCancel ? styles.none : '')} style={{ backgroundColor: '#FFFFFF' }}>
              {
                !IsHideOk &&
                <div ref="divBtnOk" className={styles.okButton}
                  onClick={this.__HandlerOkButton.bind(this)}>{okButtonTitle || '确定'}</div>
              }
              {
                !IsHideCancel &&
                <div ref="divBtnCancel" className={styles.cancelButton}
                  onClick={this.__HandlerCancelButton.bind(this, true)}>{cancelButtonTitle || '取消'}</div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
