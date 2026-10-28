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
		this.scaleX = inherited.scaleX ?? 1;
		this.scaleY = inherited.scaleY ?? 1;
		this.rotation = inherited.rotation ?? 0;
		this.width = inherited.width ?? 100;
		this.height = inherited.height ?? 100;
		this.halfWidth = this.width * 0.5;
		this.halfHeight = this.height * 0.5;

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
		this.dirty = true;
		
		// Debug toggles
		this.dDraw = inherited.dDraw ?? false;
		this.ddCross = inherited.ddCross ?? false;

		// ChildrenHandler
		this.children = {};
		this.childRunningCount = 0;
		this.relativeID = -1;

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
						target.dirty = true;
						target[prop] = Utils.forceMod(value, 360);
						break;
					case "positionX":
					case "positionY":
					case "scaleX":
					case "scaleY":
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
		if(this.parent !== null && !this.parent.isLive) this.isLive = false;
		if(this.dirty) this.updateWorldData();
		return this.isLive;
	}

	draw(ctx) 
	{
		ctx.save();
		this.setupCamera(ctx)
		if (this.dDraw) this.debugDrawing(ctx);
		ctx.restore();
	}

	updateWorldData()
	{
		for(let key in this.children) this.children[key].dirty = true;
		this.dirty = false;
	}

	setupCamera(ctx)
	{
		if(this.parent !== null)
		{
			this.parent.setupCamera(ctx);
		}

		ctx.translate(this.positionX, this.positionY);
		ctx.rotate(Utils.getRadians(this.rotation));
		ctx.scale(this.scaleX, this.scaleY);
	}

	resetCamera(ctx)
	{
		ctx.resetTransform();
		this.engine.setupGlobalCamera();
	}

	debugDrawing(ctx)
	{
		ctx.lineWidth = 1; 
		if (this.ddCross)
		{
			ctx.beginPath();
			ctx.moveTo(this.halfWidth, 0)
			ctx.lineTo(-this.halfWidth, 0)
			ctx.moveTo(0, this.halfHeight)
			ctx.lineTo(0, -this.halfHeight)
			ctx.closePath();
			ctx.strokeStyle = "red";
			ctx.stroke();
			ctx.strokeStyle = "Lime";
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

	getGlobalPosition()
	{
		let outPosX = this.positionX;
		let outPosY = this.positionY;

		if (this.parent !== null)
		{
			const parentPos = this.parent.getGlobalPosition();
			const parentRotation = this.parent.getGlobalRotation();
			outPosX += parentPos[0];
			outPosY += parentPos[1];
			const rotated = Utils.rotatePoint(outPosX, outPosY, parentRotation, parentPos[0], parentPos[1])
			outPosX = rotated[0];
			outPosY = rotated[1];
		}

		return [outPosX, outPosY]
	}

	getGlobalRotation()
	{
		let outRotation = this.rotation;
		if (this.parent !== null)
		{
			const parentRotation = this.parent.getGlobalRotation();
			outRotation = parentRotation;
		}
		return outRotation;
	}

	adoptChild(child)
	{
		child.relativeID = this.childRunningCount++;
		this.children[child.relativeID] = child;
		child.onAdoption(this);
	}

	onAdoption(parent)
	{
		this.parent = parent;
	}
	
	killChild(childID)
	{
		delete this.children[childID];
	}
	
	getPath(ctx) { }

	onDeath()
	{
		if(this.parent !== null) this.parent.killChild(this.relativeID);
	}
}