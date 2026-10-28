import { Dynamic } from "./libs/WorldFatherAX/wf_Objects.js";
import { Utils } from "./libs/WorldFatherAX/wf_Utils.js";
import { objects } from "./libs/WorldFatherAX/WorldFather2D.js";

export class playerObject extends Dynamic
{
	constructor(inherited)
	{
		super(inherited);

		this.shape = Utils.getShape(3, false);
		this.tag = "player";

		this.width = 50;
		this.height = 50;

		this.velocityX = 0;
		this.velocityY = 0;
		this.acceleration = 500;
		this.drag = 0.75;
		this.turnSpeed = 175;

		this.drawThrustTimer = Date.now();
		this.drawThrust = false;

		this.shotDelay = 500;
		this.lastShot = this.shotDelay;
		this.shotAngle = 3;

		this.canCollide = true;

		this.leftGun = true;

		//Power Ups
		this.shotGunActive = false;
		this.shotGunMaxTime = 5000;
		this.shotGunStartTime = 0;

		this.initShotDelay = this.shotDelay;
		this.rapidFireMaxTime = 5000;
		this.rapidFireStartTime = 0;
		this.rapidFireRate = 250;

		this.smallShipMaxTime = 5000;
		this.smallShipPointOne = new objects.Empty();
		this.smallShipPointOneUsed = false;
		this.smallShipOneStartTime = 0;
		this.smallShipPointTwo = new objects.Empty();
		this.smallShipPointTwoUsed = false;
		this.smallShipTwoStartTime = 0;
	}

	update(dt)
	{
		if (this.engine.isKeyDown("KeyA")) this.rotation -= this.turnSpeed * dt;
		if (this.engine.isKeyDown("KeyD")) this.rotation += this.turnSpeed * dt;

		if (this.engine.isKeyDown("KeyW"))
		{
			this.velocityX += this.cos * this.acceleration * dt;
			this.velocityY += this.sin * this.acceleration * dt;
		}

		if (this.engine.isKeyDown("KeyS"))
		{
			this.velocityX -= this.cos * this.acceleration * dt;
			this.velocityY -= this.sin * this.acceleration * dt;
		}

		this.velocityX -= this.velocityX * this.drag * dt;
		this.velocityY -= this.velocityY * this.drag * dt;

		if (Utils.absolute(this.velocityX) < 0.01) this.velocityX = 0;
		if (Utils.absolute(this.velocityY) < 0.01) this.velocityY = 0;

		this.positionX += this.velocityX * dt;
		this.positionY += this.velocityY * dt;

		if (this.positionX > this.engine.halfScreenWidth + 50 || this.positionX < -this.engine.halfScreenWidth - 50) this.positionX *= -1;
		if (this.positionY > this.engine.halfScreenHeight + 50 || this.positionY < -this.engine.halfScreenHeight - 50) this.positionY *= -1;

		// const relativeOne = Utils.getRelativePosition(this.positionX, this.positionY, this.rotation, this.positionX - 25, this.positionY + 40);
		// this.smallShipPointOne.positionX = relativeOne[0];
		// this.smallShipPointOne.positionY = relativeOne[1];
		// this.smallShipPointOne.rotation = this.rotation;
		// const relativeTwo = Utils.getRelativePosition(this.positionX, this.positionY, this.rotation, this.positionX - 25, this.positionY - 40);
		// this.smallShipPointTwo.positionX = relativeTwo[0];
		// this.smallShipPointTwo.positionY = relativeTwo[1];
		// this.smallShipPointTwo.rotation = this.rotation;

		// if (this.engine.isKeyDown("Equal"))
		// {
		// 	this.startPowerUp("shotGun");
		// }

		// if (this.engine.isKeyDown("Minus"))
		// {
		// 	this.startPowerUp("rapidFire");
		// }

		// if (this.engine.isKeyDown("BracketLeft"))
		// {
		// 	this.startPowerUp("smallShip");
		// }

		// this.resetPowerUps();

		if (this.engine.isKeyDown("Space") && Utils.timeSince(this.lastShot) > this.shotDelay)
		{
			this.shoot();

			// this.scene.importantObjs["smallShipOne"]?.shoot();
			// this.scene.importantObjs["smallShipTwo"]?.shoot();
		}
	}

