/**
 * Created by admin on 2016-06-13.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { } from 'components';

export default class CarouselContent extends Component {
  static propTypes = {
    children: PropTypes.any,                                  // 子项
    ImageList: PropTypes.array,
    ImageHeight: PropTypes.number,
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
    } else {
      const lastImage = DataSource.pop();    // 获取最后一个元素
      DataSource.unshift(lastImage);
      this.state.DataSource = DataSource;
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
    const { DataSource, IsAutoPlay } = this.state;
    if (!DataSource) {
      this.state.DataSource = [];
    } else if (DataSource && !DataSource.length) {
      this.state.DataSource = [DataSource];
    } else {
      const lastImage = DataSource.pop();    // 获取最后一个元素
      DataSource.unshift(lastImage);
      this.state.DataSource = DataSource;
      const PageIndex = nextProps.PageIndex;
      this.__NextPageIndex(PageIndex);
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

  /**
   * 鼠标离开 轮播开始滚动
   * @memberOf Carousel
   */
  __MouseOut() {
    // this.state.Interval = setInterval(this.__NextPage.bind(this), 3000);
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
    if (DataSource.length === 1) {
      return;
    }
    const __shift = DataSource.shift();    // 获取第一个过元素
    DataSource.push(__shift);
    this.state.DataSource = DataSource;
    this.state.CurrentIndex = CurrentIndex < DataSource.length - 1 ? CurrentIndex + 1 : 0;
    this.state.IsAdd = false;
    this.state.IsNextPage = true;
    this.__UpdateRender();
    setTimeout(() => {
      this.state.IsAdd = true;
      this.__UpdateRender();
    }, 50);
    const { onNextPage } = this.props;
    if (onNextPage) {
      onNextPage(this.state.CurrentIndex);
    }
  }

  __PreviousImage() {
    const { CurrentIndex, DataSource } = this.state;
    if (DataSource.length === 1) {
      return;
    }
    this.state.DataSource = DataSource;
    this.state.CurrentIndex = DataSource.length === 1 ? 0 : CurrentIndex >= 1 ? CurrentIndex - 1 : DataSource.length - 1;
    this.state.IsAdd = false;
    this.state.IsNextPage = false;
    this.__UpdateRender();
    setTimeout(() => {
      this.state.IsAdd = true;
      this.__UpdateRender();
      const __shift = DataSource.pop();    // 取出最后一个元素，并把他放到最前面。
      DataSource.unshift(__shift);
    }, 50);

    const { onNextPage } = this.props;
    if (onNextPage) {
      onNextPage(this.state.CurrentIndex);
    }
  }
  __HandlerPrevious() {
    this.__PreviousImage();
  }

  __HandlerNext() {
    this.__NextPage();
  }

  __BuildHtml(styles) {
    const { DataSource, IsNextPage } = this.state;
    const __Html = (child, index, IsAdd) => {
      if (!!IsNextPage) {
        return (<div key={'c_i_n_' + index}
          className={styles.item + ' ' +
            (IsAdd ? styles.item0 : '') + ' ' +
            styles['other' + index] + ' ' +
            (index <= 2 ? '' : styles.none)}>
          {child}
        </div>);
      }
      return (<div key={'c_i_p_' + index}
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
    const styles = require('./scss/XtnCarousel.scss');
    return (
      <div className={styles.carousel}>
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
          <div className={styles.previous} onClick={this.__HandlerPrevious.bind(this)}>上</div>
          <div className={styles.next} onClick={this.__HandlerNext.bind(this)}>下</div>
        </div>
      </div>
    );
  }
}


