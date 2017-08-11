/**
 * Created by admin on 2016-07-13.
 */
import Utility from '../../Common/Utility';

const __Base = 'xtn/xtn/Common/';
const Load = __Base + 'Load';
const LoadSuccess = __Base + 'LoadSuccess';
const LoadFail = __Base + 'LoadFail';

const EditPageSliderInfo = __Base + '/EditPageSliderInfo';
const SetNavbarIsShow = __Base + '/SetNavbarIsShow';
const _BaseNBEditTitle = __Base + 'NavBar/';
const NbTitleEdit = _BaseNBEditTitle + 'Title_Edit';
const NbTitleInfo = _BaseNBEditTitle + 'Title_Info';
const __UpdateTime = __Base + '/__UpdateTime';
const __UpdateStateByAddRow = __Base + '/UpdateStateByAddRow';
const __DeleteStateByFields = __Base + '/DeleteStateByFields';
const __UpdateListPraiseState = __Base + '/UpdateListPraiseState';
// 转换JSON数据
const __ParseContentJson = __Base + '/ParseContentJson';
// 首页删除评论
const __DeleteComment = __Base + '/DeleteComment';
// 首页添加评论
const __AddCommentToHome = __Base + '/AddCommentToHome';
// 清空信息
const ClearContentSuccess = __Base + '/ClearContentSuccess';
/**
 * 设置变量操作
 * @type {string}
 */
const OnSetContent = __Base + 'OnSetContent';
const UrlParamsEdit = __Base + 'UrlParamsEdit';

const __API = __Base + 'API/';
const __POST = __API + '/POST';               // POST方法处理
const __PUT = __API + '/PUT';                 // PUT方法处理
const __DELETE = __API + '/DELETE';           // DELETE方法处理
const __GET = __API + '/GET';                 // GET方法处理

let __TEMP_SERVICES_SYSTEM_TIEM;
const initialState = { loaded: false, __Times: 0, };

function __ProcessGetArray(state, action) {
  const { StateName, Condition, result } = action;
  const { params } = Condition;
  const { pg_index, pg_count, index } = params;
  let __Result = state[StateName];
  if (!__Result) {
    __Result = {};
    state[StateName] = __Result;
  }
  if (!result) {
    state[StateName].List = [];
    state[StateName].Condition = Condition;
    return state;
  }
  const { elements, totalElements } = result || {};
  if (!Utility.$isArray(elements)) {
    if (!Utility.$isArray(state[StateName].List) || pg_index === 0) {
      state[StateName].List = [];
    }
    params.IsExistsNextData = false;
    state[StateName].Condition = params;
    state[StateName].Total = totalElements;
    return state;
  }
  const __pgCount = pg_count || Utility.constItem.PageSize;
  const __pgIndex = pg_index || 0;
  params.pg_index = Number(__pgIndex) + 1;
  params.pg_count = __pgCount;
  params.IsExistsNextData = elements.length < __pgCount ? false : true;
  if (elements) {
    if (__pgIndex !== 0 && Utility.$isArray(__Result.List)) {
      __Result.List = __Result.List.concat(elements);
    } else {
      __Result.List = elements;
    }
  }
  __Result.Condition = params;
  __Result.Total = totalElements;
  __Result.CurrentIndex = index;

  state[StateName] = __Result;
  return state;
}

function __ProcessRequestByGet(state, action) {
  const { StateName, result, Condition } = action;
  const { params } = Condition;
  if (params) {
    const { pg_index } = params || {};
    if (pg_index || pg_index >= 0) {
      // 说明返回的数组。
      return __ProcessGetArray(state, action);
    }
  }

  if (StateName) {
    state[StateName] = result;
  }
  return state;
}

