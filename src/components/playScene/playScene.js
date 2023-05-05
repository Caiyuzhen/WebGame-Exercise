import { Container } from "../../libs/pixijs.js"
import ShapeBox from "./shapeBox.js"
import TitleBox from './titleBox.js'
import BarElement from "./barElement.js"
import GoldenStar from "./goldenStar.js"
import StartBtn from './startBtn.js'
import GameLoader from "../gameControl/gameLoader.js"
import Control from "../gameControl/control.js"
import ScoreText from "./scoreText.js"

export default class PlayScene {
	/* constructor 跟 init() 是平层的关系, 要访问需要通过 this (指向实例) 中介
		作用域是根据【函数定义】的地方, 而不是【函数被调用】的地方
	*/
	// 👇未封装的写法
	// constructor({ gameBlockTextTexture, rainbowColorTexture, chnText, shapeBundle, barTexture, barCornerTexture, goldenStarTexture }, app) { //🔥用解构赋值的方式来传递数据, 解构的【⚡️名称】必须一致 !!! 解构的【⚡️顺序】可以不一致 !!!

	// 📦封装加载方法过后的写法
	constructor(app) { //🔥用解构赋值的方式来传递数据, 解构的【⚡️名称】必须一致 !!! 解构的【⚡️顺序】可以不一致 !!!
		this.app = app //🔥要存到实例上才能传递给下游使用！ 
		this.sceneBox = new Container() // 👈存放游戏场景下所有元素的 box
		// 🚀🚀🚀 存放游戏场景内的所有(要飞出去的）元素实例, 然后等加载完成后统一调用基类的 showUp() 方法!
		this.allInstances = []
		this.scoreTextInstance = null

		// this.gameBlockTextTexture = gameBlockTextTexture //承接文字材质
		// this.rainbowColorTexture = rainbowColorTexture //承接彩虹材质
		// this.chnText = chnText
		// this.shapeBundle = shapeBundle
		// this.barTexture = barTexture
		// this.barCornerTexture = barCornerTexture
		// this.goldenStarTexture = goldenStarTexture

		// 👇图形小元素的位置数据, 传入 ShapeBox 内去做动画, 可以访问 this.app 也可以访问上游传下来的 app 来获取 screen 数据, 因为继承自 Character 类, 已经在基类中定义 posInfo 的动画！
		this.shapePosInfo = [
			{ from: { x: 100, y: -20 }, to: { x: app.screen.width / 3, y: 500 } },
			{ from: { x: -20, y: 100 }, to: { x: app.screen.width / 8, y: 300 } },
			{ from: { x: app.screen.width / 3, y: -50 }, to: { x: app.screen.width / 5 * 4, y: 200 } },
			{ from: { x: app.screen.width, y: -10 }, to: { x: app.screen.width / 5 * 4.5, y: 100 } },
			{ from: { x: app.screen.width / 2, y: -20 }, to: { x: app.screen.width / 10 * 4, y: 80 } },
			{ from: { x: app.screen.width / 5 * 4, y: -20 }, to: { x: app.screen.width / 6 * 4, y: 520 } },
			{ from: { x: app.screen.width, y: -20 }, to: { x: app.screen.width / 6 * 5, y: 400 } },
			{ from: { x: app.screen.width + 30, y: 100 }, to: { x: app.screen.width / 5, y: 150 } },
		]

		// 🔥🔥🔥获取封装好的 GameLoader 内的数据 !!! 就不用传来传去了
		console.log(GameLoader.allData.playScene)
		this.init() //⚡️⚡️this 放最后的原因是上边的数据定义好后, 才能在 init() 中访问到!!
	}


	// 🚀🚀🚀 显示游戏场景内所有实例的方法(🚀核心是让元素们各自调用基类身上的 moveShowUpEle() 方法🚀)
	appear() {
		// 🚀每个实例都调用基类的 moveShowUpEle() 方法, 注意离别要处理下数组元素！
		for(let name in this.allInstances) {
			if(name === 'shapes') {
				this.allInstances[name].forEach((item) => {
					item.moveShowUpEle()  //🚀显示元素 => 每个小元素都调用基类的 moveShowUpEle() 方法, 注意, 不是要操作元素, 而是调用元素身上的方法, 所以不用 this.element
				})
			} else {
				this.allInstances[name].moveShowUpEle() //🚀显示元素
			}
		}
	}


	// 🚀🚀🚀游戏开始后, 把其他元素退出去, 只留下游戏元素 ⚡️ playScene -> Character 父类中定义 hidden 元素的方法
	gameStarPlay() {
		for(let name in this.allInstances) {
			if(name === 'shapes') {
				this.allInstances[name].forEach((item) => {
					item.hideOff()  //🚀隐藏元素
				})
			} else {
				this.allInstances[name].hideOff() //🚀隐藏元素
			}
		}

		this.scoreTextInstance.moveShowUpEle() //🚀显示计分牌元素
	}


	// 🔘 Start 按钮事件, 点击后开始游戏
	startBtnEvent() {
		this.allInstances.startBtn.element.eventMode = 'static'
		this.allInstances.startBtn.element.addEventListener('pointerdown', () => {
			// this.gameStarPlay() //写法一
			Control.gameStar() //写法二, 统一用控制类管理
		})
	}


	// 🎮游戏结束后的布局
	gameOver() {
		for(let name in this.allInstances) {
			if(name === 'shapes') {
				this.allInstances[name].forEach((item) => {
					item.moveShowUpEle()  
				})
			} else if(name === 'barElement'){ //游戏结束后，恢复挡板的运动状态
				this.allInstances[name].moveShowUpEle()
				this.allInstances[name].resetBar()
			} else if (name === 'goldenStar') {
				this.allInstances[name].showOverResult() //此方法定义在基类上, 因为【星星】跟【计分牌】都要执行
			} 
			// 计分牌没有被放入 allInstance 内, 所以要单独处理
			this.scoreTextInstance.showOverResult()

		}
	}


