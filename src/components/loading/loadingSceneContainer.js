import { Container, Text } from '../../libs/pixijs.js'
import LoadingTitleContainer from './loadingTitleContainer.js'
import GameLoader from '../gameControl/gameLoader.js'


export default class LoadingSceneContainer {
	// constructor(sheet, app) {  //⚡️⚡️ 从 mian 传入的 sheet, app 数据
	constructor(app) {  // 📦封装加载资源后的写法
		this.sceneBox = new Container()
		// this.rainbowStarSheet = sheet //🔥🔥 接收【上游传入】的 sheet 这个参数
		this.app = app //🔥🔥 接收【上游传入】的 app 这个参数

		this.loadingBarInstance = null

		this.init() //此时 init 就可以访问到 rainbowStarSheet 了
	}

	init() { 
		// 再把 rainbowStarSheet 数据传给标题组件
		// const loadingTitleContainer = new LoadingTitleContainer(this.rainbowStarSheet)
		// 📦封装加载资源后的写法
		const loadingTitleContainer = new LoadingTitleContainer(GameLoader.allData.loadingScene.rainbowStarSheetData)

		//⚡️用来获取进度条的实例, 定义在 loadingTitleContainer 中, 实例化后就有数据了⚡️
		this.loadingBarInstance = loadingTitleContainer.loadingBarInstance 

		// loadingTitleContainer.element.x = this.app.screen.width / 2 //🔥🔥居中！
		loadingTitleContainer.element.x = innerWidth / 2 //全屏, innerWidth 也可以！
		loadingTitleContainer.element.y = this.app.screen.height / 2 //🔥🔥居中！

		//👇 把 TitleBox 添加到场景中！
		this.sceneBox.addChild(loadingTitleContainer.element) 


		// 设置中心锚点
		this.sceneBox.pivot.set(this.app.screen.width / 2, this.app.screen.height / 2)
		this.sceneBox.x = innerWidth / 2
		this.sceneBox.y = innerHeight / 2


		// 放到实例上
		this.loadingTitleInstance = loadingTitleContainer
	}


	// 游戏场景加载完后, loadingScene 场景消失的方法 (⚡️ control -> gameLoader -> loadingScene -> loadingTitleContainer )
	disappear() {
		this.loadingTitleInstance.disappear()
		// gsap.to(this.loadingTitleInstance.element, {
		// 	alpha: 0,
		// 	duration: 1,
		// }) 
	}


}