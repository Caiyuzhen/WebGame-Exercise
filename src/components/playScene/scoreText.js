import Character from "./character.js"
import { Text } from "../../libs/pixijs.js"



export default class ScoreText extends Character {
	constructor(posInfo) {
		super(posInfo)
		this.element = null
		this.init()
	}

	init() { 
		this.element = new Text( `0`, {
			fontFamily: 'RetroGaming',
			fontSize: 43,
			fill: 0xFFF4DE,
			letterSpacing: 2,
			align: 'center',
		})
		this.superInit()
	}
}