	draw(ctx)
	{
		ctx.fillStyle = "Black";
		ctx.lineWidth = 5;

		if (Utils.timeSince(this.drawThrustTimer) > 100)
		{
			this.drawThrust = !this.drawThrust;
			this.drawThrustTimer = Date.now();
		}

		let thrustColor = (this.drawThrust) ? "red" : "orange";

		if (this.engine.isKeyDown("KeyW"))
		{
			ctx.strokeStyle = thrustColor;
			ctx.beginPath();
			ctx.moveTo(-10, 25);
			ctx.lineTo(-50, 0);
			ctx.lineTo(-10, -25);
			ctx.stroke();
		}

		ctx.strokeStyle = "Lime";
		ctx.lineWidth = 7;

		ctx.beginPath();
		ctx.moveTo(-12.5, 22.5);
		ctx.lineTo(25, 22.5);
		ctx.moveTo(-12.5, -22.5);
		ctx.lineTo(25, -22.5);
		ctx.stroke();

		ctx.lineWidth = 10;

		this.getPath(ctx);
		ctx.stroke();
		ctx.fill();
	}

	shoot()
	{
		this.lastShot = Date.now();

		// if(this.shotGunActive)
		// {
		// 	this.scene.addObject(new bullet({positionX: this.positionX, positionY: this.positionY, rotation: this.rotation - 15}));
		// 	this.scene.addObject(new bullet({positionX: this.positionX, positionY: this.positionY, rotation: this.rotation + 15}));
		// }

		if (this.leftGun)
		{
			const shootPos = Utils.getRelativePosition(this.globalPositionX, this.globalPositionY, this.rotation, this.globalPositionX + 25, this.globalPositionY + 22.5);
			this.scene.addObject(new bullet({ positionX: shootPos[0], positionY: shootPos[1], rotation: this.globalRotation + this.shotAngle }), { layer: "hind" });
		}
		else
		{
			const shootPos = Utils.getRelativePosition(this.globalPositionX, this.globalPositionY, this.rotation, this.globalPositionX + 25, this.globalPositionY - 22.5);
			this.scene.addObject(new bullet({ positionX: shootPos[0], positionY: shootPos[1], rotation: this.globalRotation - this.shotAngle }), { layer: "hind" });
		}
		this.leftGun = !this.leftGun;
	}
	// startPowerUp(type)
	// {
	// 	switch(type)
	// 	{
	// 		case "shotGun":
	// 			this.shotGunActive = true;
	// 			this.shotGunStartTime = Date.now();
	// 			break;
	// 		case "rapidFire":
	// 			this.shotDelay = this.rapidFireRate;
	// 			this.rapidFireStartTime = Date.now();
	// 			break;
	// 		case "smallShip":
	// 			let target;
	// 			let newShip;
	// 			let name;
	// 			if(!this.smallShipPointOneUsed)
	// 			{
	// 				target = this.smallShipPointOne;
	// 				newShip = new helperShip();
	// 				name = "smallShipOne";
	// 				this.smallShipOneStartTime = Date.now();
	// 				this.smallShipPointOneUsed = true;
	// 			}
	// 			else if(!this.smallShipPointTwoUsed)
	// 			{
	// 				target = this.smallShipPointTwo;
	// 				newShip = new helperShip({});
	// 				name = "smallShipTwo";
	// 				this.smallShipTwoStartTime = Date.now();
	// 				this.smallShipPointTwoUsed = true;
	// 			}
	// 			else break;

	// 			newShip.target = target;

	// 			this.scene.addObject(newShip, { name: name });
	// 			break;
	// 	}
	// }

