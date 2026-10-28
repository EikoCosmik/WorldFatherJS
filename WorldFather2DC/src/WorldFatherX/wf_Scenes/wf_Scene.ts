import { ErrorManager } from "../wf_ErrorManager.js";
import { WorldFather2D } from "../WorldFather2D.js";
import { Entity } from "../wf_Entities/wf_Entity/wf_Entity.js";
import { debug_sceneCenter, debug_sceneCenterRings, debug_collisionGrid } from "../wf_DebugSwitches.js";

export class Scene
{
	private _layers: Record<string, Entity[]> = { "_hindGrid": [], "default": [], "_foreGround": [] };
	get layers(): Record<string, Entity[]> { return this._layers};

	private _gridSize: number = 100;
	get gridSize(): number { return this._gridSize};

	private _startTime: number = Date.now();
	get startTime(): number { return this._startTime};

	private _backgroundColor: string = "#000000";
	get backgroundColor(): string { return this._backgroundColor};

	private _WorldFather: WorldFather2D;
	get WorldFather(): WorldFather2D { return this._WorldFather};

	private _collisionGrid: Record<string, [string, Entity[]]> = {};
	get collisionGrid(): Record<string, [string, Entity[]]> { return this._collisionGrid}; //--! Verify: better collision? Definitly collision layers soon  //--! CustomType?

	private _importantObjects: Record<string, Entity | any> = {};
	get importantObjects(): Record<string, Entity | any> { return this._importantObjects };

	//public mouseWorldCoords: Record<string, Object[]>; //--! Verify: We have a better mouse system now, can this be improved?  //--! CustomType?
	//public clickableObjects: Record<??, ??>; //--! Verify: We have a better mouse system now, can this be improved?  //--! CustomType?
	
	// #region ================================================================
	// #region =================| Setup & Initialise |=========================
	// #region ================================================================

	constructor(inherited: Record<string, any> = {})
	{
		this._WorldFather = inherited["engine"];
	}

	_initialise(): void
	{ 
		this.onSetup();
	}

	onSetup(): void {}
	
	onSwapTo(): void { }

	// #endregion ==============| Setup & Initialise |=========================

	// #region ====================================================
	// #region =================| Update |=========================
	// #region ====================================================

	_update(dt: number): void
	{
		this.update(dt);

		this._collisionGrid = {};

		Object.entries(this._layers).forEach(([key, layer]) =>
		{
			for (let i = layer.length - 1; i > -1; i--)
			{
				const entity = ErrorManager.setIfExists(layer[i], `wf_Scene._update(): layer[i] did not exist, setting const entity`);
				entity._update(dt);
				if (!entity._isLive) this.removeEntity(i, layer, entity);
				else if (entity.usingCollision != null && entity.usingCollision) this._WorldFather.updateCollisionGrid(entity, this._collisionGrid);
			};
		});

		if (Object.keys(this._collisionGrid).length > 0) this._WorldFather.testCollisionGrid(this._collisionGrid);

		this.onUpdate(dt);
	}
	
	update(dt: number): void {}
	
	onUpdate(dt: number): void {}

	// #endregion ==============| Update |=========================

	// #region ==================================================
	// #region =================| Draw |=========================
	// #region ==================================================
	
	_draw(ctx: CanvasRenderingContext2D): void
	{
		const worldFather = this._WorldFather;
		
		ctx.fillStyle = this._backgroundColor;
		ctx.fillRect(-worldFather.halfScreenWidth - 10, -worldFather.halfScreenHeight - 10, worldFather.screenWidth + 10, worldFather.screenHeight + 10);

		this.draw(ctx);
		
		Object.entries(this._layers).forEach(([key, layer]) =>
		{
			for (let i = layer.length - 1; i > -1; i--)
			{
				const entity = ErrorManager.setIfExists(layer[i], `wf_Scene._draw(): layer[i] did not exist, setting const entity`);
				entity._draw(ctx);
			};
		});

		this._drawDebuging(ctx);
		this.onDraw(ctx);
	}

