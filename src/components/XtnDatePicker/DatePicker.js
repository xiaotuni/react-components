/**
 * Created by admin on 2016-10-13.
 *
 *  <XtnDatePicker value={value}
 *     min={new Date(1970, 0, 1)}
 *     max={new Date(2050, 0, 1)}
 *     isShowTime = {true} 有这个就显示出时间出来。false的时候，不显示时间
 *     onConfirm={this.__HandlerConfirm.bind(this)}
 *     onCancel={this.__HandlerCancel.bind(this)}
 *     />
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { convertDate } from './time.js';
import DatePickerItem from './DatePickerItem.js';
import Utility from '../../Common/Utility';

export default class DatePicker extends Component {
  static propTypes = {
    value: PropTypes.object,                         // 初始化值
    min: PropTypes.object,                           // 最小值
    max: PropTypes.object,                           // 最大值
    isShowTime: PropTypes.bool,                      // 是否显示时间
    onConfirm: PropTypes.func,                       // 确定
    onCancel: PropTypes.func,                        // 取消关闭用的。
  }

  constructor(props) {
    super(props);
    this.state = { __index: 0, value: new Date(), type: 'date' };
  }

  componentWillMount() {
    const { value, min, max } = this.props;
    this.setState({ value: value || new Date(), min: min || new Date(1930, 0, 1), max: max || new Date(2099, 0, 1) });
  }

  componentDidMount() {
  }

  /**
   * 选择日期事件
   * @param value
   * @private
   */
  __HandlerSelect(value) {
    this.setState({ value: value });
  }

  /**
   * 点击确定事件
   */
  handleFinishBtnClick() {
    const { onConfirm, isShowTime } = this.props;
    const { value, Hour, Minute } = this.state;
    if (!onConfirm) {
      return;
    }
    if (isShowTime) {
      if (Hour) {
        value.setHours(Hour);
      }
      if (Minute) {
        value.setMinutes(Minute);
      }
    }
    onConfirm(value);
    this.handleCancel();
  }

  /**
   * 点击取消事件
   */
  handleCancel() {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  }

  /**
   * 日期，时间类型
   * @param type
   * @private
   */
  __HandlerDate(type) {
    this.setState({ type: type });
  }

  /**
   * 只能输入数字事件
   * @param event
   * @private
   */
  __HandlerKeyDown() {
    // console.log(event);
    // if ((event.keyCode < 48 || event.keyCode > 57) || event.keyCode !== 8 || event.keyCode !== 13) {
    // }
  }

  __HandlerKeyPress(event) {
    if (!Utility.$isNumber(event.key)) {
      event.preventDefault();
      return;
    }
    if ((event.charCode >= 48 && event.charCode <= 57) || (event.charCode >= 96 && event.charCode <= 105)) {
      return;
    }
    event.preventDefault();
  }

  /**
   * 失去焦点事件
   * @param type
   * @private
   */
  __HandlerBlur(type) {
    const __txt = this.refs['txt' + type];
    let __value = Utility.$trim(__txt.value);
    if (!Utility.$isNumber(__value)) {
      Utility.$actionSheet('只能输入数字');
      __txt.value = '0';
      __value = '';
    }
    this.state[type] = __value;
    this.setState({ __index: this.state.__index++ });
  }

  __HandlerArrow(direction, ctrl) {
    const __txt = this.refs['txt' + ctrl];
    if (!Utility.$isNumber(Utility.$trim(__txt.value))) {
      Utility.$actionSheet('请输入数字');
      return;
    }
    const value = parseInt(Utility.$trim(__txt.value), 0);
    if (ctrl === 'Minute') { // 分钟
      if (value === 0 && direction !== 'up') {
        __txt.value = 59;
      } else if (value === 59 && direction === 'up') {
        __txt.value = 0;
      } else {
        __txt.value = (direction === 'up' ? (value + 1) : (value - 1));
      }
    } else {  // 小时
      if (value === 0 && direction !== 'up') {
        __txt.value = 23;
      } else if (value === 23 && direction === 'up') {
        __txt.value = 0;
      } else {
        __txt.value = (direction === 'up' ? (value + 1) : (value - 1));
      }
    }
    this.state[ctrl] = __txt.value;
    this.setState({ __index: this.state.__index++ });
  }

  __GetHoursAndMinutes() {
    const { isShowTime } = this.props;
    if (!isShowTime) {
      return '';
    }
    const { value, Hour, Minute } = this.state;
    // if (type !== 'time') {
    //   return '';
    // }
    return (Hour || value.getHours()) + ':' + (Minute || value.getMinutes());
  }

  render() {
    const dStyle = require('./scss/index.scss');
    const { isShowTime } = this.props;
    const { value, min, max, type, Hour, Minute } = this.state;
    return (
      <div className={dStyle.datepickerModal}>
        <div className={dStyle.datepicker + ' ' + dStyle.default}>
          <div className={dStyle.datepickerHeader}>
            <div
              className={dStyle.dateInfo + ' ' + (type === 'date' ? dStyle.select : '') + ' ' + (!isShowTime ? dStyle.dateInfo1 : '')}
              onClick={this.__HandlerDate.bind(this, 'date')}>日期
            </div>
            <div className={dStyle.dateTimeInfo + ' ' + (!isShowTime ? dStyle.dateTimeInfo1 : '')}>
              {convertDate(value, 'YYYY-MM-DD') + ' ' + this.__GetHoursAndMinutes()}
            </div>
            {isShowTime ?
              <div className={dStyle.timeInfo + ' ' + (type === 'time' ? dStyle.select : '')}
                onClick={this.__HandlerDate.bind(this, 'time')}>时间
              </div> : ''
            }
          </div>
          {type === 'date' ?
            <div className={dStyle.datepickerContent}>
              <DatePickerItem value={value} typeName="Year" format="YYYY" min={min} max={max} onSelect={this.__HandlerSelect.bind(this)} />
              <DatePickerItem value={value} typeName="Month" format="M" min={min} max={max} onSelect={this.__HandlerSelect.bind(this)} />
              <DatePickerItem value={value} typeName="Date" format="D" min={min} max={max} onSelect={this.__HandlerSelect.bind(this)} />
            </div>
            :
            <div className={dStyle.timeContent}>
              <div className={dStyle.timeContentCenter}>
                <div className={dStyle.item}>
                  <div className={dStyle.title}>小时：</div>
                  <div className={dStyle.value}>
                    <input type="text" ref="txtHour" maxLength="2" defaultValue={Hour || value.getHours()}
                      onKeyPress={this.__HandlerKeyPress.bind(this)}
                      onBlur={this.__HandlerBlur.bind(this, 'Hour')} />
                  </div>
                  <div className={dStyle.arrow}>
                    <div className={dStyle.up} onClick={this.__HandlerArrow.bind(this, 'up', 'Hour')}>
                      <div>
                      </div>
                    </div>
                    <div className={dStyle.down} onClick={this.__HandlerArrow.bind(this, 'down', 'Hour')}>
                      <div>
                      </div>
                    </div>
                  </div>

                </div>
                <div className={dStyle.item}>
                  <div className={dStyle.title}>分钟：</div>
                  <div className={dStyle.value}>
                    <input type="text" ref="txtMinute" maxLength="2" defaultValue={Minute || value.getMinutes()}
                      onKeyPress={this.__HandlerKeyPress.bind(this)}
                      onBlur={this.__HandlerBlur.bind(this, 'Minute')} />
                  </div>

                  <div className={dStyle.arrow}>
                    <div className={dStyle.up} onClick={this.__HandlerArrow.bind(this, 'up', 'Minute')}>
                      <div>
                      </div>
                    </div>
                    <div className={dStyle.down} onClick={this.__HandlerArrow.bind(this, 'down', 'Minute')}>
                      <div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
          <div className={dStyle.datepickerNavbar}>
            <div></div>
            <div className={dStyle.cancel} onClick={this.handleCancel.bind(this)}>取消</div>
            <div></div>
            <div className={dStyle.complate} onClick={this.handleFinishBtnClick.bind(this)}>完成</div>
            <div></div>
          </div>
        </div>
      </div>
    );
  }
}