	// resetPowerUps()
	// {
	// 	if(this.shotGunActive && Utils.timeSince(this.shotGunStartTime) > this.shotGunMaxTime)
	// 	{
	// 		this.shotGunActive = false;
	// 	}
	// 	if(this.shotDelay == this.rapidFireRate && Utils.timeSince(this.rapidFireStartTime) > this.rapidFireMaxTime)
	// 	{
	// 		this.shotDelay = 1000;
	// 	}
	// 	if(this.smallShipPointOneUsed && Utils.timeSince(this.smallShipOneStartTime) > this.smallShipMaxTime)
	// 	{
	// 		this.scene.importantObjs["smallShipOne"].isLive = false;
	// 		this.smallShipPointOneUsed = false;
	// 	}
	// 	if(this.smallShipPointTwoUsed && Utils.timeSince(this.smallShipTwoStartTime) > this.smallShipMaxTime)
	// 	{
	// 		this.scene.importantObjs["smallShipTwo"].isLive = false;
	// 		this.smallShipPointTwoUsed = false;
	// 	}
	// }

	collidedWith(collidedObject)
	{
		if (collidedObject.tag == "asteroid")
		{
			this.isLive = false;
		}
	}

	onClicked() 
	{
		console.log("wasClicked")
	}
}

class bullet extends Dynamic
{
	constructor(inherited)
	{
		super(inherited);

		this.canCollide = true;
		this.speed = 500;
		this.width = 20;
		this.height = 10;
		this.tag = "bullet";
		this.color = "Cyan";
	}

	collidedWith(collidedObject)
	{
		if (collidedObject.tag == "asteroid")
		{
			this.isLive = false;
		}
	}

	update(dt)
	{
		this.positionX += this.speed * this.cos * dt;
		this.positionY += this.speed * this.sin * dt;

		if (this.positionX > this.engine.halfScreenWidth || this.positionX < -this.engine.halfScreenWidth || this.positionY > this.engine.halfScreenHeight || this.positionY < -this.engine.halfScreenHeight) this.isLive = false;
	}
}

// export class helperShip extends worldFather.objects.BaseObject
// {
// 	constructor(inherited)
// 	{
// 		super(inherited);
// 		this.speed = 350;
// 		this.atTarget = false;
// 		this.shape = Utils.getShape(3);
// 		this.scaleX = 25;
// 		this.scaleY = 20;
// 	}

// 	update(dt)
// 	{
// 		if(!this.atTarget)
// 		{
// 			this.dx = this.target.positionX - this.positionX;
// 			this.dy = this.target.positionY - this.positionY;
// 			this.rotation = Utils.getDegrees(Utils.getAngleBetweenPoints(this.dx, this.dy));

// 			this.positionX += this.speed * this.cos * dt;
// 			this.positionY += this.speed * this.sin * dt;

// 			if(Utils.withinRange(this.positionX, this.target.positionX, 5) && Utils.withinRange(this.positionY, this.target.positionY, 5)) this.atTarget = true;
// 		}
// 		else
// 		{
// 			this.positionX = this.target.positionX;
// 			this.positionY = this.target.positionY;
// 			this.rotation = this.target.rotation;
// 		}

// 		return super.update(dt)
// 	}

// 	draw(ctx)
// 	{
// 		ctx.strokeStyle = "blue";
// 		ctx.fillStyle = "Black";
// 		ctx.lineWidth = 3;

// 		ctx.beginPath();
// 		Utils.drawLineFromTo(ctx, this.positionX - 5, this.positionY + 7, this.positionX + 10, this.positionY + 7, this.positionX, this.positionY, this.rotation);
// 		Utils.drawLineFromTo(ctx, this.positionX - 5, this.positionY - 7, this.positionX + 10, this.positionY - 7, this.positionX, this.positionY, this.rotation);
// 		ctx.stroke();
// 		this.getShapePath(ctx);
// 		ctx.fill();
// 		ctx.stroke();
// 	}

// 	shoot()
// 	{
// 		this.lastShot = Date.now();

// 		const tempBullet = new bullet({positionX: this.positionX, positionY: this.positionY, rotation: this.rotation});
// 		tempBullet.scaleX *= 0.5;
// 		tempBullet.scaleY *= 0.5;
// 		this.scene.addObject(tempBullet);
// 	}
// }

