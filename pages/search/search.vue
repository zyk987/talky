<template>
	<view class="content">
		<view class="top-bar">
			<view class="search-div">
				<image src="../../static/icon/search.png" class="search-img"></image>
				<input type="search" placeholder="搜索用户或群" class="search" placeholder-style="color:#bbb;font-wight:400" @input="search" />
			</view>
			<view class="top-bar-right" @tap="backOne()"><view class="text">取消</view></view>
		</view>
		<view class="main">
			<view class="search-user result">
				<view class="title">用户</view>
				<view class="list user" v-for="(item, index) in userarr" :key="index">
					<navigator :url="'../userhome/userhome?id=' + item._id + '&tip=' + item.tip" hover-class="none"><image :src="item.imgurl"></image></navigator>
					<view class="names">
						<view class="name" v-html="item.name"></view>
						<view class="email" v-html="item.email"></view>
					</view>
					<view class="right-bt send" v-if="item.tip == 1" @tap="goChatRoom(item._id, item.truename, item.imgurl)">发消息</view>
					<view class="right-bt add" v-if="item.tip == 0" @tap="addFriendBtn(item._id)">加好友</view>
				</view>
			</view>
		</view>
		<view class="modify" :style="{ bottom: -+widHeight + 'px' }" :animation="animationData">
			<view class="modify-header">
				<view class="close" @tap="modify">取消</view>
				<view class="title">加好友</view>
				<view class="define" @tap="addSubmit">确定</view>
			</view>
			<view class="modify-main"><textarea v-model="msg" class="modify-content"></textarea></view>
		</view>
	</view>
</template>

<script>
import myfun from '../../commons/js/myfun.js';
export default {
	data() {
		return {
			userarr: [],
			uid: '',
			imgurl: '',
			token: '',
			myname: '',
			fid: '',
			msg: '',
			animationData: {}, //
			isModify: false,
			widHeight: '1000'
		};
	},
	onLoad: function() {
		this.getStorages();
	},
	onReady: function() {
		this.getElementStyle();
	},
	methods: {
		backOne: function() {
			uni.navigateBack({
				delta: 1
			});
		},
		//获取缓存数据
		getStorages: function() {
			try {
				const value = uni.getStorageSync('user');
				// console.log(value);
				if (value) {
					this.uid = value.id;
					this.imgurl = this.serverUrl + value.imgurl;
					this.token = value.token;
					this.myname = value.name;
				} else {
					uni.navigateTo({
						url: '../signin/signin'
					});
				}
			} catch (e) {}
		},
		search: myfun.debounce(async function(e) {
			this.userarr = [];
			const searchval = e.detail.value;
			if (searchval.length > 0) {
				await this.searchUser(searchval);
			}
		}),
		async searchUser(e) {
			const params = {
				data: e,
				token: this.token
			};
			const res = await this.API.SearchUser(params);
			const result = res.data.result;
			console.log(result)
			for (let i = 0; i < result.length; i++) {
				this.isFriend(result[i], e);
			}
		},
		isFriend(arr, e) {
			let data = arr;
			let tip = 0;
			let exp = eval('/' + e + '/g');
			if (data._id == this.uid) {
				tip = 2;
				data.tip = tip;
				data.imgurl = this.serverUrl + data.imgurl;
				data.truename = data.name;
				data.name = data.name.replace(exp, "<span style='color:#4AAAFF;'>" + e + '</span>');
				data.email = data.email.replace(exp, "<span style='color:#4AAAFF;'>" + e + '</span>');
				this.userarr.push(data);
			} else {
				const params = {
					uid: this.uid,
					fid: data._id,
					token: this.token
				};
				this.API.JudgeFriend(params).then(res => {
					const status = res.data.status;
					if (status==200) {
						tip = 1;
					}
					data.tip = tip;
					data.imgurl = this.serverUrl + data.imgurl;
					data.truename = data.name;
					data.name = data.name.replace(exp, "<span style='color:#4AAAFF;'>" + e + '</span>');
					data.email = data.email.replace(exp, "<span style='color:#4AAAFF;'>" + e + '</span>');
					this.userarr.push(data);
				});
			}
		},
		//获取页面高度
		getElementStyle: function() {
			const query = uni.createSelectorQuery().in(this);
			query
				.select('.modify')
				.boundingClientRect(data => {
					this.widHeight = data.height;
				})
				.exec();
		},
		//修改项弹框
		modify: function(type, data) {
			this.modifyTitle = type;
			this.data = data;
			this.isModify = !this.isModify;
			var animation = uni.createAnimation({
				duration: 300,
				timingFunction: 'ease'
			});
			if (this.isModify) {
				animation.bottom(0).step();
			} else {
				animation.bottom(-this.widHeight).step();
			}
			this.animationData = animation.export();
		},
		//添加好友按钮
		addFriendBtn: function(fid) {
			this.fid = fid;
			this.msg = this.myname + '请求添加好友~';
			this.modify();
		},
		//确定添加好友
		async addSubmit() {
			if (this.msg.length > 0) {
				this.modify();
				const params = {
					uid: this.uid,
					fid: this.fid,
					token: this.token,
					msg: this.msg
				};
				await this.API.ApplyFriend(params);
				uni.showToast({
					title: '好友请求发送成功!',
					icon: 'none',
					duration: 2000
				});
			}
		},
		goChatRoom: function(id, name, imgurl) {
			uni.navigateTo({
				url: '../chatroom/chatroom?id=' + id + '&name=' + name + '&img=' + imgurl + '&type=0'
			});
		}
	}
};
</script>

