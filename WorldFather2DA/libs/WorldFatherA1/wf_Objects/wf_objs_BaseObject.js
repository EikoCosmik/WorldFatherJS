import { Utils } from "../wf_Utils.js";
import { Empty } from "./wf_objs_Empty.js";

export class BaseObject extends Empty
{
	constructor(inherited = {})
	{
		super(inherited);

		// Internal Variables

		this.dirty = true;
		this.type = inherited.type ?? "Base";

		// Shape Variables

		this.shape = inherited.shape ?? Utils.getShape(4, 45);
		
		this.normals = [];
		this.verticies = [];

		// Draw Variables
		
		this.transform = [[0, 0, 0], [0, 0, 0]];

		// Collision Variables

		this.maxGridRadius = 0;
		this.canCollide = inherited.canCollide ?? false;
		this.gridCells = [];
		this.hasCollidedWith = [];
	}

	onSetup()
	{
		this.forceTransformRecalculate();
		this.initialising = false;
	}

	forceTransformRecalculate()
	{
		this.sin = Math.sin(Utils.getRadians(this.rotation));
		this.cos = Math.cos(Utils.getRadians(this.rotation));
		this.transform[0][2] = this.positionX;
		this.transform[1][2] = this.positionY;
		this.transform[0][0] = this.scaleX * this.cos;
		this.transform[1][1] = this.scaleY * this.cos;
		this.transform[0][1] = -(this.scaleY * this.sin);
		this.transform[1][0] = this.scaleX * this.sin;
		this.dirty = true;
	}

	getProxyHandler()
	{
		const handler =
		{
			set(target, prop, value)
			{
				target[prop] = value;

				if (target.initialising) return true;

				switch (prop)
				{
					case "positionX":
						target.transform[0][2] = value;
						target.dirty = true;
						break;
					case "positionY":
						target.transform[1][2] = value;
						target.dirty = true;
						break;
					case "scaleX":
						target.transform[0][0] = value * target.cos;
						target.transform[1][0] = value * target.sin;
						target.dirty = true;
						break;
					case "scaleY":
						target.transform[0][1] = -(value * target.sin);
						target.transform[1][1] = value * target.cos;
						target.dirty = true;
						break;
					case "rotation":
						target[prop] = Utils.forceMod(target[prop], 360)
						target.sin = Math.sin(Utils.getRadians(value));
						target.cos = Math.cos(Utils.getRadians(value));
						target.transform[0][0] = target.scaleX * target.cos;
						target.transform[1][1] = target.scaleY * target.cos;
						target.transform[0][1] = -(target.scaleY * target.sin);
						target.transform[1][0] = target.scaleX * target.sin;
						target.dirty = true;
						break;
				}

				return true;
			}
		};

		return handler;
	}

	update(dt)
	{
		if (this.dirty) this.updateShape();
		this.hasCollidedWith = [];
		return this.isLive;
	}

	draw(ctx)
	{
		ctx.fillStyle = this.color;
		this.getShapePath(ctx);
		ctx.fill();
	}

	getShapePath(ctx)
	{
		ctx.beginPath();
		for (let i = 0; i < this.verticies.length; i++)
		{
			let vert = this.verticies[i];
			if (i == 0) ctx.moveTo(vert[0], vert[1]);
			else ctx.lineTo(vert[0], vert[1]);
		}
		ctx.closePath();
	}

	updateShape()
	{
		this.calcShape();
		this.calcCollisionGrid();
		this.dirty = false;
	}

	calcShape()
	{
		this.maxGridRadius = -Infinity;
		this.verticies = new Array(this.shape.length);

		for (let i = 0; i < this.shape.length; i++)
		{
			// Calculate vertex
			this.verticies[i] = this.verticies[i] ?? this.getWorldVertex(this.shape[i]);
			this.verticies[(i + 1) % this.verticies.length] = this.verticies[(i + 1) % this.verticies.length] ?? this.getWorldVertex(this.shape[(i + 1) % this.verticies.length]);
			let vertexOne = this.verticies[i];
			let vertexTwo = this.verticies[(i + 1) % this.verticies.length];

			// Calculate normals
			const dx = vertexTwo[0] - vertexOne[0];
			const dy = vertexTwo[1] - vertexOne[1];
			const normalX = -dy;
			const normalY = dx;
			const length = Math.sqrt(normalX * normalX + normalY * normalY);
			this.normals[i] = [(length > 0) ? normalX / length : normalX, (length > 0) ? normalY / length : normalY];

			// Calculate maxGridRadius
			const positionDx = this.positionX - vertexOne[0];
			const positionDy = this.positionY - vertexOne[1];
			const distance = Utils.absolute(Math.sqrt(positionDx * positionDx + positionDy * positionDy));
			if (distance > this.maxGridRadius) this.maxGridRadius = distance;
		}
	}

	calcCollisionGrid()
	{
		//Grab Used Variables
		const posX = this.positionX;
		const posY = this.positionY;
		const gridSize = this.scene.gridSize;

		//Calculate GridCell for maximum cardinals
		const UpDownX = Math.floor(posX / gridSize);
		const LeftRightY = Math.floor(posY / gridSize);
		const upY = Math.floor((posY - this.maxGridRadius) / gridSize);
		const downY = Math.floor((posY + this.maxGridRadius) / gridSize);
		const leftX = Math.floor((posX - this.maxGridRadius) / gridSize);
		const rightX = Math.floor((posX + this.maxGridRadius) / gridSize);
		const gridCells = [[UpDownX, upY], [UpDownX, downY], [leftX, LeftRightY], [rightX, LeftRightY]];

		this.gridCells = gridCells;
	}

	getWorldVertex(shapeIn)
	{
		let point = [...shapeIn, 1];
		let outX = Utils.dotProduct(point, this.transform[0]);
		let outY = Utils.dotProduct(point, this.transform[1]);
		return [outX, outY];
	}
}