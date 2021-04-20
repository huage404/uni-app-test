<template>
	<view class="order">
		<!-- 导航栏 start -->
		<view class="nav-list">
			<view class="nav-item" :class="{active: item.isActive}" @click="handleNavChange(item)" v-for="item in navList" :key="item.index">
				<text>{{item.text}}</text>
				<view class="line"></view>
			</view>
		</view>
		<!-- 导航栏 end -->

		<!-- 订单列表 start -->
		<view class="order-list" >
			<template v-if="showList">
				<orderCard v-for="(item, index) in listData" :key="index" :cardData="item"></orderCard>
			</template>
			<template v-else>
				<orderCard v-for="(item, index) in filterListData" :key="index" :cardData="item"></orderCard>
			</template>
		</view>
		<!-- 订单列表 end -->
	</view>
</template>

<script>
	import orderCard from './components/order-card.vue'
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				navList:[
					{
						index: 0,
						isActive: true,
						filterState: '0',
						text: '全部'
					},
					{
						index: 1,
						isActive: false,
						text: '待出行',
						filterState: '2'
					},
					{
						index: 2,
						isActive: false,
						text: '已完成',
						filterState: '3'
					},
					{
						index: 3,
						isActive: false,
						text: '退款单',
						filterState: '6'
					}
				],
				listData: [],
				filterListData: [],
				showList: true
			}
		},
		computed: { ...mapState(['userId','resourceId','appId']) },
		components:{ orderCard },
		methods: {
			init(){
				if(this.userId){
					let param = {
						userId: this.userId,
						resourceId: this.resourceId
					}
					this.$API.getOrderList(param).then(({data})=>{
						this.listData = data.map(item=>{
							return {
								gytOrderNo: item.gytOrderNo,
								state: item.state,
								orderName: item.tradeName,
								travelTime: item.addtime,
								unitPrice: item.commPric,
								totalPrices: item.commPric,
								ticketType: '',
								platNum: item.platNum,
								count: 1
							}
						})
					}).catch(err => {
						console.log('error', err)
					})
				}
			},
			// 点击导航触发
			handleNavChange(el){
				// 切换样式
				function changeStyle(el){
					this.navList.forEach(item=>{
						item.isActive = false
					})	
					el.isActive = true
				}
				/**
				 * 切换 listData 中的数据
				 * @param {Number} active
				 * @return {Array} list
				 */
				function filterList(state){
					let list = []
					
					this.listData.forEach(item=>{
						if(item.state === state){
							list.push(item)
						}
					})
					console.log('已触发',list)
					return list
				}
				
				// 切换样式
				changeStyle.apply(this,[el])
				
				// 切换数据
				if(el.index !== 0){
					this.filterListData = filterList.apply(this,[el.filterState])
					this.showList = false
				}else{
					this.showList = true
				}
			}
		},
		mounted() {
			this.init()
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/globalStyle.scss';

	.order{
		background: $themeBgColor;
		min-height: 100vh;
		.nav-list{
			height: 90rpx;
			display: flex;
			justify-content: space-around;
			align-items: center;
			padding: 0 $padding;
			font-size: 28rpx;
			background: #fff;
			border-top: 2rpx solid $borderColor;
			box-shadow: $boxShadow;

			.nav-item{
				.line{
					width: 0;
					height: 4rpx;
					margin: 0 auto;
					background: $themeColor;
					transform: translateY(28rpx);
					transition: all 0.1s linear;
				}

				&.active{
					color: $themeColor;
					.line{
						width: 100%;
					}
				}
			}
		}

		.order-list{
			padding-bottom: 100rpx;
		}
	}

</style>
