import { Container, Text } from '../../libs/pixijs.js'
import LoadingTitleContainer from './loadingTitleContainer.js'


export default class LoadingSceneContainer {
	constructor(sheet, app) {  //⚡️⚡️ 从 mian 传入的 sheet, app 数据
		this.sceneBox = new Container()
		this.rainbowStarSheet = sheet //🔥🔥 接收【上游传入】的 sheet 这个参数
		this.app = app //🔥🔥 接收【上游传入】的 app 这个参数
		this.init() //此时 init 就可以访问到 rainbowStarSheet 了
	}

	init() { 
		// 再把 rainbowStarSheet 数据传给标题组件
		const loadingTitleContainer = new LoadingTitleContainer(this.rainbowStarSheet)

		// loadingTitleContainer.element.x = this.app.screen.width / 2 //🔥🔥居中！
		loadingTitleContainer.element.x = innerWidth / 2 //全屏, innerWidth 也可以！
		loadingTitleContainer.element.y = this.app.screen.height / 2 //🔥🔥居中！

		//👇 把 TitleBox 添加到场景中！
		this.sceneBox.addChild(loadingTitleContainer.element) 
	}
}