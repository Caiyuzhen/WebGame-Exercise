// ⚡️在最外层 js 加载数据
import { Application, Assets } from './src/libs/pixijs.js'
import LoadingScene from './src/components/loading/loadingScene.js'


// 初始化画布
const app = new Application({
	resizeTo: window,
	resolution: window.devicePixelRatio || 1, //分辨率
	autoDensity: true, //自动适配分辨率
})

// 把画布添加到 DOM 上
document.body.appendChild(app.view)


// 🌟加载小星星的数据
const sheet = await Assets.load('src/assets/raibowStarSheet/rainbowStar.json')
// console.log(sheet)

// ⚡️传入小星星数据数据
const loadingScene = new LoadingScene(sheet)

app.stage.addChild(loadingScene.sceneBox)