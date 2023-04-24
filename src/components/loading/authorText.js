import { Text, Graphics, Container } from '../../libs/pixijs.js'


export default class AuthorText {
	constructor() { 
		this.element = null //存放文字的容器
		this.init()
	}


	init() {
		// 前面一段文本
		const AuthorText = new Text('Simple Game playground & design by', {
			fontFamily: 'RetroGaming',
			fontSize: 22,
			fill: 0xffffff,
			letterSpacing: 2,
			align: 'center',
		})

		// 后面一段文本
		const HelloText = new Text('Hello Zeno', {
			fontFamily: 'RetroGaming',
			fontSize: 22,
			fill: 0xffffff,
			letterSpacing: 2,
			align: 'center',
		})

		const titleBox = new Container() // 创建一个容器
		titleBox.addChild(AuthorText, HelloText)
		HelloText.x = AuthorText.width //让 helloText 平移到 authorText 的后面

		this.element = titleBox // ⚡️ 让 this.element 指向 titleBox
		this.HelloText = HelloText;

		this.eleEvent(titleBox)
	}


	// 给元素添加交互事件
	eleEvent(ele) { //传入要 mousein 的元素
		// ele.interactive = true
		ele.eventMode = 'static'

		let intervalId = null

		// 鼠标移入标题
		ele.addEventListener('mouseenter', () => {
			const colors = [0xff0000, 0xff7f00, 0xffff00, 0x00ff00, 0x0000ff, 0x4b0082, 0x9400d3]

			let i = 0

			intervalId = setInterval( () => {
				// 循环变色
				this.HelloText.style.fill = colors[i]
				i = (i + 1) % colors.length // 应为上面 setInterval, 所以 i 会不断的 + 1 , 所以索引值就会不断的增加, 然后取余获取完所有颜色

			}, 200)
		})

		// 鼠标移出标题
		ele.addEventListener('mouseleave', () => {
			clearInterval(intervalId)
			// 取消循环变色
			this.HelloText.style.fill = 0x3c3c3c
			console.log('移出了')
		})


		// 添加点击事件
		this.HelloText.interactive = true
		this.HelloText.eventMode = 'static' //interactive 被废弃了
		this.HelloText.addEventListener('click', () => {
			// window.open('http://google.com') //有些浏览器会阻止 window.open
			window.location.href('http://google.com')
		})

		this.HelloText.addEventListener('mouseenter', () => {
			document.body.style.cursor = 'pointer' //改变鼠标样式
		})

		this.HelloText.addEventListener('mouseleave', () => {
			document.body.style.cursor = 'default' //改变鼠标样式
		})

		// ele.y = 300
	}
}