function __ProcessDeleteStateByFields(state, action) {
  const { StateName, Fields } = action;
  if (!StateName || !Fields) {
    return state;
  }
  const __Data = state[StateName] || {};
  const List = Utility.$isArray(__Data) ? __Data : __Data.List;
  if (!Utility.$isArray(List)) {
    return state;
  }
  const __C_Name = Fields.constructor.name;
  let __fields = [];
  if (__C_Name === 'Object') {
    __fields = [Fields];
  } else if (__C_Name === 'Array') {
    __fields = Fields;
  } else {
    return state;
  }
  const __times = __fields.length;
  List.forEach((item, index) => {
    let __count = 0;
    for (let i = 0; i < __times; i++) {
      const { Key, Value } = __fields[i];
      if (item[Key] === Value) {
        __count++;
      }
    }
    if (__count === __times) {
      List.splice(index, 1);
      if (state[StateName].Total) {
        state[StateName].Total--;
      }
    }
  });
  return state;
}

// 改变动态列表的赞的状态
function __UpdateFavoriteList(state, action) {
  const { StateName, ChangeItem } = action;
  if (!StateName || !ChangeItem) {
    return state;
  }
  const __Data = state[StateName];
  const { List } = __Data || {};
  if (!Utility.$isArray(List)) {
    return state;
  }
  const __Item_Name = ChangeItem.constructor.name;
  if (__Item_Name !== 'Object') {
    return state;
  }
  List.forEach((item) => {
    if ((item.SourceId === ChangeItem.SourceId) && (item.SourceType === ChangeItem.SourceType)) {
      item.IsPraise = ChangeItem.IsPraise;
      item.PraiseNumber = ChangeItem.PraiseNumber;
    }
  });
  return state;
}

function __ProcessUpdateStateByAddRow(state, action) {
  const { data, StateName, isAddFirst } = action;
  const __Data = state[StateName];
  let __List = [];
  if (__Data.constructor.name === 'Object') {
    const { List } = __Data;
    if (Utility.$isArray(List)) {
      __List = List;
    } else {
      state[StateName].List = __List;
    }
    __Data.Total++;
  } else {
    if (Utility.$isArray(__Data)) {
      __List = __Data;
    } else {
      state[StateName] = __List;
    }
  }
  if (isAddFirst) {
    __List.unshift(data);
  } else {
    __List.push(data);
  }
  return state;
}

// 转化JSON
function __ProcessParseContentJson(state, action) {
  const { StateName, ToJsonFields } = action;
  const Data = state[StateName];
  if (!Data || !Utility.$isArray(ToJsonFields)) {
    return state;
  }
  const __JsonField = (item) => {
    ToJsonFields.forEach((field) => {
      const Value = item[field];
      item[field + '_JSON'] = JSON.parse(Value);
    });
  };
  const { List } = Data;
  if (Utility.$isArray(List)) {
    List.forEach((row) => {
      __JsonField(row);
    });
  } else {
    __JsonField(Data);
  }
  return state;
}

// 首页删除评论
function __ProcessDeleteComment(state, action) {
  const { StateName, Condition } = action;
  const Data = state[StateName];
  if (!Data || !Condition) {
    return state;
  }
  const { _SourceId, _CommentId } = Condition;
  const { List } = Data;
  if (!Utility.$isArray(List)) {
    return state;
  }

  const __IsDeleteComment = (Comments) => {
    for (let i = 0; i < Comments.length; i++) {
      const { CommentId } = Comments[i];
      if (CommentId === _CommentId) {
        Comments.splice(i, 1);
        return true;
      }
    }
    return false;
  };

  for (let i = 0; i < List.length; i++) {
    const { SourceId, Comments } = List[i];
    if (SourceId === _SourceId && Utility.$isArray(Comments)) {
      if (__IsDeleteComment(Comments)) {
        break;
      }
    }
  }
  return state;
}

// 首页添加评论
function __ProcessAddCommentToHome(state, action) {
  const { StateName, CommonInfo } = action;
  const Data = state[StateName];
  if (!Data || !CommonInfo) {
    return state;
  }
  const { List } = Data;
  const { SourceId } = CommonInfo;
  for (let i = 0; i < List.length; i++) {
    if (List[i].SourceId === SourceId) {
      let { Comments } = List[i];
      if (!Utility.$isArray(Comments)) {
        Comments = [];
        List[i].Comments = Comments;
      }
      Comments.unshift(CommonInfo);
      break;
    }
  }
  return state;
}

