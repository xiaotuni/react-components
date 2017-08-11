import superagent from 'superagent';
import config from '../config';
import Utility from '../Common/Utility';

const methods = ['get', 'post', 'put', 'patch', 'del'];

function formatUrl(path) {
  const adjustedPath = path[0] !== '/' ? '/' + path : path;
  const _ApiUrl = config.ServerAPI + adjustedPath;
  return _ApiUrl;
}

export default class ApiClient {

  API = {
    /**
     * 通用的方法。
     */
    Common: {
      LoginInfo: '/login',
      /**
       * get 获取系统当前时间
       *  ------------------------------------------------------------------------------
       * name(字段名称)      description(描述)   type(类型)      Required(是否是必须的) 
       *  token                用户令牌           字符串             是          
       * 
       * 
       */
      SystemTimes: '/systemTimes',

      /**
       * get 标签列表              httptoken
       * ----------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述)    
       * 
       * @url /labels
       */
      Labels: '/labels',
      /**
       * post 添加标签              httptoken
       * ----------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述)    
       * 
       * @url /labels
       */
      AddLabels: '/labels',
      /**
       * del 删除标签              httptoken
       * ----------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述)    
       * 
       * @url /labels/{label_id}
       */
      DeleteLabels: '/labels/{0}',
      /**
       * get 获取群组列表              httptoken
       * ----------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述)    
       * pg_index             int                否                        页码                    
       * pg_count             int                否                        每页记录数量
       * 
       * @url /groups?pg_index=0&pg_count=15
       */
      Groups: '/groups',
      /**
       * get 获取评论列表              httptoken
       * ----------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述)    
       * source_type          string             否                        数据源类型                    
       * source_id            int                否                        数据源标识	
       * blog_id              int                否                        动态标识
       * pg_index             int                否                        页码                    
       * pg_count             int                否                        每页记录数量
       * 
       * @url /comments?pg_index=0&pg_count=15
       */
      Comments: '/comments',
      /**
       * get 获取点赞列表              httptoken
       * ----------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述)    
       * source_type          string             否                        数据源类型                    
       * source_id            int                否                        数据源标识	
       * blog_id              int                否                        动态标识
       * pg_index             int                否                        页码                    
       * pg_count             int                否                        每页记录数量
       * 
       * @url /praises?pg_index=0&pg_count=15
       */
      Praises: '/praises',
    },
    /**
     * 话题
     */
    Topic: {
      /**
       * get 获取话题（热门）列表       httptoken
       * ----------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述)    
       * is_hot               boole              否                        是否热门 默认:否
       * is_recent            boole              否                        是否最近使用 默认: 否	                 
       * pg_index             int                否                        页码                    
       * pg_count             int                否                        每页记录数量
       * 
       * @url /topics?is_hot=false&pg_index=0&pg_count=15
       */
      QueryList: '/topics',
      /**
       * get 获取话题（分类）列表       httptoken
       * ----------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述)    
       * pg_index             int                否                        页码                    
       * pg_count             int                否                        每页记录数量
       * 
       * @url /topics/types
       */
      TopicTypes: '/topics/types',
      /**
       * get 查看话题        
       * ----------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述)           
       * topic_id             int                是                        话题标识	               
       * 
       * @url /topics/11
       */
      ViewTopic: '/topics/{0}',
      /**
       * put 编辑话题       
       * ----------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述)           
       * topic_id             int                是                        话题标识	               
       * TypeId               int                是                        分类标识	               
       * Intro                string             是                        导语	               
       * 
       * @url /topics/11
       */
      EditTopic: '/topics/{0}',
      /**
       * delete 删除话题       
       * ----------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述)           
       * topic_id             int                是                        话题标识	               
       * 
       * @url /topics/11
       */
      DeleteTopic: '/topics/{0}',
      /**
       * post 关注/取消关注       
       * ----------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述)           
       * SourceType           string             是                        数据源类型		               
       * SourceId             int                是                        数据源标识		               
       * 
       * @url /topics/attention
       */
      AttentionTopic: '/topics/attention',
    },
    /**
    *  首页 :轮播  评论  收藏 赞
    */
    HomePage: {
      /**
       * get 获取公司live列表           httptoken
       * ----------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述)    
       * token                string             否                        用户令牌
       * 
       * @url /lives
       */
      Lives: './lives',
      /**
       * get 获取消息列表              httptoken
       * ----------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述)    
       * pg_index             int                否                        页码                    
       * pg_count             int                否                        每页记录数量
       * 
       * @url /messages?pg_index=0&pg_count=15
       */
      Messages: '/messages',
      /**
       * get 获取我的消息提醒数量       httptoken
       * ----------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述)    
       * token                string             否                        用户令牌
       * 
       * @url /my/messages/count
       */
      MessagesCount: '/my/messages/count',
      /**
       * get 获取提醒消息列表           httptoken
       * ----------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述)    
       * pg_index             int                否                        页码                    
       * pg_count             int                否                        每页记录数量
       * 
       * @url /my/messages?pg_index=0&pg_count=15
       */
      MessagesUnread: '/my/messages/unread',
      /**
       * post 点赞/取消点赞    
       * SourceType的值: activity(0), dynamic(1), topic(2), birthremind(3),staffremind(4),institution(5);   
       * 0：活动，1：动态，2：话题 3：生日提醒 4：新员工提醒5：公司制度           
       * ----------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述)    
       * SourceType           string             是                        数据源类型                    
       * SourceId             int                是                        消息标识
       * 
       * @url /praises
       */
      Praises: '/praises',
      /**
       * post 收藏/取消收藏                
       * ----------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述)    
       * SourceType           string             是                        数据源类型                    
       * SourceId             int                是                        消息标识
       * 
       * @url /collections
       */
      Collections: '/collections',
      /**
       * post 添加评论                
       * ----------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述)    
       * SourceType           string             是                        数据源类型                    
       * SourceId             int                是                        消息标识
       * 
       * @url /comments
       */
      AddComments: '/comments',
      /**
       * DELETE 删除评论                
       * ----------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述)    
       * comment_id           int                是                        评论标识
       * 
       * @url /comments/1
       */
      DeleComments: '/comments/{0}',

    },
    /**
    * 我的
    */
    Mine: {
      /**
       * get 我的统计                  httptoken
       * ----------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述)    
       * pg_index             int                否                        页码                    
       * pg_count             int                否                        每页记录数量
       * 
       * @url /my/statistics
       */
      MineStatistics: '/my/statistics',
      /**
       * get 获取我的消息列表       
       * ----------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述)           
       * pg_index             int                否                        页码                    
       * pg_count             int                否                        每页记录数量       
       * 
       * @url /my/messages?pg_index=0&pg_count=15
       */
      MineMessageList: '/my/messages',
      /**
       * get 我的收藏                  httptoken         
       * ----------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述)           
       * pg_index             int                否                        页码
       * pg_count             int                否                        每页记录数量
       * 
       * @url /my/collections?pg_index=0&pg_count=15
       */
      MineCollections: '/my/collections',
      /**
       * GET 我的活动
       * ------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述) 
       * pg_index             int                否                        页码
       * pg_count             int                否                        每页记录数量
       * 
       * @url /my/activities?pg_index=0&pg_count=15
       */
      MineActivitys: '/my/activities',
      /**
       * GET 我的话题                  httptoken
       * ------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述) 
       * pg_index             int                否                        页码
       * pg_count             int                否                        每页记录数量
       * 
       * @url /my/topics?pg_index=0&pg_count=15
       */
      MineTopics: '/my/topics',
      /**
       * POST 分享
       * ------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述) 
       * Title	              string             是                        标题        	       
       * LinkTitle	          string	           否                        链接标题
       * LinkImage	          string	           否                        链接图片
       * LinkUrl      	      string	           否                        链接		
       * Range      	       	object	           是                        范围
       * Orgs      	          array	             否                        组织结构标识列表 null：无，空数组：全公司
       * Groups      	        array	             否                        群标识列表 null：无，空数组：所有群
       * 
       * @url /my/sharing
       */
      Sharing: '/my/sharing',
    },
    /**
     * 动态
     */
    DongTai: {
      /**
       * get 获取动态列表              httptoken
       * ----------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述)    
       * source_id            int                否                         数值型
       * source_type          string             否                         数据源类型
       * is_hot               bool               否                        是否热门 默认：否
       * ids                  array              否                        标识列表                    
       * pg_index             int                否                        页码                    
       * pg_count             int                否                        每页记录数量
       * 
       * @url /blogs?pg_index=0&pg_count=15
       */
      Blogs: '/blogs',
      /**
       * get 查看动态                  httptoken
       * ----------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述)    
       * blog_id              int                是                        动态列表                    
       * 
       * @url /blogs/1
       */
      BlogDetail: '/blogs/{0}',
      /**
       * get 查看动态评论列表           httptoken
       * ----------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述)    
       * blog_id              int                是                        动态列表                    
       * pg_index             int                否                        页码                    
       * pg_count             int                否                        每页记录数量
       * 
       * @url /blogs/1/comments?pg_index=0&pg_count=15
       */
      BlogDetailComments: '/blogs/{0}/comments',
      /**
       * POST 添加活动                 httptoken
       * ------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述) 
       * Title	              string             是                        标题        	       
       * LabelId	            int	               否                        标签标识 null:自定义标签
       * LabelName	          string	           否                        标签名称 自定义标签
       * Images	              array	             否                        图片列表
       * Range      	       	object	           是                        范围
       * Orgs      	          array	             否                        组织结构标识列表 null：无，空数组：全公司
       * Groups      	        array	             否                        群标识列表 null：无，空数组：所有群
       * 
       * @url /blogs
       */
      Add: '/blogs',
      /**
       * delete 删除动态               httptoken
       * ------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述) 
       * blog_id	            int	               否                        动态标识
       * 
       * @url /blogs/23
       */
      DeleteBlogs: '/blogs/{0}',
      /**
       * get 查看职工关怀              httptoken
       * ------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述) 
       * care_id	            int	               否                        关怀标识
       * 
       * @url /care/23
       */
      StaffCare: '/care/{0}',
      /**
      * get 查看职工关怀评论列表       httptoken
      * ----------------------------------------------------------------------------------
      * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述) 
      * care_id	            int	               否                        关怀标识
      * pg_index             int                否                        页码                    
      * pg_count             int                否                        每页记录数量
      * 
      * @url /care/23/comments?pg_index=0&pg_count=15
      */
      StaffCareComments: '/care/{0}/comments',
    },
    /**
     * 活动
     */
    Activity: {
      /**
       * get 获取活动（热门）列表       httptoken
       * ----------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述)    
       * is_hot               boole              否                        是否热门 默认:否
       * ids                  array              否                        标识列表	                 
       * pg_index             int                否                        页码                    
       * pg_count             int                否                        每页记录数量
       * 
       * @url /activities?is_hot=false&pg_index=0&pg_count=15
       */
      ActivityList: '/activities',
      /**
       * get 查看活动       
       * ----------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述)           
       * activity_id          int                是                        活动标识	               
       * 
       * @url /activities/12
       */
      ViewActivity: '/activities/{0}',
      /**
       * get 查看活动参与人            httptoken         
       * ----------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述)           
       * activity_id          int                是                        活动标识
       * pg_index             int                否                        页码
       * pg_count             int                否                        每页记录数量
       * 
       * @url /activities/12/users?pg_index=0&pg_count=15
       */
      ActivityJoiner: '/activities/{0}/users',
      /**
       * POST 添加活动
       * ------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述) 
       * Title	              string             是                        标题        	       
       * Desc	                string	           是                        描述
       * Address	            string	           是                        地址
       * StartTime	      	  int	               是                        开始时间
       * EndTime	            int	               是                        结束时间
       * UserLimit	          int	               是                        人数限制
       * IsAutoGroup	        boolean	           是                        是否自动建群
       * Range      	       	object	           是                        范围
       * Orgs      	          array	             否                        组织结构标识列表 null：无，空数组：全公司
       * Groups      	        array	             否                        群标识列表 null：无，空数组：所有群
       * Topics      	        array	             否                        话题列表
       * SourceId      	      int	               否                        话题标识
       * Title      	        string	           否                        话题标题	
       * 
       * @url /activities
       */
      AddActivity: '/activities',
      /**
       * DELETE 删除活动               httptoken
       * ------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述) 
       * activity_id      	  int	               是                        活动标识	
       * 
       * @url /activities/12
       */
      DeleteActivity: '/activities/{0}',
      /**
       * POST 参与/取消参与
       * ------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述) 
       * SourceType      	    string	           是                        数据源类型		
       * SourceId      	      int	               是                        数据源标识		
       * 
       * @url /activities/join
       */
      IsJoinActivity: '/activities/join',
      /**
       * PUT 编辑活动
       * ------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述) 
       * activity_id      	  int	               否                        活动标识
       * Title	              string             是                        标题        	       
       * Desc	                string	           是                        描述
       * Address	            string	           是                        地址
       * StartTime	      	  int	               是                        开始时间
       * EndTime	            int	               是                        结束时间
       * UserLimit	          int	               是                        人数限制
       * IsAutoGroup	        boolean	           是                        是否自动建群
       * Files      	        array	             否                        文件列表	
       * Name   	            string	           否                        文件名
       * Url    	            string	           否                        文件路径
       * Range      	       	object	           是                        范围
       * Orgs      	          array	             否                        组织结构标识列表 null：无，空数组：全公司
       * Groups      	        array	             否                        群标识列表 null：无，空数组：所有群
       * Topics      	        array	             否                        话题列表
       * SourceId      	      int	               否                        话题标识
       * Title      	        string	           否                        话题标题	
       * 
       * @url /activities
       */
      EditActivity: '/activities/{0}',
      /**
       * get 查看活动       
       * ----------------------------------------------------------------------------------
       * name(字段名称)       type(类型)         Required(是否是必须的)     description(描述)           
       * activity_id          int                是                        活动标识	               
       * 
       * @url /activities/edit/12
       */
      EditActivityDetail: '/activities/edit/{0}',
    }
  }

