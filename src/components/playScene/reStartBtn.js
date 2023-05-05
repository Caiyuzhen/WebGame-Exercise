import Character from "./character.js"
import { Text } from '../../libs/pixijs.js'


export default class ReStartBtn extends Character {
	constructor(posInfo) { 
		super(posInfo)
		this.element = null

		this.colorVariation = null //字体变化颜色的动画

		this.init()
	}

	init() { 
		this.element = new Text('ReStart', {
			fontFamily: 'RetorGaming',
			fill: 0x641CFC,
			fontSize: 48,
			letterSpacing: 2,
			align: 'center',
			dropShadow: true,
			dropShadowColor: '#FF50E3',
			dropShadowDistance: 4,
		})

		//鼠标 hover 时, 让字体变化颜色
		this.element.eventMode = 'static'
		this.element.on('mouseover', () => {
			this.colorVariation = setInterval(() => {
				this.element.style.fill = Math.floor(Math.random() * 16777215)
			}, 200)
			document.body.style.cursor = 'pointer'
		})

		//鼠标离开时, 让字体恢复原来的颜色
		this.element.on('mouseout', () => {
			clearInterval(this.colorVariation)
			this.element.style.fill = 0x641CFC
			document.body.style.cursor = 'default'
		})
	
		this.superInit()
	}
}