export default function reducer(state = initialState, action = {}) {
  let __Result = { ...state };
  if (action.result) {      // 这里就是请求完成了
    Object.assign(__Result, { loading: false, loaded: true });
    __Result.Result = action.result;
  }
  if (action.error) {     // 请求完了之后出错信息
    Object.assign(__Result, { loading: false, loaded: false });
    __Result.Error = action.error;
  }
  const { StateName, result } = action;
  const { __CurrentSystemTimes } = result || {};
  if (__CurrentSystemTimes) {
    __TEMP_SERVICES_SYSTEM_TIEM = __CurrentSystemTimes;
  }
  __Result.CurrentSystemTimes = __TEMP_SERVICES_SYSTEM_TIEM;
  __Result.SystemTimes = __TEMP_SERVICES_SYSTEM_TIEM;

  switch (action.type) {
    case __AddCommentToHome:
      __Result = __ProcessAddCommentToHome(state, action);
      break;
    case __DeleteComment:
      __Result = __ProcessDeleteComment(state, action);
      break;
    case __ParseContentJson:
      __Result = __ProcessParseContentJson(state, action);
      break;
    case __DELETE:
      break;
    case __POST:
    case __PUT:
      if (StateName) {
        __Result[StateName] = result;
      }
      break;
    case __GET:
      __Result = __ProcessRequestByGet(state, action);
      break;
    case SetNavbarIsShow:                                                             // 导航条是否显示
      __Result.IsHideNavBar = !!action.IsShow;
      break;
    case OnSetContent:
      if (StateName) {
        __Result[StateName] = action.Value;
      }
      break;
    case EditPageSliderInfo:                                                             // 页面是否切换滑动方向
      const PageSliderInfo = __Result.PageSliderInfo || {};
      PageSliderInfo.IsReturn = action.IsReturn;
      __Result.PageSliderInfo = PageSliderInfo;
      break;
    case Load:                                                                         // 加载
      __Result.loading = true;
      break;
    case LoadSuccess:                                                                    // 加载成功
      __Result.data = action.result;
      break;
    case NbTitleInfo:                                                                     // 修改标题,是否显示返回按键
      __Result.Title = action.Title || '默认标题';
      __Result.IsShowBackArrow = action.IsShowBackArrow ? action.IsShowBackArrow : false;
      break;
    case NbTitleEdit:                                                                    // 修改标题
      __Result.Title = action.Title || '默认标题';
      break;
    case UrlParamsEdit:                                                                  // url 参数
      __Result.UrlParams = action.query;
      break;
    case LoadFail:                                                                       // 加载失败
      break;
    case __UpdateTime:
      __Result.__Times++;
      break;
    case __UpdateStateByAddRow:
      __Result = __ProcessUpdateStateByAddRow(state, action);
      break;
    case __DeleteStateByFields:
      __Result = __ProcessDeleteStateByFields(state, action);
      break;
    case __UpdateListPraiseState:
      __Result = __UpdateFavoriteList(state, action);
      break;
    case ClearContentSuccess:
      __Result[action.Key] = null;                                               // 清空信息
      break;
    default:
  }
  return __Result;
}

function __RequestProcess(method, StateName, api, args) {
  const __Method = { get: __GET, post: __POST, put: __PUT, del: __DELETE };
  return {
    types: [Load, __Method[method] || __GET, LoadFail],
    promise: (client) => client[method || 'get'](api, args),
    Condition: args,
    StateName
  };
}

/**
 * post保存接口调用方法。
 * 
 * @export
 * @param {any} StateName 
 * @param {any} Api 
 * @param {any} Args {params:{}:data:{}} 
 * @returns 
 */
export function onApiPost(StateName, Api, Args) {
  return __RequestProcess('post', StateName, Api, Args);
}

/**
 * put方法，修改方法操作。
 * @export
 * @param {any} StateName 
 * @param {any} Api 
 * @param {any} Args 
 * @returns 
 */
