<template>
	<view>
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne()"><image src="../../static/icon/back.png" class="back-img"></image></view>
			<view class="top-bar-right">
				<view class="more-img" @tap="goToUserDetial"><image src="../../static/icon/more.png"></image></view>
			</view>
		</view>
		<view class="bg">
			<view class="bg-bai"></view>
			<image :src="imgurl" class="bg-img" mode="aspectFill"></image>
		</view>
		<view class="main">
			<view class="user-header">
				<view class="sex" :animation="animationData3"><image :src="seximg"></image></view>
				<image :src="imgurl" mode="aspectFill" class="user-img" :animation="animationData2"></image>
			</view>
			<view class="user-inf">
				<view class="name" v-if="tip == 2">{{ user.name }}</view>
				<view class="name" v-if="tip == 1 && markname != ''">{{ markname }}</view>
				<view class="name" v-if="tip == 1 && markname == ''">{{ user.name }}</view>
				<view class="name" v-if="tip == 0">{{ user.name }}</view>
				<view class="nick">昵称：{{ user.name }}</view>
				<view class="intr">{{ user.explain }}</view>
			</view>
		</view>
		<view class="bottom-bar">
			<view class="bottom-btn btn1" v-if="tip == 0 && tip != 2" @tap="addFriendbtn()">加为好友</view>
			<view class="bottom-btn btn1" v-if="tip == 1 && tip != 2" @tap="goChatRoom(id, user.name, imgurl)">发送消息</view>
		</view>
		<view class="add-misg" :style="{ height: addHeight + 'px', bottom: -+addHeight + 'px' }" :animation="animationData">
			<view class="name">{{ user.name }}</view>
			<textarea v-model="msg" maxlength="120" class="add-main" :cursor-spacing="0"></textarea>
		</view>
		<view class="add-bt bottom-bar" :animation="animationData1">
			<view class="close btn1" @tap="addFriendAnimat()">取消</view>
			<view class="send btn1" @tap="addSubmit()">发送</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			id: '',
			uid: '',
			myname: '',
			token: '',
			user: {},
			tip: 2,
			seximg: '',
			markname: '',
			imgurl: '',
			msg: '请求加为好友！',
			addHeight: '1000',
			animationData: {},
			animationData1: {},
			animationData2: {},
			animationData3: {},
			isAdd: false
		};
	},
	onLoad: function(e) {
		this.id = e.id;
		this.tip = e.tip;
		this.getStorages();
		this.getUser();
		this.getMarkName();
	},
	onShow: function() {
		this.getUser();
		this.getMarkName();
	},
	mounted: function() {
		this.getElementStyle();
		setTimeout(() => {
			this.msg = this.myname + this.msg;
		}, 500);
	},
	methods: {
		backOne() {
			uni.navigateBack({
				delta: 1
			});
		},
		//获取缓存数据
		getStorages() {
			try {
				const value = uni.getStorageSync('user');
				if (value) {
					this.uid = value.id;
					this.myname = value.name;
					this.imgurl = this.serverUrl + value.imgurl;
					this.token = value.token;
				} else {
					uni.navigateTo({
						url: '../signin/signin'
					});
				}
			} catch (e) {}
		},
		async getUser() {
			const params = {
				id: this.id,
				token: this.token
			};
			const res = await this.API.GetUserInfo(params);
			const result = res.data.result;
			this.imgurl = this.serverUrl + result.imgurl;
			if (result.explain == undefined) {
				result.explain = '这个人很懒，什么都没有留下~';
			}
			this.sexJudge(result.sex);
			this.user = result;
		},
		//获取好友昵称
		async getMarkName() {
			if (this.uid != this.id) {
				const params = {
					uid: this.uid,
					fid: this.id,
					token: this.token
				};
				const res = await this.API.GetFriendInfo(params);
				const status = res.data.status;
				if (status == 200) {
					const result = res.data.result;
					if (result.markname != undefined) {
						this.markname = result.markname;
					}
				}
			}
		},
		//性别判断
		sexJudge(e) {
			if (e == 'female') {
				this.seximg = '../../static/icon/female.png';
			} else if (e == 'male') {
				this.seximg = '../../static/icon/male.png';
			} else {
				this.seximg = '../../static/icon/asexual.png';
			}
		},
		getElementStyle() {
			const query = uni.createSelectorQuery().in(this);
			query
				.select('.bg')
				.boundingClientRect(data => {
					this.addHeight = data.height - 186;
				})
				.exec();
		},
		//添加好友动画
		addFriendAnimat() {
			this.isAdd = !this.isAdd;
			var animation = uni.createAnimation({
				duration: 300,
				timingFunction: 'ease'
			});
			var animation1 = uni.createAnimation({
				duration: 300,
				timingFunction: 'ease'
			});
			var animation2 = uni.createAnimation({
				duration: 300,
				timingFunction: 'ease'
			});
			var animation3 = uni.createAnimation({
				duration: 300,
				timingFunction: 'ease'
			});
			if (this.isAdd) {
				animation.bottom(0).step();
				animation1.bottom(0).step();
				animation2
					.width(100)
					.height(100)
					.top(60)
					.left(-100)
					.step();
				animation3.opacity(0).step();
			} else {
				animation.bottom(-this.addHeight).step();
				animation1.bottom(-100).step();
				animation2
					.width(200)
					.height()
					.top(0)
					.left(0)
					.step();
				animation3.opacity(1).step();
			}
			this.animationData = animation.export();
			this.animationData1 = animation1.export();
			this.animationData2 = animation2.export();
			this.animationData3 = animation3.export();
		},
		addFriendbtn() {
			this.msg = this.myname + ' 请求加为好友~';
			this.addFriendAnimat();
		},
		//确定添加好友
		async addSubmit() {
			if (this.msg.length > 0) {
				const params = {
					uid: this.uid,
					fid: this.user._id,
					token: this.token,
					msg: this.msg
				};
				await this.API.ApplyFriend(params);
				uni.showToast({
					title: '好友请求发送成功!',
					icon: 'none',
					duration: 2000
				});
				this.addFriendAnimat();
			}
		},
		//跳转到聊天页
		goChatRoom(id, name, imgurl) {
			uni.navigateTo({
				url: '../chatroom/chatroom?id=' + id + '&name=' + name + '&img=' + imgurl + '&type=0'
			});
		},
		//跳转到用户详情页
		goToUserDetial() {
			uni.navigateTo({
				url: '../userdetials/userdetials?id=' + this.user._id
			});
		}
	}
};
</script>