<style lang="scss">
@import '../../commons/css/mycss.scss';

.content {
	height: 100%;
}

.top-bar {
	background: rgba(255, 255, 255, 0.96);
	border-bottom: 1px solid $uni-border-color;

	.search-div {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		z-index: -1;
		box-sizing: border-box;
		padding: 14rpx 118rpx 14rpx $uni-spacing-col-base;
	}

	.search {
		padding: 0 60rpx 0 12rpx;
		height: 60rpx;
		background: $uni-bg-color-grey;
		border-radius: 10rpx;
	}

	.search-img {
		position: absolute;
		right: 130rpx;
		top: 22rpx;
		width: 40rpx;
		height: 40rpx;
	}
}

.main {
	padding: 88rpx $uni-spacing-col-base;

	.result {
		padding-top: $uni-spacing-col-base;

		.title {
			font-size: 44rpx;
			font-weight: 600;
			color: $uni-text-color;
			line-height: 60rpx;
		}

		.list {
			width: 100%;
			padding: 20rpx 0;
			height: 80rpx;

			image {
				float: left;
				width: 80rpx;
				height: 80rpx;
				border-radius: $uni-border-radius-base;
			}
		}

		.names {
			float: left;
			padding-left: $uni-spacing-col-base;
		}

		.name {
			font-size: 36rpx;
			color: $uni-text-color;
			line-height: 50rpx;
		}

		.email {
			font-size: $uni-font-size-sm;
			color: $uni-text-color;
			line-height: 20rpx;
		}

		.right-bt {
			float: right;
			width: 120rpx;
			height: 48rpx;
			border-radius: 24rpx;
			font-size: $uni-font-size-sm;
			line-height: 48rpx;
			text-align: center;
			margin-top: 16rpx;
		}

		.add {
			background: $uni-color-primary;
			color: $uni-text-color-inverse;
		}

		.send {
			background: $uni-bg-color-grey;
			color: $uni-color-primary;
		}
	}
}

/*修改弹框*/

.modify {
	position: fixed;
	//margin-top: 100vh;
	z-index: 1002;
	left: 0;
	height: 100%;
	width: 100%;
	background-color: #fff;

	.modify-header {
		width: 100%;
		height: 88rpx;
		padding-top: var(--status-bar-height);
		display: flex;
		flex-direction: row;
		align-items: center;
		border-bottom: 1px solid $uni-border-color;

		.close {
			padding-left: $uni-spacing-col-base;
			font-size: $uni-font-size-lg;
			color: $uni-text-color;
			line-height: 44rpx;
		}

		.title {
			flex: auto;
			text-align: center;
			font-size: 40rpx;
			color: $uni-text-color;
			line-height: 88rpx;
		}

		.define {
			padding-right: $uni-spacing-col-base;
			font-size: $uni-font-size-lg;
			color: $uni-color-success;
			line-height: 44rpx;
		}
	}

	.modify-main {
		display: flex;
		padding: $uni-spacing-col-base;
		flex-direction: column;

		.modify-pwd {
			margin-bottom: $uni-spacing-col-base;
			padding: 0 20rpx;
			box-sizing: border-box;
			width: 100%;
			flex: auto;
			height: 88rpx;
			background: $uni-bg-color-grey;
			border-radius: $uni-border-radius-base;
			font-size: $uni-font-size-lg;
			color: $uni-text-color;
			line-height: 88rpx;
		}

		.modify-content {
			padding: 16rpx 20rpx;
			box-sizing: border-box;
			flex: auto;
			width: 100%;
			height: 386rpx;
			background: $uni-bg-color-grey;
			border-radius: $uni-border-radius-base;
			font-size: $uni-font-size-lg;
			color: $uni-text-color;
			line-height: 44rpx;
		}
	}
}
</style>
