<template>
	<view>
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne()"><image src="../../static/icon/bcakwhite.png" class="back-img"></image></view>
			<view class="top-bar-right">
				<view class="more-img"><image src="../../static/icon/morewhite.png"></image></view>
			</view>
		</view>
		<view class="top-bar bgbar" :animation="animationData1">
			<view class="top-bar-left" @tap="backOne()"><image src="../../static/icon/back.png" class="back-img"></image></view>
			<view class="top-bar-right">
				<view class="more-img"><image src="../../static/icon/more.png"></image></view>
			</view>
		</view>
		<view class="bg"><image :src="gimg" class="bg-img" mode="aspectFill"></image></view>
		<view class="main">
			<view class="main-inner">
				<view class="info">
					<view class="name">{{ groupInfo.name }}</view>
					<view class="time">{{ groupInfo.time }}</view>
					<view class="notice">{{ groupInfo.notice }}</view>
				</view>
				<view class="member">
					<view class="top">
						<view class="title">群成员</view>
						<view class="more">管理群成员</view>
						<image src="../../static/icon/right.png" mode="aspectFit" class="more-img"></image>
					</view>
					<view class="member-ls">
						<view class="member-li" v-for="(item, index) in groupMembers" :key="index">
							<view class="imgs">
								<image
									src="../../static/icon/delete.png"
									mode="aspectFill"
									class="delete"
									v-if="uid == groupInfo.userId && item.id != groupInfo.userId"
									@tap="deleteMember(item.id, item.name)"
								></image>
								<image :src="item.imgurl" mode="aspectFit" class="user-img"></image>
							</view>
							<view class="name">{{ item.name }}</view>
						</view>
						<navigator :url="'../inviteusers/inviteusers?gid=' + gid" class="member-li">
							<view class="imgs">
								<image src="../../static/icon/addmember.png" mode="aspectFit" class="user-add"></image>
								<view class="name">邀请</view>
							</view>
						</navigator>
					</view>
					<view class="clear"></view>
				</view>
				<view class="mitem">
					<view class="row" @tap="modify('name', '群名称', groupInfo.name)">
						<view class="title">群名称</view>
						<view class="cont">{{ groupInfo.name }}</view>
						<view class="more"><image src="../../static/icon/right.png" mode="aspectFit"></image></view>
					</view>
					<view class="row">
						<view class="title">群头像</view>
						<view class="cont">
							<view class="user-head" >
								<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
								<image :src="gimg" class="group-img" @tap="upload"></image>
							</view>
							<image :src="gimg" class="group-img" mode="aspectFill"></image>
						</view>
						<view class="more"><image src="../../static/icon/right.png" mode="aspectFit"></image></view>
					</view>
					<view class="row" @tap="modify('notice', '群公告', groupInfo.notice)">
						<view class="title">群公告</view>
						<view class="cont">{{ groupInfo.notice }}</view>
						<view class="more"><image src="../../static/icon/right.png" mode="aspectFit"></image></view>
					</view>
					<view class="row" @tap="modify('giname', '群内名', myname)">
						<view class="title">群内名</view>
						<view class="cont">{{myname}}</view>
						<view class="more"><image src="../../static/icon/right.png" mode="aspectFit"></image></view>
					</view>
					<view class="row">
						<view class="title">消息免打扰</view>
						<view class="cont"></view>
						<view class="more"><switch :checked="swit" @change="switchChange" color="rgba(66,100,251,1)" class="switch"></switch></view>
					</view>
				</view>
				<view class="bt2" @tap="deleteGroup">解散群</view>
			</view>
		</view>
		<view class="modify" :style="{ bottom: -+widHeight + 'px' }" :animation="animationData">
			<view class="modify-header">
				<view class="close" @tap="modify()">取消</view>
				<view class="title">{{ modifyTitle }}</view>
				<view class="define" @tap="modifySubmit()">确定</view>
			</view>
			<view class="modify-main">
				<textarea v-model="data" class="modify-content" placeholder="请输入需要修改的内容" placeholder-style="color:#bbb;font-wight:400"></textarea>
			</view>
		</view>
	</view>
</template>

