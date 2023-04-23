import { Container } from '../../libs/pixijs.js'
import RainBowStar from './RainBowStar.js' 

export default class LoadingTitle {
	constructor(rainbowStarSheet) {
		this.titleBox = new Container()
		this.rainbowStarSheetData = rainbowStarSheet
		this.init()
	}

	init() {
		// 实例化【小星星类】
		const rainBowStar = new RainBowStar(this.rainbowStarSheetData) //加载小星星
		this.titleBox.addChild(rainBowStar.elementBox) //👈 把 rainBowStar 类中创建的小星星 添加到 titleBox 中！！
	}
}