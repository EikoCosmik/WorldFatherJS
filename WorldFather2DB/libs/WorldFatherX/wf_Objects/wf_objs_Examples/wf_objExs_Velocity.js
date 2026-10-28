import { DefaultObj } from "../wf_objs_DefaultObject/wf_objs_DefaultObj.js";

export class VelocityExample extends DefaultObj
{
	constructor(inherited = {}) { super(inherited); }

	onSetup()
	{
		this.tag = "_VelocityExample";
		this.shape = this.wf.Utils.getShape(3, false);
		this.color = "lime";

		this.rotationSpeed = 200;

		this.velocity = 0;
		this.acceleration = 500;
		this.drag = 0.75;

		this.seperateVelocities = true;
		this.velocityX = 0;
		this.velocityY = 0;
	}

	update(dt)
	{
		// Rotation

		if (this.wf.isKeyDown("KeyA"))
		{
			this.rotation -= this.rotationSpeed * dt;
		}

		if (this.wf.isKeyDown("KeyD"))
		{
			this.rotation += this.rotationSpeed * dt;
		}

		if(this.seperateVelocities)
		{
			if (this.wf.isKeyDown("KeyW"))
			{
				this.velocityX += this.acceleration* this.forwardX * dt;
				this.velocityY += this.acceleration* this.forwardY * dt;
			}

			if (this.wf.isKeyDown("KeyS"))
			{
				this.velocityX -= this.acceleration* this.forwardX * dt;
				this.velocityY -= this.acceleration* this.forwardY * dt;
			}

			this.positionX += this.velocityX * dt;
			this.positionY += this.velocityY * dt;
			this.velocityX -= this.velocityX * this.drag * dt;
			this.velocityY -= this.velocityY * this.drag * dt;

			if (this.wf.Utils.absolute(this.velocityX) < 0.01) this.velocityX = 0;
			if (this.wf.Utils.absolute(this.velocityY) < 0.01) this.velocityY = 0;

		}
		else
		{
			if (this.wf.isKeyDown("KeyW"))
			{
				this.velocity += this.acceleration * dt;
			}

			if (this.wf.isKeyDown("KeyS"))
			{
				this.velocity -= this.acceleration * dt;
			}

			this.positionX += this.velocity * this.forwardX * dt;
			this.positionY += this.velocity * this.forwardY * dt;
			this.velocity -= this.velocity * this.drag * dt;

			if (this.wf.Utils.absolute(this.velocity) < 0.01) this.velocity = 0;
		}
	}
}