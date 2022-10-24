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
				['😀', '😃', '😄', '😁', '😆', '😅', '😂'],
				['🤣', '😊', '😇', '🙂', '🙃', '😉', '😌'],
				['😍', '🥰', '😘', '😗', '😙', '😚', '😋'],
				['😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓'],
				['😎', '🤩', '🥳', '😏', '😒', '😞', '😔'],
				['😟', '😕', '🙁', '😣', '😖', '😫', '😩'],
				['🥺', '😢', '😭', '😤', '😠', '🤖', '🎃'],
				['🤯', '😳', '🥵', '🥶', '😱', '😨', '😰'],
				['🙏', '😥', '😓', '🤗', '🤔', '🤭', '🤫'],
				['🤥', '😶', '😐', '😑', '😬', '🙄', '😯'],
				['😦', '😧', '😮', '😲', '😴', '🤤', '😪'],
				['😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷'],
				['🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹'],
				['👺', '🤡', '💩', '👻', '💀', '👽', '👾'],
				['😺', '😸', '😹', '😻', '😼']
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