	init() {

		// ✏️标题元素
		const titleBox = new TitleBox({ //🔥🔥把材质、app.ticker 两个参数再传递给 titleBox 下游!!
			// 👇未封装加载资源的写法
			// gameBlockTextTexture: this.gameBlockTextTexture,  //因为要用 this.XXX 来赋值, 所以要用这种写法
			// rainbowColorTexture: this.rainbowColorTexture,   //因为要用 this.XXX 来赋值, 所以要用这种写法
			// chnText: this.chnText //因为要用 this.XXX 来赋值, 所以要用这种写法！

			// 📦封装加载方法过后的写法
			gameBlockTextTexture: GameLoader.allData.playScene.gameBlockTextTexture,
			rainBowColorTexture: GameLoader.allData.playScene.rainBowColorTexture,
			chnText: GameLoader.allData.playScene.chnText

		}, this.app.ticker //🔥🔥第二个参数传递 app.ticker, 用于下游的动画效果！！
		// 🌈 彩虹标题的位置数据, 传入到 TitleBox 内去做动画
		, { from: { x: this.app.screen.width / 2, y: -100 }, to: { x: this.app.screen.width / 2, y: 300 } }, //🔥第三个参数传入位置信息, 用于移动🌈彩虹大标题, 因为继承自 Character 类, 已经在基类中定义 posInfo 的动画！
		)  

		// 👇先前写死的标题位置数据
		// titleBox.element.x = this.app.screen.width / 2
		// titleBox.element.y = this.app.screen.height / 2
		this.sceneBox.addChild(titleBox.element)

		console.log('🌈', GameLoader.allData.playScene.rainBowColorTexture)


		// 背景小元素组件
		//for-in 循环、Object.keys() 的枚举顺序是不确定的, 但如果不在意对象内 value 的顺序就可以用
		// 🔥遍历方法一: for-in 循环出 【所有点缀元素】
		let k = 0
		const shapeArray = [] //🚀🚀🚀装起来保存实例, 用于 allInstances , 加载完后显示 playScene 内的实例
		for(let i in GameLoader.allData.playScene.shapesBundle) {
		// for (let i in this.shapeBundle) { // i 相当于数组的索引
			const shape = new ShapeBox(GameLoader.allData.playScene.shapesBundle[i], this.shapePosInfo[k++]) // k++ 用于遍历 shapePosInfo 内的所有数组
			// const shape = new ShapeBox(this.shapeBundle[i], this.shapePosInfo[k++]) // k++ 用于遍历 shapePosInfo 内的所有数组
			shapeArray.push(shape)
			this.sceneBox.addChild(shape.element)
		}

		// 🔥遍历方法二: Object.keys() 方法, 传入一个对象, 会把它的所有属性名组成一个数组 【0:'shape1', 1:'shape2', ...】
		// console.log(Object.keys(this.shapeBundle)) // 【0:'shape1', 1:'shape2', ...】
		// console.log(Object.value(this.shapeBundle)) // 【0:'shape1', 1:'shape2', ...】




		// 🎮创建挡板元素
		const barElement = new BarElement(
			GameLoader.allData.playScene.barTexture,
			GameLoader.allData.playScene.barCornerTexture,
			// this.barTexture, 
			// this.barCornerTexture,
			{ from: { x: 100, y: this.app.screen.height - 300 }, to: { x: this.app.screen.width / 3, y: this.app.screen.height - 300 } }, //挡板元素的数据， 因为继承自 Character 类, 已经在基类中定义 posInfo 的动画！
		)
		this.sceneBox.addChild(barElement.element)




		// 🌟创建星星元素
		const goldenStar = new GoldenStar( GameLoader.allData.playScene.goldenStarTexture, //this.goldenStarTexture,
			// 🔥 使用封装的方法添加动画: 【第一步】, 把动画数据传递给封装的方法
			{ from: { x: this.app.screen.width, y: 100 }, to: { x: this.app.screen.width / 2 + 100, y: 500 } }, //挡板元素的数据
		)
		this.sceneBox.addChild(goldenStar.element)




		// 🔘创建底部 Start 按钮元素
		const startBtn = new StartBtn({
			// 这个只要传递动画数据就行了, 不用传递材质, 因为继承自 Character 类, 已经在基类中定义 posInfo 的动画！
			from: {
				x: this.app.screen.width / 2,
				y: this.app.screen.height + 100
			},
			to: {
				x: this.app.screen.width / 2,
				y: this.app.screen.height - 120
			}
		})
		this.sceneBox.addChild(startBtn.element)



		// 🧮创建计分牌元素
		const scoreText = new ScoreText({
			// 👇只要传递数据就好了, 因为在基类上已经定义了方法, 然后再在 scoreText 内部调用来做动画
			from: { x: this.app.screen.width / 2 + 50, y: this.app.screen.height + 100 },
			to: { x: this.app.screen.width / 2 + 50, y: this.app.screen.height - 76 } //this.app.screen.height 表示超出了窗口的高度
		})
		this.sceneBox.addChild(scoreText.element)


		// 👇保存下实例用来做游戏开始后【要退出去】跟【不要退出去, 单独做动画】的元素们
		this.allInstances.titleBox = titleBox
		this.allInstances.shapes = shapeArray
		this.allInstances.barElement = barElement
		this.allInstances.goldenStar = goldenStar
		this.allInstances.startBtn = startBtn
		this.scoreTextInstance = scoreText

		this.startBtnEvent() //执行一下 Start 按钮的事件（绑定事件)
	}
}