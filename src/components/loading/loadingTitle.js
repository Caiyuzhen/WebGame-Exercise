import { Container } from '../../libs/pixijs.js'
import RainBowStar from './RainBowStar.js' 

export default class LoadingTitle {
	constructor() {
		this.titleBox = new Container()
		this.init()
	}

	init() {
		const rainBowStar = new RainBowStar() //加载小星星
	}
}