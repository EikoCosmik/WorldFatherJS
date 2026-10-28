import { ErrorManager } from "../../wf_ErrorManager.js";
import { Utils } from "../../wf_Utils.js";
import { Point2D } from "../../wf_CustomTypes.js";
import { debug_EntityDirection, debug_EntityBoundingBox, debug_EntityNormals, debug_EntityVerticies } from "../../wf_DebugSwitches.js";
import { WorldFather2D } from "../../WorldFather2D.js";
import { Scene } from "../../wf_Scenes/wf_Scene.js";
import { WFColors, WFColor, WFColorUtils } from "../../wf_Colors.js";

export class Entity
{
	private _id: symbol = Symbol("UID");
	get id(): symbol { return this._id; }

	private _name: string;
	get name(): string { return this._name; }

	private _ready: boolean;
	get ready(): boolean { return this._ready; }

	private _dirtyData: boolean = true;
	get dirtyData(): boolean { return this._dirtyData; }

	private _isLive: boolean;
	get isLive(): boolean { return this._isLive; }
	set isLive(value: boolean) { this._isLive = value; }

	private _scaleX: number;
	get scaleX(): number { return this._scaleX; }
	set scaleX(value: number) { this._scaleX = value; this._dirtyData = true; }

	private _scaleY: number;
	get scaleY(): number { return this._scaleY; }
	set scaleY(value: number) { this._scaleY = value; this._dirtyData = true; }

	private _positionX: number;
	get positionX(): number
	{
		this._dirtyData = true;
		return this._positionX;
	}
	set positionX(value: number) { this._positionX = value; this._dirtyData = true; }

	private _positionY: number;
	get positionY(): number
	{
		this._dirtyData = true;
		return this._positionY; 
	}
	set positionY(value: number) { this._positionY = value; this._dirtyData = true; }

	private _rotation: number = 0;
	get rotation(): number { return this._rotation; }
	set rotation(value: number)
	{ 
		this._rotation = Utils.forceMod(value, 360); 
		const sin = Math.sin(Utils.getRadians(this._rotation)); 
		const cos = Math.cos(Utils.getRadians(this._rotation)); 
		this._sin = sin;
		this._cos = cos;
		this._forwardX = cos;
		this._forwardY = sin;
		this._rightX = -sin;
		this._rightY = cos;
		this._leftX = sin;
		this._leftY = -cos;
		this._backX = -cos; 
		this._backY = -sin;
		this._dirtyData = true;
	}
	
	private _sin: number = 0;
	get sin(): number { return this._sin; }

	private _cos: number = 0;
	get cos(): number { return this._cos; }

	private _forwardX: number = 0;
	get forwardX(): number { return this._forwardX; }

	private _forwardY: number = 0;
	get forwardY(): number { return this._forwardY; }

	private _rightX: number = 0;
	get rightX(): number { return this._rightX; }

	private _rightY: number = 0;
	get rightY(): number { return this._rightY; }

	private _leftX: number = 0;
	get leftX(): number { return this._leftX; }

	private _leftY: number = 0;
	get leftY(): number { return this._leftY; }

	private _backX: number = 0;
	get backX(): number { return this._backX; }

	private _backY: number = 0;
	get backY(): number { return this._backY; }

	private _worldPositionX: number;
	get worldPositionX(): number
	{
		if (this.dirtyData) this._updateWorldData(); 
		return this._worldPositionX;
	}

	private _worldPositionY: number;
	get worldPositionY(): number 
	{
		if (this.dirtyData) this._updateWorldData();
		return this._worldPositionY;
	}

	private _worldRotation: number;
	get worldRotation(): number
	{
		if (this.dirtyData) this._updateWorldData(); 
		return this._worldRotation;
	}
	set worldRotation(value: number)
	{
		this._worldSin = Math.sin(Utils.getRadians(value));
		this._worldCos = Math.cos(Utils.getRadians(value));
		this._worldRotation = value
	}

	private _worldSin: number = 0;

	private _worldCos: number = 0;
	
	private _width: number = 0;
	get width(): number { return this._width; }
	set width(value: number) { this._width = value; this._halfWidth = value * 0.5; this._dirtyData = true; }
	
	private _height: number = 0;
	get height(): number { return this._height; }
	set height(value: number) { this._height = value; this._halfHeight = value * 0.5; this._dirtyData = true; }
	
	private _halfWidth: number = 0;
	get halfWidth(): number { return this._halfWidth; }
	
