import LoadingSceneContainer from '../loading/loadingSceneContainer.js'
import PlayScene from '../playScene/playScene.js'
import GameLoader from '../gameControl/gameLoader.js'
import AudioIcon from './audioIcon.js'
const { sound } = PIXI




// 🪜用来管理游戏加载的逻辑（比如加载资源、显示加载场景、加载游戏场景资源、显示游戏场景、游戏结束场景等）
export default class Control {

	// 👇👇定义静态属性, 在整个项目中共享数据
	static gameApp = null
	static loadedScene = null //加载完毕后要消失的场景
	static playScene = null //加载完毕后要显示的场景
	static gameIsStart = false// 🎮判断游戏是否开启, 开始后 bar 才可以拖拽
	static currentShapeIndex = 0 //当前弹射元素的索引
	static gameScore = 0 //游戏分数
	static blockBarLife = 3 //剩多少条命
	static isMobile = false //判断是否是移动端
	static boundary = {//小元素的碰撞边界数据
		left: 0,
		right: innerWidth,
		top: 0,
		bottom: innerHeight,		
	}

	// 👇👇对于不需要被实例化的控制类, 可以定义静态方法给外部调用
	// 游戏初始化
	static async gameInit(app) {
		this.gameApp = app

		// 【加载 loadScene 场景资源】
		// 🔋 第 1 步: 加载好【加载场景的资源】
		await GameLoader.getLoadSceneAssetsLoad() 
		sound.add('hit', '/src/assets/audio/block.mp3') //🔥添加声音资源(自定义声音名称 + 路径)
		sound.add('fail', '/src/assets/audio/fail.mp3') //🔥添加声音资源(自定义声音名称 + 路径)
		sound.add('decrease', '/src/assets/audio/decrease.mp3') //🔥添加声音资源(自定义声音名称 + 路径)
		sound.add('opening', '/src/assets/audio/opening.mp3') //🔥添加声音资源(自定义声音名称 + 路径)
		sound.volumeAll = 0.2 //🔥设置声音音量大小
		sound.muteAll() //🔥一开始先静音
		const audioIcon = new AudioIcon(this.gameApp) //🔥创建声音 icon
		this.gameApp.stage.addChild(audioIcon.element)



		// 👇在加载游戏资源前, 检测一下是否是移动端
		this.detectDevice()


		// 🔋 第 2 步: 创建【加载场景】
		const loadingScene = new LoadingSceneContainer(this.gameApp)
		if(this.isMobile) { //如果是移动端, 就缩小这个场景
			loadingScene.sceneBox.scale.set(0.6)
		}
		

		// 🔋 第 3 步: 把【加载场景】渲染到舞台
		this.gameApp.stage.addChild(loadingScene.sceneBox)

		this.loadedScene = loadingScene

		

		// 🔋 第 4 步:【加载 playScene 场景资源】, 让进度条跟这个加载进度保持同步, 并且让 【加载场景】消失
		//  loadingScene ->  LoadingTitleCon.gameApp
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
		// 🔊🔊开始播放
		sound.play('opening', {
			loop: true //没传第二个参数的话, 默认就播放一次
		})
	}



	// 🚀🚀游戏开始计分, ⚡️ playScene -> Character 父类中定义 hidden 元素的方法, 把其他元素退出去, 只留下游戏元素
	static gameStar() {
		this.playScene.gameStarPlay()
		this.gameIsStart = true

		// 🔇🔇停止播放
		sound.stop('opening') //结束上一个声音


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
		// 🔊🔊播放挡回去的声音
		sound.play('hit')

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

			// 🔊🔊播放元素出界的声音
			sound.play('decrease')

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
			
			// 🔊🔊播放游戏结束的声音
			sound.play('fail')
			// ...
		}
	}

	// ❌ 游戏结束的场景
	static gameOver() { 
		this.gameIsStart = false
		this.playScene.gameOver()
	}


	//  ❌ 游戏结束后, 重置分数
	static resetScore() { 
		this.gameScore = 0
		const scoreTextInstance = this.playScene.scoreTextInstance
		scoreTextInstance.element.text = this.gameScore
	}


	// 📱检测是否是移动端
	static detectDevice() { 
		const UA = navigator.userAgent
		const ipad = UA.match(/(iPad).*OS\s([\d_]+)/)
		const isIphone = !ipad && UA.match(/(iPhone\sOS)\s([\d_]+)/)
		const isAndroid = UA.match(/(Android)\s+([\d.]+)/)
		const isMobile = isIphone || isAndroid
		if(isMobile) { 
			this.isMobile = true
		}
	}
}