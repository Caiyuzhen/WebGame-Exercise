import { Sprite } from "../../libs/pixijs.js"

export default class ShapeBox {
	constructor(texture, posInfo) {  //🔥🔥 texture 材质由上游传入！ posInfo 元素位置信息由上游传入！
		this.element = new Sprite(texture) //🔥🔥 实例化形状, 材质由上游传入！
		this.posInfo = posInfo //存一下, 下面的 init() 才能访问到！
		this.animationInfo = { //⚡️⚡️⚡️ GSAP 的帧动画数据
			keyframes: {
				'0%': { x: 1, y: 1 },
				'50%': { x: 1.2, y: 1.2 },
				'100%': { x: 1, y: 1 },
			},
			duration: 1.2,
			delay: Math.random(), //随机延迟
			ease: 'none',
			repeat: -1, //♾️ -1 表示无限循环
		}
		// console.log(posInfo) 
		this.init()
	}

	init() { 
		this.element.x = this.posInfo.x //🔥🔥 posInfo 元素位置信息由上游传入！
		this.element.y = this.posInfo.y //🔥🔥 posInfo 元素位置信息由上游传入！
		gsap.to(this.element.scale, this.animationInfo) //⚡️⚡️⚡️ GSAP 的帧动画 -> 【this.element.scale】 表示变化元素的 scale 属性,  【this.animationInfo】 表示要变化的参数
	}
}