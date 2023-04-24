// ⚡️在最外层 js 加载数据
import { Application, Assets } from './src/libs/pixijs.js'
import LoadingSceneContainer from './src/components/loading/loadingSceneContainer.js'
import PlayScene from './src/components/playScene/playScene.js'


// 初始化画布
const app = new Application({
	resizeTo: window,
	resolution: window.devicePixelRatio || 1, //分辨率
	autoDensity: true, //自动适配分辨率
})


// 把画布添加到 DOM 上
document.body.appendChild(app.view)


// 加载字体
await Assets.load('src/assets/fonts/RetroGaming.ttf')
await Assets.load('src/assets/fonts/upheavtt.ttf')


// 加载文字蒙版
const gameBlockTextTexture = await Assets.load('src/assets/titleTextures/blockText.png')
const rainbowColorTexture = await Assets.load('src/assets/titleTextures/rainbowColor.png')


// 🌟加载小星星的数据
const sheet = await Assets.load('src/assets/raibowStarSheet/rainbowStar.json')
// console.log(sheet)


// ⚡️传入小星星数据数据、画布数据
// const loadingSceneContainer = new LoadingSceneContainer(sheet, app) //传入画布（app, 然后下层去计算画布的宽高, 把元素放在画布中心）


const playScene = new PlayScene({gameBlockTextTexture, rainbowColorTexture}, app) //👈传一个对象的方式
app.stage.addChild(playScene.sceneBox)


// app.stage.addChild(loadingSceneContainer.sceneBox)