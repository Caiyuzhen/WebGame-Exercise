import { Sprite } from "../../libs/pixijs.js"
import Character from "./character.js";

export default class GoldenStar extends Character {
	constructor(starTexture, posInfo) {
		super(posInfo)
		this.element = new Sprite(starTexture)

		// 🔥 使用封装的方法添加动画: 【第二步】, 定义位移动化的数据
		this.AnimationInfo = { //星星不断上下变化的效果
			keyframes: {
				'0%': { y: posInfo.to.y },
				'50%': { y: posInfo.to.y - 20 },
				'100%': { y: posInfo.to.y },
			},
			duration: 1.2,
			delay: Math.random(), //随机延迟
			ease: 'none',
			repeat: -1, //♾️ -1 表示无限循环
		}

		this.init()
	}



	// 🚗游戏开始后移动星星到指定位置的方法
	gameReadyToMoveStar() {
		gsap.to(this.element, {
			x: innerWidth / 2,
			y: innerHeight -50,
			duration: 0.75,
		})
	}




	init() {
		this.element.anchor.set(0.5)
		// 🔥 使用封装的方法添加动画: 【第三步】, 调用父类身上的方法, 获得 posInfo 数据并进行动画
		this.needAutoAnimation = true
		this.superInit()			 
	}
}
