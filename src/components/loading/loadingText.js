import { Text } from '../../libs/pixijs.js'


// 加载态的文字
export default class LoadingText {
	constructor() { 
		this.element = new Text('loading...', { //统一用 element 来存放元素
			fontFamily: 'RetroGaming',
			fontSize: 18,
			fill: 0xffffff,
			letterSpacing: 2,
		})
		this.init()
	}
	
	// 每隔 500ms 触发一次改变 loading 文字的方法, 依次为 loading... -> loading -> loading. -> loading.. -> loading...
	autoChangeText() { 
		let count = 0
		const timer = setInterval( () => {
			if( count === 4 ) {
				count = 0
			}
			this.element.text = 'loading' + '.'.repeat(count) // 🔥🔥 .repeat 表示重复 count 个字符串
			count ++
		}, 500)

		return timer
	}

	init() {
		// this.element.pivot.set(this.element.width / 2, this.element.height / 2 )// 改变锚点
		// this.element.anchor.set(0.5)// 改变锚点方式二, 文字有 anchor 属性！如何设置为中心 0.5 的话, 就是文字的中心点, 但是加载 ... 会跳动
		this.autoChangeText()
	}
}