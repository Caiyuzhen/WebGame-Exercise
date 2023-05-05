import Character from "./character.js"
import { Text, Container } from '../../libs/pixijs.js'
import GameLoader from "../gameControl/gameLoader.js" //🔥加载游戏资源的方法
import RainBowStar from "../loading/rainBowStar.js"


// 游戏结束的标题
export default class GameOverTitle extends Character {
	constructor(posInfo) { 
		super(posInfo)
		this.element = new Container()
		this.init()
	}

	init() { 
		// const container = new Container()
		// 加载星星数据
		const rainBowStar = new RainBowStar(GameLoader.allData.loadingScene.rainbowStarSheetData)
		const gameOverText = new Text('Game Over', {
			fontFamily: 'RetorGaming',
			fill: 0xFFFFFF,
			fontSize: 82,
			letterSpacing: 2,
			align: 'center',
			dropShadow: true,
			dropShadowColor: '#DD5A5F',
		})

		// 把元素放在 container 中
		this.element.addChild(gameOverText, rainBowStar.elementBox)
		rainBowStar.elementBox.x = gameOverText.width / 2 // 👉👉注意, 星星的 ele 写成了 elementBox！！
		rainBowStar.elementBox.y = gameOverText.y // 👉👉注意, 星星的 ele 写成了 elementBox！！


		// 调用父类的方法 -> 用来实现动画
		this.superInit()
	}
	
}
