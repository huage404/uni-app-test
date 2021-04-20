<template>
	<!-- 首页页面
				页面路径: pages/home
				功能: 展示景点信息，入口页面
	-->
	<view class="container">
		<swiper class="swiper" :autoplay="true">
			<template>
				<swiper-item v-for="(item,index) in bannerList" :key="index">
					<image class="banner" :src="getFilePath(item.filePath)"></image>
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
							<text class="tickets-info">{{item.productName}}</text>
							<text class="price">￥{{getPrice(item.ticketPriceCalendars)}}</text>
							<button size="mini" @click="toNavPage(0)">立即预定</button>
						</view>
					</view>
				</view>
				<!-- 门票 End -->

				<view class="module" v-if="introduction.length !== 0">
					<view class="module-title"><text class="icon"></text>景区介绍</view>
					<rich-text :nodes="introduction"></rich-text>
				</view>

				<view class="module" v-if="playReadme.length !== 0">
					<view class="module-title"><text class="icon"></text>预定需知</view>
					<rich-text :nodes="playReadme"></rich-text>
				</view>

				<view class="module" v-if="trafficInformation.length !== 0">
					<view class="module-title"><text class="icon"></text>温馨提示</view>
					<rich-text :nodes="trafficInformation"></rich-text>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	import {
		getFilePath,
		htmlToNode
	} from "../../utils/index.js"
	// import baseImage from "@/static/base-image.jpg"
	import {
		mapState,
		mapActions,
		mapMutations
	} from "vuex"

	export default {
		data() {
			return {
				baseInfo: {}, // 基本信息
				bannerList: [], // 轮播图
				ticketsList: [], // 门票列表
				navList: [{
						"icon": "icon-goupiao",
						"text": "自助购票"
					},
					{
						"icon": "icon-jingdian1",
						"text": "景区介绍"
					},
					{
						"icon": "icon-yuyue",
						"text": "预订须知"
					},
					{
						"icon": "icon-gonglve",
						"text": "温馨提示"
					}
				], // 导航
				introduction: [], // 景区介绍
				playReadme: [], // 预定需知
				trafficInformation: [], // 温馨提示
			}
		},
		computed: {
			...mapState(['resourceId', 'userId'])
		},
		onLoad() {
			this.init()
		},
		methods: {
			...mapActions(['setUserIdSync', 'setResourceId', 'setResourceNameSync']),
			...mapMutations(['setResourceId']),
			init() {
				this.getTicketData()
				this.login()
			},

			// 获取景点门票数据
			getTicketData() {
				this.$API.getTicketData(this.resourceId).then(({
					data
				}) => {

					this.baseInfo = {
						title: data.scenicName,
						time: data.openTime,
						address: data.address
					}
					this.bannerList = data.resourcePictures

					this.setResourceNameSync(data.scenicName)

					handleListProductTickets.call(this, data.listProductTickets)
					handleResourceScenicInfo.call(this, data.resourceScenicInfo)

					uni.setStorage({
						key: 'tcketData',
						data: data
					})
				}).finally(() => {
					// 当返回数据中，没有图片信息，则给予一张默认图片用于展示
					/* if (this.bannerList.length === 0) {
						this.bannerList.push(baseImage)
					} */
				})

				/**
				 * 处理资源风景信息
				 * @description 将资源信息处理成支持 rich-text 的数据格式，并渲染到页面
				 * @param {Object} resourceScenicInfo
				 */
				function handleResourceScenicInfo(resourceScenicInfo) {
					const {
						introduction,
						playReadme,
						trafficInformation
					} = resourceScenicInfo

					const introductionNode = htmlToNode(introduction)
					const playReadmeNode = htmlToNode(playReadme)
					const trafficInformationNode = htmlToNode(trafficInformation)

					// 渲染到页面
					this.introduction = introductionNode
					this.playReadme = playReadmeNode
					this.trafficInformation = trafficInformationNode

					// 存到缓存中，给 scenic-management 提供数据
					uni.setStorage({
						key: 'introduction',
						data: introductionNode
					})
					uni.setStorage({
						key: 'playReadme',
						data: playReadmeNode
					})
					uni.setStorage({
						key: 'trafficInformation',
						data: trafficInformationNode
					})
				}

				/**
				 * 处理产品套餐数据
				 * @description 过滤掉无库存的门票
				 */
				function handleListProductTickets(listProductTickets) {
					let newArr = []
					listProductTickets.forEach(item => {
						if (item.ticketPriceCalendars.length !== 0) {
							newArr.push(item)
						}
					})
					uni.setStorage({
						key: 'ticketsList',
						data: newArr
					})
					this.ticketsList = newArr
				}
			},

			login() {
				let that = this
				uni.login({
					success(res) {
						that.getUserId(res.authCode)
					}
				})
				this.setResourceId()
			},

			// 获取用户 userId
			getUserId(authcode) {
				this.$API.getPermission({
					authcode: authcode,
					resourceId: this.resourceId
				}).then(res => {
					this.setUserIdSync(res.data.userId)
				})
			},

			// 点击导航跳转链接
			toNavPage(index) {
				let typeHash = {
					'1': 'introduction',
					'2': 'playReadme',
					'3': 'trafficInformation'
				}
				let url = index === 0 ? `../tickets-list/tickets-list` :
					`../scenic-management/scenic-management?active=${index-1}&type=${typeHash[index]}`
				uni.navigateTo({
					url
				})
			},

			/**
			 * 返回一个套餐价格
			 * @description 返回今天之后的第一个套餐价格
			 * @param {Array} list - 价格数组
			 * @return {String}
			 */
			getPrice(list) {
				let nowTime = new Date().getTime()
				let newArr = []
				list.forEach(item => {
					let useTime = new Date(item.useDate)
					if (useTime > nowTime) {
						newArr.push(item)
					}
				})
				return Number(newArr[0]['dealPrice']).toFixed(2)
			},

			getFilePath(filePath) {
				return getFilePath(filePath)
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
