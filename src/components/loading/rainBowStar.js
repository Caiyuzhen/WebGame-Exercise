import { AnimatedSprite , Container } from "../../libs/pixijs.js"

export default class RainBowStar {
	constructor(rainbowStarSheetData) {
		this.rainbowStarSheetDataAll = rainbowStarSheetData
		// 用 AnimatedSprite 来创建小星星动画实例, 传入 AnimatedSprite 数据
		this.centerEye = new AnimatedSprite(rainbowStarSheetData.animations['center/center'])
		this.leftEye = new AnimatedSprite(rainbowStarSheetData.animations['left/left'])
		this.rightEye = new AnimatedSprite(rainbowStarSheetData.animations['right/right'])
		this.elementBox = new Container()  // 🔥用来保存所有小星星的实例 (左中右眨眼), 注意 Container 元素没有 anchor 属性, 需要通过 pivot 来设置
		this.init()
	}


	init() {
		this.elementBox.addChild(this.leftEye) // 🔥最终加载小星星
		// console.log('小星星数据', this.rainbowStarSheetDataAll)
		this.centerEye.animationSpeed = 0.2 // 设置小星星的动画
		this.centerEye.loop = false //不循环播放
		this.leftEye.animationSpeed = 0.2 // 设置小星星的动画
		this.leftEye.loop = false //不循环播放
		this.rightEye.animationSpeed = 0.2 // 设置小星星的动画
		this.rightEye.loop = false //不循环播放
		// this.elementBox.addChild(this.rightEye)
		this.autoWink() // 🔥随机眨眼睛
		this.elementBox.pivot.set(this.elementBox.width / 2, this.elementBox.height / 2) // 🔥设置中心点 (注意 Container 元素没有 anchor 属性, 需要通过 pivot 来设置)
		this.elementBox.scale.set(0.5, 0.5) // 缩放(⚡️注意先后顺序！先缩放再调整 pivot 的话, pivot 会被缩放！！)
		// this.elementBox.x = 200
		// this.elementBox.y = 200
	}

	

	// 随机眨眼睛的方法 (随机返回数组中的一个元素)
	autoWink() {
		const allWinks = [this.leftEye, this.rightEye, this.centerEye]
		const radomIndex = Math.floor(Math.random() * 3) // 实际时间, 获取一个随机值,  floor 向下取整, 0 1 2
		this.changeSysSprite(allWinks[radomIndex]) // 改变 elementBox 中的小星星的方法

		// 间隔时间
		const radomTime = Math.floor(Math.random() * 2 + 3) // 3 ~ 5

		// 每隔一段时间, 随机眨眼睛
		setTimeout(() => {//箭头函数 this 指向的是 RainBowStar 的实例
			this.autoWink()
			// console.log('眨眼了')
		},  radomTime * 1000) //毫秒数
	}


	// 播放小星星的方法
	changeSysSprite(animationAction) {
		this.elementBox.children[0].gotoAndStop(0) // 播放完后, 回到第 0 帧
		this.elementBox.removeChildren()  // 🔥先清空所有的小星星, 再添加一个新的小星星
		this.elementBox.addChild(animationAction)
		// console.log(this.elementBox.children)
		// this.elementBox.children[0].play() //方法一
		animationAction.play() //方法一
		animationAction.animationSpeed = 0.5  // 播放速度
	}
}