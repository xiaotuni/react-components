/**
 * Created by admin on 2016-07-06.
 */
import React, { Component, PropTypes } from 'react';
import { Utility, XtnActionSheet, XtnConfirmModel, XtnPreviewModel, XtnLoadingModel, XtnDatePicker } from 'components';
import { connect } from 'react-redux';
import * as CommonActions from 'redux/modules/reduxCommon';
const styles = require('./scss/XtnNavBar.scss');

@connect(
  state => ({
    IsShowBackArrow: state.Common.IsShowBackArrow,
    UrlParams: state.Common.UrlParams,
    CurrentPagePathInfo: state.Common.PathInfo,
  }),
  { ...CommonActions })

/**
 * 导航条
 */
export default class NavBar extends Component {
  static propTypes = {
    location: PropTypes.object,                                      // location信息
    IsShowBackArrow: PropTypes.bool,                                 // 是否显示返回按键
    Title: PropTypes.string,                                         // 标题
    UrlParams: PropTypes.object,                                     // url 参数
    CurrentPagePathInfo: PropTypes.object,                           // 当前页面url信息
    IsWeiXin: PropTypes.bool,                                        // 微信
    onNavBarTitleInfo: PropTypes.func.isRequired,                    // 导航条信息
    onUrlParamsEdit: PropTypes.func,                                 // 获取url参数
    onNavBarTitleEdit: PropTypes.func,                               // 修改标题
    onHandlerRight: PropTypes.func,                                  // 右边事件
    onGetUserInfo: PropTypes.func,                                   // 获取用户信息
    onPageSliderInfo: PropTypes.func,                                // 页面滑动
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
    history: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      __TimeoutCount: 0,
      IsOpenDate: false,                                         // 是否打开日期组件
      CurrentSelectDate: new Date(),                             // 当前选中的日期
      IsShowTime: false,                                         // 是否显示时间
      ShowModelLoading: '',                                      // 加载
      ShowModelConfirm: '',                                      // 确定和取消
      ShowModelActionSheet: '',                                  // 弹出信息
      asContent: '',                                             // 内容
      asTitle: '',                                               // 标题
      asButtons: [],                                             // 按钮集合
      DialogList: [],                                            // 对话窗体列表
    };
  }

  componentWillMount() {
    // 初始化加载事件
    this.__InitEmit();
    // 初始化监听路由事件
    this.__InitRouteListen();
    // 设置上下文件
    Utility.setContent(Utility.constItem.Context, this.context);
    // 获取用户信息
    if (Utility.isFunction(this.props.onGetUserInfo)) {
      this.props.onGetUserInfo();
    }
  }

  componentDidMount() {
    this.state.IsWeiXin = Utility.isWeiXin();
    this.state.isMount = true;
  }

  componentWillUnmount() {
    try {
      const { __IComCloseBtnInterval, __IntervalNBDefault, __IntervalNBMenu, __IntervalNBIcon } = this.state;
      clearInterval(__IComCloseBtnInterval);
      clearTimeout(__IComCloseBtnInterval);
      clearInterval(__IntervalNBDefault);
      clearInterval(__IntervalNBMenu);
      clearInterval(__IntervalNBIcon);
      clearTimeout(__IntervalNBDefault);
      clearTimeout(__IntervalNBMenu);
      clearTimeout(__IntervalNBIcon);
      delete this.state.isMount;
    } catch (ex) {
      console.log(ex);
    }
  }

  /**
   * 更新页面信息
   * 
   * @memberOf NavBar
   */
  __UpdateRender() {
    if (!!this.state.isMount) {
      this.setState({ _NavBar_Time: new Date().getTime() });
    }
  }

  /**
   * 初始化监听路由事件
   * @private
   */
  __InitRouteListen() {
    try {
      if (!this.context.router || !this.context.router.listen) {
        return;
      }
      const { onUrlParamsEdit } = this.props;
      const __self = this;
      this.context.router.listen((obj) => {
        const { UrlTitle, Events } = Utility.constItem;
        // 关闭弹窗体
        Utility.$emit(Events.ShowModel.OnConfirmHide);
        // call hide no reosurce component;
        const { pathname } = obj || {};
        const __PathName = (pathname || '').toLowerCase();
        const __Obj = UrlTitle;
        const __UrlTitle = __Obj[__PathName] || __Obj['/' + __PathName];
        const { IsHideNavBar } = __UrlTitle || {};
        delete __self.state.nMenuItem;

        onUrlParamsEdit(obj.query);
        const __IsReturn = __self.__UpdateTitle(obj);
        if (__IsReturn) {
          return;
        }

        if (obj.action === 'POP') {
          this.showBackButton(false);
          return;
        }

        Utility.$emit(Events.OnEditPageSliderInfo, { IsReturn: false, IsHideNavBar });
        Utility.setContent(Utility.constItem.IsStopSlidePageAnimation, false);
        __self.showBackButton(true);
      });
    } catch (ex) {
      console.log(ex);
    }
  }

  /**
   * 更新标题
   * @param options
   * @returns {boolean}
   * @private
   */
  __UpdateTitle(options) {
    const { pathname } = options || {};
    if (!pathname) {
      return false;
    }
    const __PathName = pathname.toLowerCase();

    const __Obj = Utility.constItem.UrlTitle;
    const __UrlTitle = __Obj[__PathName] || __Obj['/' + __PathName];
    const { IsHideNavBar, Title, Index } = __UrlTitle || {};
    const __AppPage = {};
    if (Title) {
      __AppPage.Title = Title;
    }
    __AppPage.IsHideNavBar = IsHideNavBar;

    __AppPage.IsReturn = (options.action === 'POP');
    Utility.$emit(Utility.constItem.Events.OnEditPageSliderInfo, __AppPage);

    if (Index > 0) { // 顶级页面。
      Utility.removeContent(Utility.constItem.SaveUrlPath, true);
      this.showBackButton(false);
      this.__IsStop();
      return true;
    }
    // 次级页面
    return false;
  }

  /**
   * 后退操作
   */
  __HandlerGoBack() {
    Utility.$goBack();
  }

  /**
   * 停止动画切换界面
   *
   * @memberOf NavBar
   */
  __IsStop() {
    setTimeout(() => {
      Utility.setContent(Utility.constItem.IsStopSlidePageAnimation, true);
    }, 500);
  }

  /**
   * 显示返回箭头
   * @param isShow
   */
  showBackButton() {
    this.props.onNavBarTitleInfo({ IsShowBackArrow: true, Title: this.props.Title });
  }

  /**
   * 初始化事件
   * @private
   */
  __InitEmit() {
    const __this = this;
    const { OnNotNetwork, ShowModel, HttpStatus, OnOpenDatePicker } = Utility.constItem.Events;
    // Utility.constItem.Events.OnNotNetwork
    Utility.$on(OnNotNetwork, () => {
      Utility.$toPage(Utility.constItem.UrlItem.BrokenNetwork);
    });
    Utility.$on(HttpStatus[1], (err, body) => {
      console.log(err, body);
    });
    Utility.$on(HttpStatus[400], (err, body) => {
      Utility.$actionSheet(body ? body.msg : (err ? err.message : ''));
    });
    Utility.$on(HttpStatus[401], (err, body) => {
      Utility.$actionSheet(body.msg);
    });
    Utility.$on(HttpStatus[402], (err, body) => {
      console.log(err, body);
    });
    Utility.$on(HttpStatus[403], (err, body) => {
      console.log(err, body);
    });
    Utility.$on(HttpStatus[404], (err, body) => {
      if (body.path) {
        Utility.$actionSheet('接口[' + body.path + ']方法未找到');
      } else {
        Utility.$actionSheet(body.msg);
      }
    });
    Utility.$on(HttpStatus[405], (err, body) => {
      console.log(err, body);
    });
    Utility.$on(HttpStatus[406], (err, body) => {
      console.log(err, body);
    });
    Utility.$on(HttpStatus[407], (err, body) => {
      console.log(err, body);
    });
    Utility.$on(HttpStatus[408], (err, body) => {
      console.log(err, body);
    });
    Utility.$on(HttpStatus[409], (err, body) => {
      console.log(err, body);
    });
    Utility.$on(HttpStatus[411], (err, body) => {
      Utility.$emit(ShowModel.OnActionSheet, {
        Title: __this.props.Title,
        Content: { Content: body.msg || '用户登录过期' }
      });
    });
    Utility.$on(HttpStatus[500], (err, body) => {
      console.log(err, body);
      const { msg } = body || {};
      Utility.$actionSheet('服务器处理错误' + (msg ? '[' + msg + ']' : ''));
    });
    Utility.$on(HttpStatus[501], (err, body) => {
      console.log(err, body);
    });
    Utility.$on(HttpStatus[502], (err, body) => {
      console.log(err, body);
    });
    Utility.$on(HttpStatus[503], (err, body) => {
      console.log(err, body);
    });

    const __ClearComponent = () => {
      delete __this.state.IsShowPreview;
      delete __this.state.PreviewInfo;
      __this.__UpdateRender();
    };

    const {
      OnActionSheet, OnConfirm, OnLoading, OnLoadingHide, OnActionSheetHide, OnConfirmHide, OnShowDialog,
      OnShowDialogClose, OnShowDialogHide, OnPreviewModel, OnPreviewModelHide,
    } = ShowModel;
    Utility.$on(OnPreviewModel, (args) => {
      __this.state.IsShowPreview = true;
      __this.state.PreviewInfo = args;
      __this.__UpdateRender();
    });
    Utility.$on(OnPreviewModelHide, () => {
      __ClearComponent();
    });
    /**
     * 弹出消息窗体
     */
    Utility.$on(OnActionSheet, (args) => {
      __this.state = Object.assign(__this.state || {}, {
        ShowModelActionSheet: Utility.constItem.ShowModel.ActionSheet,
        asContent: args.ContentInfo,
        asTitle: args.Title || __this.props.Title,
        asClickTitle: args.okClickTitle,
        asButtons: args.Buttons,
        asToPage: args.ToPage || {}
      });
      __this.__UpdateRender();
    });
    /**
     * 弹出确认--取消窗体
     */
    Utility.$on(OnConfirm, (args) => {
      __this.state = Object.assign(__this.state || {}, {
        ShowModelConfirm: Utility.constItem.ShowModel.Confirm,
        cmTitle: args.Title || __this.props.Title,
        cmContent: args.Content,
        cmOkButton: args.okButton,
        cmCancelButton: args.cancelButton,
        cmOptions: args.Options,
      });
      __this.__UpdateRender();
    });

    /**
     * 弹出加载窗体
     */
    Utility.$on(OnLoading, () => {
      __this.state = Object.assign(__this.state || {}, { ShowModelLoading: Utility.constItem.ShowModel.Loading, lmContent: '正在处理...' });
      __this.__UpdateRender();
    });

    /**
     * 关闭弹出的确认--取消窗体
     */
    Utility.$on(OnLoadingHide, (args) => {
      if (__this.state.ShowModelLoading === '') {
        return;
      }
      const times = parseInt(args || 0, 0);
      setTimeout(() => {
        if (__this.state.ShowModelLoading === '') {
          return;
        }
        __this.state.ShowModelLoading = '';
        __this.__UpdateRender();
      }, times === 0 ? 10 : times);
    });
    /**
     * 关闭弹出消息窗体
     */
    Utility.$on(OnActionSheetHide, (args) => {
      const { xtnActionSheet } = __this.refs;
      if (xtnActionSheet) {
        xtnActionSheet.__HandlerClose();
        setTimeout(() => {
          __this.state.ShowModelActionSheet = '';
          __this.__UpdateRender();
          const { callBack } = args || {};
          if (callBack) {
            callBack();
          }
        }, 50);
      }
    });
    /**
     * 关闭弹出确认窗体
     */
    Utility.$on(OnConfirmHide, () => {
      __this.state.ShowModelConfirm = '';
      __this.state.DialogList = [];
      __this.__UpdateRender();
    });

    /**
     * 打开弹出窗体
     */
    Utility.$on(OnShowDialog, (args) => {
      const { DialogList } = __this.state;
      DialogList.push(Object.assign(args || {}, { DialogIndex: DialogList.length + 1 }));
      __this.state.DialogList = DialogList;
      __this.__UpdateRender();
    });


    /**
     * 关闭弹出窗体
     * 
     * times 判断当前关闭窗体的 索引号，是否和 DialogList 里的DialogIndex一致。不一致的话，就不关闭窗体。
     * 如果times为  undefined 说是主动关闭的，直接关闭窗体了。
     */
    Utility.$on(OnShowDialogHide, (times) => {
      const { DialogList } = __this.state;
      if (DialogList.length === 0) {
        return;
      }

      const __index = DialogList[DialogList.length - 1].DialogIndex;
      if (!times || Number(times) === __index) {
        Utility.$emit(OnShowDialogClose + '_' + __index);
      }
      setTimeout(() => {
        if (!times || (Number(times) === __index)) {
          DialogList.pop();
          __this.state.DialogList = DialogList;
          __this.__UpdateRender();
        }
      }, times || 200);
    });


    /**
     * 打开日期控件
     */
    Utility.$on(OnOpenDatePicker, (date, IsShowTime, onConfirm, onCancel) => {
      __this.state = Object.assign(__this.state || {}, {
        IsOpenDate: true,
        CurrentSelectDate: Utility.isDate(date) ? Utility.$convertToDateByString(date) : new Date(),
        IsShowTime: IsShowTime,
        onDatePickerConfirm: onConfirm,
        onDatePickerCancel: onCancel
      });
      __this.__UpdateRender();
    });
  }

  /**
   * 关闭弹出消息窗体事件
   *
   * @param {any} params
   *
   * @memberOf NavBar
   */
  handlerActionSheetClose(params) {
    this.state.ShowModelActionSheet = '';
    this.state.___other = params;
    this.__UpdateRender();
  }

  /**
   * 页面加载
   * @returns {*}
   * @private
   */
  __ShowLoading() {
    const isShow = this.state.ShowModelLoading;
    return isShow && isShow !== '' ? (<XtnLoadingModel Content={this.state.lmContent || '正在载'} />) : null;
  }

  /**
   * 确定，取消
   * @returns {*}
   * @private
   */
  __ShowConfirm() {
    const { cmContent, cmOkButton, cmCancelButtonTitle, cmCancelButton, cmOkButtonTitle, cmOptions, cmTitle } = this.state;
    const isShow = this.state.ShowModelConfirm;
    return isShow && isShow !== '' ? (<XtnConfirmModel
      Title={cmTitle || '订单管理'}
      Content={cmContent || '真的删除订单吗？'}
      Options={cmOptions}
      okButtonTitle={cmOkButtonTitle}
      cancelButtonTitle={cmCancelButtonTitle}
      okButton={cmOkButton}
      cancelButton={cmCancelButton}
    />) : null;
  }

  /**
   * 从下面弹出信息来
   * @returns {*}
   * @private
   */
  __ShowActionSheet() {
    const isShow = this.state.ShowModelActionSheet;
    return isShow && isShow !== '' ? (<XtnActionSheet ref="xtnActionSheet"
      ContentInfo={this.state.asContent || {}} Title={this.state.asTitle}
      onClose={this.handlerActionSheetClose.bind(this)}
      Buttons={this.state.asButtons}
      okClickTitle={this.state.asClickTitle}
      ToPage={this.state.asToPage}
    />) : null;
  }

  /**
   * 点击确定，返回日期时间
   *
   * @param {datetime} value 返回的时间
   *
   * @memberOf NavBar
   */
  __HandlerDatePickerConfirm(value) {
    this.state.CurrentSelectDate = value;
    const { onDatePickerConfirm } = this.state;
    if (!Utility.isFunction(onDatePickerConfirm)) {
      return;
    }
    onDatePickerConfirm(value);
  }

  /**
   * 关闭日期控件
   *
   * @memberOf NavBar
   */
  __HandlerDatePickerCancel() {
    this.setState({ IsOpenDate: false });
    const { onDatePickerCancel } = this.state;
    if (!Utility.isFunction(onDatePickerCancel)) {
      return;
    }
    onDatePickerCancel();
  }

  /**
   * 对话框
   *
   * @returns
   *
   * @memberof NavBar
   */
  __BuildDialogHTML() {
    const { DialogList } = this.state;
    if (!Utility.$isArray(DialogList)) {
      return null;
    }
    return DialogList.map((item, index) => {
      // const {Title, Html, okButton, onCancel} = item;
      return (<XtnConfirmModel key={'navbar_dialog_' + index}
        {...item}
      >{item.Html}</XtnConfirmModel>);
    });
  }

  __HandlerGetToken() {
    const { isProduction } = Utility.getContent(Utility.constItem.ConfigInfo) || {};
    if (!isProduction) {
      const __token = Utility.getContent(Utility.constItem.Token);
      if (__token) {
        Utility.$alert(__token);
      }
    }
  }

  __HandlerTitleOther(ee) {
    if (ee) {
      ee.stopPropagation();
      ee.preventDefault();
    }
  }

  __BuildRightTypeHtml(isRight) {
    console.log(isRight);
    return '';
  }

  render() {
    const { IsShowPreview, PreviewInfo, IsOpenDate, IsShowTime, CurrentSelectDate } = this.state;
    const { Title, IsWeiXin } = this.props;
    return (
      <div className={styles.navBarCss + ' ' + (!!IsWeiXin ? styles.isWeiXin : '')}>
        <div className={styles.subContent + ' ' + (!!IsWeiXin ? styles.isWeiXin1 : '')}>
          <div className={styles.left} onClick={this.__HandlerGoBack.bind(this)}>
            <div className={styles.defaultIcon}>
              <div></div>
            </div>
          </div>
          <div className={styles.center}>
            <div className={styles.other} onClick={this.__HandlerTitleOther.bind(this)} ></div>
            <div className={styles.title} onClick={this.__HandlerGetToken.bind(this)}>{Title || ''}</div>
            <div className={styles.other} onClick={this.__HandlerTitleOther.bind(this)} ></div>
          </div>
          <div className={styles.right}>
            {this.__BuildRightTypeHtml(true)}
          </div>
        </div>

        {!!IsOpenDate &&
          <XtnDatePicker isShowTime={IsShowTime} value={!CurrentSelectDate ? new Date() : CurrentSelectDate}
            onConfirm={this.__HandlerDatePickerConfirm.bind(this)}
            onCancel={this.__HandlerDatePickerCancel.bind(this)} />
        }
        {this.__ShowConfirm()}
        {this.__ShowLoading()}
        {this.__ShowActionSheet()}
        {this.__BuildDialogHTML()}
        {!!IsShowPreview && <XtnPreviewModel PreviewInfo={PreviewInfo} />}
      </div>
    );
  }
}
