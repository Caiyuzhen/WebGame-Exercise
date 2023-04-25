import { Container } from "../../libs/pixijs.js"
import ShapeBox from "./shapeBox.js"
import TitleBox from './titleBox.js'


export default class PlayScene {
	/* constructor 跟 init() 是平层的关系, 要访问需要通过 this (指向实例) 中介
		作用域是根据【函数定义】的地方, 而不是【函数被调用】的地方
	*/
	constructor({ gameBlockTextTexture, rainbowColorTexture, chnText, shapeBundle }, app) { //🔥用解构赋值的方式来传递数据, 解构的【⚡️名称】必须一致 !!! 解构的【⚡️顺序】可以不一致 !!!
		// 👇存放游戏场景的 box
		this.sceneBox = new Container()
		this.gameBlockTextTexture = gameBlockTextTexture //承接文字材质
		this.rainbowColorTexture = rainbowColorTexture //承接彩虹材质
		this.chnText = chnText
		this.shapeBundle = shapeBundle
		this.app = app //🔥要存到实例上才能传递给下游使用！
		this.shapePosInfo = [// 图形小元素的位置值, 可以访问 this.app 也可以访问上游传下来的 app 来获取 screen 数据
			{ x: app.screen.width / 3, y: 500 },
			{ x: app.screen.width / 8, y: 300 },
			{ x: app.screen.width / 5 * 4, y: 200 },
			{ x: app.screen.width / 5 * 4.5, y: 100 },
			{ x: app.screen.width / 10 * 4, y: 80 },
			{ x: app.screen.width / 6 * 4, y: 520 },
			{ x: app.screen.width / 6 * 5, y: 400 },
			{ x: app.screen.width / 5, y: 150 },
		]
		this.init()
	}

	init() {
		// 标题组件
		const titleBox = new TitleBox({ //🔥🔥把材质、app.ticker 两个参数再传递给 titleBox 下游!!
			gameBlockTextTexture: this.gameBlockTextTexture,  //因为要用 this.XXX 来赋值, 所以要用这种写法
			rainbowColorTexture: this.rainbowColorTexture,   //因为要用 this.XXX 来赋值, 所以要用这种写法
			chnText: this.chnText //因为要用 this.XXX 来赋值, 所以要用这种写法！
		}, this.app.ticker)  //🔥🔥第二个参数传递 app.ticker, 用于下游的动画效果！！

		titleBox.element.x = this.app.screen.width / 2
		titleBox.element.y = this.app.screen.height / 2
		this.sceneBox.addChild(titleBox.element)


		// 背景小元素组件
		//for-in 循环、Object.keys() 的枚举顺序是不确定的, 但如果不在意对象内 value 的顺序就可以用
		// 🔥遍历方法一: for-in 循环出 【所有点缀元素】
		let k = 0
		for (let i in this.shapeBundle) { // i 相当于数组的索引
			const shape = new ShapeBox(this.shapeBundle[i], this.shapePosInfo[k++]) // k++ 用于遍历 shapePosInfo 内的所有数组
			this.sceneBox.addChild(shape.element)
		}

		// 🔥遍历方法二: Object.keys() 方法, 传入一个对象, 会把它的所有属性名组成一个数组 【0:'shape1', 1:'shape2', ...】
		// console.log(Object.keys(this.shapeBundle)) // 【0:'shape1', 1:'shape2', ...】
		// console.log(Object.value(this.shapeBundle)) // 【0:'shape1', 1:'shape2', ...】

	}
}