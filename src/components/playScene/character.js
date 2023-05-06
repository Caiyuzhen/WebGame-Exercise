// 基类, 提供公共的方法, 让子类继承 !!
// 父类也可以调用子类的原型方法 !!

export default class Character {
	constructor(posInfo) {
		// this.father = 'hey'
		// this.t() //可以调用子类的方法, 因为 this 指向子类实例, 是在定义的时候生成的, 而不是在实例化的时候生成的 !! 
		// 【⚡️原型链遮蔽问题⚡️】, 比如子类上定义的原型方法跟父类的原型方法【名称一模一样】, 此时优先【执行子类的原型方法】 !! 比如子类可以重新定义一些方法 !!
		this.posInfo = posInfo
		this.needAutoScaleAnimation = false //控制子元素是否需要缩放动画(比如小元素需要, 大标题不需要)
		this.isPlayLoopAnimation = null
	}




	// 👇定义一个方法, 在子类中去执行, 不然访问不到 element ！【🔥🔥🔥在子类中分别都调用 this.superInit() !!! 通过原型链访问到基类的方法】
	superInit() {
		// console.log(this.element) //⚡️因为先执行父类再执行子类, 如果这个函数不在子类中去执行的话, 会 undefined !!【⚡️里边的 this 谁调用就指向谁】


		// ⚡️⚡️让所有子元素的锚点都位于中心
		if(this.anchor) {
			this.anchor.set(this.anchor.x, this.anchor.y) //this.anchor.x 表示锚点的 x 坐标, this.anchor.y 表示锚点的 y 坐标
		} else {
			this.element.pivot.set(this.element.width / 2, this.element.height / 2) //this.element.width 表示元素的宽度, this.element.height 表示元素的高度
		}


		// this.moveShowUpEle() // 🚄 方便动画控制触发的时机 ——————————————————————————————————————————————————————————————
		// 👇👇👇 每个 this.element 指向各自的子类, 因为被不同的子类分别调用了!!!
		this.element.alpha = 0//🔥🔥🔥 做透明度的动画 !! 因为子类继承了父类, ⚡️⚡️⚡️ 并且 superInit() 是在子类中调用的, 所以 【this.element 就统一指向子类!!】
		this.element.x = this.posInfo.from.x
		this.element.t = this.posInfo.from.y

		// 👆元素已经在场景里了, 但是加载进度还没走完, 所以先不出现 ——————————————————————————————————————————————————————————————
		// this.element.x = this.posInfo.from.x
		// this.element.t = this.posInfo.from.y
		// gsap.to(this.element, { //this 指向子类, 因为是子类调用的
		// 	x: this.posInfo.to.x,
		// 	y: this.posInfo.to.y,
		// 	duration: 0.75
		// })
 	}




	// 📦封装的方法 (🔥🔥🔥相当于子类只要传数据就行了, 不同重新定义方法！)
	/* 【🧠思路】
			1.子类继承父类
			2.父类定义方法，this.XXX 的形式进行定义, 如 superInit()
			3.子类调用父类的此方法
			4.父类定义动画函数, 子类接收 playScene() 那边统一管理的数据
			5.最终子类可以被统一修改到
	*/

	// 🚄 【👀统一显示元素】方便动画控制触发的时机, 在子类中调用就能显示出元素
	moveShowUpEle() {
		// // 👇👇👇 每个 this.element 指向各自的子类, 因为被不同的子类分别调用了!!!
		// this.element.alpha = 0//🔥🔥🔥 做透明度的动画 !! 因为子类继承了父类, ⚡️⚡️⚡️ 并且 superInit() 是在子类中调用的, 所以 【this.element 就统一指向子类!!】
		// this.element.x = this.posInfo.from.x
		// this.element.t = this.posInfo.from.y

		gsap.to(this.element, { //this 指向子类, 因为是子类调用的
			x: this.posInfo.to.x,
			y: this.posInfo.to.y,
			alpha: 1,
			duration: 0.75,
			onComplete: () => { //动画完成后触发
				if(this.needAutoAnimation) {
					this.isPlayLoopAnimation = gsap.to( //👈用 isPlayLoopAnimation 来承接一些 gsap 的方法, 以便后续控制
						// 在子类中添加了一个 'scale' 属性用于判断是否应该执行缩放动画
						this.autoAnimationType === 'scale' ? this.element.scale : this.element, 
						this.AnimationInfo // 位置动画一定会执行（🔥🔥在子类中 barElement 、 shapeBox 都有定义 AnimationInfo 动画！）
					)
				}
			}
		})
	}


	// 🚄 【👀统一隐藏元素】
	hideOff() {
		// 先暂停再移开元素
		if(this.isPlayLoopAnimation) {
			// this.isPlayLoopAnimation.pause() //👈停止元素自动变化的效果 kill() 完全清除, pause() 暂停
			this.isPlayLoopAnimation.kill() //👈停止元素自动变化的效果 kill() 完全清除, pause() 暂停
		}

		console.log(this)
		if( //判断实例上是否有 gameReadyToMoveStar() 方法, 是的话则执行 (目的是排除掉 🌟 星星, 星星单独移动到最下边, this 指向子类)
			this.gameReadyToMoveStar &&
			typeof this.gameReadyToMoveStar === 'function'
		) { 
			console.log('是星星')
			this.gameReadyToMoveStar()
		} else {
			gsap.to(this.element, {
				x: this.posInfo.from.x, // from 就是回去
				y: this.posInfo.from.y, // from 就是回去
				// alpha: 0,
				duration: 0.75,
				// onComplete: () => { //🤚停止元素自动变化的效果
				// 	if(this.isPlayLoopAnimation) {
				// 		this.isPlayLoopAnimation.pause() //👈停止元素自动变化的效果 kill() 完全清除, pause() 暂停
				// 	}
				// }
			})
		}
	}



	// 🏆显示记分结果【星星】、【分数】
	showOverResult() { 
		gsap.to(this.element, {
			y: this.element.y - 600, //游戏结束后, 【星星】、【分数】 向上位移
			duration: 0.75,
		})
	}

	
}