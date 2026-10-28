import { Scene } from "../../wf_Scene.js";
import * as objects from "../../wf_Objects.js";

export class conwaysGameOfLife extends Scene
{
	constructor() { super(); }

	onSetup()
	{
		this.backgroundColor = "#000000";
		this.gridSize = 50;
		this.addItem = false;
		this.newItemCoords = {};
		this.cellGrid = {};
		this.gameLive = false;
		this.queueStart = false;
		this.queuePause = false;
		this.lastStep = 0;
		this.stepSpeed = 250;
		this.drawText = false;
		this.buttonCoords = [this.wf.halfScreenWidth - 50 - 20, this.wf.halfScreenHeight - 50 - 20,];

		this.addObject(new objects.BackButton());

		this.addObject(new objects.Button({
			clickDetectionType: "up",
			onClicked: (function (worldCoords, coords, data) { if (data.type == this.clickDetectionType) this.scene.queuePause = true; }),
			borderColor: "red",
			positionX: 999999,
			positionY: 999999,
			text: "Stop"
		}), { name: "stopButton", layer: "_foreGround" });

		this.addObject(new objects.Button({
			clickDetectionType: "up",
			onClicked: (function (worldCoords, coords, data) { if (data.type == this.clickDetectionType) { this.scene.addItem = false; this.scene.queueStart = true; } }),
			borderColor: "lime",
			positionX: this.buttonCoords[0],
			positionY: this.buttonCoords[1],
			text: "Start",
			tag: "startButton"
		}), { name: "startButton" });
	}

	draw(ctx)
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

	onDraw(ctx)
	{
		if (this.gameLive && this.drawText)
		{
			for (const [key, value] of Object.entries(this.cellGrid))
			{
				ctx.font = `${this.gridSize * 0.6}px sans serif`;
				ctx.fillStyle = "lime";
				ctx.fillText(value.count, value.positionX, value.positionY);
			}
		}
	}

	update(dt)
	{
		if (this.queueStart)
		{
			this.queueStart = false;
			this.gameLive = true;
			this.lastStep = Date.now();
			this.importantObjects["startButton"].positionX = 99999;
			this.importantObjects["startButton"].positionY = 99999;
			this.importantObjects["stopButton"].positionX = this.buttonCoords[0];
			this.importantObjects["stopButton"].positionY = this.buttonCoords[1];
		}
		this.cellGrid = {};
	}

	onUpdate(dt)
	{
		if (this.gameLive && this.wf.Utils.timeSince(this.lastStep) > this.stepSpeed)
		{
			this.lastStep = Date.now();

			for (const [key, value] of Object.entries(this.cellGrid))
			{
				if (value.count < 4 && value.count > 1)
				{
					if (value.object === undefined && value.count == 3) this.addObject(new cell({ positionX: value.positionX, positionY: value.positionY }));
				}
				else
				{
					if (value.object !== undefined) value.object.isLive = false;
				}
			}
		}
		else
		{
			if (this.addItem && !this.hasClicked)
			{
				const adjustedX = Math.round(this.newItemCoords.x / this.gridSize) * this.gridSize;
				const adjustedY = Math.round(this.newItemCoords.y / this.gridSize) * this.gridSize;
				if (this.cellGrid[`${adjustedX}-${adjustedY}`] === undefined) this.addObject(new cell({ positionX: adjustedX, positionY: adjustedY }));
				else this.cellGrid[`${adjustedX}-${adjustedY}`].isLive = false;
			}
			this.addItem = false;
		}

		if (this.queuePause)
		{
			this.queuePause = false;
			this.gameLive = false;
			this.importantObjects["stopButton"].positionX = 99999;
			this.importantObjects["stopButton"].positionY = 99999;
			this.importantObjects["startButton"].positionX = this.buttonCoords[0];
			this.importantObjects["startButton"].positionY = this.buttonCoords[1];
		}
	}

	mouseEvent(worldCoords, coords, data = {})
	{
		if (data.type == "up" && !this.gameLive)
		{
			this.newItemCoords = worldCoords;
			this.addItem = true;
		}
	}
}

class cell extends objects.DefaultObj
{
	constructor(inherited = {})
	{
		super(inherited);
	}

	onSetup()
	{
		this.color = "white";
		this.width = this.wf.currentScene.gridSize * 0.9;
		this.height = this.wf.currentScene.gridSize * 0.9;
	}

	update(dt)
	{
		if (!this.isLive) return;

		if (this.wf.currentScene.gameLive)
		{
			const gridSize = this.wf.currentScene.gridSize;

			for (let i = -1; i < 2; i++)
			{
				const row = this.positionY + (gridSize * i);

				for (let j = -1; j < 2; j++)
				{
					if (!(i == 0 && j == 0))
					{
						const column = this.positionX + (gridSize * j);
						const key = `${column}-${row}`;
						if (this.wf.currentScene.cellGrid[key] === undefined) this.wf.currentScene.cellGrid[key] = { count: 1, object: undefined, positionX: column, positionY: row };
						else this.wf.currentScene.cellGrid[key].count += 1;
					}
					else
					{
						const key = `${this.positionX}-${this.positionY}`;
						if (this.wf.currentScene.cellGrid[key] === undefined) this.wf.currentScene.cellGrid[key] = { count: 0, object: this, positionX: this.positionX, positionY: this.positionY };
						else this.wf.currentScene.cellGrid[key].object = this;
					}
				}
			}
		}
		else
		{
			const key = `${this.positionX}-${this.positionY}`;
			this.wf.currentScene.cellGrid[key] = this;
		}
	}
}