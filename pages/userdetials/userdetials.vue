<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-center"><view class="title">详情</view></view>
			<view class="top-bar-right"><view class="pice"></view></view>
			<view class="top-bar-left" @tap="backOne()"><image src="../../static/icon/back.png" class="back-img"></image></view>
		</view>
		<view class="main">
			<view class="column heads">
				<view class="row head">
					<view class="title">头像</view>
					<view class="user-head" v-if="id == uid" >
						<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
						<image :src="cropFilePath"  class="user-img" @tap="upload"></image>
					</view>
					<view class="more" v-if="id == uid"><image src="../../static/icon/right.png" mode="aspectFit"></image></view>
					<image :src="cropFilePath" v-if="id != uid" class="user-img"></image>
				</view>
				<view class="row" @tap="modify('explain', '签名', user.explain, false)" v-if="id == uid">
					<view class="title">签名</view>
					<view class="cont">{{ user.explain }}</view>
					<view class="more"><image src="../../static/icon/right.png" mode="aspectFit"></image></view>
				</view>
				<view class="row" v-if="id != uid">
					<view class="title">签名</view>
					<view class="cont">{{ user.explain }}</view>
				</view>
				<view class="row">
					<view class="title">注册</view>
					<view class="cont">{{ changeTime(user.time) }}</view>
				</view>
			</view>
			<view class="column">
				<view class="row" @tap="modify('name', '昵称', user.name, false)" v-if="id == uid">
					<view class="title">昵称</view>
					<view class="cont">{{ user.name }}</view>
					<view class="more"><image src="../../static/icon/right.png" mode="aspectFit"></image></view>
				</view>
				<view class="row" v-if="id != uid && friendstate == 0" @tap="modify('markname', '昵称', markname, false)">
					<view class="title">昵称</view>
					<view class="cont">{{ markname }}</view>
					<view class="more"><image src="../../static/icon/right.png" mode="aspectFit"></image></view>
				</view>
				<view class="row" v-if="id != uid && friendstate != 0">
					<view class="title">昵称</view>
					<view class="cont">{{ user.name }}</view>
				</view>
				<view class="row">
					<view class="title">性别</view>
					<view class="cont">
						<picker @change="bindPickerChange" :value="index" :range="array" v-if="id == uid">
							<view class="uni-input">{{ array[index] }}</view>
						</picker>
						<view class="uni-input" v-if="id != uid">{{ array[index] }}</view>
					</view>
					<view class="more" v-if="id == uid"><image src="../../static/icon/right.png" mode="aspectFit"></image></view>
				</view>
				<view class="row">
					<view class="title">生日</view>
					<view class="cont">
						<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange" v-if="id == uid">
							<view class="uni-input">{{ date }}</view>
						</picker>
						<view class="uni-input" v-if="id != uid">{{ date }}</view>
					</view>
					<view class="more" v-if="id == uid"><image src="../../static/icon/right.png" mode="aspectFit"></image></view>
				</view>
				<view class="row">
					<view class="title">电话</view>
					<view class="cont" @tap="modify('phone', '电话', user.phone, false)" v-if="id == uid">{{ user.phone }}</view>
					<view class="cont" v-if="id != uid">{{ user.phone }}</view>
					<view class="more" v-if="id == uid"><image src="../../static/icon/right.png" mode="aspectFit"></image></view>
				</view>
				<view class="row">
					<view class="title">邮箱</view>
					<view class="cont" @tap="modify('email', '邮箱', user.email, true)" v-if="id == uid">{{ user.email }}</view>
					<view class="cont" v-if="id != uid">{{ user.email }}</view>
					<view class="more" v-if="id == uid"><image src="../../static/icon/right.png" mode="aspectFit"></image></view>
				</view>
			</view>
			<view class="column" v-if="id == uid">
				<view class="row">
					<view class="title">密码</view>
					<view class="cont" @tap="modify('pwd', '密码', '', true)">**********</view>
					<view class="more"><image src="../../static/icon/right.png" mode="aspectFit"></image></view>
				</view>
			</view>
			<view class="bt2" v-if="id == uid" @tap="logOut">退出登录</view>
			<view class="bt2" v-if="id != uid && friendstate == 0" @tap="deleteFriend">删除好友</view>
		</view>
		<view class="modify" :style="{ bottom: -+widHeight + 'px' }" :animation="animationData">
			<view class="modify-header">
				<view class="close" @tap="modify()">取消</view>
				<view class="title">{{ modifyTitle }}</view>
				<view class="define" @tap="modifySubmit()">确定</view>
			</view>
			<view class="modify-main">
				<input type="text" v-model="pwd" :style="{ display: ispwd }" class="modify-pwd" placeholder="请输入原密码" placeholder-style="color:#bbb;font-wight:400" />
				<textarea v-model="data" class="modify-content" placeholder="请输入需要修改的内容" placeholder-style="color:#bbb;font-wight:400"></textarea>
			</view>
		</view>
	</view>
