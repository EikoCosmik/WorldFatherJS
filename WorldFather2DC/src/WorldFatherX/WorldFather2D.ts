import { Scene } from "./wf_Scenes/wf_Scene.js";
import { ErrorManager } from "./wf_ErrorManager.js";
import { Point2D } from "./wf_CustomTypes.js";
import { Entity } from "./wf_Entities/wf_Entity/wf_Entity.js";
import { CameraEntity } from "./wf_Entities/wf_InternalEntities/wf_Camera.js";
import { debug_drawCamera } from "./wf_DebugSwitches.js";
import { Utils } from "./wf_Utils.js";

export class WorldFather2D
{
	private _renderID: number | null = null;
	get renderID(): number | null { return this._renderID};

	private _scenes: Record<string, Scene>;
	get scenes(): Record<string, Scene> { return this._scenes};

	private _currentScene: Scene;
	get currentScene(): Scene { return this._currentScene};

	private _cameras: Record<string, CameraEntity>;
	get cameras(): Record<string, CameraEntity> { return this._cameras};

	private _currentCamera: CameraEntity;
	get currentCamera(): CameraEntity { return this._currentCamera};

	private _lastScene: Scene;
	get lastScene(): Scene { return this._lastScene};

	private _lastTime: number = 0;
	get lastTime(): number { return this._lastTime};

	private _scaleMod: number = 0;
	get scaleMod(): number { return this._scaleMod};
	
	private _screenCenter: Point2D = { x: 0, y: 0 };
	get screenCenter(): Point2D { return this._screenCenter};

	private _container: HTMLElement;
	get container(): HTMLElement { return this._container};

	private _canvas: HTMLCanvasElement;
	get canvas(): HTMLCanvasElement { return this._canvas};

	private _context: CanvasRenderingContext2D;
	get context(): CanvasRenderingContext2D { return this._context};

	private _screenWidth: number;
	get screenWidth(): number { return this._screenWidth};

	private _screenHeight: number;
	get screenHeight(): number { return this._screenHeight};

	private _halfScreenWidth: number;
	get halfScreenWidth(): number { return this._halfScreenWidth};

	private _halfScreenHeight: number;
	get halfScreenHeight(): number { return this._halfScreenHeight};

	private _screenRatio: number;
	get screenRatio(): number { return this._screenRatio};

	private _ratioChord: number;
	get ratioChord(): number { return this._ratioChord};

	private _resizer: ResizeObserver;
	get resizer(): ResizeObserver { return this._resizer};

	private _keysPressed: Record<string, boolean>;
	get keysPressed(): Record<string, boolean> { return this._keysPressed};

	constructor(containerID: string, screenWidth: number = 1440, screenHeight: number = 1080, screenRatio: number = 4 / 3)
	{
		// ==========| Cameras |==========
		this._cameras = { "DefaultCamera": new CameraEntity({ engine: this }) };
		const curCamera = ErrorManager.setIfExists(this._cameras["DefaultCamera"], `baseWorldFather.constructor(): this.cameras["DefaultCamera"] did not exist, setting curCamera`);
		this._currentCamera = curCamera;

		// ==========| Scenes |==========
		this._scenes = { "DefaultScene": new Scene() };
		const curScene = ErrorManager.setIfExists(this._scenes["DefaultScene"], `baseWorldFather.constructor(): this.scenes["DefaultScene"] did not exist, setting curScene`);
		this._lastScene = curScene;
		this._currentScene = curScene;
		curScene.onSwapTo();
		curScene._initialise();

		// ==========| Renderer |==========
		this._screenWidth = screenWidth;
		this._screenHeight = screenHeight;
		this._halfScreenWidth = screenWidth * 0.5;
		this._halfScreenHeight = screenHeight * 0.5;
		this._screenRatio = screenRatio;
		this._ratioChord = Math.sqrt(screenWidth * screenWidth + screenHeight * screenHeight);

		this._container = ErrorManager.setIfExists(document.getElementById(containerID), `wf_Renderer.setRenderVars(): document.getElementById(${containerID}) did not exist, setting this.context`);

		const canvasElement = document.createElement("canvas");
		canvasElement.id = containerID + "Canvas";
		canvasElement.style.width = "100%";
		canvasElement.style.height = "100%";
		canvasElement.style.display = "block";

		this._container.appendChild(canvasElement);

		this._canvas = ErrorManager.setIfExists(this._container.querySelector("#" + containerID + "Canvas"), `wf_Renderer.setRenderVars(): this.container.querySelector(${"#" + containerID + "Canvas"}) did not exist, setting this.canvas`);
		this._context = ErrorManager.setIfExists(this._canvas.getContext("2d"), `wf_Renderer.setRenderVars(): this.canvas.getContext("2d") did not exist, setting this.context`);

		this._resizer = new ResizeObserver(e =>
		{
			this._resize();
		});
		this._resizer.observe(this._container);

		// ==========| Key Inputs |==========
		this._keysPressed = {};
		window.addEventListener('keydown', this.onKeyDown);
		window.addEventListener('keyup', this.onKeyUp);

		return this;
	}

