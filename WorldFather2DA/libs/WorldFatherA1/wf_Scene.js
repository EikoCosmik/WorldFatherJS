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
		this.gridSize = 100;
		this.startTime = Date.now();
		this.backgroundColor = "#ff00ff";
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

	update(dt)
	{
		this.collisionGrid = {};
		
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
				this.engine.CollisionDetection?.updateCollisionGrid(object, i, this.collisionGrid);
			};
		}
		this.engine.CollisionDetection?.testCollisionGrid(this.collisionGrid);
	}

	draw(ctx)
	{
		for (let key in this.layers)
		{
			this.layers[key].forEach(obj => obj.draw(ctx));
		}
	}

	onSetup(){}
}