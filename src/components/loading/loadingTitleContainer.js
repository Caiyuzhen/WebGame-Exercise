import { Container } from '../../libs/pixijs.js'
import RainBowStar from './rainBowStar.js' 
import LoadingBar from './LoadingBar.js'
import LoadingText from './loadingText.js'
import AuthorText from './authorText.js'


export default class LoadingTitleContainer {
	constructor(rainbowStarSheet) { //接收上游数据
		//🚀 整个【星星】 + 【进度条】的容器, 相当于打了一个组 (在这之前需要删除元素内部的移动)
		this.element = new Container() 
		this.rainbowStarSheetData = rainbowStarSheet
		this.init()
	}

	init() {
		// 👇 统一进行实例化
		const rainBowStar = new RainBowStar(this.rainbowStarSheetData) //加载小星星
		const loadingBar = new LoadingBar() // 加载进度条
		const loadingText = new LoadingText() // 加载文字
		const authorText = new AuthorText() // 底部文字


		//⚡️ 把上面的元素添加到 element 中！！【element 的宽高 = 元素的总宽高！】
		this.element.addChild(rainBowStar.elementBox, loadingBar.element, loadingText.element, authorText.element) 

		// 👇👇统一在这里去移动元素的位置！【🔥记得都先改变一下中心锚点 !!】
		rainBowStar.elementBox.x = authorText.element.width / 2
		rainBowStar.elementBox.y = 100

		loadingBar.element.x = authorText.element.width / 2
		loadingBar.element.y = 160

		loadingText.element.x = authorText.element.width / 2 - 52 //不用 ahchor 的话, 就需要手动调 Loading 文本的整位置!!
		loadingText.element.y = 200

		authorText.element.y = 240

		// 设置中心锚点
		this.element.pivot.set(this.element.width / 2, this.element.height / 2)
	}
}