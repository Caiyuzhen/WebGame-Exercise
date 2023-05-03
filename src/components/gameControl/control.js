import LoadingSceneContainer from '../loading/loadingSceneContainer.js'
import PlayScene from '../playScene/playScene.js'
import GameLoader from '../gameControl/gameLoader.js'




// 🪜用来管理游戏加载的逻辑（比如加载资源、显示加载场景、加载游戏场景资源、显示游戏场景、游戏结束场景等）
export default class control {

	static gameApp = null

	// 游戏初始化
	static async gameInit(app) {
		this.gameApp = app

		// 【加载 loadScene 场景资源】
		// 🔋 第 1 步: 加载好【加载场景的资源】
		await GameLoader.getLoadSceneAssetsLoad() 

		// 🔋 第 2 步: 创建【加载场景】
		const loadingScene = new LoadingSceneContainer(this.gameApp)

		// 🔋 第 3 步: 把【加载场景】渲染到舞台
		this.gameApp.stage.addChild(loadingScene.sceneBox)


		// 🔋 第 4 步:【加载 playScene 场景资源】, 让进度条跟这个加载进度保持同步, 并且让 【加载场景】消失
		//  loadingScene ->  LoadingTitleContainer  ->  loadingBarInstance
		await GameLoader.getPlayScenesAssetsLoad(loadingScene.loadingBarInstance, loadingScene) //loadingScene 传入 loadingScene 是为了让加载场景消失 (⚡️ control -> gameLoader -> loadingScene -> loadingTitleContainer )
	}


	// 用来管理游戏场景的消失逻辑
	static loadSceneDisappear() {

	}
}