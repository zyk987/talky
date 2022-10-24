<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne()"><image src="../../static/icon/back.png" class="back-img"></image></view>
		</view>
		<view class="logo"><image src="../../static/img/logo.png"></image></view>
		<view class="main">
			<view class="title">注册</view>
			<view class="inputs">
				<view class="inputs-div">
					<input type="text" placeholder="请取个名字" v-model="user" class="user" placeholder-style="color:#bbb;font-wight:400" @input="matchUser()" />
					<view class="employ" v-if="userEmploy">已占有</view>
					<image src="../../static/icon/correct.png" class="ok" v-if="isUser"></image>
				</view>
				<view class="inputs-div">
					<input type="text" placeholder="请输入邮箱" v-model="email" class="email" placeholder-style="color:#bbb;font-wight:400" @input="emailJudge()" />
					<view class="employ" v-if="emailEmploy">已占有</view>
					<view class="invalid" v-if="invalid">邮箱无效</view>
					<image src="../../static/icon/correct.png" class="ok" v-if="isEmail"></image>
				</view>
				<view class="inputs-div">
					<input :type="type" placeholder="这里输入密码" class="pwd" placeholder-style="color:#bbb;font-wight:400" @input="getPwd($event)" />
					<image :src="eyesurl" class="display" @tap="displays()"></image>
				</view>
			</view>
		</view>
		<view :class="[{ submit: isok }, { submit1: !isok }]" @tap="signUp">注册</view>
	</view>
</template>

<script>
import myfun from '../../commons/js/myfun.js';
export default {
	data() {
		return {
			type: 'password',
			isUser: false, //用户名是否占有
			isEmail: false, //邮箱是否占有
			display: false, //是否显示密码
			invalid: false, //邮箱是否符合
			userEmploy: false, //用户是否占用
			emailEmploy: false, //邮箱是否占用
			eyesurl: '../../static/icon/hide.png',
			email: '',
			user: '',
			password: '',
			isok: false
		};
	},
	computed: {
		//判断是否可以注册
		isOk() {
			let that = this;
			if (this.isUser && this.isEmail && this.password.length > 5) {
				that.isok = true;
			} else {
				that.isok = false;
			}
			return that.isok;
		}
	},
	methods: {
		displays() {
			if (this.display) {
				this.type = 'password';
				this.display = !this.display;
				this.eyesurl = '../../static/icon/hide.png';
			} else {
				this.type = 'text';
				this.display = !this.display;
				this.eyesurl = '../../static/icon/display.png';
			}
		},
		getPwd(e) {
			this.password = e.detail.value;
			this.isOk;
		},
		//判断是否为邮箱格式
		emailJudge() {
			let reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
			if (this.email.length > 0) {
				if (reg.test(this.email)) {
					this.invalid = false;
					this.matchEmail();
				} else {
					this.invalid = true;
					this.isEmail = false;
					this.emailEmploy = false;
				}
			} else {
				this.invalid = false;
				this.isEmail = false;
				this.emailEmploy = false;
			}
		},
		//匹配邮箱
		matchEmail: myfun.debounce(async function() {
			const params = {
				data: this.email,
				type: 'email'
			};
			const res = await this.API.MatchInfo(params);
			const result = res.data.result;
			if (result > 0) {
				this.emailEmploy = true;
				this.isEmail = false;
			} else {
				this.emailEmploy = false;
				this.isEmail = true;
			}
		}),
		//匹配用户
		//防抖
		matchUser: myfun.debounce(async function() {
			const params = {
				data: this.user,
				type: 'name'
			};
			const res = await this.API.MatchInfo(params);
			const result = res.data.result;
			if (result > 0) {
				this.userEmploy = true;
				this.isUser = false;
			} else {
				this.userEmploy = false;
				this.isUser = true;
			}
		}),
		//注册提交
		async signUp() {
			if (this.isOk) {
				const params = {
					name: this.user,
					mail: this.email,
					pwd: this.password
				};
				const res = await this.API.SignUp(params);
				const status = res.data.status;
				if (status == 200) {
					//注册成功跳转到登录页面
					uni.navigateTo({
						url: '../signin/signin?user=' + this.user
					});
				} else {
					uni.showToast({
						title: '注册失败!',
						icon: 'none',
						duration: 2000
					});
				}
			}
		},
		//返回登录页面
		backOne: function() {
			uni.navigateBack({
				delta: 1
			});
		}
	}
};
</script>

<style lang="scss">
@import '../../commons/css/mycss.scss';

.content {
	padding-top: var(--status-bar-height);
}
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
	.title {
		font-size: 56rpx;
		font-weight: 500;
		color: $uni-text-color;
		line-height: 80rpx;
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

	.inputs-div {
		position: relative;
	}

	.employ,
	.invalid {
		position: absolute;
		right: 0;
		top: 40rpx;
		font-size: $uni-font-size-base;
		font-weight: 500;
		color: $uni-color-warning;
		line-height: 88rpx;
	}

	.ok {
		position: absolute;
		right: 10rpx;
		top: 76rpx;
		width: 42rpx;
		height: 42rpx;
	}

	.display {
		position: absolute;
		right: 10rpx;
		top: 76rpx;
		width: 42rpx;
		height: 42rpx;
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

.submit1 {
	margin: 0 auto;
	width: 520rpx;
	height: 96rpx;
	background: rgba(39, 40, 50, 0.2);
	border-radius: 48rpx;
	font-size: $uni-font-size-lg;
	font-weight: 500;
	color: $uni-text-color-inverse;
	line-height: 96rpx;
	text-align: center;
}
</style>
