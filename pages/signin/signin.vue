<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-right" @tap="toSignUp()"><view class="text">注册</view></view>
		</view>
		<view class="logo"><image src="../../static/img/logo.png"></image></view>
		<view class="main">
			<view class="title">登录</view>
			<view class="slogan">你好！欢迎</view>
			<view class="inputs">
				<input type="text" placeholder="用户名/邮箱" v-model="user" class="user" placeholder-style="color:#bbb;font-wight:400" />
				<input type="password" placeholder="密码" v-model="password" class="psw" placeholder-style="color:#bbb;font-wight:400" />
			</view>
			<view class="tips" :style="{ display: mon }">输入用户或密码错误！</view>
		</view>
		<view class="submit" @tap="login()">登录</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			user: '',
			password: '',
			token: '',
			mon: 'none'
		};
	},
	onLoad: function(e) {
		if (e.user) {
			this.user = e.user;
			uni.showToast({
				title: '注册成功请登录',
				icon: 'success',
				duration: 1500
			});
		} else if (e.name) {
			this.user = e.name;
			uni.showToast({
				title: '验证过期请重新登录',
				icon: 'none',
				duration: 1500
			});
		} else if (e.msg) {
			uni.showToast({
				title: e.msg,
				icon: 'none',
				duration: 1500
			});
		}
	},
	methods: {
		//跳转到注册页面
		toSignUp() {
			uni.navigateTo({
				url: '../signup/signup'
			});
		},
		//登录提交
		async login() {
			if (this.user && this.password) {
				const params = {
					data: this.user,
					pwd: this.password
				};
				const res = await this.API.SignIn(params);
				const status = res.data.status;
				this.mon = 'none';
				this.user = '';
				this.password = '';
				const data = res.data.data;
				//存储本地信息
				try {
					uni.setStorageSync('user', {
						id: data.id,
						name: data.name,
						imgurl: data.imgurl,
						token: data.token
					});
				} catch (e) {
					console.log('数据存储出错');
				}
				//登录成功跳转主页
				uni.navigateTo({
					url: '../index/index?id=' + data.id
				});
				if (status == 400) {
					//匹配失败
					this.mon = 'block';
					this.password = '';
				}
			}
		}
	}
};
</script>

<style lang="scss">
@import '../../commons/css/mycss.scss';

.logo {
	text-align: center;

	image {
		text-align: center;
		padding-top: 256rpx;
		width: 194rpx;
		height: 92rpx;
		margin: 0 auto;
	}
}

.main {
	padding: 54rpx $uni-spacing-row-lg 120rpx;

	//width: 100%;
	.title {
		font-size: 56rpx;
		font-weight: 500;
		color: $uni-text-color;
		line-height: 80rpx;
	}

	.slogan {
		font-size: 40rpx;
		color: $uni-text-color-grey;
		line-height: 56rpx;
	}

	.inputs {
		padding-top: 8rpx;

		input {
			padding-top: 40rpx;
			height: 88rpx;
			font-size: $uni-font-size-lg;
			font-weight: 500;
			color: $uni-text-color;
			line-height: 88rpx;
			border-bottom: 1px solid $uni-border-color;
		}
	}

	.tips {
		float: left;
		font-size: $uni-font-size-lg;
		color: $uni-color-warning;
		line-height: 56rpx;
	}
}

.submit {
	margin: 0 auto;
	width: 520rpx;
	height: 96rpx;
	background: $uni-color-primary;
	box-shadow: 0px 50rpx 32rpx -36rpx rgba(149, 175, 192, 0.4);
	border-radius: 48rpx;
	font-size: $uni-font-size-lg;
	font-weight: 500;
	color: rgba(39, 40, 50, 1);
	line-height: 96rpx;
	text-align: center;
}
</style>
