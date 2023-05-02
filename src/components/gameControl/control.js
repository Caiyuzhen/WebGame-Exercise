import LoadingSceneContainer from './src/components/loading/loadingSceneContainer.js'
import PlayScene from './src/components/playScene/playScene.js'
import GameLoader from './src/components/gameControl/gameLoader.js'


// 用来管理游戏的流程逻辑（比如加载资源、显示加载场景、加载游戏场景资源、显示游戏场景、游戏结束场景等）
export default class control {

	static gameApp = null

	// 游戏初始化
	static gameInit(app) {
		this.gameApp = app
	}
}