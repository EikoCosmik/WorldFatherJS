import { Utils } from "../wf_Utils.js";

export class Empty
{
	constructor(inherited = {})
	{
		//Internal safeguard against early Proxy triggers
		this.initialising = true;

		// Physical variables
		this.positionX = inherited.positionX ?? 0;
		this.positionY = inherited.positionY ?? 0;
		this.scaleX = inherited.scaleX ?? 100;
		this.scaleY = inherited.scaleY ?? 100;
		this.rotation = inherited.rotation ?? 0;

		// Included as a cache
		this.cos = Math.cos(Utils.getRadians(this.rotation));
		this.sin = Math.sin(Utils.getRadians(this.rotation));

		// Helpful Direction references
		this.forwardX = this.cos;
		this.forwardY = this.sin;
		this.rightX = -this.sin;
		this.rightY = this.cos;
		this.leftX = this.sin;
		this.leftY = -this.cos;
		this.backX = -this.cos;
		this.backY = -this.sin;

		// Identity variabels
		this.id = Symbol("UID");
		this.isLive = true;
		this.tag = inherited.tag ?? "Empty";
		this.parent = inherited.parent ?? null;
		
		// Debug toggles
		this.debugDrawCross = inherited.debugDrawCross ?? false;
		this.debugDrawForward = inherited.debugDrawForward ?? false;

		//Let Empty return the proxy, do not re-return just overwrite getProxyHandler()
		return new Proxy(this, this.getProxyHandler());
	}

	// After Construction but before added to scene (Needed for referencing this.scene or this.engine)
	onSetup()
	{
		this.initialising = false;
	}

	// Variable update automation, override as required but include the parents code still
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
						target.forwardX = target.cos;
						target.forwardY = target.sin;
						target.rightX = -target.sin;
						target.rightY = target.cos;
						target.leftX = target.sin;
						target.leftY = -target.cos;
						target.backX = -target.cos;
						target.backY = -target.sin;
						break;
				}

				return true;
			}
		};

		return handler;
	}

	// Width and Height Definitions that can be overwritten (Used by Grids)
	getWidth()
	{
		return this.scaleX;
	}

	getHeight()
	{
		return this.scaleY;
	}

	// Engine -> Scenes -> Object.update(dt), Called Before Draw
	update(dt)
	{
		//set isLive for scene to handle removal
		return this.isLive;
	}

	// Engine -> Scenes -> Object.draw(ctx), Called After Update
	draw(ctx) 
	{
		this.setupCamera(ctx);
		this.debugDrawing(ctx);
		this.restoreCamera(ctx);
	}

	setupCamera(ctx)
	{
		ctx.save(); 
		ctx.translate(this.positionX, this.positionY);
		ctx.rotate(Utils.getRadians(this.rotation));
		ctx.scale(this.scaleX, this.scaleY);
	}

	restoreCamera(ctx)
	{
		ctx.restore();
	}

	debugDrawing(ctx)
	{
		ctx.lineWidth = 0.05;
		if (this.debugDrawCross)
		{
			ctx.beginPath();
			ctx.moveTo(0.5, 0)
			ctx.lineTo(-0.5, 0)
			ctx.moveTo(0, 0.5)
			ctx.lineTo(0, -0.5)
			ctx.closePath();
			ctx.strokeStyle = "red";
			ctx.stroke();
		}
		if (this.debugDrawForward)
		{
			ctx.strokeStyle = "Lime";
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(0.5, 0);
			ctx.closePath();
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(0.5, 0);
			ctx.lineTo(0.25, -0.25);
			ctx.closePath();
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(0.5, 0);
			ctx.lineTo(0.25, 0.25)
			ctx.closePath();
			ctx.stroke();
		}
	}
	
	getPath(ctx) { }

	onClicked() { }

	// Triggers when removed during scene update with object returning this.isLive = false; 
	onDeath() { }
}