	// #region ===================================================================
	// #region =================| Start / Stop Controls |=========================
	// #region ===================================================================

	start()
	{
		if (this._renderID == null) this._renderID = requestAnimationFrame((t) => this._timeStep(t));
	}

	stop()
	{
		if (this._renderID !== null)
		{
			cancelAnimationFrame(this._renderID);
			this._renderID = null;
		}
	}

	// #endregion ==============! Start / Stop Controls !=========================

	// #region ============================================================
	// #region =================| Scene Controls |=========================
	// #region ============================================================

	addScene(name: string, scene: typeof Scene, sceneOverrides: Record<string, any> = {})
	{
		sceneOverrides["engine"] = this;
		const newScene = new scene(sceneOverrides);
		this._scenes[name] = newScene;
		newScene._initialise();
	}

	swapScene(name: string)
	{
		this._lastScene = this._currentScene;
		const curScene = ErrorManager.setIfExists(this._scenes[name], `wf_Rendered.constructor(): this.scenes[${name}] did not exist, setting this.context`);
		this._currentScene = curScene;
		curScene.onSwapTo();
	}

	swapToLastScene()
	{
		const tempHold = this._currentScene
		this._currentScene = this._lastScene;
		this._lastScene = tempHold;
		this._currentScene.onSwapTo();
	}

	// #endregion ==============! Scene Controls !=========================

	// #region =============================================================
	// #region =================| Camera Controls |=========================
	// #region =============================================================

	addCamera(name: string, overrides = {})
	{
		const newCam = new CameraEntity(overrides);
		newCam._initialise();
		this._cameras[name] = newCam;
	}

	swapCamera(name: string)
	{
		this._currentCamera = ErrorManager.setIfExists(this._cameras[name], `baseWorldFather.swapCamera(): this.cameras[name] did not exist, setting this.currentCamera`);
	}

	// #endregion ==============! Scene Controls !=========================

	// #region =========================================================
	// #region =================| Engine Loop |=========================
	// #region =========================================================

	_timeStep(t: number)
	{
		// Get time since last _timeStep
		const deltaTime = (t - this._lastTime) / 1000;

		// Reset _lastTime to current time
		this._lastTime = t;

		// Scene does all its updates and its objects updates
		this._currentScene._update(deltaTime); //--! TOFIX: wf Reference

		// Renderer resets / updates camera and draws all applicable objects
		this._render(deltaTime); //--! TOFIX: wf Reference

		// Continue the Loop
		this._renderID = requestAnimationFrame((t) => this._timeStep(t)); //--! TOFIX: wf Reference
	}

	// #endregion ==============! Engine Loop !=========================

	// #region ======================================================
	// #region =================| Renderer |=========================
	// #region ======================================================

	_resize(): void
	{
		let canvasBoundingBox = this._canvas.getBoundingClientRect();

		const width = canvasBoundingBox.width;
		const height = canvasBoundingBox.height;

		this._canvas.width = width;
		this._canvas.height = height;

		this._scaleMod = Math.sqrt(width * width + height * height) / this._ratioChord;
		this._screenCenter = { x: width * 0.5, y: height * 0.5 };

		if (this._context)
		{
			this._context.textAlign = "center";
			this._context.textBaseline = "middle";
		}
	}

	_render(dt: number): void
	{
		const ctx = this._context;
		const currentScene = this._currentScene;
		const currentCamera = this._currentCamera;

		currentCamera._update(dt);

		ctx.save();

		this._setupGlobalCamera();

		currentScene._draw(ctx);
		if (debug_drawCamera) currentCamera._draw(ctx);

		ctx.restore();
	}

