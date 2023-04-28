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


// 👇统一引入材质 ————————————————————————————————————————
// 加载字体
await Assets.load('src/assets/fonts/RetroGaming.ttf')
await Assets.load('src/assets/fonts/upheavtt.ttf')


// 加载文字蒙版
const gameBlockTextTexture = await Assets.load('src/assets/titleTextures/blockText.png')
const rainbowColorTexture = await Assets.load('src/assets/titleTextures/rainbowColor.png')
const chnText = await Assets.load('src/assets/titleTextures/dang.png')


// 打包加载所有点缀图片
Assets.addBundle('shapes', {
	shape1: 'src/assets/shapes/shape1.png',
	shape2: 'src/assets/shapes/shape2.png',
	shape3: 'src/assets/shapes/shape3.png',
	shape4: 'src/assets/shapes/shape4.png',
	shape5: 'src/assets/shapes/shape5.png',
	shape6: 'src/assets/shapes/shape6.png',
	shape7: 'src/assets/shapes/shape7.png',
	shape8: 'src/assets/shapes/shape8.png',
})
const shapeBundle = await Assets.loadBundle('shapes') //👈 loadBundle ！不是 load !
console.log('shapeBundle:', shapeBundle)


// 🌟加载小星星的数据
const sheet = await Assets.load('src/assets/raibowStarSheet/rainbowStar.json')
// console.log(sheet)


// ⚡️传入小星星数据数据、画布数据
// const loadingSceneContainer = new LoadingSceneContainer(sheet, app) //传入画布（app, 然后下层去计算画布的宽高, 把元素放在画布中心）

// 🎮挡板元素
const barTexture = await Assets.load('src/assets/barElements/barBlock.png')
const barCornerTexture = await Assets.load('src/assets/barElements/barCorner.png')

const playScene = new PlayScene({gameBlockTextTexture, rainbowColorTexture, chnText, shapeBundle, barTexture, barCornerTexture}, app) //👈传一个对象的方式
app.stage.addChild(playScene.sceneBox)


// app.stage.addChild(loadingSceneContainer.sceneBox)