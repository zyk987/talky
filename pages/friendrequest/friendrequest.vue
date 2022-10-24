<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-center"><view class="title">好友请求</view></view>
			<view class="top-bar-right">
				<view class="more-img"><view class="pice"></view></view>
			</view>
			<view class="top-bar-left" @tap="backOne()"><image src="../../static/icon/back.png" class="back-img"></image></view>
		</view>
		<view class="main">
			<view class="requester" v-for="(item, index) in requestData" :key="index">
				<view class="request-top">
					<view class="reject btn" @tap="refuse(item.id)">拒绝</view>
					<view class="header-img"><image :src="item.imgurl"></image></view>
					<view class="agree btn" @tap="agree(item.id)">同意</view>
				</view>
				<view class="request-center">
					<view class="title">{{ item.name }}</view>
					<view class="time">{{ changeTime(item.lastTime) }}</view>
				</view>
				<view class="notic">
					<text>留言：{{ item.msg }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import myfun from '../../commons/js/myfun.js';
export default {
	data() {
		return {
			uid: '',
			imgurl: '',
			token: '',
			myname: '',
			requestData: []
		};
	},
	onLoad() {
		this.getStorages();
		this.getFriends();
		this.friendRequest();
	},
	methods: {
		backOne: function() {
			uni.navigateBack({
				delta: 1
			});
		},
		changeTime: function(date) {
			return myfun.detialTime(date);
		},
		//获取缓存数据
		getStorages: function() {
			try {
				const value = uni.getStorageSync('user');
				if (value) {
					this.uid = value.id;
					this.token = value.token;
					this.myname = value.name;
				} else {
					uni.navigateTo({
						url: '../signin/signin'
					});
				}
			} catch (e) {}
		},
		async getFriends() {
			const params = {
				uid: this.uid,
				token: this.token,
				state: 1
			};
			await this.API.GetFriend(params);
		},
		async friendRequest() {
			const params = {
				uid: this.uid,
				token: this.token,
				state: 1
			};
			const res = await this.API.GetFriend(params);
			const result = res.data.result;
			for (let i = 0; i < result.length; i++) {
				result[i].imgurl = this.serverUrl + result[i].imgurl;
				this.getLeave(result, i);
			}
			this.requestData = result;
		},
		//获取留言
		async getLeave(arr, i) {
			const params = {
				uid: this.uid,
				fid: arr[i].id,
				token: this.token
			};
			const res = await this.API.GetLastMag(params);
			const result = res.data.result;
			let e = arr[i];
			e.msg = result.message;
			arr.splice(i, 1, e);
		},
		//拒绝好友申请
		async refuse(fid) {
			const params = {
				uid: this.uid,
				fid: fid,
				token: this.token
			};
			const res = await this.API.DeleteFriend(params);
			for (let i = 0; i < this.requestData.length; i++) {
				if (this.requestData[i].id == fid) {
					this.requestData.splice(i, 1);
				}
			}
		},
		//同意好友申请
		async agree(fid) {
			const params = {
				uid: this.uid,
				fid: fid,
				token: this.token
			};
			const res = await this.API.AgreeFriend(params);
			for (let i = 0; i < this.requestData.length; i++) {
				if (this.requestData[i].id == fid) {
					this.requestData.splice(i, 1);
				}
			}
		}
	}
};
</script>

<style lang="scss">
@import '../../commons/css/mycss.scss';

.top-bar {
	background: rgba(255, 255, 255, 0.96);
	border-bottom: 1px solid $uni-border-color;
}

.main {
	padding: 108rpx $uni-spacing-col-base;

	.requester {
		margin-top: 112rpx;
		padding: $uni-spacing-col-base;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 24rpx 64rpx -8rpx rgba(0, 0, 0, 0.1);
		border-radius: $uni-border-radius-base;
	}

	.request-top {
		display: flex;
		flex-direction: row;

		.btn {
			flex: none;
			text-align: center;
			width: 160rpx;
			height: 64rpx;
			background: rgba(255, 93, 91, 0.1);
			border-radius: 40rpx;
			font-size: $uni-font-size-lg;
			line-height: 64rpx;
		}
		.reject {
			color: $uni-color-warning;
			background-color: rgba(255, 93, 91, 0.1);
		}
		.agree {
			color: $uni-text-color-inverse;
			background-color: $uni-color-primary;
		}
		.header-img {
			margin-top: -104rpx;
			flex: auto;
			text-align: center;
			image {
				flex: auto;
				width: 144rpx;
				height: 144rpx;
				border-radius: 50%;
			}
		}
	}
	.request-center {
		text-align: center;
		padding-top: 20rpx;
		padding-bottom: 40rpx;
		.title {
			font-size: 36rpx;
			font-weight: 500;
			color: $uni-text-color;
			line-height: 50rpx;
		}
		.time {
			font-size: $uni-font-size-sm;
			color: $uni-text-color-disable;
			line-height: 34rpx;
		}
	}
	.notic {
		padding: $uni-spacing-row-sm $uni-spacing-col-base;
		border-radius: $uni-border-radius-base;
		background-color: $uni-bg-color-grey;
		font-size: $uni-font-size-base;
		color: $uni-text-color;
		line-height: 40rpx;
	}
}
</style>
