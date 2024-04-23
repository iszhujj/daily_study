<template>
	<view class="content">
		<live-pusher id='livePusher' url="rtmp://localhost:1935/flv/video"
			mode="SD" :muted="true" :enable-camera="true" :auto-focus="true" :beauty="1" whiteness="2"
			aspect="9:16" @statechange="statechange" @netstatus="netstatus" @error = "error"
		></live-pusher>
		<button @click="start" type='primary'>start push</button>
		<button @click="pause" type='default'>pause push</button>
		<button @click="resume" type='default'>resume push</button>
		<button @click="stop" type='warn'>stop push</button>
		<button @click="startPreview" type='default'>open preview</button>
		<button @click="stopPreview" type='default'>close preview</button>
	</view>
</template>

<script>
	export default{
		data(){
			return{}
		},
		methods:{
			statechange(detail){
				console.log('statechange', detail)
			},
			netstatus(detail){
				console.log('netstatus', detail)
			},
			// 开启摄像头预览
			startPreview(){
				this.context.startPreview({
					success: (a) => {
						console.log("livePusher.startPreview:" + JSON.stringify(a));
					},
					fail:(err)=>{
						console.log(err)
					}
				});
			},
			// 关闭摄像头预览，关闭摄像头预览时，会暂停推流
			stopPreview(){
				this.context.stopPreview({
					success: (a) => {
						console.log("livePusher.stopPreview:" + JSON.stringify(a));
					}
				});
			},
			// 开始推流
			start(){
				console.log('start:')
				this.context.start({
					success: (a) => {
						console.log("livePusher.start:" + JSON.stringify(a));
					},fail:err =>{
						console.log("livePusher.start err:" + err)
					}
				});
			},
			// 暂停推流
			pause(){
				this.context.pause({
					success: (a) => {
						console.log("livePusher.close:" + JSON.stringify(a));
					},fail:err =>{
						console.log(err)
					}
				});
			},
			stop(){
				this.context.stop({
					success: (a) => {
						console.log("livePusher.close:" + JSON.stringify(a));
					}
				})
			},
			// 恢复推流
			resume(){
				this.context.resume({
					success: (a) => {
						console.log("livePusher.close:" + JSON.stringify(a));
					}
				})
			},
			error(e){
				console.log("error:" + JSON.stringify(e));
			}
		},
		onReady() {
			console.log('ready')
			this.context = uni.createLivePusherContext("livePusher", this);
		},
		mounted(){
			uni.request({
				url:'http://139.9.53.12:9092/test'
			}).then(data =>{
				console.log(data)
			}).catch(err =>{
				console.log(err)
			})
		}
	}
</script>
<style lang="scss" scoped>
.content{
	button{
		width: 160px;
		margin-top: 8px;
		margin-bottom: 8px;
	}
}
</style>
