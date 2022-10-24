<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left"><view class="text" @tap="backOne">取消</view></view>
			<view class="top-bar-center"><view class="title">邀请用户</view></view>
			<view class="top-bar-right"><view class="pice"></view></view>
		</view>
		<view class="main">
			<view class="friends">
				<view class="user" v-for="(item, index) in friends" :key="index" @tap="selectFriend(item,index)">
					<view class="selected" :class="{ isselected: item.selected }">
						<image src="../../static/icon/choose.png" v-if="item.selected" class="selected-img"></image>
					</view>
					<image class="user-img" :src="item.imgurl"></image>
					<view class="name">{{ item.name }}</view>
				</view>
			</view>
		</view>
		<view class="bottom-bar">
			<view class="bottom-btn btn1" :class="{ noselected: selectedCount == 0  }" @tap="submit">邀请({{ selectedCount }})</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			gid:'',
			uid: '',
			token: '',
			selectedCount: 0,
			friends: [],
			users: [],
			groupMembers: [],
		};
	},
	onLoad(e) {
		this.gid=e.gid;
		this.getStorages();
		this.alreadyMembers()
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
			// console.log(this.friends);
		},
		// 获取群现有成员
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
		async alreadyMembers(){
			await this.getFriends();
			await this.getGroupMembers();
			this.friends.forEach(item=>{
				if(this.groupMembers.find(member=>{return member.id==item.id})!=undefined){
					item.selected=true;
					item.disabled=true;
				}
			});
			// console.log(this.friends);
		},
		//动态选择好友
		selectFriend(item,e) {
			if(item.disabled){
				return;
			}
			this.friends[e].selected = !this.friends[e].selected;
			this.users = [];
			this.friends
				.filter(item => item.selected == true&&item.disabled!=true)
				.map(item => {
					this.users.push(item.id);
				});
			this.selectedCount = this.friends.filter(item => item.selected == true&&item.disabled!=true).length;
		},
		async submit() {
			if (this.selectedCount > 0) {
				const params = {
					gid: this.gid,
					uid:this.users,
					token: this.token
				};
				const res = await this.API.AddGroupMember(params);
				uni.navigateBack({
					delta:1
				})
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
	.friends {
		padding: 100rpx $uni-spacing-row-base 100rpx;
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
