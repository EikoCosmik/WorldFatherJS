import { DefaultObj } from "../wf_objs_DefaultObject/wf_objs_DefaultObj.js";

export class CollisionDetectorExample extends DefaultObj
{
	constructor(inherited = {}) { super(inherited); }

	onSetup()
	{
		this.tag = "_CollisionDetectorExample";
		this.debugCenterCross = true;
		this.debugVerticies = true;
		this.debugBoundingBox = true;
		this.debugNormals = true;
		this.color = "lime";
		this._modules.useDebug = true;
		this._modules.useWorldData = true;
		this._modules.useCollision = true;
		
	}

	update(dt)
	{
		this.color = "lime";
	}

	onCollision(collidedWith)
	{
		console.log(`${this.tag} has collided with ${collidedWith.tag}`);
		this.color = "red";
	}
}