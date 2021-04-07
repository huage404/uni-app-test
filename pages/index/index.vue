<template>
	<view class="container">
		<swiper class="swiper" :autoplay="true">
			<template>
				<swiper-item v-for="(item,index) in bannerList" :key="index">
					<image class="banner" :src="item"></image>
				</swiper-item>
			</template>
		</swiper>

		<view class="content">
			<!-- 景区信息 Start -->
			<view class="info">
				<view class="title">{{baseInfo.title}}</view>
				<view class="time">开放时间：{{baseInfo.time}}</view>
				<view class="address">地址：{{baseInfo.address}}</view>
			</view>
			<!-- 景区信息 End -->

			<!-- 导航 Start -->
			<view class="nav-list">
				<view class="item" v-for="(item,index) in navList" :key="index" @click="toNavPage(index)">
					<text class="iconfont" :class="item.icon"></text>
					<text>{{item.text}}</text>
				</view>
			</view>
			<!-- 导航 End -->

			<view class="introduce">
				<!-- 门票 Start -->
				<view class="module">
					<view class="module-title"><text class="icon"></text>门票详情</view>
					<view class="module-content">
						<view class="tickets" v-for="(item,index) in ticketsList" :key="index">
							<text class="tickets-info">{{item.text}}</text>
							<text class="price">￥{{item.price}}</text>
							<button size="mini" :class="{disabled: item.isDisabled}"
								@click="toNavPage(0)">{{item.buttonText}}</button>
						</view>
					</view>
				</view>
				<!-- 门票 End -->

				<view class="module" v-for="(item,index) in moduleData" :key="index">
					<view class="module-title"><text class="icon"></text> {{item.title}}</view>
					<view class="module-content">
						{{item.content}}
						<template v-if="index === 0">
							<image style="width: 100%;margin-top: 10px;" v-for="(item,index) in bannerList" :src="item"
								:key="index" mode="widthFix"></image>
						</template>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import data from "@/mock/data.json"
	import {getFilePath} from "../../utils/index.js"
	import baseImage from "@/static/base-image.jpg"
	import {mapState,mapActions,mapMutations} from "vuex"

	export default {
		data() {
			return {
				baseInfo: {}, 		// 基本信息				
				bannerList: [], 	// 轮播图
				ticketsList: [], 	// 门票列表
				moduleData: [], 	// 景区介绍
				navList: []			// 导航
			}
		},
		computed:{
			...mapState(['resourceId','userId'])
		},
		onLoad() {
			this.init()
		},
		methods: {
			...mapActions(['setUserIdSync','setResourceId']),
			...mapMutations(['setResourceId']),
			init(){
				this.moduleData = data.moduleData
				this.navList = data.navList
				this.getTicketData()
				this.login()
			},
			
			// 获取景点门票数据
			getTicketData(){
				this.$API.getTicketData(this.resourceId).then(({data}) => {
					this.baseInfo = {
						title: data.scenicName,
						time: data.openTime,
						address: data.address
					}
					this.bannerList = data.filePath.map(item => {
						return getFilePath(item)
					})
					this.ticketsList = data.ticketRates.map(item => {
						return {
							text: item.fullName,
							price: item.retailPrice,
							buttonText: '了解更多',
							isDisabled: false,
							number: 0
						}
					})
				}).finally(() => {
					// 当返回数据中，没有图片信息，则给予一张默认图片用于展示
					if (this.bannerList.length === 0) {
						this.bannerList.push(baseImage)
					}
				})
			},
			
			login(){
				let that = this
				uni.login({
					success(res) {
						that.getUserId(res.authCode)
					}	
				})
				this.setResourceId()
			},
			
			getUserId(authcode){
				this.$API.getPermission({
					authcode: authcode,
					resourceId: this.resourceId
				}).then(res=>{
					this.setUserIdSync(res.data.userId)
				})
			},
			
			toNavPage(index) {
				let url = index === 0 ? `../buy-ticket/buy-ticket` : `../scenic-management/scenic-management?active=${index-1}`
				uni.navigateTo({url})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/globalStyle.scss';

	$margin-top: 24rpx;

	.container {
		.swiper {
			z-index: -1;

			.banner {
				width: 100%;
				height: 480rpx;
			}
		}

		.content {
			padding: 0 $padding;
			margin-top: -80rpx;

			.info {
				@extend .baseContianer;
				font-size: 24rpx;
				margin-bottom: $padding;

				>.title {
					font-size: 32rpx;
					font-weight: 800;
				}

				>.time {
					margin-top: $margin-top;
				}

				>.address {
					margin-top: $margin-top;
					font-weight: 800;
				}
			}

			.nav-list {
				@extend .baseContianer;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.item {
					display: flex;
					justify-content: center;
					align-items: center;
					flex-direction: column;

					>text {
						font-size: 24rpx;
					}

					.iconfont {
						font-size: 60rpx;
						margin-bottom: 10rpx;
					}
				}
			}

			.introduce {
				padding-bottom: 80rpx;

				.module {
					@extend .baseContianer;
					margin-top: $padding;

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
							padding: $padding 0;
							border-bottom: 1rpx solid rgba(0, 0, 0, .1);

							&:last-child {
								border: none;
							}
						}

						>.tickets {
							display: flex;
							justify-content: space-between;
							align-items: center;

							>.tickets-info {
								// width: 400rpx;
								flex: 7;
							}

							>.price {
								flex: 3;
								text-align: center;
								font-size: 30rpx;
								color: rgba(255, 127, 0, .8);
								font-weight: 700;
							}

							>button {
								flex: 2;
								background-color: rgba(255, 127, 0, 1);
								color: #fff;
								border-radius: 10rpx;
								font-size: 26rpx;

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
			}
		}
	}

	.text {
		color: red;
		background-color: blue;
		border: 1rpx solid green;
	}
</style>
