import { Sprite } from "../../libs/pixijs.js"
import Character from "./character.js"

export default class ShapeBox extends Character {
	constructor(texture, posInfo) {  //🔥🔥 texture 材质由上游传入！ posInfo 元素位置信息由上游传入！

		// 👇把 posInfo 数据传递给父类, 让父类处理小元素移动的逻辑
		super(posInfo) //👈👈记得一定要 super() 一下!! 要写在最前面!! 相当于去调用 character() 的构造函数!! 如果给 super() 传递数据那么就是给父类传递数据!!
		this.element = new Sprite(texture) //🔥🔥 实例化形状, 材质由上游传入！
		// this.posInfo = posInfo //存一下, 下面的 init() 才能访问到！【⚡️后面改造成用父类去接这个数据了!⚡️】

		this.autoAnimationType = 'scale' //用来在基类里边判断是【缩放动画】还是【位移动画】
		this.AnimationInfo = { //⚡️⚡️⚡️ GSAP 的帧动画数据 (定义元素的动画, 名字叫 AnimationInfo) ⚠️注意, 这个名称在 barElement 也会用到！
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
		this.needAutoAnimation = true //🚀🚀用于让父元素判断是否需要添加缩放动画（这个属性修改的是父类的属性!）
		console.log(this.needAutoAnimation) //打印的是父类的属性, 被子类修改了
		this.element.x = this.posInfo.x //🔥🔥 posInfo 元素位置信息由上游传入！
		this.element.y = this.posInfo.y //🔥🔥 posInfo 元素位置信息由上游传入！
		// gsap.to(this.element.scale, this.AnimationInfo) //⚡️⚡️⚡️ GSAP 的帧动画 -> 【this.element.scale】 表示变化元素的 scale 属性,  【this.AnimationInfo】 表示要变化的参数
		this.superInit() //【⚡️执行父类的动画方法, 里边的 this 谁调用就指向谁】
	}

	// t() {
		// console.log('hey, 这是子类的方法')
	// }
}