import { Scene } from "../../wf_Scene.js";
import * as objects from "../../wf_Objects.js"

export class snake extends Scene
{
	constructor() { super(); }

	onSetup()
	{
		this.isRunning = false;
		this.gridSize = 100;
		this.debugSnakeGrid = true;
		this.controlSetting = true;

		this.wf.addCamera("snakeCam");

		this.addObject(new objects.BackButton());
		
		this.addObject(new objects.Button({
			borderColor: "#007700",
			text: "Start",
			onClickFunction: (() => { this.startGame(); this.importantObjects["startButton"].positionX = 10000; this.importantObjects["controlsButton"].positionX = 10000 }),
			width: 250,
		}), { name: "startButton" });
		
		this.addObject(new objects.Button({
			borderColor: "#000077",
			text: `Control Style: Rotate`,
			onClickFunction: (() => { this.controlSetting = !this.controlSetting; this.importantObjects["controlsButton"].text = `Control Style: ${(this.controlSetting) ? "Rotate" : "Set" }` }),
			positionX: -this.wf.halfScreenWidth + 100 + 25,
			positionY: this.wf.halfScreenHeight - 50 - 25,
			height: 50,
			width: 225,
			fontSize: 20,
			textAlign: "left",
			textPadding: 20
		}), { name: "controlsButton" });

		this.addObject(new wall({
			positionY: this.gridSize * 5,
			width: this.gridSize * 13,
			color: "#00000000"
		}));
		this.addObject(new wall({
			positionY: this.gridSize * -5,
			width: this.gridSize * 13,
			color: "#00000000"
		}));
		this.addObject(new wall({
			positionX: -this.gridSize * 6,
			height: this.gridSize * 11,
			color: "#00000000"
		}));
		this.addObject(new wall({
			positionX: this.gridSize * 6,
			height: this.gridSize * 11,
			color: "#00000000"
		}));

		this.spawnApple();
	}

	onSwapTo()
	{
		this.wf.swapCamera("snakeCam");
	}

	draw(ctx)
	{
		if(this.debugSnakeGrid)
		{
			ctx.strokeStyle = "white";

			const verticles = (this.wf.halfScreenWidth / this.gridSize);
			const horizontals = (this.wf.halfScreenHeight / this.gridSize);

			for (let i = 0; i < verticles; i++)
			{
				const gridsLength = this.wf.screenHeight;
				const step = (this.gridSize * i) + (this.gridSize * 0.5);
				ctx.beginPath();
				ctx.moveTo(step, gridsLength);
				ctx.lineTo(step, -gridsLength);
				ctx.moveTo(-step, gridsLength);
				ctx.lineTo(-step, -gridsLength);
				ctx.stroke();
			}

			for (let i = 0; i < horizontals; i++)
			{
				const gridsLength = this.wf.halfScreenWidth;
				const step = (this.gridSize * i) + (this.gridSize * 0.5);
				ctx.beginPath();
				ctx.moveTo(gridsLength, step);
				ctx.lineTo(-gridsLength, step);
				ctx.moveTo(gridsLength, -step);
				ctx.lineTo(-gridsLength, -step);
				ctx.stroke();
			}
		}
	}

	startGame()
	{
		this.isRunning = true;
		this.addObject(new snakeHead(), { name: "snakeHead" });
		this.importantObjects["snakeHead"].lastMoveTime = Date.now();
	}

	keyEvent(code, action)
	{
		this.importantObjects["snakeHead"]?.keyEvent(code, action);
	}

	spawnApple()
	{
		//Convert to calc for screenSize / play space and grid Size
		this.maxXMultiplyer = 5;
		this.maxYMultiplyer = 4;

		this.addObject(new apple({
			positionX: this.wf.Utils.getRandomInteger(-this.maxXMultiplyer, this.maxXMultiplyer) * this.gridSize,
			positionY: this.wf.Utils.getRandomInteger(-this.maxYMultiplyer, this.maxYMultiplyer) * this.gridSize,
		}));
	}
	
	stopGame()
	{
		this.isRunning = false;	
		this.importantObjects["startButton"].positionX = 0;
		this.importantObjects["controlsButton"].positionX = -this.wf.halfScreenWidth + 100 + 25;
		this.importantObjects["controlsButton"].positionY = this.wf.halfScreenHeight - 50 - 25;
	}
}

class wall extends objects.DefaultObj
{
	constructor(inherited = {}) { super(inherited); }

	onSetup()
	{
		this.useDebug = true;
		this.useWorldData = true;
		this.useCollision = true;
		this.tag = "wall";
		this.debugCenterCross = false;
		this.debugVerticies = false;
		this.debugBoundingBox = true;
		this.debugNormals = false;
	}
}

