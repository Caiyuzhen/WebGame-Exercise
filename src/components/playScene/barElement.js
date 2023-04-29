import Character from './character.js'
import { Container, Sprite } from "../../libs/pixijs.js"


export default class barElement extends Character {
	constructor(barTexture, barCornerTexture, posInfo) { //posInfo 来自 playScene
		super(posInfo) // 🚀🚀 在下边 this.superInit() 调用一下 【基类】的方法 +  【super()】 并传入 posInfo 就可以给元素加上动画了
		this.element = new Container() //组合成挡板的容器
		this.barTexture = barTexture
		this.barCornerTexture = barCornerTexture

		this.AnimationInfo = {// bar 自动动的动画
			keyframes: {
				'0%': { x: this.posInfo.to.x }, //x: this.posInfo.to.x 表示初始化时进入到的位置
				'50%': { x: this.posInfo.to.x - 100 },
				'100%': { x: this.posInfo.to.x },
			},
			duration: 2,
			delay: Math.random(), //随机延迟
			ease: 'none',
			repeat: -1, //♾️ -1 表示无限循环
		}
		this.init()
	}

	init() {
		this.needAutoAnimation = true// 因为父类上有个【🔒动画锁】, 所以要 true 一下

		const centerBar = new Sprite(this.barTexture)
		const leftSide = new Sprite(this.barCornerTexture)
		const rightSide = new Sprite(this.barCornerTexture)
		this.element.addChild(centerBar, leftSide, rightSide)
		leftSide.anchor.set(0.5) //Sprite 有 anchor 属性
		leftSide.angle = 180 //旋转 180 度
		leftSide.x = leftSide.width / 2  // 移入一点
		leftSide.y = leftSide.height / 2 // 移入一点
		centerBar.x = leftSide.width
		rightSide.x = centerBar.width + rightSide.width / 2

		// 🚀🚀 调用一下 【基类】的方法 + 上边 【super()】 并传入 posInfo 就可以给元素加上动画了
		this.superInit()
	}
}