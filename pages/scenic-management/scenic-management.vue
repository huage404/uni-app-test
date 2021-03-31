<template>
	<!-- 景点管理页面 -->
	<view>
		<view class="banner">
			<text class="title">{{title}}</text>
			<image :src="bgUrl" mode="widthFix"></image>
		</view>
		
		<view class="module">
			<view class="module-title"><text class="icon"></text>{{title}}</view>
			<view class="module-content">
				<text>{{content}}</text>
				
				<template v-if="active === 0">
					<image style="width: 100%;margin-top: 10px;" v-for="(item,index) in bannerList" :src="item" :key="index" mode="widthFix"></image>
				</template>
			</view>
		</view>
	</view>
</template>

<script>
	import data from "@/mock/data.json"
	
	export default {
		onLoad(option){
			let pageData = data.moduleData[option.active]
			let Nonce = parseInt(Math.random() * data.bannerList.length-1)
			this.active = option.active
			this.title = pageData.title
			this.content = pageData.content
			this.bannerList = data.bannerList
			this.bgUrl = data.bannerList[Nonce]
		},
		data() {
			return {
				active: 0,
				title: '',
				content: '',
				hasImg: '',
				bgUrl: '',
				bannerList: []
			};
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/globalStyle.scss';

	.banner {
		height: 250rpx;
		overflow: hidden;
		position: relative;
		background: #000;
	
		image {
			width: auto;
	
			&:active {
				opacity: .8;
			}
		}
	
		.title {
			position: absolute;
			top: 35%;
			left: 50%;
			transform: translate(-50%, -50%);
			font-size: 60rpx;
			color: #fff;
			font-weight: bold;
			letter-spacing: 10rpx;
			z-index: 1;
		}
	}
	
	.module {
		@extend .baseContianer;
		margin: $padding;
		margin-top: -74rpx;
		margin-bottom: 70rpx;
		position: relative;
	
		.module-title {
			height: 100%;
			font-size: 28rpx;
			margin-bottom: $padding;
	
			.icon {
				display: inline-block;
				width: 8rpx;
				height: 20rpx;
				margin-right: 4rpx;
				background-color: red;
			}
		}
	
		.module-content {
			font-size: 24rpx;
			line-height: 1.5;
	
			>view {
				padding: $padding;
				border-bottom: 1rpx solid rgba(0, 0, 0, .1);
	
				&:last-child {
					border: none;
				}
			}
	
			>.tickets {
				display: flex;
				justify-content: space-between;
				align-items: center;
	
				>text {
					width: 470rpx;
				}
	
				>button {
					background-color: rgba(255, 127, 0, 1);
					color: #fff;
					padding: 0 20rpx;
					border-radius: 10rpx;
	
					&:active {
						background-color: rgba(255, 127, 0, .8);
					}
	
					&.disabled {
						background-color: rgba(0, 0, 0, .4);
					}
				}
			}
		}
	}
	
</style>