class snakeHead extends objects.DefaultObj
{
	constructor(inherited = {}) { super(inherited); }

	onSetup()
	{
		this.useDebug = true;

		this.useWorldData = true;
		this.useCollision = true;
		this.size = this.scene.gridSize;
		this.width = this.size - 5;
		this.height = this.size - 5;
		this.moveDelay = 500;
		this.lastMoveTime = 0;
		this.direction = "up";
		this.rotation = 270;

		this.recordedMovesMax = 2;
		this.previousMoves = []
		this.tailPieces = [];
	}

	update(dt)
	{
		if(this.scene.isRunning)
		{
			if(this.wf.Utils.timeSince(this.lastMoveTime) > this.moveDelay)
			{
				this.lastMoveTime = Date.now();
				this.previousMoves.unshift([this.positionX, this.positionY]);
				if(this.previousMoves.length > this.recordedMovesMax) this.previousMoves.pop();

				switch(this.direction)
				{
					case "up":
						this.positionY -= this.size;
						break;
					case "down":
						this.positionY += this.size;
						break;
					case "right":
						this.positionX += this.size;
						break;
					case "left":
						this.positionX -= this.size;
						break;
				}

				for(let i = 0; i < this.tailPieces.length; i++)
				{
					const piece = this.tailPieces[i];
					piece.positionX = this.previousMoves[i][0];
					piece.positionY = this.previousMoves[i][1];
					piece._update(dt);
				}
			}
		}
	}

	keyEvent(code, action)
	{
		if(action == "down")
		{
			if(this.scene.controlSetting)
			{
				if (code == "KeyD")
				{
					if(this.direction == "up") { this.direction = "right"; this.rotation = 0; }
					else if(this.direction == "right") { this.direction = "down"; this.rotation = 90; }
					else if(this.direction == "down") { this.direction = "left"; this.rotation = 180; }
					else if(this.direction == "left") { this.direction = "up"; this.rotation = 270; }
				}
				else if (code == "KeyA")
				{
					if(this.direction == "up") { this.direction = "left"; this.rotation = 180; }
					else if(this.direction == "right") { this.direction = "up"; this.rotation = 270; }
					else if(this.direction == "down") { this.direction = "right"; this.rotation = 0; }
					else if(this.direction == "left") { this.direction = "down"; this.rotation = 90; }
				}
			}
			else
			{
				if(code == "KeyW" && this.direction !== "down")
				{
					this.direction = "up";
					this.rotation = 270;
				}
				else if (code == "KeyS" && this.direction !== "up")
				{
					this.direction = "down";
					this.rotation = 90;

				}
				else if (code == "KeyD" && this.direction !== "left")
				{
					this.direction = "right";
					this.rotation = 0;

				}
				else if (code == "KeyA" && this.direction !== "right")
				{
					this.direction = "left";
					this.rotation = 180;
				}
			}
		}
	}

	onCollision(collidedWith)
	{
		switch(collidedWith.tag)
		{
			case "apple":
				collidedWith.isLive = false;
				collidedWith.useCollision = false;
				this.scene.spawnApple();
				this.spawnTail();
				break;
			case "tail":
			case "wall":
				this.isLive = false;
				this.scene.stopGame();
				break;
		}
	}

	spawnTail()
	{
		const newChild = new tail({
			width: this.width,
			height: this.height,
			positionX: 99999,
			positionY: 99999,
			addToScene: false
		});
		this.scene.addObject(newChild);
		this.tailPieces.push(newChild);
		this.recordedMovesMax += 1;
	}

	draw(ctx)
	{
		ctx.fillStyle = this.color;
		this.getPath(ctx);
		ctx.fill();
	}

	onDeath()
	{
		for(let i = 0; i < this.tailPieces.length; i++)
		{
			this.tailPieces[i].isLive = false;
		}
		this.tailPieces = [];
	}
}

class apple extends objects.DefaultObj
{
	constructor(inherited = {}) { super(inherited); }

	onSetup()
	{
		this.useDebug = true;

		this.useWorldData = true;
		this.useCollision = true;

		this.color = "#ff0066";
		this.tag = "apple";

		this.size = this.scene.gridSize;
		this.width = this.size - 15;
		this.height = this.size - 15;
	}
}

class tail extends objects.DefaultObj
{
	constructor(inherited = {}) { super(inherited); }

	onSetup()
	{
		this.useDebug = true;
		this.useWorldData = true;
		this.useCollision = true;
		this.tag = "tail";
		this.color = "lime";
	}
}