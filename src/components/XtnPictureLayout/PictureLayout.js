/**
 * 九宫格组件 引入react-bootstrap
 */
import React, { PropTypes, Component } from 'react';
import { Utility } from 'components';
const styles = require('./scss/PictureLayout.scss');

export default class PictureLayout extends Component {
  static propTypes = {
    PictureList: PropTypes.array,                                            // 图片数组
  }
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  /**
   * 图片预览
   * 
   * @param {any} styles 
   * @returns 
   * @memberof PictureLayout
   */
  __PicturePreview(Index) {
    const { PictureList } = this.props;
    if (!Utility.$isArray(PictureList)) {
      return;
    }
    const _url = [];
    for (let i = 0; i < PictureList.length; i++) {
      if (PictureList[i].Url) {
        _url.push(PictureList[i].Url);
      }
    }

    Utility.$previewModel({ Urls: _url, Index: Index });
  }

  __BuildImageListHTML() {
    const { PictureList } = this.props;
    if (!Utility.$isArray(PictureList)) {
      return null;
    }
    const __length = PictureList.length;
    let __List = [];
    if (__length > 9) {
      __List = PictureList.slice(0, 9);
    } else {
      __List = PictureList;
    }
    const __CName = __length === 4 ? styles.img_4 : styles.img0;
    return __List.map((row, index) => {
      return (<div key={index} className={__CName}
        onClick={this.__PicturePreview.bind(this, index)}>
        <img src={row.Url} />
      </div>);
    });
  }
  render() {
    return (
      <div className={styles.pictureLayoutCss} >
        {
          this.__BuildImageListHTML()
        }
      </div>
    );
  }
}
