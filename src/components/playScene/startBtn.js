import { Text } from "../../libs/pixijs.js"
import Character from "./character.js"


export default class StartBtn extends Character {
	constructor(posInfo) {
		super(posInfo)
		this.element = new Text('Start', {
			fontFamily: 'RetroGaming',
			fontSize: 48,
			fill: 0x183BF5,
			align: 'center',
			dropShadowColor: '#FF32C6',
			dropShadow: true,
			dropShadowDistance: 6,
			letterSpacing: 4, // 字间距
		})


		this.colorInterval = null// 🔥自动变化颜色的计时器

		this.init()
	}
	
	init() {
		this.superInit()
		// this.element.anchor.set(0.5)
		// 👇鼠标 hover 上去后, 颜色不断改变
		this.element.eventMode = 'static'
		this.element.on('mouseover', () => {
			this.colorInterval = setInterval(() => {
				this.element.style.fill = Math.floor(Math.random() * 16777215) //Math.floor 就是取整, random 是 0-1 之间的小数, 乘以 16777215 就是 0xffffff, 相当于在不断的变化颜色
				this.element.style.dropShadowColor = Math.floor(Math.random() * 16777215) //Math.floor 就是取整, random 是 0-1 之间的小数, 乘以 16777215 就是 0xffffff, 相当于在不断的变化颜色
			}, 200)

			document.body.style.cursor = 'pointer'
		})

		// 👇鼠标 hover 离开后, 颜色停止改变
		this.element.on('mouseout', () => {
			clearInterval(this.colorInterval)
			this.element.style.fill = 0x183BF5

			document.body.style.cursor = 'default'
		})
	}
}