import { clickObject } from "./wf_Objects.js";

export class Scene
{
	constructor()
	{
		this.importantObjs = {};
		this.layers = 
		{
			grids: [],
			back1: [],
			back2: [],
			hind: [],
			main: [],
			fore: [],
			ui1: [],
			ui2: []
		}
		this.collisionGrid = {};
		this.clickableGrid = {};
		this.gridSize = 100;
		this.startTime = Date.now();
		this.backgroundColor = "#ff00ff";
		this.unresolvedClick = false;
		this.curClick = false;
		this.lastClicked = false;
	}

	addObject(obj, opts)
	{
		obj.scene = this;
		obj.engine = this.engine;
		const {layer = "main", name = false} = {} = opts ?? {};
		if(name != false)
		{
			this.importantObjs[name] = obj;
			obj.importantName = name;
		}
		this.layers[layer].unshift(obj);
		obj.onSetup();
	}

	update(dt, ctx)
	{
		this.collisionGrid = {};
		this.clickableGrid = {};
		if (this.curClick) this.engine.updateCollisionGrid(this.curClick, this.clickableGrid);
		
		for (let key in this.layers)
		{
			for (let i = this.layers[key].length - 1; i > -1; i--)
			{
				const object = this.layers[key][i];
				if (!object.update(dt))
				{
					this.layers[key].splice(i, 1);
					if(this.importantObjs[object.importantName]) delete this.importantObjs[object.importantName];
					object.onDeath();
					continue;
				}
				if (object.canCollide) this.engine.updateCollisionGrid(object, this.collisionGrid);
				if (object.isClickable) this.engine.updateCollisionGrid(object, this.clickableGrid);
				object.draw(ctx);
			};
		}
		if (this.collisionGrid != {}) this.engine.testCollisionGrid(this.collisionGrid);
		if (this.clickableGrid != {}) this.engine.testCollisionGrid(this.clickableGrid);
		this.curClick = false;
		this.lastClicked.onClicked?.();
		this.lastClicked = false;
	}

	onSetup() { }

	onClick(coords)
	{
		this.curClick = new clickObject({ positionX: coords.x, positionY: coords.y, scaleX: 1, scaleY: 1 });
		this.addObject(this.curClick);
		console.log(coords)
	}
}