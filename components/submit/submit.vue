<template>
	<view>
		<view class="submit">
			<view class="submit-chat">
				<view class="bt-img" @tap="records"><image :src="toc"></image></view>
				<textarea auto-height="true" class="chat-send btn" :class="{ displaynone: isrecord }" @input="inputs" v-model="msg" @focus="focus()"></textarea>
				<view class="record btn" :class="{ displaynone: !isrecord }" @touchstart="startRecord" @touchend="endRecord" @touchmove="touchmove">按住说话</view>
				<view class="bt-img" @tap="emoji"><image src="../../static/icon/bq.png"></image></view>
				<view class="bt-img" @tap="moreFun"><image src="../../static/icon/tj.png"></image></view>
			</view>
			<view class="emoji" :class="{ displaynone: isemoji }">
				<view class="emoji-send">
					<view class="emoji-send-det">
						<image src="../../static/icon/noemoji.png" v-if="msg == ''"></image>
						<image src="../../static/icon/hasemoji.png" v-if="msg != ''" @tap="emojiBack()"></image>
					</view>
					<view class="emoji-send-bt" v-if="msg == ''" style="background-color: #ffffff;color: #e6e6e6;">发送</view>
					<view class="emoji-send-bt" v-if="msg != ''" style="background-color: #4264fb;color: #ffffff;" @tap="emojiSend()">发送</view>
				</view>
				<emoji @emotion="emotion" :height="260"></emoji>
			</view>
			<view class="more" :class="{ displaynone: ismore }">
				<view class="more-list" @tap="sendImg('album')">
					<image src="../../static/icon/tp.png"></image>
					<view class="more-list-title">图片</view>
				</view>
				<view class="more-list" @tap="sendImg('camera')">
					<image src="../../static/icon/xj.png"></image>
					<view class="more-list-title">拍摄</view>
				</view>
				<view class="more-list">
					<image src="../../static/icon/sp.png"></image>
					<view class="more-list-title">视频</view>
				</view>
				<view class="more-list" @tap="chooseLocation">
					<image src="../../static/icon/dw.png"></image>
					<view class="more-list-title">位置</view>
				</view>
				<view class="more-list">
					<image src="../../static/icon/wj.png"></image>
					<view class="more-list-title">文件</view>
				</view>
			</view>
		</view>
		<view class="voice-bg" :class="{ displaynone: voiceBg }">
			<view class="voice-bg-len">
				<view class="voice-bg-time" :style="{ width: vlength / 0.6 + '%' }">{{ vlength }}″</view>
			</view>
			<view class="voice-del">上划取消录音</view>
		</view>
	</view>
</template>

<script>
import emoji from './emoji/emoji.vue';
//录音
const recorderManager = uni.getRecorderManager();
export default {
	data() {
		return {
			isrecord: false,
			isemoji: true,
			ismore: true,
			toc: '../../static/icon/yy.png',
			msg: '',
			timer: '',
			vlength: 0,
			voiceBg: true,
			pageY: 0
		};
	},
	components: {
		emoji
	},
	methods: {
		getElementHeight: function() {
			const query = uni.createSelectorQuery().in(this);
			query
				.select('.submit')
				.boundingClientRect(data => {
					this.$emit('heights', data.height);
				})
				.exec();
		},
		//点击切换语音
		records: function() {
			this.isemoji = true;
			this.ismore = true;
			if (this.isrecord) {
				this.isrecord = false;
				this.toc = '../../static/icon/yy.png';
			} else {
				this.isrecord = true;
				this.toc = '../../static/icon/jp.png';
			}
		},
		//表情
		emoji: function() {
			this.isemoji = !this.isemoji;
			this.ismore = true;
			this.isrecord = false;
			this.toc = '../../static/icon/yy.png';
			setTimeout(() => {
				this.getElementHeight();
			}, 10);
		},
		emotion: function(e) {
			this.msg += e;
		},
		//文字发送
		inputs: function(e) {
			let chatm = e.detail.value;
			let pos = chatm.indexOf('\n');
			if (pos != -1 && chatm.length > 1) {
				this.send(this.msg, 0);
			}
		},
		focus: function() {
			this.isemoji = true;
			this.ismore = true;
			setTimeout(() => {
				this.getElementHeight();
			}, 10);
		},
		//表情内发送
		emojiSend: function() {
			console.log(this.msg);
			if (this.msg != '') {
				this.send(this.msg, 0);
			}
		},
		//表情内删除
		emojiBack: function() {
			if (this.msg.length > 0) {
				this.msg = this.msg.substring(0, this.msg.length - 1);
			}
		},
		//更多功能
		moreFun: function() {
			this.ismore = !this.ismore;
			this.isemoji = true;
			this.isrecord = false;
			this.toc = '../../static/icon/yy.png';
			setTimeout(() => {
				this.getElementHeight();
			}, 10);
		},
		//图片发送
		sendImg: function(e) {
			let count = 9;
			if (e == 'album') {
				count = 9;
			} else {
				count = 1;
			}
			uni.chooseImage({
				count: count, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: [e], //从相册选择或拍照
				success: res => {
					const filePaths = res.tempFilePaths;
					for (let i = 0; i < filePaths.length; i++) {
						this.send(filePaths[i], 1);
					}
					// 	console.log(JSON.stringify(res.tempFilePaths));
				}
			});
		},
		//开始录音
		startRecord: function(e) {
			this.pageY = e.changedTouches[0].pageY;
			this.voiceBg = false;
			let i = 1;
			this.timer = setInterval(() => {
				this.vlength = i;
				i++;
				if (i > 60) {
					clearInterval(this.timer);
					this.endRecord();
				}
			}, 1000);
			recorderManager.start();
		},
		//结束录音
		endRecord: function() {
			clearInterval(this.timer);
			recorderManager.stop();
			recorderManager.onStop(res => {
				let data = {
					voice: res.tempFilePath,
					time: this.vlength
				};
				if (!this.voiceBg) {
					this.send(data, 2);
				}
				this.vlength = 0;
				this.voiceBg = true;
			});
		},
		//终止录音
		touchmove: function(e) {
			if (this.pageY - e.changedTouches[0].pageY > 100) {
				this.voiceBg = true;
			}
			// console.log(e)
		},
		//选择定位
		chooseLocation: function() {
			uni.chooseLocation({
				success: res => {
					let data = {
						name: res.name,
						address: res.address,
						latitude: res.latitude,
						longitude: res.longitude
					};
					let jsonData = JSON.stringify(data);
					this.send(jsonData, 4);
				}
			});
		},
		//发送
		send: function(msg, type) {
			let data = {
				message: msg,
				types: type
			};
			this.$emit('inputs', data);
			setTimeout(() => {
				this.msg = '';
			}, 0);
		}
	}
};
</script>