  ErrorCode = {
    '200': '请求成功',
    '400': '请求参数错误',
    '401': '未授权',
    '403': '禁止访问',
    '404': '请求资源未找到',
    '500': '服务器内部错误',
    '11001': '数据源不存在',
  }

  constructor(req) {
    methods.forEach((method) =>
      this[method] = (path, { params, data } = {}) => new Promise((resolve, reject) => {
        // get token from cache
        let __token = Utility.getContent(Utility.constItem.Token);
        const __HttpToken = Utility.getContent(Utility.constItem.LoginApiInfo);
        const { httptoken } = __HttpToken || {};
        __token = __token ? __token : 'Authorization' + new Date().getTime();
        // merge paramenter
        const __newParams = Object.assign({}, params || {}, { token: __token });
        // convert parameter
        const __paramUrl = Utility.$convertToUrlParams(__newParams);
        const request = superagent[method](formatUrl(path + '?' + __paramUrl));

        if (__SERVER__ && req.get('cookie')) {
          request.set('cookie', req.get('cookie'));
        }

        if (data) {
          request.send(data);
        }


        /**
         * 错误处理及提示
         *
         * @param {any} err
         */
        function __ProcessError(err, body, __req) {
          try {
            Utility.$loadingHide();
            if (err.status) {
              if (Utility.constItem.Events.HttpStatus[err.status]) {
                // 删除loading
                if (err.status === 400 && Utility.constItem.Events.HttpStatus[__req.status]) {
                  Utility.$emit(Utility.constItem.Events.HttpStatus[__req.status], err, body);
                } else {
                  Utility.$emit(Utility.constItem.Events.HttpStatus[err.status], err, body);
                }
              }
            } else if (!!err.crossDomain) {
              Utility.$actionSheet('与服务器连接中断...');
            } else if (err.message && err.message !== '') {
              Utility.$actionSheet(err.message);
            }
          } catch (ex) {
            console.log(ex);
          }
        }

        function __SendRequest(_request) {
          _request.end((err, response) => {
            const { body, headers } = response || {};
            const { date } = headers || {};
            const CurrentSystemTimes = date ? new Date(date).getTime() : new Date().getTime();
            // console.log('current date:', date, '：调用接口:', path);
            if (err) {
              __ProcessError(err, body, response);
              reject(body || err);      // reject-->拒绝; resolve-->解决
            } else {
              if (!body) {
                Utility.$emit(Utility.constItem.Events.HttpStatus[response.status],
                  { status: response.status, msg: '处理成功' }, response);
              }
              if (body && body.constructor.name === 'Object') {
                body.__CurrentSystemTimes = CurrentSystemTimes;
              }
              resolve(body);
            }
          });
        }

        try {
          request.header.httptoken = httptoken || __token;
          __SendRequest(request);
        } catch (ex) {
          console.log(ex);
        }
      }));
  }
  empty() {
  }
}
