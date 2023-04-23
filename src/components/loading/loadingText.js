import { Text } from '../../libs/pixijs.js'


// 加载态的文字
export default class LoadingText {
	constructor() { 
		this.element = new Text('loading...', {
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
		this.autoChangeText()
	}
}