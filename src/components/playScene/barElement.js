import Character from './character.js'
import { Container, Sprite } from "../../libs/pixijs.js"
import Control from '../gameControl/control.js'


export default class barElement extends Character {
	constructor(barTexture, barCornerTexture, posInfo) { //posInfo 来自 playScene
		super(posInfo) // 🚀🚀 在下边 this.superInit() 调用一下 【基类】的方法 +  【super()】 并传入 posInfo 就可以给元素加上动画了
		this.element = new Container() //组合成挡板的容器
		this.barTexture = barTexture
		this.barCornerTexture = barCornerTexture
		
		this.canBeDrag = false //👋是否被拖拽
		this.pointDownPos = {} //👋鼠标点击后拖拽 bar 的距离
		this.barCenter = null //👋 bar 的实例(中间)
		this.leftSideBar = null // 👋 bar 的实例(左侧)
		this.rightSideBar = null // 👋 bar 的实例(右侧)

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



	// 👋 拖拽 Bar 的方法
	setUpDrag() { 
		this.element.eventMode = 'static'

		// 移入
		this.element.addEventListener('pointerover', () => { //鼠标移入后触发一次
			if(Control.gameIsStart) { //👈👈利用记录在 Control 身上的数据做判断！！
				document.body.style.cursor = 'grab' //抓手形式
			}
		})


		// 按下
		this.element.addEventListener('pointerdown', (e) => { //e 为 pixi.js 自己封装的事件, 跟原生的 DOM 不一样
			if(Control.gameIsStart) { //👈👈利用记录在 Control 身上的数据做判断！！
				this.canBeDrag = true
				this.pointDownPos.x = e.client.x //按下去的初始位置, 🔋 通过 .XXX 的方式存入上边的 {}  对象
				this.pointDownPos.y = e.client.y //按下去的初始位置, 🔋 通过 .XXX 的方式存入上边的 {}  对象
				// console.log('按下去的初始位置', this.pointDownPos)
				document.body.style.cursor = 'grab' //抓手形式
			}
		})


		// 移动
		this.element.addEventListener('globalpointermove', (e) => { //🔥 🔥 globalpointermove 表示整个页面上的鼠标移动都可以被监听到！！
			if(this.canBeDrag) {
				// 记录位移的距离
				const delayX = e.client.x - this.pointDownPos.x // 移动距离 - 按下的距离
				this.element.x += delayX // 让 bar 移动到对应的位置
				// 更新坐标
				this.pointDownPos = {
					x: e.client.x, //新位置
					y: e.client.y, //新位置
				}

				// 🔥判断 bar 是否超出边界 (超出自身的一半)
				if(this.element.x < this.element.width / 2) { //超出左边界
					this.element.x = this.element.width / 2
				} else if (this.element.x > innerWidth - this.element.width / 2) { //超出右边界
					this.element.x = innerWidth - this.element.width / 2
				}
			}
		})


		// 抬起
		this.element.addEventListener('pointerup', (e) => { // pointerup 只有在【元素上】放开才有效
			this.canBeDrag = false
			document.body.style.cursor = 'default' //抓手形式
		})

		this.element.addEventListener('pointerupoutside', (e) => { // pointerupoutside 在【元素外】放开都有效
			this.canBeDrag = false
			document.body.style.cursor = 'default' //抓手形式
		})


		// 移出
		this.element.addEventListener('pointerout', () => { //鼠标移入后触发一次
			if(!this.canBeDrag) {
				document.body.style.cursor = 'default' //抓手形式
			}
		})
	}



	// 💥 缩短 bar 的方法 (就是处理 bar 实例)
	shortenBar() {
		if(Control.gameIsStart) {
			// bar 的实例, 缩短中间的线
			gsap.to(this.barCenter, {
				width: this.barCenter.width - 40,
				duration: 0.35,
			})

			// bar 的实例, 缩短左侧的线, 记得都先设置一下中心点 anchor !
			gsap.to(this.leftSideBar, {
				x: this.leftSideBar.x + 20, //往右边移 20
				duration: 0.35,
			})

			// bar 的实例, 缩短右侧的线, 记得都先设置一下中心点 anchor !
			gsap.to(this.rightSideBar, {
				x: this.rightSideBar.x - 20, //往左边移 20
				duration: 0.35,
			})
		}
	}



	init() {
		this.needAutoAnimation = true// 因为父类上有个【🔒动画锁】, 所以要 true 一下

		const centerBar = new Sprite(this.barTexture)
		const leftSide = new Sprite(this.barCornerTexture)
		const rightSide = new Sprite(this.barCornerTexture)
		this.element.addChild(centerBar, leftSide, rightSide)

		centerBar.anchor.set(0.5) //Sprite 有 anchor 属性
		leftSide.anchor.set(0.5) //Sprite 有 anchor 属性
		rightSide.anchor.set(0.5) //Sprite 有 anchor 属性

		leftSide.angle = 180 //旋转 180 度
		// leftSide.x = leftSide.width / 2  + centerBar.width / 2// 移入一点
		// leftSide.y = leftSide.height / 2 // 移入一点
		// 👇因为都是在一个 Group 内, 并且 anchor 都位于中心!! 所以位移的话就相对于 Container !!
		
		// 👇下面都是为了让整个 bar 的中心点在中间, 居中对齐
		leftSide.x = leftSide.width / 2
		leftSide.y = leftSide.height / 2
		centerBar.x = leftSide.width / 2  + centerBar.width / 2
		centerBar.y = centerBar.height / 2
		rightSide.x = leftSide.width + centerBar.width
		rightSide.y = rightSide.height / 2

		// 设置整体的中心锚点 (目的是为了 globalpointermove 事件内判断 bar 拖拽是否超过一半)
		this.element.pivot.set(this.element.width / 2, this.element.height / 2)



		this.setUpDrag()

		this.barCenter = centerBar //保存下 bar 实例
		this.leftSideBar = leftSide //保存下 bar 实例
		this.rightSideBar = rightSide //保存下 bar 实例


		// 👇看看效果
		// this.element.eventMode = 'static'
		// this.element.addEventListener('click', () => {
		// 	this.shortenBar()
		// })


		// 🚀🚀 调用一下 【基类】的方法 + 上边 【super()】 并传入 posInfo 就可以给元素加上动画了
		this.superInit()
	}
}