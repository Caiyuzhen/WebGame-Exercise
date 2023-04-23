import { Container, Text } from '../../libs/pixijs.js'
import LoadingTitle from './loadingTitle.js'


export default class LoadingScene {
	constructor(sheet) {  //从 mian 传入的 sheet 数据
		this.sceneBox = new Container()
		this.rainbowStarSheet = sheet
		this.init() //此时 init 就可以访问到 rainbowStarSheet 了
	}

	init() { 
		// 再把 rainbowStarSheet 数据传给标题组件
		const loadingTitle = new LoadingTitle(this.rainbowStarSheet)
		this.sceneBox.addChild(loadingTitle.titleBox) //👈 把 TitleBox 添加到场景中！
	}
}