<style lang="scss">
.displaynone {
	display: none;
}

.submit {
	background: rgba(244, 244, 244, 0.96);
	border-top: 1px solid $uni-border-color;
	width: 100%;
	position: fixed;
	bottom: 0;
	z-index: 1002;
	padding-bottom: env(safe-area-inset-bottom);
}

.submit-chat {
	width: 100%;
	display: flex;
	align-items: flex-end;
	box-sizing: border-box;
	padding: 14rpx 10rpx;

	image {
		width: 56rpx;
		height: 56rpx;
		margin: 0 10rpx;
		flex: auto;
	}

	.btn {
		flex: auto;
		background-color: #fff;
		border-radius: 10rpx;
		padding: 20rpx;
		max-height: 160rpx;
		margin: 0 10rpx;
	}
	.chat-send {
		line-height: 40rpx;
	}
	.record {
		text-align: center;
		line-height: 40rpx;
		font-size: $uni-font-size-lg;
		color: $uni-text-color-grey;
	}
}

.emoji {
	width: 100%;
	height: 460rpx;
	background: rgba(236, 237, 238, 1);
	box-shadow: 0px -1rpx 0px 0px rgba(0, 0, 0, 0.1);
	.emoji-send {
		width: 240rpx;
		height: 120rpx;
		position: fixed;
		bottom: 0;
		right: 20rpx;
		bottom: env(safe-area-inset-bottom);
		display: flex;
		.emoji-send-det {
			width: 110rpx;
			height: 80rpx;
			background-color: white;
			text-align: center;
			line-height: 80rpx;
			border-radius: 10rpx;
			margin-right: 20rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			image {
				width: 45rpx;
				height: 35rpx;
			}
		}
		.emoji-send-bt {
			width: 110rpx;
			height: 80rpx;
			font-size: 30rpx;
			text-align: center;
			line-height: 80rpx;
			border-radius: 10rpx;
		}
	}
}
.more {
	width: 100%;
	height: 436rpx;
	background: rgba(236, 237, 238, 1);
	box-shadow: 0px -1rpx 0px 0px rgba(0, 0, 0, 0.1);
	bottom: env(safe-area-inset-bottom);
	padding: 4rpx 20rpx;
	box-sizing: border-box;
	.more-list {
		width: 25%;
		text-align: center;
		float: left;
		padding-top: 32rpx;
		image {
			width: 60rpx;
			height: 60rpx;
			padding: 36rpx;
			background: rgba(255, 255, 255, 1);
			border-radius: 30rpx;
		}

		.more-list-title {
			font-size: 24rpx;
			color: rgba(111, 111, 111, 0.5);
			line-height: 34rpx;
		}
	}
}
.voice-bg {
	height: 100%;
	width: 100%;
	background-color: rgba(0, 0, 0, 0.3);
	position: fixed;
	top: 0;
	bottom: 0;
	z-index: 1001;
	.voice-bg-len {
		height: 84rpx;
		width: 600rpx;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		margin: auto;
		background-color: rgba(255, 255, 255, 0.2);
		border-radius: 42rpx;
		text-align: center;
	}
	.voice-bg-time {
		display: inline-block;
		min-width: 120rpx;
		line-height: 84rpx;
		background-color: $uni-color-primary;
		border-radius: 42rpx;
		color: #fff;
	}
	.voice-del {
		position: absolute;
		bottom: 148rpx;
		margin-bottom: env(safe-area-inset-bottom);
		width: 100%;
		text-align: center;
		color: #fff;
		font-size: $uni-font-size-base;
	}
}
</style>
