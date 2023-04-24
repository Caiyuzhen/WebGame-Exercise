import { Container, Graphics } from "../../libs/pixijs.js"


export default class LoadingBar {
	constructor() { 
		this.element = new Container()
		this.num = 24 // 定义小方块的数量 3 * 8
		this.colors = [0xDC2B01, 0xF37E15, 0xFCD633, 0x63DC15, 0x41A4F5, 0x19227D, 0x663AB8, 0xA123B0] // 定义八种颜色
		this.init()
	}

	init() { 
		this.createRects()
		// this.element.x = 100
		// this.element.y = 260
	
		const obj = {
			number: 0
		}

		// 检验一下进度条的动画
		gsap.to(obj, {
			number: 100,
			duration: 3,
			onUpdate: () => {
				this.barUpdate(obj.number)
				console.log('3秒加载完')
			}
		})

		// 🔥设置进度条的中心锚点
		this.element.pivot.set(this.element.width / 2, this.element.height / 2)
	}

	createRects() {  //创建 24 个小方块
			for(let i = 0; i < this.num; i++) {
			const rect = new Graphics()
			rect.beginFill(0x3c3c3c)
			rect.drawRect(0, 0, 6, 6)
			rect.endFill()
			rect.x = i * 12 // 12 为小方块的位置, 根据自己的位置递增
			this.element.addChild(rect)
		}
	}

	// 后续根据资源加载的进度来更新进度条
	barUpdate(progress) { // 进度条更新（变为彩色）, progress 为加载进度
		for(let i = 0; i < this.num; i ++) { // 🔥 循环所有小方块
			const bar = this.element.children[i] // 获取每个小方块

			if(i <= progress / 100 * this.num) { // 🔥 如果当前小方块的索引小于等于加载进度的百分比, 所有都循环到则是 24 
				bar.beginFill(this.colors[ i % this.colors.length ] ) // 🔥 i % this.colors.length 表示 i 除以 8 的余数, 也就是 0 - 7
			} else {
				bar.beginFill(0x3c3c3c) // 绘制默认的灰色色块
			}

			bar.drawRect(0, 0, 6, 6) //绘制方形
			bar.endFill()
		}
	}
}