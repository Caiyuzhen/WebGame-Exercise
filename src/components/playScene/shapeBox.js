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


		// 👇游戏开始后小元素飞入画面的一些数据
		this.isMoving = false
		this.direction = 0 //运行方向
		this.speed = 12
		this.x = null
		this.y = null
		this.vx = 0 //运行速度值
		this.vy = 0 //运行速度值
		this.shapeIsInArea = false //元素是否进入了游戏区域内
		this.shapeIsOut = false //元素是否进入了挡板下方

		// console.log(posInfo) 
		this.init()
	}


	// 👋把小元素汇集起来的方法
	shapeRandomReady() { 
		const randomX = Math.random() * innerWidth / 2 + innerWidth / 4 //要随机分布到视窗中央, Math.random() 随机返回 0~1 , innerWidth / 2 + innerWidth / 4 表示从 1 /4 处开始到 1 / 2 处), 因为 innerWidth / 4 表示视窗的 1 / 4 处
		this.element.x = randomX
		this.element.y = -50 //先放在窗口上方 -50 处

		// 随机取一个 45 - 135 度的角度值
		const randomAngle = Math.random() * 90 + 45

		// 转化成弧度值
		const randomRadian = randomAngle * Math.PI / 180

		this.direction = randomRadian //把弧度值赋值给运行方向

		this.x = this.element.x // 中间临时值, 用于计算
		this.y = this.element.y // 中间临时值, 用于计算
	}


	// 👀哪个小元素调用这个方法, 就把那个小元素进行移动到指定位置
	oneStep() {
		this.isMoving = true
		this.vx = this.speed * Math.cos(this.direction) // 先计算出 x 轴的速度值
		this.vy = this.speed * Math.sin(this.direction) // 先计算出 y 轴的速度值
		this.x += this.vx // 持续的运动
		this.y += this.vy // 持续的运动
		this.element.x = this.x
		this.element.y = this.y
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