</template>

<script>
import ImageCropper from '@/components/ling-imgcropper/ling-imgcropper.vue';
import myfun from '../../commons/js/myfun.js';
export default {
	components: {
		ImageCropper
	},
	data() {
		const currentDate = this.getDate({
			format: true
		});
		return {
			id: '',
			uid: '',
			myname: '',
			token: '',
			imgurl: '',
			user: {},
			markname: '',
			friendstate: '',
			tempFilePath: '',
			cropFilePath: '../../static/img/head.jpg',
			array: ['男', '女', '未知'],
			index: 0,
			date: currentDate,
			headimg: '',
			modifyTitle: '',
			oldData: '',
			data: '', //修改内容
			ispwd: 'none',
			pwd: undefined,
			type: '',
			animationData: {}, //
			isModify: false,
			widHeight: '1000'
		};
	},
	computed: {
		startDate() {
			return this.getDate('start');
		},
		endDate() {
			return this.getDate('end');
		}
	},
	onLoad: function(e) {
		this.id = e.id;
		this.getStorages();
		this.getUser();
		this.getFriendInfo();
	},
	onShow:function(){
		this.getUser();
		this.getFriendInfo();
	},
	onReady: function() {
		this.getElementStyle();
	},
	methods: {
		backOne: function() {
			uni.navigateBack({
				delta: 1,
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
				} else {
					uni.navigateTo({
						url: '../signin/signin'
					});
				}
			} catch (e) {}
		},
		//获取用户信息
		async getUser() {
			const params = {
				id: this.id,
				token: this.token
			};
			const res = await this.API.GetUserInfo(params);
			const result = res.data.result;
			this.cropFilePath = this.serverUrl + result.imgurl;
			if (result.explain == undefined) {
				result.explain = '这个人很懒，什么都没有留下~';
			}
			//处理生日
			if (result.birth == undefined) {
				this.date = '0000-00-00';
			} else {
				let birth = myfun.ymdDate(result.birth);
				this.date = birth;
			}
			//处理电话
			if (result.phone == undefined) {
				result.phone = 1000000000;
			}
			//处理markname
			if (this.markname.length == 0) {
				this.markname = result.name;
			}
			this.sexJudge(result.sex);
			this.user = result;
		},
		//获取好友信息
		async getFriendInfo() {
			if (this.uid != this.id) {
				const params = {
					uid: this.uid,
					fid: this.id,
					token: this.token
				};
				const res = await this.API.GetFriendInfo(params);
				const status = res.data.status;
				const result = res.data.result;
				if (status == 200) {
					if (result.markname != undefined) {
						this.markname = result.markname;
					}
					this.friendstate = result.state;
				} else if (status == 400) {
					this.friendstate = 1;
				}
			}
		},
		//性别判断
		sexJudge(e) {
			if (e == 'female') {
				this.index = 1;
			} else if (e == 'male') {
				this.index = 0;
			} else {
				this.index = 2;
			}
		},
		//性别选择器
		bindPickerChange(e) {
			let oldIndex = this.index;
			this.index = e.target.value;
			if (oldIndex != this.index) {
				let sex = 'asexual';
				if (this.index == 0) {
					sex = 'male';
				} else if (this.index == 1) {
					sex = 'female';
				}
				this.update(sex, 'sex', undefined);
			}
		},
		//日期选择器
		bindDateChange(e) {
			let oldDate = this.date;
			this.date = e.target.value;
			if (oldDate != this.date) {
				this.update(this.date, 'birth', undefined);
			}
		},
		//时间处理
		changeTime(date) {
			return myfun.detialTime(date);
		},
		//选择日期
		getDate(type) {
			const date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();

			if (type === 'start') {
				year = year - 60;
			} else if (type === 'end') {
				year = year + 2;
			}
			month = month > 9 ? month : '0' + month;
			day = day > 9 ? day : '0' + day;
			return `${year}-${month}-${day}`;
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
			this.headimg = e.detail.tempFilePath;
			uni.uploadFile({
				url: this.serverUrl + '/api/files/upload',
				filePath: this.headimg,
				name: 'file',
				fileType: 'image',
				formData: {
					url: 'user',
					name: this.uid,
					token: this.token
				}, //传递参数
				success: uploadFileRes => {
					var backstr = uploadFileRes.data;
					console.log(backstr);
					//修改本地信息
					try {
						uni.setStorageSync('user', {
							id: this.uid,
							name: this.name,
							imgurl: backstr,
							token: this.token
						});
					} catch (e) {
						console.log('数据存储出错');
					}
					//修改头像保存到数据库
					this.update(backstr, 'imgurl', undefined);
				},
				fail(e) {
					console.log('this is errormes ' + e.message);
				}
			});
		},
		cancel() {
			this.tempFilePath = '';
		},
		//获取页面高度
		getElementStyle() {
			const query = uni.createSelectorQuery().in(this);
			query
				.select('.modify')
				.boundingClientRect(data => {
					this.widHeight = data.height;
				})
				.exec();
		},
		//修改项弹框
		modify(t, type, data, ispwd) {
			if (ispwd) {
				this.ispwd = 'block';
			} else {
				this.ispwd = 'none';
				this.pwd = undefined;
			}
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
		//更新用户信息
		async update(data, type, pwd) {
			const params = {
				id: this.uid,
				data: data,
				type: type,
				pwd: pwd,
				token: this.token
			};
			const res = await this.API.UpdateUserInfo(params);
			const status = res.data.status;
			if (status == 200) {
				if (type != 'sex' && type != 'birth' && type != 'pwd' && type != 'imgurl') {
					this.user[type] = data;
					this.modify();
					this.getInfo();
				} else if (type == 'pwd') {
					uni.removeStorage({
						key: 'user',
						success: function(res) {
							uni.navigateTo({
								url: '../signin/signin?msg=密码修改成功,请重新登录！'
							});
						}
					});
				}
			} else if (status == 400) {
				uni.showToast({
					title: res.data.msg,
					icon: 'none',
					duration: 2000
				});
			}
		},
		//提交更新
		modifySubmit() {
			if (this.data.length > 0 && this.data != this.oldData) {
				if (this.type == 'markname') {
					this.updateFriendName();
					this.markname == this.data;
				} else {
					if (this.ispwd == 'block') {
						if (this.pwd != undefined) {
							if (this.type == 'email') {
								let reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
								if (reg.test(this.data)) {
									this.update(this.data, this.type, this.pwd);
								} else {
									uni.showToast({
										title: '邮箱格式错误！',
										icon: 'none',
										duration: 2000
									});
								}
							} else {
								this.update(this.data, this.type, this.pwd);
							}
						} else {
							uni.showToast({
								title: '请输入密码！',
								icon: 'none',
								duration: 2000
							});
						}
					} else {
						this.update(this.data, this.type, this.pwd);
					}
				}
			}
		},
		//好友昵称修改
		async updateFriendName() {
			if (this.data.length > 0 && this.data != this.oldData) {
				const params = {
					uid: this.uid,
					fid: this.id,
					name: this.data,
					token: this.token
				};
				const res = await this.API.UpdateMarkName(params);
				this.getInfo();
				this.modify();
			}
		},
		logOut() {
			uni.showModal({
				title: '提示',
				content: '确定退出登录吗？',
				success: function(res) {
					if (res.confirm) {
						uni.removeStorage({
							key: 'user',
							success: function(res) {
								uni.clearStorage();
								uni.navigateTo({
									url: '../signin/signin'
								});
							}
						});
					} else if (res.cancel) {
					}
				}
			});
		},
		deleteFriend() {
			uni.showModal({
				title: '提示',
				content: '确定要删除该好友吗？',
				success: async (res) =>{
					if (res.confirm) {
						const params = {
							uid: this.uid,
							fid: this.id,
							token: this.token
						};
						await this.API.DeleteFriend(params);
						uni.redirectTo({
							url:'../index/index'
						})
					} else if (res.cancel) {
					}
				}
			});
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
	padding-top: 118rpx;
	display: flex;
	flex-direction: column;

	.column {
		display: flex;
		flex-direction: column;
		padding-top: 12rpx;
		width: 100%;
		border-bottom: 1px solid $uni-border-color;

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
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
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
	}

	.bt2 {
		margin-top: 160rpx;
		font-weight: bolder;
		text-align: center;
		font-size: $uni-font-size-lg;
		color: $uni-color-warning;
		line-height: 88rpx;
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
