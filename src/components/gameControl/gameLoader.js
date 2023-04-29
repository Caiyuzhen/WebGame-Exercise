/* 	
	核心是实现两个场景的资源加载, 加载的类不需要被实例化, 直接调用静态方法即可
		loadScene (星星进度条)
		playScene
			playScene 场景内的资源加载要与进度条进行联动
*/

import { Assets } from '../../libs/pixijs.js'

export default class GameLoader {
	// 整理所有要加载的数据
	static data = {
		loadScene: {
			// 单个资源单个资源的加载
			singles: [
				{ name: 'RetorGaming', url: 'src/assets/fonts/RetroGaming.ttf' },
				{ name: 'upheavtt', url: 'src/assets/fonts/upheavtt.ttf' },
			]
		},
		playScene: {

		}
	}
}