import { Empty } from "./wf_objs_Empty.js";
import { Utils } from "../wf_Utils.js";

export class GridCell extends Empty
{
	constructor(inherited = {})
	{
		super(inherited);
		this.tag = inherited.tag ?? "Base";
		this.shape = inherited.shape ?? Utils.getShape(4);		
		this.color = inherited.color ?? "magenta";
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

	setupCamera(ctx)
	{
		ctx.save();
		ctx.translate(this.parent.positionX, this.parent.positionY);
		ctx.rotate(Utils.getRadians(this.rotation));
		ctx.translate(this.positionX, this.positionY);
		ctx.scale(this.scaleX, this.scaleY);
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
}