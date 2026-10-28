import { DefaultObj } from "../wf_objs_DefaultObject/wf_objs_DefaultObj.js";

export class StatusBar extends DefaultObj
{
	constructor(inherited = {}) { super(inherited); }

	onSetup()
	{		
		this.isInverted = this.overrides.isInverted ?? false;
		this.isVerticle = this.overrides.isVerticle ?? false;
		this.inversePercent = this.overrides.inversePercent ?? 0;
		this.value = this.overrides.value ?? 100;
		this.percent = 1;
		this.max = this.overrides.max ?? 100;
		this.min = this.overrides.min ?? 0;
	}

	draw(ctx)
	{
		ctx.fillStyle = this.color;
		this.getPath(ctx);
		ctx.fill();
		ctx.fillStyle = "lime";
		this.getFillPath(ctx);
		ctx.fill();
	}

	getFillPath(ctx)
	{
		ctx.beginPath();
		
		let fill = 0;

		if (this.isVerticle)
		{
			fill = this.height * this.percent;
			const minX = this.halfWidth;
			const minY = -this.halfHeight;

			if(this.isInverted)
			{
				ctx.moveTo(minX, minY);
				ctx.lineTo(minX, minY + fill);
				ctx.lineTo(-minX, minY + fill);
				ctx.lineTo(-minX, minY);
			}
			else
			{
				ctx.moveTo(minX, -minY);
				ctx.lineTo(minX, -minY - fill);
				ctx.lineTo(-minX, -minY - fill);
				ctx.lineTo(-minX, -minY);
			}
		}
		else
		{
			fill = this.width * this.percent;
			const minX = -this.halfWidth; 
			const minY = -this.halfHeight;

			if (this.isInverted)
			{
				ctx.moveTo(-minX, minY);
				ctx.lineTo(-minX - fill, minY);
				ctx.lineTo(-minX - fill, -minY);
				ctx.lineTo(-minX, -minY);
			}
			else
			{
				ctx.moveTo(minX, minY);
				ctx.lineTo(minX + fill, minY);
				ctx.lineTo(minX + fill, -minY);
				ctx.lineTo(minX, -minY);
			}
		}

		ctx.closePath();
	} 
	
	updateStat(inStat)
	{
		this.value = this.wf.Utils.clamp(inStat, this.min, this.max);
		this.percent = this.value / this.max;
		this.inversePercent = 1 - this.percent;
	}

	onAdoption(parent)
	{
		this.parent = parent;

		if (this.useParentSize)
		{
			this.width = parent.width;
			this.height = parent.height;
		}
	}
}