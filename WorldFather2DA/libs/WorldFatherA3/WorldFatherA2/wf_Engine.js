import { Renderer } from "./wf_Renderer.js";
import { Scene } from "./wf_Scene.js";
import { Camera } from "./wf_Camera.js"
import * as objects from "./wf_Objects.js";

export class WorldFather 
{
	constructor()
	{
		//Scenes
		this.scenes = {};
		this.currentScene = null;

		//Cameras
		this.cameras = {};
		this.currentCamera = null;
	}

	initalise(containerID, screenWidth = 1440, screenHeight = 1080, screenRatio = 4 / 3)
	{
		this.Renderer = new Renderer(containerID, this, screenWidth, screenHeight, screenRatio);
		this.fullScreenHeight = screenHeight;
		this.fullScreenWidth = screenWidth;
		this.halfScreenHeight = screenHeight * 0.5;
		this.halfScreenWidth = screenWidth * 0.5;
		this.addScene("Default", new Scene());
		this.swapScene("Default");
		this.addCamera("Default");
		this.swapCamera("Default");

		//CollisionDetection
		this.neighbours = [];

		//InputDetection
		this.keysPressed = {};

		this.isKeyDown = (key) =>
		{
			return this.keysPressed[key];
		};

		window.addEventListener('keydown', this.onKeyDown);
		window.addEventListener('keyup', this.onKeyUp);

		//MouseDetection
		this.Renderer.canvas.addEventListener('click', this.onClick);
		this.currentClickObj = false;
	}
	
	start()
	{
		this.Renderer.start();
	}

	stop()
	{
		this.Renderer.stop();
	}

	// Scenes

	addScene(name, scene)
	{
		scene.engine = this;
		this.scenes[name] = scene;
		scene.onSetup();
	}

	swapScene(name)
	{
		this.currentScene = this.scenes[name];
	}

	// Cameras

	addCamera(name, ovr = {})
	{
		this.cameras[name] = new Camera(name, ovr);
	}

	swapCamera(name)
	{
		this.currentCamera = this.cameras[name];
	}

	// Collision Detection

	updateCollisionGrid(object, collisionGrid)
	{
		const objectCells = object.getGridCells();
		for (let j = 0; j < objectCells.length; j++)
		{
			let cellString = `${objectCells[j]}`;
			if (!collisionGrid[cellString]) collisionGrid[cellString] = [objectCells[j], [object]];
			else if (!collisionGrid[cellString].includes(object)) collisionGrid[cellString][1].push(object);
		}
	}

	testCollisionGrid(collisionGrid)
	{
		for (let key in collisionGrid)
		{
			const cellPosition = collisionGrid[key][0];
			const neighbours = this.getCollisionNeighbours(cellPosition, collisionGrid);

			if (neighbours.length > 1)
			{
				this.testNeighbourCells(neighbours)
			}
		}
	}

	testNeighbourCells(neighbours)
	{
		for (let i = 0; i < neighbours.length - 1; i++)
		{
			for (let j = 0; j < neighbours.length - 1; j++)
			{
				const object1 = neighbours[i];
				const object2 = neighbours[j];
				if (object1.id == object2.id) continue;
				if (object1.hasCollidedWith.includes(object2)) continue;
				const isColliding = this.isColliding([object1, object2]);
				if (isColliding) 
				{
					object1.hasCollidedWith.push(object2);
					object2.hasCollidedWith.push(object1);
					object1.collidedWith?.(object2);
					object2.collidedWith?.(object1);
				}
			}
		}
	}

	isColliding(objectPair)
	{
		for (let i = 0; i < 2; i++)
		{
			for (let j = 0; j < objectPair[i].normals.length; j++)
			{
				let max = [-Infinity, -Infinity];
				let min = [Infinity, Infinity];
				let normal = [...objectPair[i].normals[j]];

				for (let k = 0; k < objectPair.length; k++)
				{
					for (const vertex of objectPair[k].verticies)
					{
						let dotProduct = normal[0] * vertex[0] + normal[1] * vertex[1];
						if (dotProduct > max[k]) max[k] = dotProduct;
						if (dotProduct < min[k]) min[k] = dotProduct;

					};
				}
				if (!(max[0] >= min[1] && max[1] >= min[0])) return false;
			}
		}

		return true;
	}

	getCollisionNeighbours(cellPosition, collisionGrid)
	{
		const tempNeightbours = [];

		for (let i = -1; i < 2; i++)
		{
			
			const neighbourX = cellPosition[0] + i;
			for (let j = -1; j < 2; j++)
			{
				const neighbourY = cellPosition[1] + j;
				const neighbourCellKey = `${[neighbourX, neighbourY]}`;
				const neighbourCell = collisionGrid[neighbourCellKey];
				if (neighbourCell)
				{
					for (let k = 0; k < neighbourCell[1].length; k++)
					{
						const object = neighbourCell[1][k];
						tempNeightbours.push(object);
					}
				}
			}
		}

		return tempNeightbours;
	}

	// Input Detection

	onKeyDown = (e) =>
	{
		this.keysPressed[e.code] = true;
	}

	onKeyUp = (e) =>
	{
		delete this.keysPressed[e.code];
	}

	isKeyDown(keycode)
	{
		return this.keysPressed[keycode]
	}

	// Mouse Detection

	onClick = (e) =>
	{
		const x = (((e.offsetX / this.Renderer.scaleMod) - ((this.Renderer.width * 0.5) / this.Renderer.scaleMod)) + this.currentCamera.positionX) / (this.currentCamera.zoomX * 0.01);
		const y = (((e.offsetY / this.Renderer.scaleMod) - ((this.Renderer.height * 0.5) / this.Renderer.scaleMod)) + this.currentCamera.positionY) / (this.currentCamera.zoomY * 0.01);
		const coords = { x, y };
		this.currentScene.onClick?.(coords);
		
		const gridSize = this.currentScene.gridSize;
		const gridX = Math.floor(x / gridSize);
		const gridY = Math.floor(y / gridSize);
		// this.unresolvedClick = new objects.clickObject({positionX: x, positionY: y, gridX: gridX, gridY: gridY}); // update to obj
		// this.unresolvedClick.onSetup();
	}
	
	testClickedOn(ctx, object)
	{
		if (this.unresolvedClick)
		{
			const neighbours = this.getCollisionNeighbours([this.unresolvedClick.gridX, this.unresolvedClick.gridY], this.currentScene.collisionGrid);
			neighbours.push(this.unresolvedClick);
			this.testNeighbourCells(neighbours);

			// if (object.worldDirty) object.updateWorldData();
			// ctx.save();
			// ctx.setTransform(1, 0, 0, 1, 0, 0);
			// const p = new Path2D();

			// p.moveTo(object.verticies[0][0], object.verticies[0][1]);
			// for (let i = 1; i < object.verticies.length; i++)
			// {
			// 	p.lineTo(object.verticies[i][0], object.verticies[i][1]);
			// }
			// p.closePath();

			// if (ctx.isPointInPath(p, this.unresolvedClick.x, this.unresolvedClick.y))
			// {
			// 	console.log("hit");
			// 	this.unresolvedClick = false;
			// }
			// ctx.restore();
		}
	}
}