<script>
import ImageCropper from '@/components/ling-imgcropper/ling-imgcropper.vue';
import moment from 'moment';
export default {
	components: {
		ImageCropper
	},
	data() {
		return {
			uid: '',
			imgurl: '',
			token: '',
			myname: '',
			gid: '',
			gimg: '../../static/img/head.jpg',
			groupInfo: {},
			groupMembers: [],
			swit: false,
			top: 0,
			animationData1: {},
			animationData: {},
			tempFilePath: '',
			headimg: '',
			modifyTitle: '',
			oldData: '',
			data: '', //修改内容
			type: '',
			isModify: false,
			widHeight: '1000'
		};
	},
	onLoad(e) {
		this.gid = e.gid;
		this.gimg = e.gimg;
		this.getGroupInfo();
		this.getGroupMembers();
		this.getStorages();
	},
	onShow() {
		this.getGroupMembers();
	},
	onReady() {
		this.getTop();
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
		async getGroupInfo() {
			const params = {
				gid: this.gid
			};
			const res = await this.API.GetGroupInfo(params);
			const result = res.data.result;
			this.groupInfo = result;
			this.gimg = this.serverUrl + result.imgurl;
			this.groupInfo.time = moment(this.groupInfo.time).format('YYYY/MM/DD');
			if (result.notice == undefined) {
				this.groupInfo.notice = '暂无群公告！';
			}
			// console.log(this.groupInfo);
		},
		async getGroupMembers() {
			const params = {
				gid: this.gid
			};
			const res = await this.API.GetGroupMembers(params);
			const result = res.data.result;
			result.forEach(item => {
				item.imgurl = this.serverUrl + item.imgurl;
			});
			this.groupMembers = result;
			// console.log(this.groupMembers)
		},
		async deleteMember(uid, uname) {
			uni.showModal({
				title: '提示',
				content: `确定删除群成员${uname}吗？`,
				success: async res => {
					if (res.confirm) {
						const params = {
							gid: this.gid,
							uid: uid
						};
						const res = await this.API.DeleteGroupMember(params);
						this.getGroupMembers();
					} else if (res.cancel) {
					}
				}
			});
		},
		switchChange: function(e) {},
		//获取距离顶部距离
		getTop: function() {
			const query = uni.createSelectorQuery().in(this);
			query
				.select('.main-inner')
				.boundingClientRect(data => {
					this.top = data.top;
				})
				.exec();
		},
		//顶部切换动画
		addAnimat: function() {
			var animation = uni.createAnimation({
				duration: 300,
				timingFunction: 'linear'
			});
			if (this.top < 60) {
				animation.opacity(1).step();
			} else {
				animation.opacity(0).step();
			}
			this.animationData1 = animation.export();
		},
		//群头像裁剪
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
			this.gimg = e.detail.tempFilePath;
			this.headimg = e.detail.tempFilePath;
			uni.uploadFile({
				url: this.serverUrl + '/api/files/upload',
				filePath: this.headimg,
				name: 'file',
				fileType: 'image',
				formData: {
					url: 'group',
					name: this.gid,
					token: this.token
				}, //传递参数
				success: uploadFileRes => {
					var backstr = uploadFileRes.data;
					//修改头像保存到数据库
					this.update(backstr, 'imgurl');
				},

				fail(e) {
					console.log('this is errormes ' + e.message);
				}
			});
		},
		cancel() {
			console.log('canceled');
		},
		//修改项弹框
		modify(t, type, data) {
			this.type = t;
			this.modifyTitle = type;
			this.oldData = data;
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
		//提交更新
		modifySubmit() {
			if (this.data.length > 0 && this.data != this.oldData) {
				this.update(this.data, this.type);
			}
		},
		async update(data, type) {
			const params = {
				id: this.gid,
				data: data,
				type: type,
				token: this.token
			};
			const res = await this.API.UpdateGroupInfo(params);
			const status = res.data.status;
			this.groupInfo[type] = data;
			if (type != 'imgurl') this.modify();
			this.getGroupInfo();
		},
		// 删除群
		async deleteGroup() {
			const params = {
				gid: this.gid
			};
			uni.showModal({
				title: '提示',
				content: '确定解散该群吗？',
				success: async res => {
					if (res.confirm) {
						await this.API.DeleteGroup(params);
						uni.navigateBack({
							delta:2
						})
					} else if (res.cancel) {
					}
				}
			});
		},
		onPageScroll: function() {
			this.getTop();
			this.addAnimat();
		}
	}
};
</script>