	draw(ctx: CanvasRenderingContext2D): void { }
	
	_drawDebuging(ctx: CanvasRenderingContext2D): void 
	{
		if (debug_collisionGrid)
		{
			ctx.strokeStyle = "white";
			const gridsLength = 1000;

			for (let i = 0; i < 10; i++)
			{
				ctx.beginPath();
				ctx.moveTo(this._gridSize * i, gridsLength);
				ctx.lineTo(this._gridSize * i, -gridsLength);
				ctx.moveTo(-this._gridSize * i, gridsLength);
				ctx.lineTo(-this._gridSize * i, -gridsLength);
				ctx.moveTo(gridsLength, this._gridSize * i);
				ctx.lineTo(-gridsLength, this._gridSize * i);
				ctx.moveTo(gridsLength, -this._gridSize * i);
				ctx.lineTo(-gridsLength, -this._gridSize * i);
				ctx.stroke();
			}
		}

		if (debug_sceneCenterRings)
		{
			const count = 15;
			const colChange = 255 / count;

			for (let i = 1; i <= count; i++)
			{
				const curColStep = colChange * i;
				ctx.strokeStyle = `#${(255 - curColStep).toString(16)}${curColStep.toString(16)}ff`;
				ctx.beginPath();
				ctx.arc(0, 0, (this._gridSize * i) - 50, 0, 2 * Math.PI);
				ctx.stroke();
			}
		}

		if (debug_sceneCenter)
		{
			ctx.fillStyle = "cyan";
			ctx.beginPath();
			ctx.arc(0, 0, 25, 0, 2 * Math.PI);
			ctx.fill();
		}
	}
	
	onDraw(ctx: CanvasRenderingContext2D): void { }

	// #endregion ==============| Draw |=========================

	// #region ============================================================
	// #region =================| Object Helpers |=========================
	// #region ============================================================

	removeEntity(index: number, layer: Object[], entity: Entity): void
	{
		layer.splice(index, 1);
		if (this.importantObjects[entity.name] != "") delete this.importantObjects[entity.name];
		// if (this.clickableObjects[entity.clickableID]) delete this.clickableObjects[entity.clickableID];
		entity._onDeath();
	}
	
	addEntity(entity: typeof Entity, entityOverrides: Record<string, any> = {})
	{
		entityOverrides["engine"] = this._WorldFather;
		entityOverrides["scene"] = this;

		const newEntity = new entity(entityOverrides);

		this._layers["default"]?.unshift(newEntity);

		if (entityOverrides["name"] != null) this._importantObjects[entityOverrides["name"]] = newEntity;

		newEntity._initialise();
	}

	// #endregion ==============| Object Helpers |=========================

	// --------------------------------------------------------------------------------------------------------------------------------------------------
	// --------------------------------------------------------------------------------------------------------------------------------------------------
	// --------------------------------------------------------------------------------------------------------------------------------------------------

	// #region ==================================================================
	// #region =================| Old / Re-add or kill |=========================
	// #region ==================================================================


	// //Drawing

	// _drawObjects(ctx)
	// {
	// 	this.draw(ctx);
	// 	this._debugDrawing(ctx);

	// 	for (let key in this.layers)
	// 	{
	// 		for (let i = this.layers[key].length - 1; i > -1; i--)
	// 		{
	// 			this.layers[key][i]._draw(ctx);
	// 		};
	// 	}

	// 	this.onDraw(ctx);
	// }

	// draw(ctx) { }

	// _debugDrawing(ctx)
	// {
	// 	if (this.debugCollisionGrid)
	// 	{
	// 		ctx.strokeStyle = "white";
	// 		const gridsLength = 1000;

