/**
 * Created by admin on 2016-08-24.
 */
import React, { Component, PropTypes } from 'react';
import { Utility, XtnScroll, XtnCarousel } from 'components';
const styles = require('./scss/XtnPreviewModel.scss');
/**
 * 预览
 *  <XtnPreviewModel />
 *
 */
export default class XtnPreviewModel extends Component {
  static propTypes = {
    children: PropTypes.object,                                     // 子项
    PreviewInfo: PropTypes.object,                                  //
    onClose: PropTypes.func,                                  //
  };

  constructor(props) {
    super(props);
    this.state = { index: 0 };
  }

  componentDidMount() {
    const { } = Utility;
  }

  componentWillUnmount() {
    this.state.IsUnmount = true;
  }

  __HandlerClose() {
    const { onClose } = this.props;
    if (!Utility.isFunction(onClose)) {
      return;
    }
    onClose();
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

  __BuildList() {
    const { PreviewInfo } = this.props;
    const { Urls } = PreviewInfo || {};
    if (!Utility.$isArray(Urls)) {
      return null;
    }
    return Urls.map((Url, index) => {
      return (<div className={styles.img} key={'url_' + index} style={{ backgroundImage: 'url(' + Url + ')' }}></div>);
    });
  }

  __HandlerSlide(isLeft) {
    const { divCarousel } = this.refs;
    if (!divCarousel) {
      return;
    }
    if (!!isLeft) {
      divCarousel.__NextPage();
    } else {
      divCarousel.__HandlerPrevious();
    }
  }

  render() {
    const { PreviewInfo } = this.props;
    const { Index } = PreviewInfo || {};
    const { cIndex } = this.state;
    return (
      <div className={styles.previewModelCss} ref="xtnPreviewModel" >
        <div className={styles.background} onClick={() => Utility.$previewModelHide()}></div>
        <div className={styles.content} onClick={() => Utility.$previewModelHide()}>
          <div className={styles.close}>
            <div onClick={() => Utility.$previewModelHide()}>X</div>
          </div>
          <div className={styles.pMode}>
            <XtnScroll RefreshComplete NextDataComplete onSlideLeft={this.__HandlerSlide.bind(this, true)}
              onSlideRight={this.__HandlerSlide.bind(this, false)}>
              <XtnCarousel ref="divCarousel" IsShowNumber PageIndex={cIndex || Index || 0} onNextPage={(index) => {
                this.state.cIndex = index;
              }}>
                {this.__BuildList()}
              </XtnCarousel>
            </XtnScroll>
          </div>
        </div>
      </div>
    );
  }
}
