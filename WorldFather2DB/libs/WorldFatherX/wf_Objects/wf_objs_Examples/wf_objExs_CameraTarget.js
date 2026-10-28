import { DefaultObj } from "../wf_objs_DefaultObject/wf_objs_DefaultObj.js";

export class CameraTargetExample extends DefaultObj
{
	constructor(inherited = {}) { super(inherited); }

	onSetup()
	{
		this.tag = "_CameraTargetExample";
		this.movementSpeed = 100;
		this.rotationSpeed = 100;
		this.useWorldData = true;
	}

	update(dt)
	{
		if (this.tag == "_CameraTargetExample") console.log(this.defaultsReset);

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

		// if (this.wf.isKeyDown("KeyQ"))
		// {
		// 	this.scaleX -= 0.2 * dt;
		// 	this.scaleY -= 0.2 * dt;
		// }

		// if (this.wf.isKeyDown("KeyE"))
		// {
		// 	this.scaleX += 0.2 * dt;
		// 	this.scaleY += 0.2 * dt;
		// }

		// if (this.wf.isKeyDown("KeyT"))
		// {
		// 	this.scaleX -= 0.2 * dt;
		// }

		// if (this.wf.isKeyDown("KeyY"))
		// {
		// 	this.scaleX += 0.2 * dt;
		// }

		// if (this.wf.isKeyDown("KeyU"))
		// {
		// 	this.scaleX = 1;
		// }

		// if (this.wf.isKeyDown("KeyG"))
		// {
		// 	this.scaleY -= 0.2 * dt;
		// }

		// if (this.wf.isKeyDown("KeyH"))
		// {
		// 	this.scaleY += 0.2 * dt;
		// }

		// if (this.wf.isKeyDown("KeyJ"))
		// {
		// 	this.scaleY = 1;
		// }
	}
}