	// 		for (let i = 0; i < 10; i++)
	// 		{
	// 			ctx.beginPath();
	// 			ctx.moveTo(this.gridSize * i, gridsLength);
	// 			ctx.lineTo(this.gridSize * i, -gridsLength);
	// 			ctx.moveTo(-this.gridSize * i, gridsLength);
	// 			ctx.lineTo(-this.gridSize * i, -gridsLength);
	// 			ctx.moveTo(gridsLength, this.gridSize * i);
	// 			ctx.lineTo(-gridsLength, this.gridSize * i);
	// 			ctx.moveTo(gridsLength, -this.gridSize * i);
	// 			ctx.lineTo(-gridsLength, -this.gridSize * i);
	// 			ctx.stroke();
	// 		}
	// 	}

	// 	if (this.debugSceneCenterRings)
	// 	{
	// 		const count = 15;
	// 		const colChange = 255 / count;

	// 		for (let i = 1; i <= count; i++)
	// 		{
	// 			const curColStep = colChange * i;
	// 			ctx.strokeStyle = `#${(255 - curColStep).toString(16)}${curColStep.toString(16)}ff`;
	// 			ctx.beginPath();
	// 			ctx.arc(0, 0, (this.gridSize * i) - 50, 0, 2 * Math.PI);
	// 			ctx.stroke();
	// 		}
	// 	}

	// 	if (this.debugSceneCenter)
	// 	{
	// 		ctx.fillStyle = "cyan";
	// 		ctx.beginPath();
	// 		ctx.arc(0, 0, 25, 0, 2 * Math.PI);
	// 		ctx.fill();
	// 	}
	// }

	// onDraw(ctx) { }

	// //MouseEvents

	// _mouseEvent(coords, data = {})
	// {
	// 	this.mouseWorldCoords = this.wf.MouseSystem.getWorldCoords(coords);
	// 	this.mouseEvent(this.mouseWorldCoords, coords, data);

	// 	let highestObj = null;
	// 	const layerKeys = Object.keys(this.layers);

	// 	for (let key in this.clickableObjects)
	// 	{
	// 		const obj = this.clickableObjects[key];
	// 		obj._testHover(this.mouseWorldCoords);
	// 		if (obj._isHover && (highestObj === null || layerKeys.indexOf(obj.layer) >= layerKeys.indexOf(highestObj.layer))) highestObj = obj;
	// 	}

	// 	if (highestObj !== null) highestObj.onClicked(this.mouseWorldCoords, coords, data);

	// 	this.onMouseEvent(this.mouseWorldCoords, coords, data);
	// }

	// mouseEvent(worldCoords, coords, data = {}) { }
	// onMouseEvent(worldCoords, coords, data = {}) { }

	// _keyEvent(code, action)
	// {
	// 	this.keyEvent(code, action);
	// 	this.onKeyEvent(code, action);
	// }

	// keyEvent(code, action) { }
	// onKeyEvent(code, action) { }


	// #endregion ==============! Old / Re-add or kill !=========================

	// #region ================================================================
	// #region =================| New to Add somehow |=========================
	// #region ================================================================

	// #region ==========| Drawing |==========

	// ----------| _drawCollisionGrid |----------
	/**
	* Moving this to a scene debug draw not renderer
	*/
	// 	private _drawCollisionGrid()
	// {
	// 	if (this.wf.CollisionDetection.cellsForDebug.length > 0) //--TOFIX: wf.collisionDetection Reference
	// 	{
	// 		const collisionDetectionDebug = this.wf.CollisionDetection.cellsForDebug; //--TOFIX: wf.collisionDetection Reference

	// 		for (let i = 0; i < collisionDetectionDebug.length; i++)
	// 		{
	// 			ctx.fillStyle = collisionDetectionDebug[i][2];
	// 			ctx.beginPath();
	// 			ctx.arc(collisionDetectionDebug[i][0], collisionDetectionDebug[i][1], currentScene.gridSize * 0.25, 0, 2 * Math.PI);
	// 			ctx.fill();
	// 		}
	// 	}
	// }

	// #endregion -------! Drawing !----------

	// #endregion ==============! New to Add somehow !=========================
}