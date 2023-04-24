import { Container, Sprite, TilingSprite } from "../../libs/pixijs.js"


export default class titleBox {
	constructor({gameBlockTextTexture, rainbowColorTexture}, ticker) {
		this.element = new Container() //一样, 也是一个总的容器
		this.gameBlockTextTexture = gameBlockTextTexture //存一下材质
		this.rainbowColorTexture = rainbowColorTexture //存一下材质
		this.ticker = ticker //🔥🔥存一下 app.ticker, 用于下游的动画效果！！
		console.log(this.gameBlockTextTexture);
		this.init()
	}

	init() { 
		// ✴️ 文字
		const gameBlockText = new Sprite(this.gameBlockTextTexture) //把材质传递给 Sprite
		this.element.addChild(gameBlockText)

		// 🌈🌈 TilingSprite 可以把材质进行平铺, 传入三个参数 (材质, 宽度, 高度)
		const rainbowTextureLayer = new TilingSprite(this.rainbowColorTexture, this.gameBlockTextTexture.width, this.gameBlockTextTexture.height * 2) 
		this.element.addChild(rainbowTextureLayer)

		// 🔗 打一个组
		const gameTitleBox = new Container()
		gameTitleBox.addChild(rainbowTextureLayer, gameBlockText)
		this.element.addChild(gameTitleBox)
		
		// 🌫️ 蒙版效果
		rainbowTextureLayer.mask = gameBlockText

		// 🚗 动画效果
		// 🔥🔥 箭头函数, 里面的 this 指向外层的 this, 也就是指向 titleBox 的实例, 也就是【可以访问到 titleBox 实例上的属性跟方法】, 所以下面就不用写很多 this！！
		this.ticker.add(() => { 
			// 🌈让彩虹移动的方法一:
			// rainbowTextureLayer.y += 2
			// if(rainbowTextureLayer.y > 0) {
			// 	rainbowTextureLayer.y = - gameTitleBox.height //🌈🌈让彩虹移动到文字的最上边！
			// }

			// 🌈让彩虹移动的方法二: 用 TilingSprite 身上的 tilePosition 方法!! 因为 rainbowTextureLayer 是通过 TilingSprite 实例化出来的!!
			rainbowTextureLayer.tilePosition.y += 2 //🌈🌈让彩虹移动到文字的最上边！
		})
	}
}