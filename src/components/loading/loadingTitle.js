import { Container } from '../../libs/pixijs'
import RainBowStar from './rainBowStar.js'

export default class LoadingTitle {
	constructor() {
		this.titleBox = new Container()
	}

	init() {
		const rainBowStar = new RainBowStar()
	}
}