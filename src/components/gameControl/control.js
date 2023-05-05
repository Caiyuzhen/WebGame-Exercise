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
	static gameScore = 0 //游戏分数
	static blockBarLife = 3 //剩多少条命
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
			this.shapeStartMove() 
		}, 2000)
	}

	

	//🚀🚀游戏开始后, 开始弹射小元素(⚡️执行这个方法后会随机弹射出一个小元素)
	static shapeStartMove() {
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



	//💥💥💥 判断元素是否超出边界
	static detectBoundary() {
	

		const shape = this.playScene.allInstances.shapes[this.currentShapeIndex] //获取到当前正在弹射的元素
		const blockBar = this.playScene.allInstances.barElement //获取挡板边界

		

		// 👇元素是否超出【挡板】边界的核心逻辑 ——————————————————————————————————————————————————————————
		//  🔥🔥获取元素的全局坐标: getGlobalPosition(),  const { x: barX, y: barY } 相当于解构赋值 => 坐标值以元素的【中心锚点】来计算, 因为我们之前设置了 bar 的中心锚点
		const { x: barX, y: barY } = blockBar.element.getGlobalPosition() //👈 因为 detectBoundary() 方法不停的被 ticker 调用, 所以数据会一直在更新！
		console.log(barX, barY)

		const barLeftArea = barX - blockBar.element.width / 2
		const barRightArea = barX + blockBar.element.width / 2
		const barTopArea = barY - blockBar.element.height / 2

		if(shape.element.y + shape.element.height / 2 >= barTopArea) {
			if(shape.element.x + shape.element.width / 2 >= barLeftArea && 
			   shape.element.x - shape.element.height / 2 <= barRightArea) {
				 if(!shape.shapeIsOut) { //当元素不是从 -> 侧边 -> 进入挡板底部时, 才会触发
					//【➕ 加分的相关逻辑】把元素挡回去
				 	shape.direction = 2 * Math.PI - shape.direction //💥改变碰撞方向(变为挡回去的方向 -> 变成向上)
					this.hitBar()
				 }
			   } else {
				  shape.shapeIsOut = true
			   }
		}



		// 👇元素是否超出【画面】边界的核心逻辑 ——————————————————————————————————————————————————————————
		// 是否超过【画面】左右边界
		if(shape.element.x < this.boundary.left + shape.element.width / 2 || shape.element.x > this.boundary.right - shape.element.width / 2) {
			shape.direction = Math.PI - shape.direction //💥改变碰撞方向
		} 

		// 是否超过【画面】上方边界
		if(shape.element.y < this.boundary.top + shape.element.height / 2 && shape.shapeIsInArea) { //🔥 shape.isInArea 是为了防止元素一开始就在上边, 导致元素出不来
			shape.direction = 2 * Math.PI - shape.direction //💥改变碰撞方向
		}

		//  是否超出【画面】底部边界
		if(shape.element.y > this.boundary.bottom - shape.element.height / 2 + 100) { //100 表示下去远一点才算出界
			// 出界后的相关逻辑: bar 变短 + 重新弹射出一个元素
			// ...
			this.shapeGetOut()
		}
	}


	// ⚽️ 挡回去并加分
	static hitBar() {
		// 加分
		const scoreTextInstance = this.playScene.scoreTextInstance
		this.gameScore += 100
		scoreTextInstance.element.text = this.gameScore

		// 加分后星星跳动
		const goldenStarInstance = this.playScene.allInstances.goldenStar
		goldenStarInstance.bounce()
	}


	// 🚪 出界后的相关逻辑（重新弹射元素、bar 变短）
	static shapeGetOut() {
		if(this.blockBarLife > 0) { //👈当还有生命时
			this.blockBarLife -= 1 // 减去一条命

			// 删除当前在场景内弹射的元素
			this.gameApp.ticker.remove(this.shapeMoveFunc)

			// 删除当前正在检测的【画布】边界
			this.gameApp.ticker.remove(this.detectBoundaryFunc) //因为这个检测方法【跟当前元素】绑定

			// 删除当前正在检测的【挡板】边界
			const shape = this.playScene.allInstances.shapes[this.currentShapeIndex]

			// 元素出界
			shape.shapeIsInArea = false
		
			// 让 bar 减短
			this.playScene.allInstances.barElement.shortenBar()

			setTimeout(() => {
				shape.shapeIsOut = false // 重置元素出界的状态
				this.shapeStartMove()
			}, 1000)
		} else { //👈当没了生命
			// 删除当前在场景内弹射的元素
			this.gameApp.ticker.remove(this.shapeMoveFunc)

			// 删除当前正在检测的【画布】边界
			this.gameApp.ticker.remove(this.detectBoundaryFunc) //因为这个检测方法【跟当前元素】绑定

			// 删除当前正在检测的【挡板】边界
			const shape = this.playScene.allInstances.shapes[this.currentShapeIndex]

			// 元素出界
			shape.shapeIsInArea = false
			// 游戏结束
			this.gameOver()
			// ...
		}
	}

	// ❌ 游戏结束的场景
	static gameOver() { 
		this.gameIsStart = false
		this.playScene.gameOver()
	}
}