export function onApiPut(StateName, Api, Args) {
  return __RequestProcess('put', StateName, Api, Args);
}

/**
 * 删除
 * 
 * @export
 * @param {any} Api 
 * @param {any} Args 
 * @returns 
 */
export function onApiDelete(Api, Args) {
  return __RequestProcess('del', null, Api, Args);
}

/**
 * 获取
 * 
 * @export
 * @param {any} StateName 
 * @param {any} Api 
 * @param {any} Args 
 * @returns 
 */
export function onApiGet(StateName, Api, Args) {
  return __RequestProcess('get', StateName, Api, Args);
}

/**
 * 保存信息到 store里面去。
 * @param StateName
 * @param value
 * @returns {{type: string, StateName: *, Value: *}}
 */
export function onSetContent(StateName, value) {
  return { type: OnSetContent, StateName, Value: value };
}

/**
 * 页面滑动切换
 * @param row
 * @returns {{type: string, IsReturn: boolean}}
 */
export function onPageSliderInfo(row) {
  const { IsReturn } = row || {};
  return { type: EditPageSliderInfo, IsReturn: (IsReturn || false) };
}

/**
 * 修改导航条信息，标题，是否显示返回按钮
 * @param row
 * @returns {{type: string, Title: *, IsShowBackArrow: (*|boolean)}}
 */
export function onNavBarTitleInfo(row) {
  return { type: NbTitleInfo, Title: row.Title, IsShowBackArrow: row.IsShowBackArrow };
}

/**
 * 修改标题
 * @param row
 * @returns {{type: string, Title: *}}
 */
export function onNavBarTitleEdit(row) {
  return { type: NbTitleEdit, Title: row.Title };
}

/**
 * 保存当前当前url参数
 * @param row
 * @returns {{type: string, query: *}}
 */
export function onUrlParamsEdit(row) {
  return { type: UrlParamsEdit, query: row };
}

export function onUpdateRedux() {
  return { type: __UpdateTime };
}

export function onUpdateStateByAddRow(StateName, data, isAddFirst) {
  return { type: __UpdateStateByAddRow, StateName, data, isAddFirst };
}

/**
 * 删除List的数据.
 * 
 * @export
 * @param {any} StateName 
 * @param {any} Fields [{Key:'SourceId',Value:123},...] or {Key:'SourceId',Value:123}
 * @returns 
 */
export function onDeleteByFields(StateName, Fields) {
  return { type: __DeleteStateByFields, StateName, Fields };
}

/**
 * 改变(更新)数据列表的相应项赞状态
 * 
 * @export
 * @param {any} StateName 
 * @param {any} ChangeItem 数据列表中被改变的某项item对象  {IsPraise:true, PraiseNumber:1,SourceId:90, SourceType :'dynamic'}
 * @returns 
 */
export function onUpdateListPraiseState(StateName, ChangeItem) {
  return { type: __UpdateListPraiseState, StateName, ChangeItem };
}

/**
 * 清空信息
 * @param {key} string
 * @param value
 * @returns
 */
export function onClearContent(key) {
  return { type: ClearContentSuccess, Key: key };
}

/**
 * 转换数据为JSON对象
 * 
 * @export
 * @param {any} StateName 
 * @param {any} ToJsonFields
 * @returns 
 */
export function onParseFieldsToJson(StateName, ToJsonFields) {
  return { type: __ParseContentJson, StateName, ToJsonFields };
}

/**
 * 首页删除评论
 * 
 * @export
 * @param {any} StateName 
 * @param {any} SourceId
 * @param {any} CommentId
 * @returns 
 */
export function onReduxDeleteComment(StateName, SourceId, CommentId) {
  return { type: __DeleteComment, StateName, Condition: { _SourceId: SourceId, _CommentId: CommentId } };
}

/**
 * 首页添加评论
 * 
 * @export
 * @param {any} StateName 
 * @param {any} CommonInfo {评论信息}
 * @returns 
 */
export function onReduxAddCommentToHome(StateName, CommonInfo) {
  return { type: __AddCommentToHome, StateName, CommonInfo };
}
