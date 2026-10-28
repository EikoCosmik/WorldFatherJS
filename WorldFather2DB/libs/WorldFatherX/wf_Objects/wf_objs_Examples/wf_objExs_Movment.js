import { DefaultObj } from "../wf_objs_DefaultObject/wf_objs_DefaultObj.js";

export class MovementExample extends DefaultObj
{
	constructor(inherited = {})
	{
		super(inherited);
		this.tag = "_MovementExample";
		this.movementSpeed = 100;
		this.rotationSpeed = 100;
	}

	update(dt)
	{
		if (this.wf.isKeyDown("KeyW"))
		{
			this.positionX += this.movementSpeed * this.forwardX * dt;
			this.positionY += this.movementSpeed * this.forwardY * dt;
		}

		if (this.wf.isKeyDown("KeyS"))
		{
			this.positionX += this.movementSpeed * this.backX * dt;
			this.positionY += this.movementSpeed * this.backY * dt;
		}

		if (this.wf.isKeyDown("KeyA"))
		{
			this.rotation -= this.rotationSpeed * dt;
		}

		if (this.wf.isKeyDown("KeyD"))
		{
			this.rotation += this.rotationSpeed * dt;
		}
	}
}