/**
 * Created by admin on 2016-09-21.
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { XtnDefHref } from 'components';
import * as CommonActions from 'redux/modules/reduxCommon';

const styles = require('./scss/Page1.scss');

@connect(
  state => ({
    Title: state.Common.Title,                                          // 标题
    UrlParams: state.Common.UrlParams,                                  // URL参数
  }),
  { ...CommonActions })
export default class Page2 extends Component {
  static propTypes = {
    Title: PropTypes.string,                                              // 标题
    UrlParams: PropTypes.object,                                         // url 参数
  };

  constructor(props) {
    super(props);

    this.state = { RefreshComplete: true, NextDataComplete: true, UA: navigator.userAgent };
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className={styles.defaultCss}>
        <XtnDefHref />
        Page2 Component;
      </div>
    );
  }
}

