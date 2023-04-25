import { Container } from "../../libs/pixijs.js"
import TitleBox from './titleBox.js'


export default class PlayScene {
	/* constructor 跟 init() 是平层的关系, 要访问需要通过 this (指向实例) 中介
		作用域是根据【函数定义】的地方, 而不是【函数被调用】的地方
	*/
	constructor({gameBlockTextTexture, rainbowColorTexture, chnText}, app) { //🔥用解构赋值的方式来传递数据, 解构的【⚡️名称】必须一致 !!! 解构的【⚡️顺序】可以不一致 !!!
		// 👇存放游戏场景的 box
		this.sceneBox = new Container()
		this.gameBlockTextTexture = gameBlockTextTexture //承接文字材质
		this.rainbowColorTexture = rainbowColorTexture //承接彩虹材质
		this.chnText = chnText
		this.app = app //🔥要存到实例上才能传递给下游使用！
		this.init()
	}

	init() {
		// 标题组件
		const titleBox = new TitleBox({ //🔥🔥把材质、app.ticker 两个参数再传递给 titleBox 下游!!
			gameBlockTextTexture: this.gameBlockTextTexture,  //因为要用 this.XXX 来赋值, 所以要用这种写法
			rainbowColorTexture: this.rainbowColorTexture,   //因为要用 this.XXX 来赋值, 所以要用这种写法
			chnText: this.chnText //因为要用 this.XXX 来赋值, 所以要用这种写法！
		}, this.app.ticker)  //🔥🔥第二个参数传递 app.ticker, 用于下游的动画效果！！

		titleBox.element.x = this.app.screen.width / 2
		titleBox.element.y = this.app.screen.height / 2
		this.sceneBox.addChild(titleBox.element)
	}
}