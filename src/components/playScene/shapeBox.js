import { Sprite } from "../../libs/pixijs.js"
import Character from "./character.js"

export default class ShapeBox extends Character {
	constructor(texture, posInfo) {  //🔥🔥 texture 材质由上游传入！ posInfo 元素位置信息由上游传入！

		// 👇把 posInfo 数据传递给父类, 让父类处理小元素移动的逻辑
		super(posInfo) //👈👈记得一定要 super() 一下!! 要写在最前面!! 相当于去调用 character() 的构造函数!! 如果给 super() 传递数据那么就是给父类传递数据!!
		this.element = new Sprite(texture) //🔥🔥 实例化形状, 材质由上游传入！
		// this.posInfo = posInfo //存一下, 下面的 init() 才能访问到！【⚡️后面改造成用父类去接这个数据了!⚡️】
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
		// gsap.to(this.element.scale, this.animationInfo) //⚡️⚡️⚡️ GSAP 的帧动画 -> 【this.element.scale】 表示变化元素的 scale 属性,  【this.animationInfo】 表示要变化的参数
		this.superInit() //【⚡️执行父类的方法, 里边的 this 谁调用就指向谁】
	}

	// t() {
		// console.log('hey, 这是子类的方法')
	// }
}