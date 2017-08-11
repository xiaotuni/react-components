/**
 * Created by admin on 2016-06-13.
 */
import React, { Component, PropTypes } from 'react';
import { Utility } from 'components';

export default class XtnSlidePage extends Component {
  static propTypes = {
    children: PropTypes.any,                                  // 子项
    ImageList: PropTypes.array,
    ImageHeight: PropTypes.number,
    UpdateKey: PropTypes.string,
    IsShowNumber: PropTypes.bool,
    DotMarginTop: PropTypes.number,
    AutoPlay: PropTypes.bool,                                 // 是否自动
    NavigationBtnStyle: PropTypes.string,                     // 导航按钮的样式，默认为'dot'
    PageIndex: PropTypes.number,                              // 当前第几页
    onNextPage: PropTypes.func,                               //

  };

  constructor(props) {
    super(props);
    this.state = { IsAdd: true, CurrentIndex: 0, IsNextPage: true, DataSource: this.props.children || [] };
    const { DataSource } = this.state;
    if (!DataSource) {
      this.state.DataSource = [];
    } else if (DataSource && !DataSource.length) {
      this.state.DataSource = [DataSource];
    }
    const { PageIndex } = this.props;
    this.state.CurrentIndex = PageIndex >= 0 ? PageIndex : 0;
    this.__NextPageIndex(this.props.PageIndex);
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.state.IsMount = true;
    const { DataSource } = this.state;
    const { AutoPlay } = this.props;
    if (DataSource.length > 1 && AutoPlay === true) {
      this.state.IsAutoPlay = true;
      this.state.Interval = setInterval(this.__NextPage.bind(this), 3000);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.state.DataSource = nextProps.children;
    const { IsAutoPlay, DataSource } = this.state;
    if (!DataSource) {
      this.state.DataSource = [];
    } else if (DataSource && !DataSource.length) {
      this.state.DataSource = [DataSource];
    } else {
      const PageIndex = nextProps.PageIndex;
      // this.__NextPageIndex(PageIndex);
      this.state.CurrentIndex = PageIndex;
      if (IsAutoPlay === true || nextProps.AutoPlay === true) {
        this.state.IsAutoPlay = true;
        this.state.Interval = setInterval(this.__NextPage.bind(this), 3000);
      }
    }
  }

  componentWillUnmount() {
    delete this.state.IsMount;
    clearInterval(this.state.Interval);
  }

  __UpdateRender() {
    if (!!this.state.IsMount) {
      Utility.removeContent(this.props.UpdateKey);
      this.setState({ cDate: new Date().getTime() });
    }
  }

  /**
   * 鼠标悬浮时候 图片不滚动 
   * 
   * @memberOf Carousel
   */
  __ClearInterval() {
    clearInterval(this.state.Interval);
  }

  __NextPageIndex(pIndex) {
    if (pIndex === 0) {
      return;
    }
    const { DataSource } = this.state;
    for (let i = 0; i < pIndex; i++) {
      const __shift = DataSource.shift();    // 获取第一个过元素
      DataSource.push(__shift);
    }
  }

  __NextPage() {
    const { CurrentIndex, DataSource } = this.state;
    if (CurrentIndex < DataSource.length - 1) {
      this.state.CurrentIndex++;
      const { onNextPage } = this.props;
      if (onNextPage) {
        onNextPage(this.state.CurrentIndex);
      }
    }
    Object.keys(this.refs).filter((key) => key.indexOf('div_page_') >= 0).forEach((key) => {
      const ctrl = this.refs[key];
      const { style } = ctrl;
      const __tr3d = 'translate3d(-' + this.state.CurrentIndex * 100 + '%, 0, 0)';
      style.transform = __tr3d;
      style.transition = 'all .2s ease-in';
      style.webkitTransform = __tr3d;
    });
    this.__UpdateRender();
  }

  __PreviousImage() {
    const { CurrentIndex } = this.state;
    if (CurrentIndex > 0) {
      this.state.CurrentIndex--;
      const { onNextPage } = this.props;
      if (onNextPage) {
        onNextPage(this.state.CurrentIndex);
      }
    }
    Object.keys(this.refs).filter((key) => key.indexOf('div_page_') >= 0).forEach((key) => {
      const ctrl = this.refs[key];
      const { style } = ctrl;
      const __tr3d = 'translate3d(-' + this.state.CurrentIndex * 100 + '%, 0, 0)';
      style.transform = __tr3d;
      style.transition = 'all .2s ease-in';
      style.webkitTransform = __tr3d;
    });

    this.__UpdateRender();
  }

  __BuildHtml(styles) {
    const { DataSource, IsNextPage } = this.state;
    const __Html = (child, index, IsAdd) => {
      const __tr3d = 'translate3d(0%, 0, 0)';
      const __style = { transform: __tr3d };
      if (!!IsNextPage) {
        return (<div ref={'div_page_' + index} key={'c_i_n_' + index} style={__style}
          className={styles.item + ' ' +
            (IsAdd ? styles.item0 : '') + ' ' +
            styles['other' + index] + ' ' +
            (index <= 2 ? '' : styles.none)}>
          {child}
        </div>);
      }
      return (<div ref={'div_page_' + index} key={'c_i_p_' + index}
        className={styles.item_P + ' ' +
          (IsAdd ? styles.item0_p : '') + ' ' +
          styles['other' + index] + ' ' +
          (index <= 2 ? '' : styles.none)}>
        {child}
      </div>);
    };
    if (DataSource.length === 1) {
      return __Html(DataSource[0], 0, false);
    }
    const __IsAdd = this.state.IsAdd;
    return DataSource.map((child, index) => {
      return __Html(child, index, __IsAdd);
    });
  }

  __LeftRightSlideBegin() {
    this.state.IsLeftRightSlideBegin = true;
  }
  __LeftRightSlideEnd() {
    delete this.state.IsLeftRightSlideBegin;
    console.log('结束');
  }

  __LeftRightSlide(Percentage) {
    const { divCC } = this.refs;
    const { clientWidth } = divCC;
    const __per = (Percentage / clientWidth) * 100;
    const { CurrentIndex } = this.state;
    const __newValue = (0 - CurrentIndex * 100) + __per;
    Object.keys(this.refs).filter((key) => key.indexOf('div_page_') >= 0).forEach((key) => {
      const ctrl = this.refs[key];
      const { style } = ctrl;
      const __tr3d = 'translate3d(' + __newValue + '%, 0, 0)';
      console.log('%d %; %s', __newValue, __tr3d);
      style.transform = __tr3d;
      style.webkitTransform = __tr3d;
    });
  }


  __BuildHtmlDot(styles) {
    const { DataSource, CurrentIndex } = this.state;
    if (DataSource.length === 1) {
      return null;
    }
    const { NavigationBtnStyle } = this.props;
    const __nBtn = styles[NavigationBtnStyle] ? styles[NavigationBtnStyle] : styles.dot;
    return DataSource.map((row, index) => {
      return (<div key={'carousel_dot_index_' + index} className={__nBtn + ' ' + (CurrentIndex === index ? styles.select : '')} >
        <div></div>
      </div>);
    });
  }

  __GetDotInfoStyle() {
    const { DotMarginTop } = this.props;
    const __Style = {};
    __Style.marginTop = DotMarginTop && DotMarginTop > 0 ? (DotMarginTop + 'px') : '-30px';
    return __Style;
  }


  render() {
    const { IsShowNumber } = this.props;
    const { CurrentIndex, DataSource } = this.state;
    const _CIndex = CurrentIndex + 1;
    const __Length = DataSource.length;
    const styles = require('./scss/XtnSlidePage.scss');
    return (
      <div ref="divCC" className={styles.slidePageCss}>
        <div className={styles.imageInfo}>
          <div className={styles.imageItems} >
            {this.__BuildHtml(styles)}
          </div>
        </div>
        {!!IsShowNumber ?
          <div className={styles.numberInfo}>{'(' + _CIndex + '/' + __Length + ')'}</div> :
          <div className={styles.dotInfo} style={this.__GetDotInfoStyle()}>
            <div className={styles.dotItem}>
              {this.__BuildHtmlDot(styles)}
            </div>
          </div>
        }
        <div className={styles.buttonGroup}>
          <div className={styles.previous} onClick={this.__PreviousImage.bind(this)}>上</div>
          <div className={styles.next} onClick={this.__NextPage.bind(this)}>下</div>
        </div>
      </div>
    );
  }
}


