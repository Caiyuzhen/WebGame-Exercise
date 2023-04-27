// 基类, 提供公共的方法, 让子类继承 !!
// 父类也可以调用子类的原型方法 !!

export default class Character {
	constructor(posInfo) {
		// this.father = 'hey'
		// this.t() //可以调用子类的方法, 因为 this 指向子类实例, 是在定义的时候生成的, 而不是在实例化的时候生成的 !! 
		// 【⚡️原型链遮蔽问题⚡️】, 比如子类上定义的原型方法跟父类的原型方法【名称一模一样】, 此时优先【执行子类的原型方法】 !! 比如子类可以重新定义一些方法 !!
		this.posInfo = posInfo
	}

	// 👇定义一个方法, 在子类中去执行
	superInit() {
		console.log(this.element) //⚡️因为先执行父类再执行子类, 如果这个函数不在子类中去执行的话, 会 undefined !!【⚡️里边的 this 谁调用就指向谁】

		this.element.x = this.posInfo.from.x
		this.element.t = this.posInfo.from.y
		gsap.to(this.element, { //this 指向子类, 因为是子类调用的
			x: this.posInfo.to.x,
			y: this.posInfo.to.y,
			duration: 0.75
		})
 	}
}