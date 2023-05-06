import Character from "./character.js"
import { Text } from '../../libs/pixijs.js'
import Control from '../gameControl/control.js'


export default class ReStartBtn extends Character {
	constructor(posInfo) { 
		super(posInfo)
		this.element = null

		this.colorVariation = null //字体变化颜色的动画

		this.init()
	}

	init() { 
		this.element = new Text('ReStart', {
			fontFamily: 'RetroGaming',
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
	


		// 👋点击重新开始游戏, 核心是执行 control 里边的 gameStar() 方法
		this.element.on('pointerdown', () => {
			Control.gameStar()
		})

		this.superInit()
	}
}

