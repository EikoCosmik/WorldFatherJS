import { DefaultObj } from "../wf_objs_DefaultObject/wf_objs_DefaultObj.js";

export class Camera extends DefaultObj
{
	constructor(inherited = {}) { super(inherited); }

	onSetup()
	{
		this.tag = "_Camera";
		this.useWorldData = true;
		this.useParentChild = true;
	}
	
	_drawDebuging(ctx)
	{
		if (this.useWorldData)
		{
			ctx.save();
			this._resetCamera(ctx);
			ctx.lineWidth = 3;

			if (this.debugVerticies)
			{
				ctx.strokeStyle = "magenta";
				for (let i = 0; i < this.verticies.length; i++)
				{
					ctx.beginPath();
					const vertex = this.verticies[i];
					ctx.arc(vertex[0], vertex[1], 5, 0, 2 * Math.PI);
					ctx.stroke();
				}
			}

			if (this.debugBoundingBox)
			{
				ctx.strokeStyle = "lime";
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

			if (this.debugNormals)
			{
				ctx.strokeStyle = "yellow";

				for (let i = 0; i < this.normals.length; i++)
				{
					const normal = this.normals[i];
					ctx.beginPath();
					ctx.moveTo(this.worldPositionX - normal[0] * this.width, this.worldPositionY - normal[1] * this.height);
					ctx.lineTo(this.worldPositionX, this.worldPositionY);
					ctx.closePath();
					ctx.stroke();
				}
			}

			ctx.restore();
		}

		if (this.debugCenterCross)
		{
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(this.halfWidth, 0)
			ctx.lineTo(-this.halfWidth, 0)
			ctx.moveTo(0, this.halfHeight)
			ctx.lineTo(0, -this.halfHeight)
			ctx.closePath();
			ctx.strokeStyle = "cyan";
			ctx.stroke();
			ctx.strokeStyle = "white";
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(this.halfWidth, 0);
			ctx.closePath();
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(this.halfWidth, 0);
			ctx.lineTo(this.halfWidth * 0.5, -this.halfHeight * 0.5);
			ctx.closePath();
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(this.halfWidth, 0);
			ctx.lineTo(this.halfWidth * 0.5, this.halfHeight * 0.5)
			ctx.closePath();
			ctx.stroke();
		}
	}

	draw(ctx) {}
}