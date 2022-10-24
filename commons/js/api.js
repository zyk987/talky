import http from './http.js';
const request = http.httpRequest;
class API {
	// 登录页
	// 用户登录
	async SignIn(data) {
		let res = await request({
			method: 'post',
			url: '/signin/match',
			data: data,
		})
		return res;
	}

	// 注册页
	// 匹配用户和邮箱，验证是否已存在
	async MatchInfo(data) {
		let res = await request({
			method: 'post',
			url: '/signup/judge',
			data: data,
		})
		return res;
	}
	// 注册
	async SignUp(data){
		let res = await request({
			method: 'post',
			url: '/signup/add',
			data: data,
		})
		return res;
	}
	
	// 首页
	// 获取好友
	async GetFriend(data){
		let res = await request({
			method: 'post',
			url: '/index/getfriend',
			data: data,
		})
		return res;
	}
	// 获取群列表
	async GetGroup(data){
		let res = await request({
			method: 'post',
			url: '/index/getgroup',
			data: data,
		})
		return res;
	}
	// 获取最后一条消息
	async GetLastMag(data){
		let res = await request({
			method: 'post',
			url: '/index/getlastmsg',
			data: data,
		})
		return res;
	}
	// 获取群最后一条消息
	async GetLastGroupMag(data){
		let res = await request({
			method: 'post',
			url: '/index/getlastgroupmsg',
			data: data,
		})
		return res;
	}
	// 获取一对一聊天未读消息数
	async GetUnread(data){
		let res = await request({
			method: 'post',
			url: '/index/unreadmsg',
			data: data,
		})
		return res;
	}
	// 清空一对一聊天未读消息数
	async ClearUnread(data){
		let res = await request({
			method: 'post',
			url: '/index/updatemsg',
			data: data,
		})
		return res;
	}
	// 清空群聊未读消息数
	async ClearGroupUnread(data){
		let res = await request({
			method: 'post',
			url: '/index/updategroupmsg',
			data: data,
		})
		return res;
	}
	
	// 搜索页
	// 搜索用户
	async SearchUser(data){
		let res = await request({
			method: 'post',
			url: '/search/user',
			data: data,
		})
		return res;
	}
	// 判断是否为好友
	async JudgeFriend(data){
		let res = await request({
			method: 'post',
			url: '/search/isfriend',
			data: data,
		})
		return res;
	}
	// 请求添加好友
	async ApplyFriend(data){
		let res = await request({
			method: 'post',
			url: '/friend/applyfriend',
			data: data,
		})
		return res;
	}
	// 拒绝好友、删除好友
	async DeleteFriend(data){
		let res = await request({
			method: 'post',
			url: '/friend/deletefriend',
			data: data,
		})
		return res;
	}
	// 同意好友请求
	async AgreeFriend(data){
		let res = await request({
			method: 'post',
			url: '/friend/updatefriendstate',
			data: data,
		})
		return res;
	}
	
	// 聊天页
	// 获取一对一聊天数据
	async GetChatMsg(data){
		let res = await request({
			method: 'post',
			url: '/chat/friendchat',
			data: data,
		})
		return res;
	}
	// 获取群聊天数据
	async GetGroupChatMsg(data){
		let res = await request({
			method: 'post',
			url: '/chat/groupchat',
			data: data,
		})
		return res;
	}
	
	// 创建群聊
	async BuildGroup(data){
		let res = await request({
			method: 'post',
			url: '/group/buildgroup',
			data: data,
		})
		return res;
	}
	// 解散群
	async DeleteGroup(data){
		let res = await request({
			method: 'post',
			url: '/group/deletegroup',
			data: data,
		})
		return res;
	}
	// 获取群详细信息
	async GetGroupInfo(data){
		let res = await request({
			method: 'post',
			url: '/group/groupdetial',
			data: data,
		})
		return res;
	}
	// 修改群详细信息
	async UpdateGroupInfo(data){
		let res = await request({
			method: 'post',
			url: '/group/updategroupdetial',
			data: data,
		})
		return res;
	}
	// 获取群成员
	async GetGroupMembers(data){
		let res = await request({
			method: 'post',
			url: '/group/groupmembers',
			data: data,
		})
		return res;
	}
	// 添加群成员
	async AddGroupMember(data){
		let res = await request({
			method: 'post',
			url: '/group/addgroupmember',
			data: data,
		})
		return res;
	}
	// 删除群成员
	async DeleteGroupMember(data){
		let res = await request({
			method: 'post',
			url: '/group/deletegroupmember',
			data: data,
		})
		return res;
	}
	// 获取用户详细信息
	async GetUserInfo(data){
		let res = await request({
			method: 'post',
			url: '/user/detial',
			data: data,
		})
		return res;
	}
	// 获取好友信息
	async GetFriendInfo(data){
		let res = await request({
			method: 'post',
			url: '/friend/getfriendinfo',
			data: data,
		})
		return res;
	}
	
	// 更新用户信息
	async UpdateUserInfo(data){
		let res = await request({
			method: 'post',
			url: '/user/update',
			data: data,
		})
		return res;
	}
	// 修改好友昵称
	async UpdateMarkName(data){
		let res = await request({
			method: 'post',
			url: '/user/markname',
			data: data,
		})
		return res;
	}
}

export default new API()