<style lang="scss">
@import '../../commons/css/mycss.scss';

.bg {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;

	.bg-bai {
		width: 100%;
		height: 100%;
		//background-color: #eee;
	}

	.bg-img {
		opacity: 0.4;
		position: absolute;
		z-index: -1;
		left: 0rpx;
		top: 0rpx;
		width: 100%;
		height: 100%;
		filter: blur(16px);
	}
}

.main {
	text-align: center;
	padding-top: 148rpx;

	.user-header {
		margin: 0 auto;
		width: 412rpx;
		height: 412rpx;
		position: relative;

		.sex {
			position: absolute;
			bottom: 15rpx;
			right: 22rpx;
			z-index: 11;

			// width: 64rpx;
			// height: 64rpx;
			// background: rgba(255,93,91,1);
			// border-radius: 36px;
			image {
				width: 64rpx;
				height: 64rpx;
			}
		}

		.user-img {
			z-index: 10;
			top: 0;
			left: 0;
			width: 400rpx;
			height: 400rpx;
			border-radius: 48rpx;
			border: 6rpx solid rgba(255, 255, 255, 1);
			box-shadow: 0px 36rpx 40rpx 0px rgba(39, 40, 50, 0.1);
		}
	}

	.user-inf {
		padding-top: 42rpx;

		.name {
			font-size: 52rpx;
			color: $uni-text-color;
			line-height: 74rpx;
		}

		.nick {
			font-size: $uni-font-size-base;
			color: $uni-text-color;
			line-height: 40rpx;
		}

		.intr {
			padding: 20rpx 120rpx;
			font-size: $uni-font-size-base;
			font-weight: 500;
			color: $uni-text-color;
			line-height: 48rpx;
		}
	}
}

.add-misg {
	position: fixed;
	width: 100%;
	box-sizing: border-box;
	padding: 0 56rpx;
	// height: 1252rpx;
	background: rgba(255, 255, 255, 1);
	border-radius: 40rpx 40rpx 0px 0px;
	.name {
		padding: 168rpx 0 40rpx;
		font-size: 52rpx;
		color: $uni-text-color;
		line-height: 74rpx;
	}

	.add-main {
		padding: 18rpx 22rpx;
		box-sizing: border-box;
		width: 100%;
		height: 420rpx;
		background: $uni-bg-color-grey;
		border-radius: $uni-border-radius-base;
		font-size: $uni-font-size-lg;
		color: $uni-text-color;
		line-height: 44rpx;
	}
}

.bottom-bar {
	.bottom-btn {
		background: $uni-color-primary;
		margin: 0 $uni-spacing-col-base;
	}
}

.add-bt {
	bottom: -200rpx;
	z-index: 100;
	display: flex;
	.close {
		width: 172rpx;
		background: $uni-bg-color-hover;
		margin-left: $uni-spacing-col-base;
	}

	.send {
		margin: 0 $uni-spacing-col-base;
		flex: auto;
		background: $uni-color-primary;
	}
}
</style>
