/**
 * Created by admin on 2016-08-24.
 */
import React, { Component, PropTypes } from 'react';
import { } from 'components';
/**
 * 加载模型
 *
 * <XtnLoadingModel Content = "数据正在加载..." />
 */
export default class XtnLoadingModel extends Component {
  static propTypes = {
    Content: PropTypes.string
  };

  /**
   * 关闭窗体
   * @private
   */
  __HandlerCloseButton() {
    // Utility.$emit(Utility.constItem.Events.ShowModel.OnLoadingHide);
  }

  /**
   * 此方法，是为了防止，底层DIV滚动用的。
   * @param ee
   * @private
   */
  __HandlerOnScroll(ee) {
    ee.stopPropagation();
    ee.preventDefault();
  }

  render() {
    const styles = require('./scss/XtnLoadingModel.scss');
    const { Content } = this.props;

    return (
      <div className={styles.loadingModel} ref="xtnLoadingModel">
        <div className={styles.background}></div>
        <div className={styles.leiLong} onTouchMove={this.__HandlerOnScroll.bind(this)}
          onClick={this.__HandlerCloseButton.bind(this)}>
          <div className={styles.subLeiLong}>
            <div className={styles.loadingIcon}></div>
            <div className={styles.template}>{Content || '正在处理,请稍等...'}</div>
          </div>
        </div>
      </div>
    );
  }
}
