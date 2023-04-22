// ⚡️在最外层 js 加载数据
import { Application } from './src/libs/pixijs.js'
import LoadingScene from './src/components/loading/loadingScene.js'


// 初始化画布
const app = new Application({
	resizeTo: window,
	resolution: window.devicePixelRatio || 1, //分辨率
	autoDensity: true, //自动适配分辨率
})

// 把画布添加到 DOM 上
document.body.appendChild(app.view)
console.log(LoadingScene)