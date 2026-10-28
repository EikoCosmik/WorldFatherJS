import { Utils } from "../wf_Utils.js";
import { Empty } from "./wf_objs_Empty.js";

export class Solid extends Empty
{
	constructor(inherited = {})
	{
		super(inherited);

		this.tag = inherited.tag ?? "Solid";

		this.isEllipse = inherited.isEllipse ?? false;
		this.shape = inherited.shape ?? Utils.getShape(4);		
		this.color = inherited.color ?? "magenta";

		this.verticies = [];
		this.normals = [];

		this.ddVerticies = inherited.ddVerticies ?? false;
		this.ddBoundingBox = inherited.ddBoundingBox ?? false;
		this.ddNormals = inherited.ddNormals ?? false;
	}

	draw(ctx)
	{
		ctx.fillStyle = this.color;
		ctx.save();
		this.setupCamera(ctx);
		this.getPath(ctx);
		ctx.fill();
		if (this.dDraw) this.debugDrawing(ctx);
		ctx.restore();
	}

	getPath(ctx)
	{
		ctx.beginPath();

		if(this.isEllipse)
		{
			ctx.ellipse(0, 0, 0.5, 0.5, 0, 0, 2 * Math.PI);
		}
		else
		{
			for (let i = 0; i < this.shape.length; i++)
			{
				if (i == 0) ctx.moveTo(this.shape[i][0] * this.width, this.shape[i][1] * this.height);
				ctx.lineTo(this.shape[i][0] * this.width, this.shape[i][1] * this.height);
			}
		}

		ctx.closePath();
	}

	debugDrawing(ctx)
	{
		ctx.save();
		this.resetCamera(ctx);
		
		if(!this.isEllipse)
		{
			ctx.lineWidth = 3;
			if(this.ddVerticies)
			{
				ctx.strokeStyle = "cyan";
				for (let i = 0; i < this.verticies.length; i++)
				{
					ctx.beginPath();
					const vertex = this.verticies[i];
					ctx.arc(vertex[0], vertex[1], 5, 0, 2 * Math.PI);
					ctx.stroke();
				}
			} 
			if (this.ddBoundingBox)
			{
				ctx.strokeStyle = "red";
				ctx.beginPath();
				for (let i = 0; i < this.verticies.length; i++)
				{
					const vertex = this.verticies[i];
					if (i == 0) ctx.moveTo(vertex[0], vertex[1]);
					ctx.lineTo(vertex[0], vertex[1]);
				}
				ctx.closePath();
				ctx.stroke();
			}
			if (this.ddNormals)
			{
				ctx.strokeStyle = "blue";
				for (let i = 0; i < this.normals.length; i++)
				{
					const normal = this.normals[i];
					ctx.beginPath();
					ctx.moveTo(this.positionX - normal[0] * this.width, this.positionY - normal[1] * this.height);
					ctx.lineTo(this.positionX, this.positionY);
					ctx.closePath();
					ctx.stroke();
				}
			}
		}
		else
		{
			ctx.fillStyle = this.color;
			ctx.strokeStyle = "red";
			ctx.lineWidth = 5;		
			ctx.beginPath();
			ctx.ellipse(this.positionX, this.positionY, this.width * 0.5, this.height * 0.5, Utils.getRadians(this.rotation), 0, 2 * Math.PI);
			ctx.closePath();
			ctx.stroke();
			ctx.fill();
		}
		
		ctx.restore();
		
		super.debugDrawing(ctx);
	}

	updateWorldData()
	{
		super.updateWorldData();
		this.updateWorldShape();
	}

	updateWorldShape()
	{
		let verticies = new Array(this.shape.length);
		const normals = [];
		
		if(this.isEllipse)
		{
			verticies = (this.parent !== null) ? [this.positionX + this.parent.positionX, this.positionY + this.parent.positionY] :	[this.positionX, this.positionY];
		}
		else
		{
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
			}
		}

		this.verticies = verticies;
		this.normals = normals;
	}

	getWorldVertex(shapeIn)
	{
		const scaledX = shapeIn[0] * this.width;
		const scaledY = shapeIn[1] * this.height;

		if(this.parent !== null)
		{
			const parentPos = this.getGlobalPosition();
			const parentRotation = this.getGlobalRotation();
			const parentCos = Math.cos(Utils.getRadians(parentRotation));
			const parentSin = Math.sin(Utils.getRadians(parentRotation));

			const rotatedX = (scaledX * parentCos) - (scaledY * parentSin);
			const rotatedY = (scaledX * parentSin) + (scaledY * parentCos);

			const outX = rotatedX + this.positionX + parentPos[0];
			const outY = rotatedY + this.positionY + parentPos[1];
			return [outX, outY];
		}
		else
		{
			const rotatedX = (scaledX * this.cos) - (scaledY * this.sin);
			const rotatedY = (scaledX * this.sin) + (scaledY * this.cos);

			const outX = rotatedX + this.positionX;
			const outY = rotatedY + this.positionY;
			return [outX, outY];
		}
	}
}