	private _halfHeight: number = 0;
	get halfHeight(): number { return this._halfHeight; }
	
	private _startTime: number;
	get startTime(): number { return this._startTime; }
	
	private _shape: Point2D[];
	get shape(): Point2D[] { return this._shape; }
	
	private _color: WFColor;
	get color(): WFColor { return this._color; }
	set color(value: WFColor) { this._color = value; }
	
	private _WorldFather: WorldFather2D;
	get WorldFather(): WorldFather2D { return this._WorldFather; }

	private _Scene: Scene;
	get Scene(): Scene { return this._Scene }
	
	private _collisionGridCells: any[];
	get collisionGridCells(): any[] { return this._collisionGridCells; }
	
	private _collisionTestedAgainst: any[];
	get collisionTestedAgainst(): any[] { return this._collisionTestedAgainst; }

	private _usingCollision: boolean = false;
	get usingCollision(): boolean { return this._usingCollision; }
	set usingCollision(value: boolean) { this._usingCollision = value; }
	
	private _verticies: Point2D[] = [];
	get verticies(): Point2D[] { return this._verticies; }
	
	private _normals: Point2D[] = [];
	get normals(): Point2D[] { return this._normals; }

	private _entityReference: Record<string, Entity> = {};
	get entityReference(): Record<string, Entity> { return this._entityReference; }

	private _parent: Entity | undefined;
	get parent(): Entity | undefined { return this._parent; }

	protected _debugExtras: Record<string, any> = {};

	constructor(inherited: Record<string, any> = {})
	{
		this._WorldFather = inherited["engine"];
		this._Scene = inherited["scene"];
		this._id = Symbol("UID");
		this._name = inherited["name"] ?? "";
		this._ready = false;
		this._isLive = inherited["isLive"] ?? true;
		this._positionX = inherited["positionX"] ?? 0;
		this._positionY = inherited["positionY"] ?? 0;
		this._worldPositionX = inherited["positionX"] ?? 0;
		this._worldPositionY = inherited["positionY"] ?? 0;
		this._scaleX = inherited["scaleX"] ?? 1;
		this._scaleY = inherited["scaleY"] ?? 1;
		this.rotation = inherited["rotation"] ?? 0;
		this._worldRotation = inherited["rotation"] ?? 0;
		this._width = inherited["width"] ?? 100;
		this._height = inherited["height"] ?? 100;
		this._color = inherited["color"] ?? WFColors.magenta;
		this._startTime = Date.now();
		this._collisionGridCells = [];
		this._collisionTestedAgainst = [];
		this._shape = inherited["shape"] ?? Utils.getShape(4);
	}

	// #region ================================================================
	// #region =================| Setup & Initialise |=========================
	// #region ================================================================

	_initialise(): void 
	{
		this._ready = true;
		this.onSetup();
	}

	onSetup(): void { }

	// #endregion ==============| Setup & Initialise |=========================

	// #region ====================================================
	// #region =================| Update |=========================
	// #region ====================================================

	_update(dt: number): void
	{
		this._collisionTestedAgainst = [];
		if (this.parent != null)
		{
			if (this.parent.dirtyData == true) this._dirtyData = true;
			if (this.parent.isLive == false) this.isLive = false;
		}
		if (this._dirtyData) this._updateWorldData();
		this.update(dt);
		this.onUpdate(dt);
	}

	update(dt: number): void { }

	onUpdate(dt: number): void { }

	// #endregion ==============| Update |=========================

	// #region ==================================================
	// #region =================| Draw |=========================
	// #region ==================================================

	_draw(ctx: CanvasRenderingContext2D): void
	{
		ctx.save();
		this.draw(ctx);
		this._drawDebuging?.(ctx);
		ctx.restore();
	}

	draw(ctx: CanvasRenderingContext2D): void
	{
		ctx.fillStyle = this._color.toString();
		
		this._getPath(ctx);
		ctx.fill();
	}

	_getPath(ctx: CanvasRenderingContext2D)
	{
		ctx.beginPath();
		for (let i = 0; i < this._verticies.length; i++)
		{
			const vert = ErrorManager.setIfExists(this._verticies[i], `wf_Entity.draw(): this._verticies[i] did not exist, setting vert`);
			if (i == 0) ctx.moveTo(vert.x, vert.y);
			else ctx.lineTo(vert.x, vert.y);
		}
		ctx.closePath();
	}

