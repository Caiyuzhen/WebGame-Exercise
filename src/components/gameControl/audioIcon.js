import { Sprite, Graphics } from '../../libs/pixijs.js'
const { sound } = PIXI


export default class AudioIcon {
	constructor(app) {
		this.element = Sprite.from('src/assets/icon/audio.png')
		this.isMuted = true
		this.app = app
		this.init()
	}


	init() {
		// 让元素显示在左下角
		this.element.anchor.set(0.5)
		this.element.x = 80
		this.element.y = this.app.screen.height - 60
		this.element.alpha = 0.6

		this.app.stage.addChild(this.element)


		// 创建遮罩层, 可以遮挡部分 audioIcon
		const mask = new Graphics()
		mask.beginFill(0xffffff)
		mask.drawRect(0, 0, 40, 40)
		mask.endFill()
		this.element.addChild(mask)

		// 设置 mask 为锚点中心
		this.element.pivot.set(17.5, 17.5)
		mask.x = -38
		mask.y = -15
		// mask.y = this.app.screen.height
		this.element.mask = mask

		this.setHoverEffect()
		this.setClickEffect()
	}


	// hover 效果
	setHoverEffect() {
		this.element.eventMode = 'static'
		this.element.addEventListener('pointerover', () => {
			this.element.alpha = 0.9
			document.body.style.cursor = 'pointer'
		})

		this.element.addEventListener('pointerout', () => {
			this.element.alpha = 0.6
			document.body.style.cursor = 'default'
		})
	}


	// 点击效果
	setClickEffect() { 
		this.element.addEventListener('pointerdown', () => {
			this.element.mask.x = this.element.mask.x === -25 ? -38 : -25 //👈用蒙版遮罩调了 icon 的声浪部分, 点击后位移一下, 就可以显示出来,【🔥🔥-25 表示显示了声浪元素, -38 表示隐藏了声浪元素】
		

			if(this.isMuted) {
				console.log('开启声音')
				sound.unmuteAll() //开启声音
			} else {
				console.log('关闭声音')
				sound.muteAll() //关闭声音
				// sound.pauseAll() 
			}
			this.isMuted = !this.isMuted
		})
	}
}