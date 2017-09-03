import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Utility, XtnNavBar } from 'components';
import config from '../../config';
// import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import { CSSTransitionGroup } from 'react-transition-group';
// import { connect } from 'react-redux';
// import * as CommonActions from 'redux/modules/reduxCommon';
const EventEmitter = require('events').EventEmitter;
const event = new EventEmitter();

// @connect(
//   state => ({
//     Title: state.Common.Title,                                          // 标题
//     UrlParams: state.Common.UrlParams,                                  // URL参数
//     TabsFooterInfo: state.Common.TabsFooterInfo,                        // tabsTooter信息
//     PageSliderInfo: state.Common.PageSliderInfo,                        // 页面滑动
//   }),
//   { ...CommonActions })
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,                                // 子项
    location: PropTypes.object,                                           // location信息
    Title: PropTypes.string,                                              // 标题
    UrlParams: PropTypes.object,                                          // url 参数
    TabsFooterInfo: PropTypes.object,                                     // tabsTooter信息
    PageSliderInfo: PropTypes.object,                                     // 页面滑动
  };

  static contextTypes = { store: PropTypes.object.isRequired };

  constructor(props) {
    super(props);
    const __IsShow = !!config.app.IsHideNavBar;
    Utility.setContent(Utility.constItem.ConfigInfo, config);
    this.state = { index: 0, Title: '', IsReturn: false, IsInitIComAPI: false, IsShow: false, IsWeiXin: __IsShow };
    // get token from url
    this.getTokenFromUrl();
  }

  componentWillMount() {
    this.state.isMount = true;

    if (this.state.IsWeiXin) {
      Utility.removeContent(Utility.constItem.UserInfo, true);
    }
    // 设置事件
    Utility.setContent(Utility.constItem.Event, event);
    const __self = this;
    Utility.$on(Utility.constItem.Events.OnEditPageSliderInfo, (options) => {
      const { IsHideNavBar, IsReturn, Title } = options;
      if (Title) {
        __self.state.Title = Title;
      }
      __self.state.IsWeiXin = !!IsHideNavBar;
      __self.state.IsReturn = IsReturn || false;
      __self.forceUpdate();
    });
    this.__SetRouterComponentEnterAndLeve();
  }

  componentDidMount() {
    // this.__JudgeNetwork();
    this.__SetMaxWindow();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const _nextIsReturn = nextState.IsReturn;
    const _nextTitle = nextState.Title;
    const _IsWeiXin = nextState.IsWeiXin;
    const { Title, IsReturn, IsWeiXin } = this.state;
    const __Result = _nextIsReturn !== IsReturn || _nextTitle !== Title || _IsWeiXin !== IsWeiXin;
    return __Result;
  }

  componentWillUnmount() {
    delete this.state.isMount;
    clearInterval(this.state.Interval1);
    clearInterval(this.state.MaxWindowInterval);
    clearInterval(this.state.MaxWindowInterval);
  }

  getTokenFromUrl() {
    const { location } = this.props;
    const { query } = location || {};
    const { token } = query || {};
    if (token) {
      const { app } = config;
      const { Environment } = app || {};
      const __TokenKey = Utility.constItem.Token;
      Utility.removeContent(__TokenKey, true);
      Utility.setContent(__TokenKey, token, !Environment);
    }
  }

  getTransitionsName(isReturn, styles) {
    const __tranName = {};
    if (isReturn) {
      __tranName.enter = styles.spEnterReturn;
      __tranName.enterActive = styles.spEnterActiveReturn;
      __tranName.leave = styles.spLeaveReturn;
      __tranName.leaveActive = styles.spLeaveActiveReturn;
      __tranName.appear = styles.spAppearReturn;
      __tranName.appearActive = styles.spAppearActiveReturn;
    } else {
      __tranName.enter = styles.spEnter;
      __tranName.enterActive = styles.spEnterActive;
      __tranName.leave = styles.spLeave;
      __tranName.leaveActive = styles.spLeaveActive;
      __tranName.appear = styles.spAppear;
      __tranName.appearActive = styles.spAppearActive;
    }
    return __tranName;
  }
  __SetMaxWindow() {
    const MaxWindowInterval = setInterval(() => {
      const { xtn } = window;
      if (xtn) {
        clearInterval(MaxWindowInterval);
        clearInterval(MaxWindowInterval);
        Utility.$platformApi.$maxWindow();
      }
    }, 500);

    this.state.MaxWindowInterval = MaxWindowInterval;
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

  __SetRouterComponentEnterAndLeve() {
    const { children } = this.props;
    const { props } = children || {};
    const { routes } = props || {};
    if (!Utility.$isArray(routes)) {
      return;
    }
    const { childRoutes } = routes[0];
    if (!Utility.$isArray(childRoutes)) {
      return;
    }
    const __KeyScroll = 'xtn_ROUTER_SCROLLTOP';
    const __onLeave = (args) => {
      const __Data = Utility.getContent(__KeyScroll) || {};
      __Data[args.toLocaleLowerCase()] = window.document.body.scrollTop;
      Utility.setContent(__KeyScroll, __Data);
    };
    const __onEnter = (args) => {
      const { location } = args;
      const { pathname } = location;
      const __Data = Utility.getContent(__KeyScroll);
      if (__Data && __Data[pathname] && __Data[pathname] > 0) {
        setTimeout(() => {
          window.document.body.scrollTop = __Data[pathname];
        }, 1000);
      }
    };
    childRoutes.forEach((r) => {
      r.onLeave = __onLeave.bind(r, r.path);
      r.onEnter = __onEnter.bind(r);
    });
    routes.forEach((r) => {
      const { path, isIndex } = r;
      if (path) {
        r.onLeave = __onLeave.bind(r, r.path);
        r.onEnter = __onEnter.bind(r);
      }
      if (isIndex === 1) {
        r.onLeave = __onLeave.bind(r, '/');
        r.onEnter = __onEnter.bind(r);
      }
    });
  }

  render() {
    const styles = require('./App.scss');
    const { Title, IsReturn, IsWeiXin, IsShow } = this.state;
    const IsStop = Utility.getContent(Utility.constItem.IsStopSlidePageAnimation);
    const __timeout = !!IsStop ? 1 : 500;
    return (
      <div className={styles.app + ' ' + (IsShow ? styles.show : '')}>
        <Helmet {...config.app.head} title={Title} />
        <XtnNavBar Title={Title} IsWeiXin={IsWeiXin} />

        <div className={!!IsWeiXin ? styles.isWeiXin : styles.appContent} ref="divAppMain">
          <CSSTransitionGroup component="div"
            transitionName={!!IsStop ? 'demo' : this.getTransitionsName(!!IsReturn, styles)}
            transitionAppear
            transitionAppearTimeout={__timeout}
            transitionEnterTimeout={__timeout}
            transitionLeaveTimeout={__timeout}>
            {React.cloneElement(this.props.children, { key: this.props.location.pathname })}
          </CSSTransitionGroup>
        </div>
      </div>
    );
  }
}
