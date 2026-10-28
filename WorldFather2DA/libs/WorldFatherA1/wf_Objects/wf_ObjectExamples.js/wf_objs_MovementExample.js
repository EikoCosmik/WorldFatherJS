import { Utils } from "../../wf_Utils.js";
import { BaseObject } from "../wf_objs_BaseObject.js";

export class MovementExample extends BaseObject
{
	constructor(inherited = {})
	{
		super(inherited);
		this.velocityX = inherited.velocityX ?? 0;
		this.velocityY = inherited.velocityY ?? 0;
		this.acceleration = inherited.acceleration ?? 5000;
		this.drag = inherited.drag ?? 10;
		this.turnSpeed = inherited.turnSpeed ?? 200;
		this.forwardX = 0;
		this.forwardY = 0;
		this.leftX = 0;
		this.leftY = 0;
		this.leftSin = 0;
		this.leftCos = 0;
	}

	update(dt)
	{
		if (this.engine.isKeyDown("KeyA")) this.setVariable("rotation", -(this.turnSpeed * dt), true);
		if (this.engine.isKeyDown("KeyD")) this.setVariable("rotation", this.turnSpeed * dt, true);
		this.setVariable("leftCos", Math.cos(Utils.getRadians(this.rotation)));
		this.setVariable("leftSin", Math.sin(Utils.getRadians(this.rotation)));

		if (this.engine.isKeyDown("KeyW"))
		{
			this.setVariable("velocityX", this.cos * this.acceleration * dt, true);
			this.setVariable("velocityY", this.sin * this.acceleration * dt, true);
		}
		if (this.engine.isKeyDown("KeyS"))
		{
			this.setVariable("velocityX", -(this.cos * this.acceleration * dt), true);
			this.setVariable("velocityY", -(this.sin * this.acceleration * dt), true);
		}
		if (this.engine.isKeyDown("KeyQ"))
		{
			this.setVariable("velocityX", this.leftCos * this.acceleration * dt, true);
			this.setVariable("velocityY", this.leftSin * this.acceleration * dt, true);
		}
		if (this.engine.isKeyDown("KeyE"))
		{
			this.setVariable("velocityX", -(this.leftCos * this.acceleration * dt), true);
			this.setVariable("velocityY", -(this.leftSin * this.acceleration * dt), true);
		}

		this.setVariable("velocityX", -(this.velocityX * this.drag * dt), true);
		this.setVariable("velocityY", -(this.velocityY * this.drag * dt), true);

		if (Utils.absolute(this.velocityX) < 0.01) this.setVariable("velocityX", 0);
		if (Utils.absolute(this.velocityY) < 0.01) this.setVariable("velocityY", 0);

		this.setVariable("positionX", this.velocityX * dt, true);
		this.setVariable("positionY", this.velocityY * dt, true);
		
		if (this.dirty) this.updateShape();
		this.hasCollidedWith = [];
		return this.isLive;
	}
}