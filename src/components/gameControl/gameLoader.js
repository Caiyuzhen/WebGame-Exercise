/* 	
	核心是实现两个场景的资源加载, 加载的类不需要被实例化, 直接调用静态方法即可
		loadScene (星星进度条)
		playScene
			playScene 场景内的资源加载要与进度条进行联动
*/

import { Assets } from '../../libs/pixijs.js'

export default class GameLoader {
	// 🌟 整理所有要加载的数据 (通过静态属性去整理, 其他地方可以通过类名直接调用)
	static data = {
		// 加载场景资源
		loadScene: {
			// 先进行单个资源单个资源的加载(字体, 图片等)
			singles: [
				{ name: 'RetroGaming', path: 'src/assets/fonts/RetroGaming.ttf' },
				{ name: 'upheavtt', path: 'src/assets/fonts/upheavtt.ttf' },
				{ name: 'rainbowStarSheetData', path: 'src/assets/rainbowStarSheet/rainbowStar.json' }
			]
		},
		// 游戏场景资源
		playScene: {
			// 先进行单个资源单个资源的加载(字体, 图片等)
			singles: [
				{ name: 'gameBlockTextTexture', path: 'src/assets/titleTextures/blockText.png' },
				{ name: 'rainBowColorTexture', path: 'src/assets/titleTextures/rainbowColor.png' },
				{ name: 'chnTextTexture', path: 'src/assets/titleTextures/dang.png' },
				{ name: 'barTexture', path: 'src/assets/barElements/barBlock.png' },
				{ name: 'barCornerTexture', path: 'src/assets/barElements/barCorner.png' },
				{ name: 'goldenStarTexture', path: 'src/assets/barElements/goldenStar.png' },
			],
			// 然后进行序列帧资源的加载
			bundles: [
				{
					name: 'shapesBundle',
					paths: {
						shape1: 'src/assets/shapes/shape1.png',
						shape2: 'src/assets/shapes/shape2.png',
						shape3: 'src/assets/shapes/shape3.png',
						shape4: 'src/assets/shapes/shape4.png',
						shape5: 'src/assets/shapes/shape5.png',
						shape6: 'src/assets/shapes/shape6.png',
						shape7: 'src/assets/shapes/shape7.png',
						shape8: 'src/assets/shapes/shape8.png',
					}
				}
			]
		}
	} 

	static basicProgress = 0 //基础加载进度（真实）
	static finalProgress = 0 //减速后的进度
	// static loadingScene = null
	static control = null

	// 🔥🔥🔥 用于存储加载好的资源
	static allData = {} //再下边执行加载方法时, 会把加载好的资源存储到这个对象内




	// 👀 改变进度条样式的方法
	static changeProgress(progress, loadingBar) {  //progress 进度条数据, loadingBar 进度条类
		loadingBar.barUpdate(progress * 10) // 0 ~ 20 为真进度

		// 如果【真进度】加载完, 就开始进行【假进度】的加载 => 🔥总进度 = 真进度 + 假进度(为了让别人看到进度条)
		if(progress === 2) {
			const progressObj = {
				num: 20,
			}

			// 🔥🔥用来画假的进度(0 ~ 10 为真进度, 20 ～ 100 为假进度)
			gsap.to(progressObj, { 
				num: 100,
				duration: 3,
				onUpdate: () => { //🔥🔥 onUpdate 监听 num 的变化
					// console.log(progressObj.num)
					loadingBar.barUpdate(progressObj.num)
					// console.log('开始改变假进度')
				},
				onComplete: () => { //🔥🔥 onUpdate 监听 num 的变化, 当加载完毕后, 进行场景切换 (⚡️ control -> gameLoader -> loadingScene -> loadingTitleContainer )
					// this.loadingScene.disappear()
					this.control.loadSceneDisappear()
				}
			})
		}
	}
	


