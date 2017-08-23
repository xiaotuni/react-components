
import EmoticonInfo from './EmoticonInfo';                                // 通用

export default class Utility {

  static __Instance;

  constructor() {
    this._TempSaveContent = {};
    this.__ConstPrefix = 'WeiXinxtn';
  }

  /**
   * 实例
   * @returns {*}
   */
  static instance() {
    if (this.__Instance === null || typeof this.__Instance === 'undefined') {
      this.__Instance = new this();
    }
    return this.__Instance;
  }

  static $emoticonCollection = new EmoticonInfo().Collection;
  /**
   * 常量
   * @type {{SaveUrlPath: string}}
   */
  static constItem = {
    PageSize: 10, // 每页大小数据
    /**
     * 当前的上下文
     */
    Context: 'xtnContext',                                             // 当前页面的Context
    /**
    * 事件
    */
    Event: 'onXtnEvent',                                               // 事件。
    Events: {
      HttpStatus: {
        1: 'onHttpStatus_xtn_1',
        200: 'onHttpStatus_xtn_200',                  // 处理成功
        400: 'onHttpStatus_xtn_400',                  // 请求无效
        401: 'onHttpStatus_xtn_401',                  // 未授权访问
        402: 'onHttpStatus_xtn_402',
        403: 'onHttpStatus_xtn_403',                  // 禁止访问
        404: 'onHttpStatus_xtn_404',                  // 资源未找到
        405: 'onHttpStatus_xtn_405',
        406: 'onHttpStatus_xtn_406',
        407: 'onHttpStatus_xtn_407',
        408: 'onHttpStatus_xtn_408',
        409: 'onHttpStatus_xtn_409',
        411: 'onHttpStatus_xtn_411',                   // 登陆超时
        500: 'onHttpStatus_xtn_500',                   // 服务器错误
        501: 'onHttpStatus_xtn_501',
        502: 'onHttpStatus_xtn_502',
        503: 'onHttpStatus_xtn_503',
      },
      ShowModel: {
        OnActionSheet: 'onXtn_ShowModel_ActionSheet',                            // 提示
        OnLoading: 'onXtn_ShowModel_Loading',                                    // 加载
        OnAlert: 'onXtn_ShowModel_Alert',                                        // 弹出信息
        OnConfirm: 'onXtn_ShowModel_Confirm',                                    // 确定--取消
        OnShowDialog: 'onXtn_ShowModel_ShowDialog',                              // 打开对话框
        OnShowDialogHide: 'onXtn_ShowModel_ShowDialogHide',                      // 隐藏对话框
        OnShowDialogClose: 'onXtn_ShowModel_ShowDialogClose',                    // 关闭对话框
        OnActionSheetHide: 'onXtn_ShowModel_ActionSheetHide',                    // 关闭
        OnLoadingHide: 'onXtn_ShowModel_LoadingHide',                            // 关闭加载
        OnConfirmHide: 'onXtn_ShowModel_ConfirmHide',                            // 隐藏弹框
        OnPreviewModel: 'onXtn_ShowModel_PreviewModel',                          // 图片预览
        OnPreviewModelHide: 'onXtn_ShowModel_PreviewModelHide',                  // 图片预览关闭
      },
      OnGoBack: 'onXtnEvent_GoBack',                                             // 页面退回事件
      OnEditNavBarRight: 'onXtnEvent_EditNavBarRight',                           // 修改导航条右边
      OnEditPageSliderInfo: 'onXtnEvent_EditPageSliderInfo',                     // 页面切换
      OnOpenDatePicker: 'onXtnEvent_OnOpenDatePicker',                           // 打开日期控件
      OnNotNetwork: 'onXtnNotNetwork',                                           // 无网
      OnNoResources: 'onXtnNoResources',                                         // 无资源

    },
    /**
    * url 列表
    */
    UrlItem: {
      GoBack: 'goBack',                                                    // 回退操作
      Default: 'default',                                                  // 默认页面
      Page1: 'Page1',                                                      // 默认页面
      Page2: 'Page2',                                                      // 默认页面
    },
    UrlTitle: {
      '/': { Title: '首页', Index: 0 },
      '/default': { Title: '默认页面', Index: 1 },
      '/page1': { Title: '页面1', Index: 0 },
      '/page2': { Title: '页面2', Index: 0 },
    },
    /**
     * 显示模式
     */
    ShowModel: {
      ActionSheet: 'xtnShowModelActionSheet',                      // 提示
      Loading: 'xtnShowModelLoading',                              // 加载
      Alert: 'xtnShowModelAlert',                                  // 弹出信息
      Confirm: 'xtnShowModelConfirm',                              // 确定--取消
    },
  }