	_setupGlobalCamera(): void
	{
		const currentCamera = this._currentCamera;
		this._context.translate(this._screenCenter.x, this._screenCenter.y);
		this._context.scale((currentCamera.scaleX) * this._scaleMod, (currentCamera.scaleY) * this._scaleMod);
		// this.context.rotate(Utils.getRadians(-currentCamera.getWorldRotation())); //--! TOFIX: Camera Needs World Data?
		// const camPos = currentCamera.getWorldPosition(); //--TOFIX: Camera Needs World Data?
		this._context.rotate(Utils.getRadians(-currentCamera.rotation));
		this._context.translate(-currentCamera.positionX, -currentCamera.positionY);
	}

	// #endregion ==============! Renderer !=========================

	// #region =================================================================
	// #region =================| Collision Detection |=========================
	// #region =================================================================

	updateCollisionGrid(object: Entity, collisionGrid: Record<string, [string, Entity[]]>)
	{
		const objectCells = object.getGridCells();

		for (let j = 0; j < objectCells.length; j++)
		{
			let cellString = `${objectCells[j]}`;
			if (collisionGrid[cellString] == null) collisionGrid[cellString] = [objectCells[j], [object]];
			else if (!collisionGrid[cellString][1].includes(object)) collisionGrid[cellString][1].push(object);
		}
	}

	testCollisionGrid(collisionGrid: Record<string, [string, Entity[]]>)
	{
		//if (this.debugActiveCollisionCells) this.cellsForDebug = [];

		for (let key in collisionGrid)
		{
			const cellPosition = ErrorManager.setIfExists(collisionGrid[key], `wf_CollisionDetection.testCollisionGrid(): collisionGrid[key] did not exist, setting cellPosition`)[0];
			const neighbours = this.getCollisionNeighbours(cellPosition, collisionGrid);

			if (neighbours.length > 1)
			{
				this.testNeighbourCells(neighbours)
			}
		}
	}

	getCollisionNeighbours(cellPosition: string, collisionGrid: Record<string, [string, Entity[]]>)
	{
		const tempNeightbours: any[] = [];

		for (let i = -1; i < 2; i++)
		{
			const neighbourX = ErrorManager.setIfExists(cellPosition[0], `wf_CollisionDetection.getCollisionNeighbours(): cellPosition[0] did not exist, setting neighbourX`) + i;
			for (let j = -1; j < 2; j++)
			{
				const neighbourY = ErrorManager.setIfExists(cellPosition[1], `wf_CollisionDetection.getCollisionNeighbours(): cellPosition[1] did not exist, setting neighbourY`) + j;
				const neighbourCellKey = `${[neighbourX, neighbourY]}`;
				const neighbourCell = collisionGrid[neighbourCellKey];

				if (neighbourCell !== undefined)
				{
					//if (this.debugActiveCollisionCells) this.addToCellsForDebug(neighbourX, neighbourY, "cyan");


					for (let k = 0; k < neighbourCell[1].length; k++)
					{
						const object = neighbourCell[1][k];
						if (!tempNeightbours.includes(object)) tempNeightbours.push(object);
					}
				}
				//else if (this.debugActiveCollisionCells)
				//{
				//	this.addToCellsForDebug(neighbourX, neighbourY, "magenta");
				//}
			}
		}

		return tempNeightbours;
	}

	// addToCellsForDebug(neighbourX, neighbourY, color)
	// {

	// 	const gridSize = this.wf.currentScene.gridSize;
	// 	const posX = neighbourX * gridSize + (gridSize * 0.5);
	// 	const posY = neighbourY * gridSize + (gridSize * 0.5);
	// 	this.cellsForDebug.push([posX, posY, color]);
	// }

	testNeighbourCells(neighbours: Entity[])
	{
		for (let i = 0; i < neighbours.length; i++)
		{
			for (let j = 0; j < neighbours.length; j++)
			{
				const object1 = ErrorManager.setIfExists(neighbours[i], `wf_CollisionDetection.testNeighbourCells(): neighbours[i] did not exist, setting object1`);
				const object2 = ErrorManager.setIfExists(neighbours[j], `wf_CollisionDetection.testNeighbourCells(): neighbours[j] did not exist, setting object2`);
				if (object1.id == object2.id) continue;
				if (object1._collisionTestedAgainst.includes(object2)) continue;
				const isColliding = this.isColliding([object1, object2]);
				object1._collisionTestedAgainst.push(object2);
				object2._collisionTestedAgainst.push(object1);
				if (isColliding) 
				{
					object1.onCollision?.(object2);
					object2.onCollision?.(object1);
				}
			}
		}
	}