<style lang="scss">
@import '../../commons/css/mycss.scss';
.clear {
	clear: both;
}
.bgbar {
	opacity: 0;
	background-color: #fff;
}
.bg {
	width: 100%;
	height: 100%;
	background-color: #fff;
	position: fixed;
	top: 0;
	left: 0;
	z-index: -1;
	.bg-img {
		width: 100%;
		height: 750rpx;
	}
}
.main {
	padding-top: 360rpx;
	.main-inner {
		width: 100%;
		min-height: 720rpx;
		background-color: #fff;
		border-radius: 40rpx 40rpx 0 0;
	}
	.info {
		padding: $uni-spacing-row-base $uni-spacing-col-base 0;
		padding-bottom: 40rpx;
		box-sizing: border-box;
		border-bottom: 1px solid #eee;
		.name {
			float: left;
			font-size: 48rpx;
			font-weight: 600;
			color: $uni-text-color;
			line-height: 66rpx;
		}
		.time {
			float: right;
			font-size: 28rpx;
			color: rgba(39, 40, 50, 0.5);
			line-height: 66rpx;
		}
		.notice {
			padding-top: 20rpx;
			clear: both;
			font-size: 28rpx;
			color: $uni-text-color;
			line-height: 40rpx;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}
	}
	.member {
		border-bottom: 1px solid #eee;
		.top {
			padding: $uni-spacing-row-base $uni-spacing-col-base 0;
			box-sizing: border-box;
			height: 100rpx;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			.title {
				flex: 1;
				font-size: 36rpx;
				font-weight: 600;
				color: #272832;
			}
			.more {
				float: right;
				padding-right: 20rpx;
				font-size: 32rpx;
				font-weight: 400;
				color: rgba(39, 40, 50, 0.6);
			}
			.more-img {
				width: 16rpx;
				height: 28rpx;
			}
		}
		.member-ls {
			width: 100%;
			padding: 20rpx 16rpx;
			box-sizing: border-box;
		}
		.member-li {
			padding-bottom: 32rpx;
			width: 20%;
			float: left;
			text-align: center;
			.imgs {
				display: inline-block;
				position: relative;
				width: 104rpx;
				height: 104rpx;
				border-radius: 20rpx;
				// background-color:$uni-color-primary;
			}
			.user-img {
				width: 104rpx;
				height: 104rpx;
				border-radius: 20rpx;
			}
			.delete {
				width: 40rpx;
				height: 40rpx;
				position: absolute;
				top: -16rpx;
				right: -16rpx;
				z-index: 10;
			}
			.name {
				padding: 0 8rpx;
				font-size: 28rpx;
				color: $uni-text-color;
				line-height: 40rpx;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
			}
			.user-add {
				width: 104rpx;
				height: 104rpx;
				box-sizing: border-box;
			}
		}
	}
	.mitem {
		display: flex;
		flex-direction: column;
		padding-top: 22rpx;
		width: 100%;
		border-bottom: 1px solid #eee;
		.row {
			display: flex;
			flex-direction: row;
		}

		.title {
			flex: none;
			font-weight: bold;
			padding: 0 $uni-spacing-col-base;
			font-size: $uni-font-size-lg;
			color: $uni-text-color;
			line-height: 112rpx;
		}

		.head {
			height: 148rpx;
			display: flex;
			align-items: center;
		}

		.user-head {
			flex: auto;
		}

		.user-img {
			margin-top: 22rpx;
			width: $uni-img-size-lg;
			height: $uni-img-size-lg;
			border-radius: $uni-border-radius-base;
		}

		.cont {
			flex: auto;
			align-items: center;
			font-size: $uni-font-size-lg;
			color: $uni-text-color-grey;
			line-height: 112rpx;
			height: 112rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.group-img {
			width: 80rpx;
			height: 80rpx;
			border-radius: 20rpx;
			margin-top: 16rpx;
		}
		.more {
			flex: none;
			height: 112rpx;
			display: flex;
			align-items: center;

			image {
				width: 80rpx;
				height: 28rpx;
			}
		}
		.switch {
			margin-right: 22rpx;
		}
	}
	.bt2 {
		margin-top: 80rpx;
		font-weight: bolder;
		text-align: center;
		font-size: $uni-font-size-lg;
		color: $uni-color-warning;
		line-height: 88rpx;
		padding-bottom: env(safe-area-inset-bottom);
	}
}
/*修改弹框*/

.modify {
	position: fixed;
	//margin-top: 100vh;
	z-index: 998;
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
			font-weight: bold;
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