  /**
   * 是否是数组
   * @param obj
   *
   *  @returns {boolean}
   */
  static $isArray(obj) {
    if (!obj || !obj.length || obj
      .length === 0) {
      return false;
    }
    return Array.isArray(obj);
  }


  /**
   * 判断是否为空
   * 
   * true-为空;false-不为空
   * @param obj
   * @returns {boolean}
   */
  static $isNull(obj) {
    return obj === null;
  }

  /**
   * 判断是否是微信打开的
   * @returns {boolean}
   */
  static isWeiXin() {
    try {
      const ua = window.navigator.userAgent.toLowerCase();
      const isWeiXin = ua.match(/micromessenger/i).indexOf('micromessenger');
      return isWeiXin >= 0 ? true : false;
    } catch (ex) {
      return false;
    }
  }

  /**
   * 浏览器信息
   * @returns {Browser}
   */
  static browserInfo() {
    const _Browser = {
      versions: () => {
        const uu = navigator.userAgent;
        return {
          trident: uu.indexOf('Trident') > -1,                                    // IE内核
          presto: uu.indexOf('Presto') > -1,                                      // opera内核
          webKit: uu.indexOf('AppleWebKit') > -1,                                 // 苹果、谷歌内核
          gecko: uu.indexOf('Gecko') > -1 && uu.indexOf('KHTML') === -1,          // 火狐内核
          mobile: !!uu.match(/AppleWebKit.*Mobile.*/),                            // 是否为移动终端
          ios: !!uu.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),                       // ios终端
          android: uu.indexOf('Android') > -1 || uu.indexOf('Adr') > -1,          // android终端
          iPhone: uu.indexOf('iPhone') > -1,                                      // 是否为iPhone或者QQHD浏览器
          iPad: uu.indexOf('iPad') > -1,                                          // 是否iPad
          webApp: uu.indexOf('Safari') === -1,                                    // 是否web应该程序，没有头部与底部
          weixin: uu.indexOf('MicroMessenger') > -1,                              // 是否微信 （2015-01-22新增）
          qq: uu.match(/\sQQ/i) === ' qq'                                         // 是否QQ
        };
      },
      language: (navigator.browserLanguage || navigator.language).toLowerCase()
    };
    return _Browser;
  }

  /**
   * 是否IOS系统
   *
   * @static
   * @returns
   *
   * @memberOf Utility
   */
  static $isIOS() {
    try {
      const u = navigator.userAgent;
      const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      return isIOS;
    } catch (ex) {
      console.log(ex);
      return false;
    }
  }

  /**
   * 获取android版本
   *
   * @static
   * @returns
   *
   * @memberOf Utility
   */
  static $androidVersion() {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf('Android') > -1 || userAgent.indexOf('Linux') > -1) {
      const num = userAgent.substr(userAgent.indexOf('Android') + 8, 3);
      return { type: 'Android', version: num };
    }
  }

  /**
   * 对Date的扩展，将 Date 转化为指定格式的String
   * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
   * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
   * @method __FormatDate
   * @param fmt
   * @param date
   * @return {*}
   * @example
   *  Utility.FormatDate('yyyy-MM-dd hh:mm:ss.S',new Date());
   * @constructor
   */
  static formatDate(fmt, date) {
    if (!date) {
      return '';
    }
    let __this = new Date();
    let _fmt = fmt || 'yyyy-MM-dd HH:mm:ss.S';
    if (date !== null) {
      if (Date.parse(date)) {
        __this = date;
      } else {
        try {
          __this = new Date(date);
        } catch (ex) {
          __this = new Date();
        }
      }
    }
    const oo = {
      'M+': __this.getMonth() + 1,                    // 月份
      'd+': __this.getDate(),                         // 日
      'D+': __this.getDate(),                         // 日
      'H+': __this.getHours(),                        // 小时
      'h+': __this.getHours(),                        // 小时
      'm+': __this.getMinutes(),                      // 分
      's+': __this.getSeconds(),                      // 秒
      'q+': Math.floor((__this.getMonth() + 3) / 3),  // 季度
      'S': __this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(_fmt)) {
      /(y+)/.exec(_fmt);
      const fmt1 = _fmt.replace(RegExp.$1, (__this.getFullYear() + '').substr(4 - RegExp.$1.length));
      _fmt = fmt1;
    }
    for (const kk in oo) {
      if (new RegExp('(' + kk + ')').test(fmt)) {
        _fmt = _fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (oo[kk]) : (('00' + oo[kk]).substr(('' + oo[kk]).length)));
      }
    }
    return _fmt;
  }

  /**
   * 打印输出日志
   * @method __PrintLog
   * @param {object} args 内容
   * @private
   */
  static $printLog(args) {
    try {
      let __callmethod = '';
      try {
        throw new Error();
      } catch (ex) {
        __callmethod = ex.stack.replace(/Error\n/).split(/\n/)[1].replace(/^\s+|\s+$/, '');
      }

      const _curDate = new Date();
      const _aa = _curDate.toLocaleDateString() + ' ' + _curDate.toLocaleTimeString() + '.' + _curDate.getMilliseconds();
      console.log('--begin->', _aa, ' call method :', __callmethod);
      const __content = JSON.stringify(args);
      console.log(__content);
    } catch (ex) {
      console.log('---------输出日志，传入的内容传为JSON出现在异常--------------');
      console.log(ex);
      console.log('---------输出日志，内容为下--------------');
      console.log(args);
    }
  }

  /**
   * 判断输入的是否是手机号
   * @method __PhonePattern
   * @param {number} phone 手机号
   * @return {boolean} true 成功；false 失败
   * @example
   *  Utility.PhonePattern('13000100100');
   * @private
   */
  static PhonePattern(phone) {
    const ex = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;
    return ex.test(phone);
  }

  /**
   * 密码验证
   * @method __PasswordPattern
   * @param {string} password 密码
   * @return {boolean} true 成功；false 失败
   * @private
   */
  static PasswordPattern(password) {
    // test('/^[_0-9a-z]{6,16}$/i');
    const ex = /^[_0-9a-zA-Z]{6,25}$/;
    return ex.test(password);
  }

  /**
   * 是否含有中文（也包含日文和韩文）
   * @method __IsChineseChar
   * @param {string} str 要判断的内容
   * @return {boolean} true:成功;false:失败.
   * @private
   */
  static IsChineseChar(str) {
    const regu = '^[\u4e00-\u9fa5]+$';
    const re = new RegExp(regu);
    return re.test(str);
  }

  /**
   * 设置内容,这里主要是用来存放临时数据的。
   * @method _SetContent
   * @param key  键值，用于下次的时候获取内容用的。其实就是 _TempSaveContent的属性名称。
   * @param content 要存储的内容
   * @param isSaveLocalStorage 是否保存到本地存储里面
   * @param IsUser 根据用户uid 来获取缓存里的数据。
   * @private
   */
  static setContent(key, content, isSaveLocalStorage, IsUser) {
    try {
      const self = this.instance();
      if (isSaveLocalStorage) {
        let __Content = content;
        if (IsUser) {
          const __UserInfo = self._TempSaveContent[this.constItem.API.UserInfo];
          if (typeof __UserInfo !== 'undefined' && __UserInfo !== null) {
            __Content = {};
            __Content[__UserInfo.member_id] = content;
          }
        }
        __Content = JSON.stringify(__Content);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, __Content);
        }
      }
      self._TempSaveContent[key] = content;
    } catch (ex) {
      console.log(ex);
    }
  }

  /**
   * 删除指定字段值。
   * @method __RemoveContent
   * @param key
   * @return {null}
   * @private
   */
  static removeContent(key, IsRemoveLocalStorage) {
    try {
      const __self = this.instance();
      if (key === null || typeof key === 'undefined') {
        return;
      }
      if (__self._TempSaveContent.hasOwnProperty(key)) {
        delete __self._TempSaveContent[key];
      }

      if (IsRemoveLocalStorage && typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (ex) {
      this.printLog(ex.toString());
    }
  }

  /**
   * 获取内容，
   * @method _GetContent
   * @param key 健名称。其实就是 _TempSaveContent的属性名称。
   * @return {*} 返回内容
   * @private
   */
  static getContent(key) {
    try {
      let __Content = null;
      const __self = this.instance();
      if (__self._TempSaveContent.hasOwnProperty(key)) {
        __Content = __self._TempSaveContent[key];
        return __Content;
      }
      if (typeof window === 'undefined') {
        return null;
      }
      if (__Content === null || typeof __Content === 'undefined') {
        const _value = window.localStorage.getItem(key);
        if (_value !== null && _value !== '' && typeof _value !== 'undefined') {
          __self._TempSaveContent[key] = JSON.parse(_value);
          __Content = __self._TempSaveContent[key];
        }
      }

      return __Content;
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }

  /**
   * 判断是否是函数
   * @param func 判断函数对象
   * @returns {boolean} true:成功，false:失败。
   */
  static isFunction(func) {
    if (func !== null && typeof func !== 'undefined' && func.constructor.name === 'Function') {
      return true;
    }
    return false;
  }

  /**
  * 判断是否未定义
  * @param obj 判断对象
  * @returns {boolean} true:成功，false:失败。
  */
  static $isUndefined(obj) {
    if (typeof obj === 'undefined') {
      return true;
    }
    return false;
  }

  /**
   * 判断是否定义。
   * @param obj 判断对象
   * @return {boolean} true:成功，false:失败。
   */
  static $isDefined(obj) {
    if (typeof obj !== 'undefined') {
      return true;
    }
    return false;
  }

  /**
   * 判断是否是日期类型
   *
   * @static
   * @param {any} obj  判断对象
   * @returns {boolean} true: 是日期，false:不是日期。
   * @example
   *        Utility.isDate('abcadfa')  ---> false
   *        Utility.isDate(new Date()) ---> true
   *        Utility.isDate('2013年10月10日') ---> true
   * @memberOf Utility
   */
  static isDate(obj) {
    if (typeof obj === 'undefined' || obj === null || obj === '') {   // 判断是不是 undefined,或 null
      return false;
    }
    const __isDate = obj.constructor.name === 'Date';  // 如果传入的就是日期
    if (__isDate) {
      return true;
    }
    try {
      return (new Date(obj.replace('年', '-').replace('月', '-').replace('日', ''))).constructor.name === 'Date';
    } catch (ex) {
      return false;
    }
  }

  /**
    * 将一个 对象转成url参数与&分开
    *
    * @param params 参数对象
    * @param split 分割符
    * @returns {*}
    * @example {a:a,b:b,c:c,e:e}
    * a=a&b=b&c=c&e=e
    */
  static $convertToUrlParams(params, options) {
    const { split, notFields } = options || {};
    if (this.$isUndefined(params) || params === null) {
      return '';
    }
    const __KeyValue = [];
    const self = this;
    const __JSONValue = (value) => {
      try {
        let __JValue;
        if (value === null) {
          return '';
        }
        const { constructor } = value;
        if (typeof constructor === 'undefined' || constructor === null) {
          return '';
        }
        switch (value.constructor.name) {
          case 'Object':
            __JValue = '{' + this.convertToUrlParams(value) + '}';
            break;
          case 'Array':
            __JValue = JSON.stringify(value);
            break;
          default:
            __JValue = value;
        }
        return __JValue;
      } catch (ex) {
        console.log(ex.message);
        return value || '';
      }
    };
    Object.keys(params).forEach((key) => {
      const __value = params[key];
      if (self.$isDefined(__value) && __value !== '') {
        if (key.toLowerCase() !== 'IsExistsNextData'.toLowerCase()) {
          if (notFields) {
            if (notFields.indexOf(key) === -1) {
              __KeyValue.push(key + '=' + __JSONValue(__value));
            }
          } else {
            __KeyValue.push(key + '=' + __JSONValue(__value));
          }
        }
      }
    });
    return __KeyValue.join(split ? split : '&');
  }

  /**
   * 将 map对象 转成 key-value 数组对象
   * @param row
   * @returns {Array}
   */
  static convertMapToObject(row) {
    if (this.$isUndefined(row) || this.$isNull(row) || row === '') {
      return [];
    }
    const __Array = [];
    Object.keys(row).forEach((key) => {
      const __obj = {};
      __obj.key = key;
      __obj.value = row[key];
      __Array.push(__obj);
    });
    return __Array;
  }

  /**
   * 页面跳转
   * @param url 要跳转的页面。
   * @param params 参数
   */
  static $toPage(url, params, isReplace) {
    try {
      const __context = this.getContent(this.constItem.Context);
      if (this.$isUndefined(url) || url === '' || this.$isUndefined(__context) || this.$isUndefined(__context.router)) {
        return;
      }
      this.$loadingHide();
      const router = __context.router;
      if (url === this.constItem.UrlItem.GoBack) {
        router.goBack();
        return;
      }
      const token = Utility.getContent(Utility.constItem.Token);
      const __pathname = '/' + url;
      const state = { pathname: __pathname, query: Object.assign(params || {}, { token, _timestamp: new Date().getTime() }) };
      if (isReplace) {
        router.replace(state);
      } else {
        router.push(state);
      }
    } catch (ex) {
      console.log(ex.toString());
    }
  }

  /**
   * 格式化
   * @example
   * sprintf('Latitude: %s, Longitude: %s, Count: %d', 41.847, -87.661, 'two')
   * Expected output: Latitude: 41.847, Longitude: -87.661, Count: 0
   * @returns {*}
   */
  static sprintf() {
    const args = arguments;
    const string = args[0];
    let __index = 1;
    return string.replace(/%((%)|s|d)/g, (mm) => {
      // m is the matched format, e.g. %s, %d
      let val = null;
      if (mm[2]) {
        val = mm[2];
      } else {
        val = args[__index];
        // A switch statement so that the formatter can be extended. Default is %s
        switch (mm) {
          case '%d':
            val = parseFloat(val);
            if (isNaN(val)) {
              val = 0;
            }
            break;
          default:
            break;
        }
        __index++;
      }
      return val;
    });
  }

  /**
   * 格式化
   * @example
   * format('{0} is dead, but {1} is alive! {0} {2}', 'ASP', 'ASP.NET');
   * ASP is dead, but ASP.NET is alive! ASP {2}
   * @param format
   * @returns {*}
   */
  static format(format) {
    const args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, (match, number) => {
      return typeof args[number] !== 'undefined'
        ? args[number] : match;
    });
  }

  /**
   * 事件处理
   * @param eventName 事件名称
   * @param param1     参数名称1
   * @param param2     参数名称2
   * @param param3     参数名称3
   * @param param4     参数名称4
   * @param param5     参数名称5
   * @param param6     参数名称6
   * @param param7     参数名称7
   * @param param8     参数名称8
   * @param param9     参数名称9
   */
  static $emit(eventName, param1, param2, param3, param4, param5, param6, param7, param8, param9) {
    if (this.$isUndefined(eventName)) {
      return;
    }
    const event = this.getContent(this.constItem.Event);
    if (this.$isUndefined(event) || event === null) {
      return;
    }
    if (!this.isFunction(event.emit)) {
      return;
    }
    event.emit(eventName, param1, param2, param3, param4, param5, param6, param7, param8, param9);
  }

  /**
   * 添加事件
   * @param eventName  {string}  事件名称
   * @param callBack  {function} 回调的方法名称
   */
  static $on(eventName, callBack) {
    if (this.$isUndefined(eventName)) {
      return;
    }
    const event = this.getContent(this.constItem.Event);
    if (this.$isUndefined(event) || event === null) {
      return;
    }
    if (!this.isFunction(event.on)) {
      return;
    }
    event.on(eventName, callBack);
  }

  /**
   * 
   * 
   * @static
   * @param {any} previewInfo  {Url:''}
   * @memberof Utility
   */
  static $previewModel(previewInfo) {
    this.$emit(this.constItem.Events.ShowModel.OnPreviewModel, previewInfo || {});
  }

  static $previewModelHide() {
    this.$emit(this.constItem.Events.ShowModel.OnPreviewModelHide);
  }

  /**
   * 弹出提示信息
   * @param Content 弹出显示内容
   * @param Title  弹出显示的标题，可以不填写，默认为当前导航条里的标题
   * @param okClickTitle  点击标题事件
   * @param ToPage 弹出来，页面跳转到下一个页面 {Url: Utility.constItem.UrlItem.Login, Options: {}}
   * @constructor
   */
  static $actionSheet(Content, Title, okClickTitle, ToPage, Buttons) {
    this.$emit(this.constItem.Events.ShowModel.OnActionSheet, {
      Title: Title, okClickTitle: okClickTitle, ContentInfo: { Content: Content }, Buttons, ToPage: ToPage
    });
  }

  static $actionSheetHide(onHide) {
    this.$emit(this.constItem.Events.ShowModel.OnActionSheetHide, { callBack: onHide });
  }

  /**
   * 确定，取消窗体
   * @param Message 信息内容
   * @param okButton 点击确定事件
   * @param Title 弹出窗体上的标题 (可空)
   * @param onCancel 点击取消事件  (可空)
   */
  static $confirm(Message, okButton, Title, onCancel, options) {
    this.$emit(this.constItem.Events.ShowModel.OnConfirm,
      { Title: Title, Content: Message, okButton: okButton, onCancel: onCancel, Options: options }
    );
  }

  static $showDialog(Html, Title, okButton, onCancel, Options) {
    this.$emit(this.constItem.Events.ShowModel.OnShowDialog, {
      Title: Title, Html: Html, okButton: okButton, onCancel: onCancel, isShowAction: true, Options:
      Object.assign(Options || {}, { IsHideCancel: false, IsHideOk: false })
    });
  }

  static $showDialogHide(args) {
    this.$emit(this.constItem.Events.ShowModel.OnShowDialogHide, args);
  }

  static $showDialogConfirm(msg, Title, okButton, onCancel) {
    let _title = Title;
    let _okButton = okButton;
    if (this.isFunction(Title)) {
      _title = '提示信息';
      _okButton = Title;
    }
    this.$emit(this.constItem.Events.ShowModel.OnShowDialog,
      { Content: msg, Title: _title, okButton: _okButton, onCancel: onCancel }
    );
  }

  static $alert(msg, title) {
    let _title = title;
    let _okButton;
    if (this.isFunction(title)) {
      _title = '提示信息';
      _okButton = title;
    }
    this.$emit(this.constItem.Events.ShowModel.OnShowDialog,
      { Content: msg, Title: _title, okButton: _okButton, Options: { IsHideCancel: true } }
    );
  }

  /**
   * 打开加载动画
   */
  static $loading() {
    this.$emit(this.constItem.Events.ShowModel.OnLoading);
  }

  /**
   * 关闭加载动画
   */
  static $loadingHide() {
    this.$emit(this.constItem.Events.ShowModel.OnLoadingHide);
  }

  /**
   * 去空格
   * @param value
   * @returns {*}
   */
  static $trim(value) {
    if (typeof value !== 'undefined') {
      return value.replace(/(^\s*)|(\s*$)/g, '');
    }
    return '';
  }

  /**
   * 打开日期控件
   *
   * @static
   * @param {datetime} currentDate 当前时间
   * @param {boolean} isShowTime 是否显示时间
   * @param {Function} ok  点击确定按钮事件-->这里可以获取到返回的日期
   * @param {Function} cancel 取消按钮事件
   *
   * @example
   *    // 打开日期
   *    Utility.$openDatePicker(new Date(),false,(date)=>{console.log(date);},()=>{ // cancel todo });
   *    // 打开日期和时间
   *    Utility.$openDatePicker(new Date(),true,(date)=>{console.log(date);},()=>{ // cancel todo });
   *    // 传入日期
   *    Utility.$openDatePicker('2013-10-10',false,(date)=>{console.log(date);},()=>{// cancel todo });
   *    // 传入日期和时间
   *    Utility.$openDatePicker('2010-10-10 12:20,true,(date)=>{console.log(date);},()=>{ // cancel todo });
   *    // 传入值，如果是null 或 '' 默认为当前时间
   *    Utility.$openDatePicker('',false,(date)=>{console.log(date);},()=>{// cancel todo });
   *
   * @memberOf Utility
   */
  static $openDatePicker(currentDate, isShowTime, ok, cancel) {
    this.$emit(this.constItem.Events.OnOpenDatePicker, currentDate, isShowTime, ok, cancel);
  }

  /**
   * 将日期转为时间戳
   *
   * @static    * @param {any} date
   * @returns
   *
   * @memberOf Utility
   */
  static $convertToTimestamp(date) {
    if (typeof date === 'undefined' || date === null || date === '') {
      return 0;
    }
    if (this.isDate(date)) {
      return date.constructor.name === 'Date' ? date.getTime() : new Date(date.replace('年', '-').replace('月', '-').replace('日', '').replace(/-/g, '/')).getTime();
    }
    return 0;
  }

  /**
   * 将时间戳转为日期类型
   *
   * @static    * @param {number} value
   * @returns
   * @example
   *    Utility.$convertToDateByTimestamp('1478131200000') -> 2016-11-03
   *    Utility.$convertToDateByTimestamp('1478131200000','yyyy年MM月dd日') -> 2016年11月03日
   * @memberOf Utility
   */
  static $convertToDateByTimestamp(value, format) {
    if (this.$isNumber(value)) {
      const __date = new Date(parseInt(value, 0));
      return this.formatDate(format || 'yyyy-MM-dd', __date);
    }
    return '';
  }

  /**
   * 字符串转为日期类型
   *
   * @static    * @param {string} value 日期
   * @returns Date 或为 null
   * @example
   *  Utility.$convertToDateByString('2013-10-10');
   * @memberOf Utility
   */
  static $convertToDateByString(value) {
    if (this.isDate(value)) {
      return value.constructor.name === 'Date' ? value : new Date(value.replace('年', '-').replace('月', '-').replace('日', ''));
    }
    return null;
  }

  /**
   * @param value
   * @returns {*}
   */
  static $isNumber(value) {
    if (typeof value === 'undefined' || value === null || value === '') {
      return false;
    }
    return /^\+?[0-9]\d*$/.test(value);
  }

  /**
   * 格式化数字
   *
   * @static
   * @param {any} number
   * @returns
   *
   * @example Utility.$formatNumber(10000) ==> 10,000
   * @memberOf Utility
   */
  static $formatNumber(number) {
    if (!this.$isNumber(number)) {
      return number;
    }
    const __value = this.$trim(number);
    return String(__value).split('').reverse().join('').replace(/(\d{3})(?=[^$])/g, '$1,').split('').reverse().join('');
  }

  /**
   * 判断是否为空
   *
   * @static
   * @param {string} value 要判断的值
   * @returns true:是 ; false:否
   *
   * @memberOf Utility
   */
  static $isEmpty(value) {
    if (!value) {
      return true;
    }
    const __value = this.$trim(value);
    if (__value === '') {
      return true;
    }
    return false;
  }

  static $clone(obj) {
    if (!obj) {
      return null;
    }
    const __temp = {};
    Object.keys(obj).forEach((key) => {
      if (key !== 'IsExistsNextData' && key !== '_timestamp') {
        __temp[key] = obj[key] ? obj[key].toString() : '';
      }
    });
    return __temp;
  }

  /**
   * 后退操作
   * 
   * @static
   * 
   * @memberOf Utility
   */
  static $goBack(times) {
    this.$toPage(this.constItem.UrlItem.GoBack, { times: times });
  }

  /**
   * 拆分表情
   * 
   * @static
   * @param {any} Content 要拆分的表情
   * @param {any} EmotList 表情列表
   * @returns 
   * @memberof Utility
   */
  static $parseEmotion(Content, EmotList) {
    if (!Content || !EmotList || EmotList.length === 0 || Content === '') {
      return [];
    }
    const __fistEmot = EmotList.shift();
    const __tempEmotList = [].concat(EmotList);
    const __splitResult = Content.split(__fistEmot.name); // 又拆分出新的来了。
    let __List = [];
    if (__splitResult.length === 1) {
      // 说明没有了
      __List = this.$parseEmotion(Content, [].concat(EmotList));
      if (__List.length > 0) {
        return __List;
      }
      __List.push({ Value: Content });
      return __List;
    }
    if (__splitResult.length === 2) {
      // 分左右两边了
      const __left = __splitResult[0];
      const __right = __splitResult[1];
      const __leftResult = this.$parseEmotion(__left, [].concat(__tempEmotList));
      const __rightResult = this.$parseEmotion(__right, [].concat(__tempEmotList));
      if (__leftResult.length > 0) {
        __List = __List.concat(__leftResult);
      }
      __List.push({ Value: __fistEmot.name, IsEmot: true, EmotInfo: __fistEmot });
      if (__rightResult.length > 0) {
        __List = __List.concat(__rightResult);
      }
      return __List;
    }
    // [睡]a[闭嘴]b[害羞]c[得意]d[色]e[撇嘴]f[睡]g[微笑]
    for (let i = 0; i < __splitResult.length - 1; i++) {
      // 取出值来。
      const __value = this.$parseEmotion(__splitResult[i], [].concat(__tempEmotList));
      if (__value.length > 0) {
        __List = __List.concat(__value);
      }
      __List.push({ Value: __fistEmot.name, IsEmot: true, EmotInfo: __fistEmot });
    }
    if (__splitResult.length > 2) {
      const __lastValue = __splitResult[__splitResult.length - 1];
      const __value = this.$parseEmotion(__lastValue, [].concat(__tempEmotList));
      if (__value.length > 0) {
        __List = __List.concat(__value);
      }
    }
    return __List;
  }

  /**
   * 拆分话题及表情
   * 
   * @static
   * @param {any} value 要拆分的内容
   * @param {any} topicList 话题列表
   * @param {any} emots 表情列表
   * @returns 
   * @memberof Utility
   */
  static $parseCharacterSplit(value, topicList, emots) {
    if (value && !this.$isArray(topicList)) {
      return Utility.$parseEmotion(value, [].concat(emots));
    }
    if (!this.$isArray(topicList) || value === '') {
      return [];
    }
    const __First = topicList.shift();
    const __Result = value.split('#' + __First.Title + '#');
    let __dList = [];
    if (__Result.length === 1) {
      const __left_Emot = Utility.$parseEmotion(value, [].concat(emots));
      if (__left_Emot.length > 0) {
        __dList = __dList.concat(__left_Emot);
      }
      return __dList;
    }
    if (__Result.length === 2) {
      // 最后了。
      const _left = __Result[0];
      const _right = __Result[1];
      if (_left !== '') {
        const _left_result = Utility.$parseCharacterSplit(_left, [].concat(topicList), [].concat(emots));
        __dList = __dList.concat(_left_result);
      }
      __dList.push({ Value: '#' + __First.Title + '#', Topic: __First });
      if (_right !== '') {
        const _right_result = this.$parseCharacterSplit(_right, [].concat(topicList), [].concat(emots));
        __dList = __dList.concat(_right_result);
      }
      return __dList;
    }
    for (let i = 0; i < __Result.length; i++) {
      const __value = __Result[i];
      if (__value !== '') {
        const _fEmot = this.$parseEmotion(__value, [].concat(emots));
        if (_fEmot.length > 0) {
          __dList = __dList.concat(_fEmot);
        }
      }
      if (i < __Result.length - 1) {
        __dList.push({ key: __First.Title, Value: '#' + __First.Title + '#', Topic: __First });
      }
    }
    return __dList;
  }
}
