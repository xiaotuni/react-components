/**
 * Created by admin on 2016-08-16.
 */
import React, { Component, PropTypes } from 'react';
import { Utility } from 'components';
const styles = require('./scss/XtnActionSheetModel.scss');

/**
 * 
 * @example
 * <ActionSheetModel
 *    Title = '标题'                                                                --------1> 不能为空
 *    ContentInfo = {                                                               --------2> 不能为空
 *                      Content:'这里填写内容',                                      --------2> ------1> 显示的内容
 *                      eventName: this.handlerClickContentEvent.bind(this)         --------2> ------2> 点击内容事件,可以不填
 *                  }
 *    Buttons = [                                                                   --------3> 可以为空
 *                {
 *                  Title: '测试按键1',                                              --------3> ------1> 按钮内容
 *                  funName: this.handlerButton1ClickEvent.bind(this)               --------3> ------2> 按键事件
 *                },
 *                {Title: '测试按键2', funName: this.handlerButton2ClickEvent.bind(this)}
 *              ]
 *    onClose = {this.handlerClose.bind(this)}                                      --------4> 可以为空
 *    ToPage = {                                                                    --------5> 可以为空
 *                Url: Utility.constItem.UrlItem.Login,                             --------5> -----1>这里是页面跳转的地址
 *                Options: {}                                                       --------5> -----2>页面跳转的传的参数
 *              }
 *    />
 */
export default class ActionSheetModel extends Component {
  static propTypes = {
    ContentInfo: PropTypes.object,
    Title: PropTypes.string,
    Buttons: PropTypes.array,
    ToPage: PropTypes.object,
    onClose: PropTypes.func,
    okClickTitle: PropTypes.func,                   // 点击标题事件
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ IsShowAction: true });
    }, 50);

    const { Buttons } = this.props;
    if (!Buttons) {
      // 三秒后自动关闭。
      this.state.__Timeout = setTimeout(() => {
        clearTimeout(this.state.__Timeout);
        Utility.$emit(Utility.constItem.Events.ShowModel.OnActionSheetHide);
        this.__HandlerToPage(1000);
      }, 1500);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.state.__Timeout);
    clearTimeout(this.state.__Timeout2);
  }

  __HandlerToPage(times) {
    const { ToPage } = this.props;
    const { Url, Options } = ToPage || {};
    if (!Url) {
      return;
    }
    // 1.5 秒后进行页面跳转
    this.state.__Timeout2 = setTimeout(() => {
      Utility.$toPage(Url, Options || {});
    }, times || 0);
  }

  __HandlerClose() {
    this.setState({ IsShowAction: false });
    const { onClose } = this.props;
    this.__HandlerToPage(10);

    if (Utility.isFunction(onClose)) {
      setTimeout(() => {
        onClose();
      }, 200);
    }
  }

  /**
   * 取消事件
   * @memberof ActionSheetModel
   */
  handlerContentEvent() {
    const { ContentInfo } = this.props;
    const { Content } = ContentInfo;
    if (ContentInfo && Content && Content === '取消') {
      this.__HandlerClose();
    }
    if (Utility.isFunction(ContentInfo.event)) {
      ContentInfo.event(ContentInfo);
    }
  }

  handlerButton(item) {
    if (Utility.isFunction(item.funName)) {
      item.funName(item);
    }
  }

  /**
   * 点击标题后，关闭当前窗体。
   * @private
   */
  __HandlerClickTitle() {
    this.__HandlerClose();
    if (Utility.isFunction(this.props.okClickTitle)) {
      this.props.okClickTitle();
    }
  }

  __BuildBtnHtml() {
    const { Buttons } = this.props;
    if (!Utility.$isArray(Buttons)) {
      return null;
    }

    return Buttons.map((item, __index) => {
      const { IsSplitLine } = item;
      return (<div key={'ab_index_' + __index} className={styles.btnRow + ' ' + (IsSplitLine ? styles.sLine : '')}>
        <div className={styles.splitLine}></div>
        {
          !!IsSplitLine ?
            <div className={styles.btnSplitLine}></div>
            :
            <div className={styles.content} onClick={this.handlerButton.bind(this, item)}>{item.Title}</div>
        }
      </div>);
    });
  }

  render() {
    const { Title, ContentInfo, Buttons } = this.props;
    const { Content } = ContentInfo || {};
    const { IsShowAction } = this.state;
    const __IsBtn = Utility.$isArray(Buttons);

    return (
      <div className={styles.content} ref="xtnActionSheet">
        <div className={styles.background} onClick={this.__HandlerClose.bind(this)}></div>
        <div className={styles.leilong + ' ' + (!!IsShowAction ? styles.showAction : '')}>
          <div className={styles.subLeiLong + ' ' + (__IsBtn ? styles.btnList : '')}>
            {
              !__IsBtn && <div className={styles.title} onClick={this.__HandlerClickTitle.bind(this)}>{Title}</div>
            }
            {Content && <div className={styles.splitLine}></div>}
            {
              Content && <div className={styles.content} onClick={this.handlerContentEvent.bind(this)}>{ContentInfo.Content}</div>
            }
            {this.__BuildBtnHtml()}
          </div>
        </div>
      </div>
    );
  }
}
