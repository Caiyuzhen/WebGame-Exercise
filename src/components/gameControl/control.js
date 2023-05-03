import LoadingSceneContainer from '../loading/loadingSceneContainer.js'
import PlayScene from '../playScene/playScene.js'
import GameLoader from '../gameControl/gameLoader.js'




// 🪜用来管理游戏加载的逻辑（比如加载资源、显示加载场景、加载游戏场景资源、显示游戏场景、游戏结束场景等）
export default class control {

	static gameApp = null
	static loadedScene = null //加载完毕后要消失的场景
	static playScene = null //加载完毕后要显示的场景

	// 游戏初始化
	static async gameInit(app) {
		this.gameApp = app

		// 【加载 loadScene 场景资源】
		// 🔋 第 1 步: 加载好【加载场景的资源】
		await GameLoader.getLoadSceneAssetsLoad() 

		// 🔋 第 2 步: 创建【加载场景】
		const loadingScene = new LoadingSceneContainer(this.gameApp)
		this.loadedScene = loadingScene

		// 🔋 第 3 步: 把【加载场景】渲染到舞台
		this.gameApp.stage.addChild(loadingScene.sceneBox)


		// 🔋 第 4 步:【加载 playScene 场景资源】, 让进度条跟这个加载进度保持同步, 并且让 【加载场景】消失
		//  loadingScene ->  LoadingTitleContainer  ->  loadingBarInstance
		// await GameLoader.getPlayScenesAssetsLoad(loadingScene.loadingBarInstance, loadingScene) //loadingScene 传入 loadingScene 是为了让加载场景消失 (⚡️ control -> gameLoader -> loadingScene -> loadingTitleContainer )
		await GameLoader.getPlayScenesAssetsLoad(loadingScene.loadingBarInstance, this) // 🔥或this 就是 control 本身, 最终调用的是下边的 loadSceneDisappear 方法


		// 🔋 第 5 步: 创建【游戏场景】
		const playScene = new PlayScene(this.gameApp)
		this.playScene = playScene

		this.gameApp.stage.addChild(playScene.sceneBox)
	}


	// 用来管理游戏场景的消失逻辑 (控制器逻辑 -> 控制消失的对象) , 比较符合直觉
	static loadSceneDisappear() {
		this.loadedScene.disappear() // (⚡️ control -> gameLoader -> loadingScene -> loadingTitleContainer )
	}


	// 🚀🚀🚀用来管理游戏场景的出现逻辑 (控制器逻辑 -> 控制出现的对象) , 比较符合直觉, 🔥🔥最终在 loadingTiTleContainer 中的 disappear 方法内的 onComplete 回调内调用!!
	static playSceneAppear() {
		this.playScene.appear() 
	}



	// 🚀🚀游戏开始计分, ⚡️ playScene -> Character 父类中定义 hidden 元素的方法, 把其他元素退出去, 只留下游戏元素
	static gameStar() {
		this.playScene.gameStarPlay()
	}
}