	_drawDebuging(ctx: CanvasRenderingContext2D)
	{
		if (debug_EntityVerticies)
		{
			for (let i = 0; i < this.verticies.length; i++)
			{
				ctx.beginPath();
				const vertex = ErrorManager.setIfExists(this.verticies[i], `wf_Entity_Debugging._drawDebuging(): this.verticies[i] did not exist, setting vertex`);
				ctx.arc(vertex.x, vertex.y, 10, 0, 2 * Math.PI);

				const color = (this._debugExtras["debugPrimaryColor"] != null) ? this._debugExtras["debugPrimaryColor"] : this._debugExtras["debugPrimaryColor"] = WFColorUtils.hueRotate(this._color, 130);

				ctx.strokeStyle = color;
				ctx.lineWidth = 4;
				ctx.stroke();
			}
		}

		if (debug_EntityBoundingBox)
		{
			ctx.save();
			this._getPath(ctx);
			ctx.clip();
			ctx.beginPath();
			for (let i = 0; i < this.verticies.length; i++)
			{
				const vertex = ErrorManager.setIfExists(this.verticies[i], `wf_Entity_Debugging._drawDebuging(): this.verticies[i] did not exist, setting vertex`);

				if (i == 0) ctx.moveTo(vertex.x, vertex.y);
				ctx.lineTo(vertex.x, vertex.y);
			}
			ctx.closePath();

			const color = (this._debugExtras["debugSecondaryColor"] != null) ? this._debugExtras["debugSecondaryColor"] : this._debugExtras["debugSecondaryColor"] = WFColorUtils.hueRotate(this._color, 230);

			ctx.strokeStyle = color;
			ctx.lineWidth = 8;
			ctx.stroke();
			ctx.restore();
		}

		if (debug_EntityNormals)
		{
			for (let i = 0; i < 4; i++)
			{
				const normal = ErrorManager.setIfExists(this.normals[i], `wf_Entity_Debugging._drawDebuging(): this.normals[i] did not exist, setting normal`);

				ctx.beginPath();
				ctx.moveTo(this.worldPositionX - normal.x * this.width, this.worldPositionY - normal.y * this.height);
				ctx.lineTo(this.worldPositionX, this.worldPositionY);
				ctx.closePath();

				const color = (this._debugExtras["debugTertiaryColor"] != null) ? this._debugExtras["debugTertiaryColor"] : this._debugExtras["debugTertiaryColor"] = WFColorUtils.hueRotate(this._color, 65);

				ctx.strokeStyle = color;
				ctx.lineWidth = 4;
				ctx.stroke();
			}
		}

		if (debug_EntityDirection)
		{
			const tip = this.getWorldVertex({ x: 0.5, y: 0 })
			const up = this.getWorldVertex({ x: 0.25, y: 0.25 })
			const down = this.getWorldVertex({ x: 0.25, y: -0.25 })

			ctx.beginPath();
			ctx.moveTo(up.x, up.y);
			ctx.lineTo(tip.x, tip.y);
			ctx.lineTo(down.x, down.y)
			ctx.moveTo(tip.x, tip.y);
			ctx.lineTo(this.worldPositionX, this.worldPositionY);
			ctx.closePath();

			ctx.strokeStyle = this._color.invertString();
			ctx.lineWidth = 4;
			ctx.stroke();
		}
	}

	onDraw(ctx: CanvasRenderingContext2D): void { }

	_resetCamera(ctx: CanvasRenderingContext2D)
	{
		ctx.resetTransform();
		this._WorldFather._setupGlobalCamera();
	}

	// #endregion ==============| Draw |=========================

	// #region =======================================================
	// #region =================| Collision |=========================
	// #region =======================================================

	getGridCells()
	{
		if (this._collisionGridCells.length < 1) this._updateWorldData();
		return this._collisionGridCells;
	}

	_calcCollisionGridCells()
	{
		const scene = this._WorldFather.currentScene;

		const leftX = Math.floor((this._worldPositionX - this._width * 0.5) / scene.gridSize);
		const rightX = Math.floor((this._worldPositionX + this._width * 0.5) / scene.gridSize);
		const upY = Math.floor((this._worldPositionY - this._height * 0.5) / scene.gridSize);
		const downY = Math.floor((this._worldPositionY + this._height * 0.5) / scene.gridSize);

		const distanceX = rightX - leftX;
		const distanceY = downY - upY;

		const gridCells = [];

		for (let i = 0; i < distanceX + 1; i++)
		{
			for (let j = 0; j < distanceY + 1; j++)
			{
				gridCells.push([leftX + i, upY + j]);
			}
		}

		this._collisionGridCells = gridCells;
	}

