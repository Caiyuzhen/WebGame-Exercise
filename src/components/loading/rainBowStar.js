import { AnimatedSprite , Container } from "../../libs/pixijs.js"


export default class RainBowStar {
	constructor(rainbowStarSheetData) {
		this.rainbowStarSheetDataAll = rainbowStarSheetData
		// 用 AnimatedSprite 来创建小星星动画实例, 传入 AnimatedSprite 数据
		this.centerEye = new AnimatedSprite(rainbowStarSheetData.animations['center/center'])
		this.leftEye = new AnimatedSprite(rainbowStarSheetData.animations['left/left'])
		this.rightEye = new AnimatedSprite(rainbowStarSheetData.animations['right/right'])
		// 🔥用来保存所有小星星的实例
		this.elementBox = new Container() 
		this.init()
	}

	init() {
		// 🔥最终加载小星星
		this.elementBox.addChild(this.centerEye)
		// console.log('小星星数据', this.rainbowStarSheetDataAll)
		// 🔥添加小星星的动画
		this.centerEye.play()
	}
}