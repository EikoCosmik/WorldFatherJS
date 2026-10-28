export class Scene
{
	constructor() { }

	//Initialisation

	_initialise()
	{
		this.importantObjects = {};
		this.clickableObjects = {};

		this.layers =
		{
			"_hindGrid": [],
			"default": [],
			"_foreGround": []
		}

		this.collisionGrid = {};
		this.gridSize = 150;
		this.mouseWorldCoords = {};

		this.startTime = Date.now();

		this.backgroundColor = "#000000";

		// Debug Draws
		this.debugCollisionGrid = false;
		this.debugSceneCenterRings = false;
		this.debugSceneCenter = false;
		this.onSetup();
	}

	onSetup() { }

	//Adding

	addObject(obj, opts)
	{
		obj.wf = this.wf;
		obj.scene = this;
		
		obj._initialise(opts);
	}

	//Update

	_updateObjects(dt)
	{
		if (this.wf.ErrorManager.errorStack.length > 0) this.wf.ErrorManager.printStack();

		this.update(dt);

		this.collisionGrid = {};

		for (let key in this.layers)
		{
			for (let i = this.layers[key].length - 1; i > -1; i--)
			{
				const object = this.layers[key][i];
				if (!object._update(dt) || !object.isLive)
				{
					this.layers[key].splice(i, 1);
					if (this.importantObjects[object.importantName]) delete this.importantObjects[object.importantName];
					if (this.clickableObjects[object.clickableID]) delete this.clickableObjects[object.clickableID];
					object._onDeath();
					continue;
				}
				if (object._modules["useCollision"].using) this.wf.CollisionDetection.updateCollisionGrid?.(object, this.collisionGrid);
			};
		}

		if (this.collisionGrid != {}) this.wf.CollisionDetection.testCollisionGrid?.(this.collisionGrid);

		this.onUpdate(dt);
	}

	update(dt) { }

	onUpdate(dt) { }

	//Drawing

	_drawObjects(ctx)
	{
		this.draw(ctx);
		this._debugDrawing(ctx);

		for (let key in this.layers)
		{
			for (let i = this.layers[key].length - 1; i > -1; i--)
			{
				this.layers[key][i]._draw(ctx);
			};
		}

		this.onDraw(ctx);
	}

	draw(ctx) { }

	_debugDrawing(ctx)
	{
		if (this.debugCollisionGrid)
		{
			ctx.strokeStyle = "white";
			const gridsLength = 1000;

			for (let i = 0; i < 10; i++)
			{
				ctx.beginPath();
				ctx.moveTo(this.gridSize * i, gridsLength);
				ctx.lineTo(this.gridSize * i, -gridsLength);
				ctx.moveTo(-this.gridSize * i, gridsLength);
				ctx.lineTo(-this.gridSize * i, -gridsLength);
				ctx.moveTo(gridsLength, this.gridSize * i);
				ctx.lineTo(-gridsLength, this.gridSize * i);
				ctx.moveTo(gridsLength, -this.gridSize * i);
				ctx.lineTo(-gridsLength, -this.gridSize * i);
				ctx.stroke();
			}
		}

		if (this.debugSceneCenterRings)
		{
			const count = 15;
			const colChange = 255 / count;

			for (let i = 1; i <= count; i++)
			{
				const curColStep = colChange * i;
				ctx.strokeStyle = `#${(255 - curColStep).toString(16)}${curColStep.toString(16)}ff`;
				ctx.beginPath();
				ctx.arc(0, 0, (this.gridSize * i) - 50, 0, 2 * Math.PI);
				ctx.stroke();
			}
		}

		if (this.debugSceneCenter)
		{
			ctx.fillStyle = "cyan";
			ctx.beginPath();
			ctx.arc(0, 0, 25, 0, 2 * Math.PI);
			ctx.fill();
		}
	}

	onDraw(ctx) { }

	//MouseEvents

	_mouseEvent(coords, data = {})
	{
		this.mouseWorldCoords = this.wf.MouseSystem.getWorldCoords(coords);
		this.mouseEvent(this.mouseWorldCoords, coords, data);
		
		let highestObj = null;
		const layerKeys = Object.keys(this.layers);

		for (let key in this.clickableObjects)
		{
			const obj = this.clickableObjects[key];
			obj._testHover(this.mouseWorldCoords);
			if (obj._isHover && (highestObj === null || layerKeys.indexOf(obj.layer) >= layerKeys.indexOf(highestObj.layer))) highestObj = obj;
		}

		if (highestObj !== null) highestObj.onClicked(this.mouseWorldCoords, coords, data);

		this.onMouseEvent(this.mouseWorldCoords, coords, data);
	}

	mouseEvent(worldCoords, coords, data = {}) { }
	onMouseEvent(worldCoords, coords, data = {}) { }

	_keyEvent(code, action)
	{
		this.keyEvent(code, action);
		this.onKeyEvent(code, action);
	}

	keyEvent(code, action) { }
	onKeyEvent(code, action) { }
	
	onSwapTo() { }
}