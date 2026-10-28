import { Utils } from "../wf_Utils.js";

export class Empty
{
	constructor(inherited = {})
	{
		this.initialising = true;

		this.positionX = inherited.positionX ?? 0;
		this.positionY = inherited.positionY ?? 0;
		this.rotation = inherited.rotation ?? 0;
		this.scaleX = inherited.scaleX ?? 50;
		this.scaleY = inherited.scaleY ?? 50;
		this.sin = Math.sin(Utils.getRadians(this.rotation));
		this.cos = Math.cos(Utils.getRadians(this.rotation));
		this.type = inherited.type ?? "Empty";

		this.color = inherited.color ?? "Cyan";
		
		this.id = Symbol("UID");
		this.isLive = true;

		this.debugCross = true;

		return new Proxy(this, this.getProxyHandler());
	}

	getWidth()
	{
		return this.scaleX;
	}

	getHeight()
	{
		return this.scaleY;
	}

	onSetup()
	{
		this.initialising = false;
	}

	isReady()
	{
		return this.initialising;
	}

	getProxyHandler()
	{
		const handler =
		{
			set(target, prop, value)
			{
				target[prop] = value;

				switch (prop)
				{
					case "rotation":
						target.sin = Math.sin(Utils.getRadians(value));
						target.cos = Math.cos(Utils.getRadians(value));
						break;
				}

				return true;
			}
		};
		
		return handler;
	}

	update(dt)
	{
		return this.isLive;
	}

	draw(ctx)
	{
		if(this.debugCross)
		{
			ctx.beginPath();
			Utils.drawLineFromTo(ctx, this.positionX, this.positionY, this.positionX, this.positionY + 25, this.positionX, this.positionY, this.rotation);
			Utils.drawLineFromTo(ctx, this.positionX, this.positionY, this.positionX, this.positionY - 25, this.positionX, this.positionY, this.rotation);
			Utils.drawLineFromTo(ctx, this.positionX, this.positionY, this.positionX + 25, this.positionY , this.positionX, this.positionY, this.rotation);
			Utils.drawLineFromTo(ctx, this.positionX, this.positionY, this.positionX - 25, this.positionY, this.positionX, this.positionY, this.rotation);

			Utils.drawLineFromTo(ctx, this.positionX + 25, this.positionY, this.positionX + 15, this.positionY + 15, this.positionX, this.positionY, this.rotation);
			Utils.drawLineFromTo(ctx, this.positionX + 25, this.positionY, this.positionX + 15, this.positionY - 15, this.positionX, this.positionY, this.rotation);
			ctx.closePath();
			ctx.lineWidth = 2;
			ctx.strokeStyle = "red";
			ctx.stroke();
		}
	}

	onDeath() { }
	gridDraw(ctx, cell) { }
	
	gridUpdate(dt, cell)
	{
		if(cell)
		{
			this.positionX = cell.centerX;
			this.positionY = cell.centerY;
		}
		this.dirty = true;
	}
}