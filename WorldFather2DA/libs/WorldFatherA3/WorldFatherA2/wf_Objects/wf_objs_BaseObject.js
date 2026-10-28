import { Utils } from "../wf_Utils.js";
import { Empty } from "./wf_objs_Empty.js";

export class BaseObject extends Empty
{
	constructor(inherited = {})
	{
		super(inherited);

		this.tag = inherited.tag ?? "Base";

		this.worldDirty = true;
		this.shape = inherited.shape ?? Utils.getShape(4);		
		this.color = inherited.color ?? "magenta";
		this.canCollide = inherited.canCollide ?? false;

		this.verticies = [];
		this.normals = [];

		this.maxRadius = -Infinity;
		this.collisionGridCells = [];
		this.hasCollidedWith = [];
	}

	update(dt)
	{
		this.hasCollidedWith = [];
		return super.update(dt);
	}

	draw(ctx)
	{
		ctx.fillStyle = this.color;
		this.setupCamera(ctx);
		this.getPath(ctx);
		ctx.fill();
		this.restoreCamera(ctx);
	}

	getPath(ctx)
	{
		ctx.beginPath();
		for (let i = 0; i < this.shape.length; i++)
		{
			if (i == 0) ctx.moveTo(this.shape[i][0], this.shape[i][1]);
			ctx.lineTo(this.shape[i][0], this.shape[i][1]);
		}
		ctx.closePath();
	}

	getGridCells()
	{
		if(this.worldDirty) this.updateWorldData();
		return this.gridCells;
	}

	updateWorldData()
	{
		this.updateWorldShape();		
		this.calcCollisionGridCells();
		this.dirty = false;
	}

	updateWorldShape()
	{
		let maxRadius = -Infinity;
		const verticies = new Array(this.shape.length);
		const normals = [];

		for (let i = 0; i < this.shape.length; i++)
		{
			// Calculate vertex
			verticies[i] = verticies[i] ?? this.getWorldVertex(this.shape[i]);
			verticies[(i + 1) % verticies.length] = verticies[(i + 1) % verticies.length] ?? this.getWorldVertex(this.shape[(i + 1) % verticies.length]);
			let vertexOne = verticies[i]; 
			let vertexTwo = verticies[(i + 1) % verticies.length];

			// Calculate normals
			const dx = vertexTwo[0] - vertexOne[0];
			const dy = vertexTwo[1] - vertexOne[1];
			const normalX = -dy;
			const normalY = dx;
			const length = Math.sqrt(normalX * normalX + normalY * normalY); 
			normals[i] = [(length > 0) ? normalX / length : normalX, (length > 0) ? normalY / length : normalY];
			
			// Calculate maxGridRadius
			const positionDx = this.positionX - vertexOne[0];
			const positionDy = this.positionY - vertexOne[1];
			const distance = Utils.absolute(Math.sqrt(positionDx * positionDx + positionDy * positionDy)); 
			if (distance > maxRadius) maxRadius = distance;
		}

		this.maxRadius = maxRadius;
		this.verticies = verticies;
		this.normals = normals;
	}
	
	getWorldVertex(shapeIn)
	{		
		const scaledX = shapeIn[0] * this.scaleX;
		const scaledY = shapeIn[1] * this.scaleY;
		const rotatedX = (scaledX * this.cos) - (scaledY * this.sin);
		const rotatedY = (scaledX * this.sin) + (scaledY * this.cos);
		const outX = rotatedX + this.positionX;
		const outY = rotatedY + this.positionY;

		return [outX, outY];
	}

	calcCollisionGridCells()
	{
		const UpDownX = Math.floor(this.positionX / this.scene.gridSize);
		const LeftRightY = Math.floor(this.positionY / this.scene.gridSize);

		const leftX = Math.floor((this.positionX - this.maxRadius) / this.scene.gridSize);
		const rightX = Math.floor((this.positionX + this.maxRadius) / this.scene.gridSize);

		const upY = Math.floor((this.positionY - this.maxRadius) / this.scene.gridSize);
		const downY = Math.floor((this.positionY + this.maxRadius) / this.scene.gridSize);

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

		this.gridCells = gridCells;
	}
}