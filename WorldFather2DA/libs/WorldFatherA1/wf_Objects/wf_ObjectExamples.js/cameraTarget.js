export class cameraTarget extends Empty
{
	constructor(inherited)
	{
		super(inherited);

		this.speed = 250;
		this.turnSpeed = 200;
		this.scaleSpeed = 1;
		this.rotation = 0;
		this.scaleX = 1;
		this.scaleY = 1;
	}

	update(dt)
	{
		if (this.engine.isKeyDown("ArrowLeft")) this.rotation -= this.turnSpeed * dt;
		if (this.engine.isKeyDown("ArrowRight")) this.rotation += this.turnSpeed * dt;

		if (this.engine.isKeyDown("BracketLeft")) 
		{
			this.scaleX += this.scaleSpeed * dt;
			this.scaleY -= this.scaleSpeed * dt;
		}	

		if (this.engine.isKeyDown("BracketRight")) 
		{
			this.scaleX -= this.scaleSpeed * dt;
			this.scaleY += this.scaleSpeed * dt;
		}

		if (this.engine.isKeyDown("Equal")) 
		{
			this.scaleX += this.scaleSpeed * dt;
			this.scaleY += this.scaleSpeed * dt;
		}

		if (this.engine.isKeyDown("Minus"))
		{
			this.scaleX -= this.scaleSpeed * dt;
			this.scaleY -= this.scaleSpeed * dt;
		}

		if (this.engine.isKeyDown("ArrowUp"))
		{
			this.positionX += this.sin * this.speed * dt;
			this.positionY -= this.cos * this.speed * dt;
		}

		if (this.engine.isKeyDown("ArrowDown"))
		{
			this.positionX -= this.sin * this.speed * dt;
			this.positionY += this.cos * this.speed * dt;
		}

		return super.update(dt);
	}
}