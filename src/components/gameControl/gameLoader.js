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
				{ name: 'RetorGaming', path: 'src/assets/fonts/RetroGaming.ttf' },
				{ name: 'upheavtt', path: 'src/assets/fonts/upheavtt.ttf' },
				{ name: 'rainbowStarSheetData', path: 'src/assets/rainbowStarSheet/rainbowStar.json' }
			]
		},
		// 游戏场景资源
		playScene: {
			// 先进行单个资源单个资源的加载(字体, 图片等)
			singles: [
				{ name: 'gameBlockTextTexture', path: 'src/assets/titleTextures/blockText.png' },
				{ name: 'rainBowColorTexture', path: 'src/assets/titleTextures/rainBowColor.png' },
				{ name: 'chineseTextTexture', path: 'src/assets/titleTextures/dang.png' },
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

	// 🌟 在资源类里边通过 static 静态属性定义的方法, 可以直接通过 this 来访问（因为静态属性的 this 指向类本身）
	static getLoadSceneAssetsLoad() { //加载 scene 资源
		// console.log('获得数据:', this.data)
		const sceneData = this.data['loadScene']
		const singlesData = sceneData.singles

		// 🔥🔥 把 3 个资源作为一个【统一的整体】来加载
	}
}