	onCollision(collidedObject: Entity) { }

	// #endregion ==============| Collision |=========================

	// #region ===========================================================
	// #region =================| WorldPosition |=========================
	// #region ===========================================================

	_updateWorldData(): void
	{
		this.updateWorldData();
		this._setWorldRotation();
		this._setWorldPosition();
		this._updateWorldShape();
		if (this._usingCollision != null) this._calcCollisionGridCells();
		this._dirtyData = false;
		this.onUpdateWorldData();
	}

	updateWorldData(): void { }
	onUpdateWorldData(): void { }

	_setWorldPosition(): void
	{
		let outPosX = this._positionX;
		let outPosY = this._positionY;

		if (this.parent != null)
		{
			const parent = this.parent;
			const parentPosX = parent.positionX;
			const parentPosY = parent.positionY;
			const parentRotation = parent.rotation;
			outPosX = outPosX + parentPosX;
			outPosY += parentPosY;
			const rotated = Utils.rotatePoint(outPosX, outPosY, parentRotation, parentPosX, parentPosY);
			outPosX = rotated[0];
			outPosY = rotated[1];
		}

		this._worldPositionX = outPosX;
		this._worldPositionY = outPosY;
	}

	_setWorldRotation(): void
	{
		let outRotation = this.rotation;

		if (this.parent != null)
		{
			const parent = this.parent;
			const parentRotation = parent.worldRotation;
			outRotation = parentRotation;
		}

		this.worldRotation = outRotation;
	}

	getWorldVertex(vertexIn: Point2D): any
	{
		const scaledX = vertexIn.x * this._width;
		const scaledY = vertexIn.y * this._height;
		const rotatedX = (scaledX * this._worldCos) - (scaledY * this._worldSin);
		const rotatedY = (scaledX * this._worldSin) + (scaledY * this._worldCos);
		const outX = rotatedX + this._worldPositionX;
		const outY = rotatedY + this._worldPositionY;
		return { x: outX, y: outY };
	}

	_updateWorldShape(): void
	{
		let verticies: any[] = [null, null, null, null];
		const normals = [];

		for (let i = 0; i < this._shape.length; i++)
		{			
			// Calculate vertex
			verticies[i] = (verticies[i] != null) ? verticies[i] : this.getWorldVertex(ErrorManager.setIfExists(this._shape[i], `wf_Entity_WorldData._updateWorldShape(): this.shape[i] did not exist, setting verticies[i]`));
			verticies[(i + 1) % verticies.length] = (verticies[(i + 1) % verticies.length] != null) ? verticies[(i + 1) % verticies.length] : this.getWorldVertex(ErrorManager.setIfExists(this._shape[(i + 1) % verticies.length], `wf_Entity_WorldData._updateWorldShape(): this.shape[i] did not exist, setting verticies[(i + 1) % verticies.length]`));

			let vertexOne = ErrorManager.setIfExists(verticies[i], `wf_Entity_WorldData._updateWorldShape(): verticies[i] did not exist, setting vertexOne`);
			let vertexTwo = ErrorManager.setIfExists(verticies[(i + 1) % verticies.length], `wf_Entity_WorldData._updateWorldShape(): verticies[secondVertFix] did not exist, setting vertexTwo`);

			// Calculate normals				
			const dx = (vertexTwo.x - vertexOne.x);
			const dy = (vertexTwo.y - vertexOne.y);
			const nx = -dy;
			const ny = dx;
			const length = Math.sqrt(nx * nx + ny * ny);
			normals[i] = { x: (length > 0) ? nx / length : 0, y: (length > 0) ? ny / length : 0 };
		}
		
		this._verticies = verticies;
		this._normals = normals;
	}

	// #endregion ==============| WorldData |=========================

	// #region ===================================================
	// #region =================| Death |=========================
	// #region ===================================================

	_onDeath(): void
	{
		this.onDeath();
	}

	onDeath(): void { }

	// #endregion ==============| Death |=========================

	// #region ==============================================================
	// #region =================| Entity Reference |=========================
	// #region ==============================================================

	public addReference(entity: Entity): void
	{
		this._entityReference[entity.name] = entity;
	}

	public setParent(entity: Entity): void
	{
		this._parent = entity;
	}

	// #endregion ==============| Entity Reference |=========================

}