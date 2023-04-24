import { Container } from '../../libs/pixijs.js'
import RainBowStar from './rainBowStar.js' 
import LoadingBar from './LoadingBar.js'
import LoadingText from './loadingText.js'
import AuthorText from './authorText.js'


export default class LoadingTitle {
	constructor(rainbowStarSheet) { //接收上游数据
		//🚀 整个【星星】 + 【进度条】的容器, 相当于打了一个组 (在这之前需要删除元素内部的移动)
		this.titleBox = new Container() 
		this.rainbowStarSheetData = rainbowStarSheet
		this.init()
	}

	init() {
		// 👇 统一进行实例化
		const rainBowStar = new RainBowStar(this.rainbowStarSheetData) //加载小星星
		const loadingBar = new LoadingBar() // 加载进度条
		const loadingText = new LoadingText() // 加载文字
		const authorText = new AuthorText() // 底部文字

		// 👇统一在这里去移动元素的位置！
		authorText.element.y = 200
		rainBowStar.elementBox.y = 120

		//⚡️ 把上面的元素添加到 titleBox 中！！
		this.titleBox.addChild(rainBowStar.elementBox, loadingBar.element, loadingText.element, authorText.element) 
	}
}