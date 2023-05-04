import LoadingSceneContainer from '../loading/loadingSceneContainer.js'
import PlayScene from '../playScene/playScene.js'
import GameLoader from '../gameControl/gameLoader.js'




// 🪜用来管理游戏加载的逻辑（比如加载资源、显示加载场景、加载游戏场景资源、显示游戏场景、游戏结束场景等）
export default class control {

	static gameApp = null
	static loadedScene = null //加载完毕后要消失的场景
	static playScene = null //加载完毕后要显示的场景
	static gameIsStart = false// 🎮判断游戏是否开启, 开始后 bar 才可以拖拽
	static currentShapeIndex = 0 //当前弹射元素的索引
	static boundary = {//小元素的碰撞边界数据
		left: 0,
		right: innerWidth,
		top: 0,
		bottom: innerHeight,		
	}

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
		this.gameIsStart = true
		setTimeout(() => { //要延迟一点执行, 不然会跟把元素移出去的动画冲突
			this.shapeMoveStart() 
		}, 2000)
	}

	

	//🚀🚀游戏开始后, 开始弹射小元素
	static shapeMoveStart() {
		this.playScene.allInstances.shapes.forEach((item) => { //allInstances.shapes 是所有小元素的实例
			item.shapeRandomReady()//把所有小元素先【汇集】起来
		}) 

		// 🌟 随机获取一个 0-7 的整数, 作为要弹射的小元素的索引, 从而实现随机弹射小元素
		const randomIndex = Math.floor(Math.random() * 8)
		this.currentShapeIndex = randomIndex


		// ⚡️注意, 这里有 this 指向问题, 会指向调用 ticker 的对象而不是指向 shapeBox, 所以要 bind 一下, 绑定在 shapeBox 自身的实例！
		this.shapeMoveFunc = this.playScene.allInstances.shapes[this.currentShapeIndex].oneStep.bind(this.playScene.allInstances.shapes[this.currentShapeIndex])
		this.gameApp.ticker.add( this.shapeMoveFunc )  //🔥⚡️【随机弹射】小元素, instance 实例 -> shapeBox -> oneStep(), 需要 ticker 来持续检测, 因为小元素如果出界后, 需要再次弹射！

		this.detectBoundaryFunc = this.detectBoundary.bind(this) // 记得绑定 this , 指向 control 本身
		this.gameApp.ticker.add(this.detectBoundaryFunc)

		// 国 500ms 后就默认小元素已经进入了【游戏区域】, 这样就可以开始检测小元素是否出界了
		setTimeout(()=>{
			this.playScene.allInstances.shapes[randomIndex].shapeIsInArea = true
		}, 500)
	}



	//🚀🚀判断元素是否超出边界
	static detectBoundary() {
		const shape = this.playScene.allInstances.shapes[this.currentShapeIndex] //获取到当前正在弹射的元素

		// 是否超过左右边界
		if(shape.element.x < this.boundary.left + shape.element.width / 2 || shape.element.x > this.boundary.right - shape.element.width / 2) {
			shape.direction = Math.PI - shape.direction //💥改变碰撞方向
		} 

		// 是否超过上方边界
		if(shape.element.y < this.boundary.top + shape.element.height / 2 && shape.shapeIsInArea) { //🔥 shape.isInArea 是为了防止元素一开始就在上边, 导致元素出不来
			shape.direction = 2 * Math.PI - shape.direction //💥改变碰撞方向
		}

		//  是否超出底部边界
		if(shape.element.y > this.boundary.bottom - shape.element.height / 2 + 100) { //100 表示下去远一点才算出界

		}
	}
}