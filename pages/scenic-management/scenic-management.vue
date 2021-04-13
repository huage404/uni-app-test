<template>
	<!-- 景点管理页面 -->
	<view>
		<view class="banner">
			<text class="title">{{title[name]}}</text>
			<image :src="bgUrl" mode="widthFix"></image>
		</view>

		<view class="module">
			<view class="module-title"><text class="icon"></text>{{title[name]}}</view>
			<rich-text :nodes="contentNodes"></rich-text>
		</view>
	</view>
</template>

<script>
	import {getFilePath} from "../../utils/index.js"
	
	export default {
		onLoad(option) {
			let {active,type} = option
			
			let data = uni.getStorageSync('tcketData')
			this.bgUrl = data.resourcePictures[0]['filePath']
			
			let filePath;
			
			if(data.resourcePictures.length > active){
				filePath = data.resourcePictures[active]['filePath']
			}else{
				filePath = data.resourcePictures[0]['filePath']
			}
			
			this.bgUrl = getFilePath(filePath)
			this.name = type
			this.contentNodes = uni.getStorageSync(type)
		},
		data() {
			return {
				active: 0,
				name: '',
				title: {
					'introduction': '景区介绍',
					'playReadme': '预定需知',
					'trafficInformation': '温馨提示',
				},
				contentNodes: [],
				bgUrl: '',
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