export class asteroid extends Dynamic
{
	constructor(inherited)
	{
		super(inherited);

		this.tag = "asteroid";
		this.canCollide = true;

		this.shape = Utils.getShape(Utils.getRandomIntegerInclusive(3, 10));
		this.rotation = Utils.getRandomInteger(0, 360);

		this.rotationDrift = Utils.getRandomFloat(15, 75);
		this.positionDrift = Utils.getRandomInteger(25, 50);

		this.driftDirection = inherited.driftDirection ?? 0;
		this.driftSin = Math.sin(Utils.getRadians(this.driftDirection));
		this.driftCos = Math.cos(Utils.getRadians(this.driftDirection));

		this.startTime = Date.now();

		this.spawnSmaller = false;
		this.minimumSize = 50;

		this.strokeColor = "White";
	}

	update(dt)
	{
		this.rotation += this.rotationDrift * dt;
		this.positionX += this.positionDrift * this.driftCos * dt;
		this.positionY += this.positionDrift * this.driftSin * dt;

		if ((this.positionX > this.engine.halfScreenWidth + (this.width * 2) || this.positionX < -this.engine.halfScreenWidth - (this.width * 2) || this.positionY > this.engine.halfScreenHeight + (this.height * 2) || this.positionY < -this.engine.halfScreenHeight - (this.height * 2)) && Date.now() - this.startTime > 5000) this.isLive = false;
	}

	draw(ctx)
	{
		ctx.fillStyle = "Black";
		ctx.strokeStyle = this.strokeColor;
		ctx.lineWidth = 10;
		this.getPath(ctx);
		ctx.stroke();
		ctx.fill();
	}

	collidedWith(collidedObject)
	{
		
		if (collidedObject.tag == "bullet")
		{
			this.isLive = false;
			this.scene.points += Math.floor((250 - this.width) / 10);

			if (this.width > this.minimumSize)
			{
				this.spawnSmaller = true;
			}
		}
	}

	onDeath()
	{
		this.scene.asteroidCount -= 1;

		if (this.spawnSmaller)
		{
			this.scene.spawnBrokenAsteroid(this.positionX, this.positionY, this.width * 0.5, true);
			this.scene.spawnBrokenAsteroid(this.positionX, this.positionY, this.width * 0.5, true);
		}
	}
}

export class redAsteroid extends asteroid
{
	constructor(inherited)
	{
		super(inherited);
		this.strokeColor = "red";
		this.initShape = Utils.getRandomIntegerInclusive(6, 12);
		this.curShape = this.initShape;
		this.shape = Utils.getShape(this.initShape);
		this.positionDrift = Utils.getRandomInteger(10, 25);
	}

	collidedWith(collidedObject)
	{
		if (collidedObject.tag == "bullet")
		{
			this.curShape -= 3;

			if (this.curShape < 3)
			{
				this.isLive = false;
				this.scene.points += 15 * this.initShape;
				this.spawnSmaller = true;
			}
			else
			{
				this.shape = Utils.getShape(this.curShape);
			}
		}
	}

	onDeath()
	{
		this.scene.asteroidCount -= 1;

		if (this.spawnSmaller)
		{
			this.scene.spawnBrokenAsteroid(this.positionX, this.positionY, this.width * 0.25, true);
			this.scene.spawnBrokenAsteroid(this.positionX, this.positionY, this.width * 0.25, true);
			this.scene.spawnBrokenAsteroid(this.positionX, this.positionY, this.width * 0.25, true);
			this.scene.spawnBrokenAsteroid(this.positionX, this.positionY, this.width * 0.25, true);
		}
	}
}

export class goldAsteroid extends asteroid
{
	constructor(inherited)
	{
		super(inherited);
		this.strokeColor = "gold";
		this.shape = Utils.getShape(3);
		this.positionDrift = Utils.getRandomInteger(50, 100);
	}

	collidedWith(collidedObject)
	{
		if (collidedObject.tag == "bullet")
		{
			this.isLive = false;
			this.scene.points += 50 + (40 - this.width);

			if (this.width > this.minimumSize)
			{
				this.spawnSmaller = true;
			}
		}
	}
}