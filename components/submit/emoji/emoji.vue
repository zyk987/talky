<template>
	<view class="emoji" :style="{ height: height + 'px' }">
		<view class="emoji-line" v-for="(line, i) in emoji" :key="i">
			<view class="emoji-item" v-for="(item, index) in line" :key="index" @tap="clickEmoji(item)">{{ item }}</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		height: {
			type: Number,
			default: 260
		}
	},
	data() {
		return {
			emoji: [
				['๐', '๐', '๐', '๐', '๐', '๐', '๐'],
				['๐คฃ', '๐', '๐', '๐', '๐', '๐', '๐'],
				['๐', '๐ฅฐ', '๐', '๐', '๐', '๐', '๐'],
				['๐', '๐', '๐', '๐คช', '๐คจ', '๐ง', '๐ค'],
				['๐', '๐คฉ', '๐ฅณ', '๐', '๐', '๐', '๐'],
				['๐', '๐', '๐', '๐ฃ', '๐', '๐ซ', '๐ฉ'],
				['๐ฅบ', '๐ข', '๐ญ', '๐ค', '๐ ', '๐ค', '๐'],
				['๐คฏ', '๐ณ', '๐ฅต', '๐ฅถ', '๐ฑ', '๐จ', '๐ฐ'],
				['๐', '๐ฅ', '๐', '๐ค', '๐ค', '๐คญ', '๐คซ'],
				['๐คฅ', '๐ถ', '๐', '๐', '๐ฌ', '๐', '๐ฏ'],
				['๐ฆ', '๐ง', '๐ฎ', '๐ฒ', '๐ด', '๐คค', '๐ช'],
				['๐ต', '๐ค', '๐ฅด', '๐คข', '๐คฎ', '๐คง', '๐ท'],
				['๐ค', '๐ค', '๐ค', '๐ค ', '๐', '๐ฟ', '๐น'],
				['๐บ', '๐คก', '๐ฉ', '๐ป', '๐', '๐ฝ', '๐พ'],
				['๐บ', '๐ธ', '๐น', '๐ป', '๐ผ']
			]
		};
	},
	methods: {
		clickEmoji: function(e) {
			this.$emit('emotion', e);
		}
	}
};
</script>

<style lang="scss">
.emoji {
	width: 100%;
	padding: 16rpx 10rpx 188rpx 10rpx;
	box-sizing: border-box;
	overflow: hidden;
	overflow-y: auto;
	.emoji-line {
		display: flex;
		.emoji-item {
			flex: 1;
			text-align: center;
			font-size: 52rpx;
			line-height: 80rpx;
		}
	}
}
</style>