	// 🌟 在资源类里边通过 static 静态属性定义的方法, 可以直接通过 this 来访问（因为静态属性的 this 指向类本身）
	// 🔥 Loading 场景的资源加载方法 ——————————————————
	static async getLoadSceneAssetsLoad() { //加载 scene 资源, 作为异步函数!
		// console.log('获得数据:', this.data)
		const sceneData = this.data['loadScene'] //=> singles
		const singles = sceneData.singles



		// 🔥🔥 把 3 个文字资源作为一个【统一的整体】来加载
		const singlesAssetsNames = []
		for( let single of singles ) { // ⚡️ 遍历 singlesData 内的数据并统一 add 到 Assets 内
			Assets.add(single.name, single.path) 
			singlesAssetsNames.push(single.name) // ⚡️ 后续利用 pixi.js 内的 Assets 方法, 可以在回调内获得加载进度
		}


		const singlesData = await Assets.load(singlesAssetsNames) // ⚡️ 等待加载完成
		// console.log(singlesData) 


		//loadingScene 就是存放数据的索引, 通过 this.allData.loadingScene 来访问 .rainbowStarSheetData 数据
		this.allData.loadingScene = { ...singlesData } //🔥🔥把数据展开, 作为静态属性存储起来, 相当于给 GameLoader 保存静态熟悉
	}




	// 🔥 游戏场景的资源加载方法 ——————————————————
	// static async getPlayScenesAssetsLoad(loadingBar, loadingScene) {
	static async getPlayScenesAssetsLoad(loadingBar, control) {

		// this.loadingScene = loadingScene //在类的静态属性上保存一下, 然后再用 gsap 的 onComplete 监听加载完成后就让它消失掉
		this.control = control //在类的静态属性上保存一下, 然后再用 gsap 的 onComplete 监听加载完成后就让它消失掉

		const sceneData = this.data['playScene'] //=> singles, bundles
		const singles = sceneData.singles
		const bundles = sceneData.bundles


		// 存放 singles 资源
		const singlesAssetsNames = []
		for( let single of singles ) {
			Assets.add(single.name, single.path)
			singlesAssetsNames.push(single.name)
			// console.log(single.name)
		}


		// 存放 bundles 资源
		const bundlesAssetsNames = []
		bundles.forEach((item) => {
			Assets.addBundle(item.name, item.paths) //addBundle 、 loadBundle 方法也是 pixi.js 内的 Assets 方法
			bundlesAssetsNames.push(item.name)
		})


		// 🔋 👇下面就是【🔥两部分真进度】要加载进度, 0～1 + 0～1, 因为 progress 那边定义的是 0～100, 所以是  0～2 * 50, 因为速度太快了, 所以会再让速度变慢一些
		// ⚡️ 等待加载完成, 本质上也是利用 pixi.js 内的 Assets 方法, pixi.js 可以传入第二个回调函数
		const singlesAssets = await Assets.load(singlesAssetsNames, (progress) => { //progress 0 ~ 1
			this.finalProgress = progress + this.basicProgress //🔥总进度 = 真进度 + 假进度(为了让别人看到进度条)
			this.changeProgress(this.finalProgress, loadingBar) //改变进度条样式
			// console.log('进度:', progress)
			if(this.finalProgress === 1) {
				this.basicProgress = 1
			}
		})

		// ⚡️ 等待加载完成, 本质上也是利用 pixi.js 内的 Assets 方法, pixi.js 可以传入第二个回调函数
		const bundlesAssets = await Assets.loadBundle(bundlesAssetsNames, (progress) => { //progress 0 ~ 1
			this.finalProgress = progress + this.basicProgress //🔥总进度 = 真进度 + 假进度(为了让别人看到进度条)
			this.changeProgress(this.finalProgress, loadingBar) //改变进度条样式
		})
		// console.log(singlesData, bundlesData)



		// ⚡️利用静态属性存储加载好的资源!!
		// singlesAssets 就是存放数据的索引, 通过 this.allData.playScene 来访问
		// bundlesAssets 就是存放数据的索引, 通过 this.allData.playScene 来访问
		this.allData.playScene = { ...singlesAssets, ...bundlesAssets } //🔥🔥把数据展开, 作为静态属性存储起来, 相当于给 GameLoader 保存静态熟悉
		
	}
}