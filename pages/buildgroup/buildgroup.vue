<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left"><view class="text" @tap="backOne">取消</view></view>
			<view class="top-bar-center"><view class="title">创建群聊</view></view>
			<view class="top-bar-right"><view class="pice"></view></view>
		</view>
		<view class="main">
			<view class="top">
				<view class="group-img">
					<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
					<image :src="this.serverUrl + gimgurl" @tap="upload" class="img"></image>
				</view>
				<view class="group-name"><input type="text" class="group-name-input" placeholder="请输入群聊名称" placeholder-style="color:#aaa;" v-model="gname" /></view>
				<view class="title">用户</view>
			</view>
			<view class="friends">
				<view class="user" v-for="(item, index) in friends" :key="index" @tap="selectFriend(index)">
					<view class="selected" :class="{ isselected: item.selected }">
						<image src="../../static/icon/choose.png" v-if="item.selected" class="selected-img"></image>
					</view>
					<image class="user-img" :src="item.imgurl"></image>
					<view class="name">{{ item.name }}</view>
				</view>
			</view>
		</view>
		<view class="bottom-bar">
			<view class="bottom-btn btn1" :class="{ noselected: selectedCount == 0 || gname == '' }" @tap="submit">创建({{ selectedCount }})</view>
		</view>
	</view>
</template>

<script>
import ImageCropper from '@/components/ling-imgcropper/ling-imgcropper.vue';
export default {
	components: {
		ImageCropper
	},
	data() {
		return {
			uid: '',
			token: '',
			gimgurl: '/group/group.png',
			tempFilePath: '',
			cropFilePath: '../../static/icon/group.png',
			headimg: '',
			gname: '',
			selectedCount: 0,
			friends: [],
			users: []
		};
	},
	onLoad() {
		this.getStorages();
		this.getFriends();
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
				if (value) {
					this.uid = value.id;
					this.token = value.token;
				} else {
					uni.navigateTo({
						url: '../signin/signin'
					});
				}
			} catch (e) {}
		},
		//头像裁剪
		upload() {
			uni.chooseImage({
				count: 1, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], //从相册选择
				success: res => {
					this.tempFilePath = res.tempFilePaths.shift();
				}
			});
		},
		confirm(e) {
			this.tempFilePath = '';
			this.cropFilePath = e.detail.tempFilePath;
			this.gimgurl = e.detail.tempFilePath;
			uni.uploadFile({
				url: this.serverUrl + '/api/files/upload',
				filePath: this.gimgurl,
				name: 'file',
				fileType: 'image',
				formData: {
					url: 'group',
					name: this.uid + new Date().getTime(),
					token: this.token
				}, //传递参数
				success: uploadFileRes => {
					var backstr = uploadFileRes.data;
					//获取群头像
					this.gimgurl = backstr;
				},
				fail(e) {
					console.log('this is errormes ' + e.message);
				}
			});
		},
		cancel() {
			console.log('canceled');
			this.tempFilePath = '';
		},
		//获取好友列表
		async getFriends() {
			const params = {
				uid: this.uid,
				token: this.token,
				state: 0
			};
			const res = await this.API.GetFriend(params);
			const result = res.data.result;
			if (result.length > 0) {
				this.friends = [];
				for (let i = 0; i < result.length; i++) {
					result[i].imgurl = this.serverUrl + result[i].imgurl;
					result[i].selected = false;
					if (result[i].markname) {
						result[i].name = result[i].markname;
					}
					this.friends.push(result[i]);
				}
			}
		},
		//动态选择好友
		selectFriend(e) {
			this.friends[e].selected = !this.friends[e].selected;
			this.users = [];
			this.friends
				.filter(item => item.selected == true)
				.map(item => {
					this.users.push(item.id);
				});
			this.selectedCount = this.friends.filter(item => item.selected == true).length;
		},
		async submit() {
			if (this.selectedCount > 0 && this.gname.length > 0) {
				const params = {
					uid: this.uid,
					name: this.gname,
					imgurl: this.gimgurl,
					member: this.users,
					token: this.token
				};
				const res = await this.API.BuildGroup(params);
				uni.navigateTo({
					url: '../index/index'
				});
			}
		}
	}
};
</script>

<style lang="scss">
@import '../../commons/css/mycss.scss';

.top-bar {
	background: rgba(255, 255, 255, 1);
	border-bottom: 1px solid $uni-border-color;
}
.main {
	display: flex;
	flex-direction: column;
	.top {
		padding-top: 148rpx;
		position: fixed;
		background-color: #fff;
		width: 100%;
		z-index: 100;
		// padding: $uni-spacing-col-base $uni-spacing-row-base;
		.title {
			padding: $uni-spacing-col-base $uni-spacing-row-base 20rpx;
			font-size: 44rpx;
			font-weight: 600;
			color: $uni-text-color;
			line-height: 60rpx;
		}

		.group-img {
			margin: 0 auto;
			width: 196rpx;
			height: 196rpx;
			background: $uni-color-primary;
			box-shadow: 0px 36rpx 40rpx 0px rgba(39, 40, 50, 0.1);
			border-radius: 40rpx;
			overflow: hidden;
			.img {
				width: 196rpx;
				height: 196rpx;
			}
		}
		.group-name {
			padding: 62rpx $uni-spacing-col-base 0;
		}
		.group-name-input {
			text-align: center;
			height: 92rpx;
			background: #f3f4f6;
			border-radius: 46rpx;
			font-size: 32rpx;
			color: $uni-text-color;
		}
	}
	.friends {
		padding: 600rpx $uni-spacing-row-base 100rpx;
		.user {
			display: flex;
			flex-direction: row;
			align-items: center;
			height: 120rpx;
			.selected {
				flex: none;
				margin-right: 30rpx;
				width: 48rpx;
				height: 48rpx;
				background: rgba(66, 100, 251, 0.5);
				border-radius: 24rpx;
				position: relative;
				.selected-img {
					width: 30rpx;
					height: 20rpx;
					position: absolute;
					left: 10rpx;
					top: 16rpx;
				}
			}
			.isselected {
				background: rgba(66, 100, 251, 1);
			}
			.user-img {
				width: 80rpx;
				height: 80rpx;
				border-radius: $uni-border-radius-base;
			}
			.name {
				padding-left: 32rpx;
				font-size: 36rpx;
				color: $uni-text-color;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
			}
		}
	}
}
.bottom-bar {
	background: rgba(250, 250, 250, 0.9);
	box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.25);
	.bottom-btn {
		background: $uni-color-primary;
		margin: 0 $uni-spacing-col-base;
	}
	.noselected {
		background: $uni-bg-color-grey;
	}
}
</style>