	isColliding(objectPair: Entity[])
	{
		//const is0Ellipse = (objectPair[0].shape == "ellipse");
		//const is1Ellipse = (objectPair[1].shape == "ellipse");

		// if (!is0Ellipse && !is1Ellipse)
		// {
		for (let i = 0; i < 2; i++)
		{
			const objPi = ErrorManager.setIfExists(objectPair[i], `wf_CollisionDetection.isColliding(): objectPair[i] did not exist, setting objPi`);

			for (let j = 0; j < objPi.normals.length; j++)
			{
				let max = [-Infinity, -Infinity];
				let min = [Infinity, Infinity];
				let normal = objPi.normals[j];
				for (let k = 0; k < objectPair.length; k++)
				{
					const objPk = ErrorManager.setIfExists(objectPair[k], `wf_CollisionDetection.isColliding(): objectPair[k] did not exist, setting objPk`);

					for (const vertex of objPk.verticies)
					{
						let dotProduct = normal.x * vertex.x + normal.y * vertex.y;
						if (dotProduct > max[k]!) max[k] = dotProduct;
						if (dotProduct < min[k]!) min[k] = dotProduct;
					};
				}
				const test = (max[0]! >= min[1]! && max[1]! >= min[0]!);

				if (!test) return false;
			}
		}

		return true;
		// }
		// else
		// {
		// 	const bothEllipse = objectPair[0].shape == "ellipse" && objectPair[1].shape == "ellipse";
		// 	const ellipse = objectPair[0].shape == "ellipse" ? objectPair[0] : objectPair[1];
		// 	const box = objectPair[0].shape == "ellipse" ? objectPair[1] : objectPair[0];
		// 	const verticies = (box.shape == "ellipse") ? this.wf.Utils.getPointsOnEllipsis(box, 16) : box.verticies;

		// 	const inverseRadiusX = 1 / (ellipse.width * 0.5);
		// 	const inverseRadiusY = 1 / (ellipse.height * 0.5);

		// 	let inside = false;

		// 	for (let i = 0, j = verticies.length - 1; i < verticies.length; j = i++)
		// 	{
		// 		const x1 = (bothEllipse) ? (verticies[i][0] - ellipse.globalPositionX) + box.globalPositionX : (verticies[i][0] - ellipse.globalPositionX);
		// 		const y1 = (bothEllipse) ? (verticies[i][1] - ellipse.globalPositionY) + box.globalPositionY : (verticies[i][1] - ellipse.globalPositionY);
		// 		const x2 = (bothEllipse) ? (verticies[j][0] - ellipse.globalPositionX) + box.globalPositionX : (verticies[j][0] - ellipse.globalPositionX);
		// 		const y2 = (bothEllipse) ? (verticies[j][1] - ellipse.globalPositionY) + box.globalPositionY : (verticies[j][1] - ellipse.globalPositionY);
		// 		const xi = (x1 * ellipse.cos + y1 * ellipse.sin) * inverseRadiusX;
		// 		const yi = (y1 * ellipse.cos - x1 * ellipse.sin) * inverseRadiusY;
		// 		const xj = (x2 * ellipse.cos + y2 * ellipse.sin) * inverseRadiusX;
		// 		const yj = (y2 * ellipse.cos - x2 * ellipse.sin) * inverseRadiusY;
		// 		const dx1 = xj - xi;
		// 		const dy1 = yj - yi;

		// 		if ((yi > 0 !== yj > 0) && (0 < dx1 * -yi / dy1 + xi)) inside = !inside;

		// 		const t = Math.max(0, Math.min(1, (-xi * dx1 + -yi * dy1) / (dx1 * dx1 + dy1 * dy1)));
		// 		const dx2 = xi + dx1 * t;
		// 		const dy2 = yi + dy1 * t;

		// 		if (dx2 * dx2 + dy2 * dy2 <= 1) return true;
		// 	}

		// 	return inside;
		// }
	}

	// #endregion ==============! Collision Detection !=========================

	// #region ====================================================
	// #region =================| Key Inputs |=========================
	// #region ====================================================

	isKeyDown(key: string): boolean
	{
		return this._keysPressed[key] ?? false;
	}

	onKeyDown = (e: KeyboardEvent) =>
	{
		//if (e.repeat) return;
		this._keysPressed[e.code] = true;
		//this.wf.currentScene._keyEvent?.(e.code, "down");
	}

	onKeyUp = (e: KeyboardEvent) =>
	{
		//if (e.repeat) return;
		delete this._keysPressed[e.code];
		//this.wf.currentScene._keyEvent?.(e.code, "up");
	}

	// #endregion ==============! Key Inputs !=========================
	
}