import { Scene } from "./wf_Scene.js";
import { Camera } from "./wf_Camera.js"
import * as objects from "./wf_Objects.js";
import { Utils } from "./wf_Utils.js";

export class WorldFather 
{
	constructor(containerID, screenWidth = 1440, screenHeight = 1080, screenRatio = 4 / 3)
	{
		this.container = document.getElementById(containerID);

		const canvasElement = document.createElement("canvas");
		canvasElement.id = containerID + "Canvas";
		canvasElement.style.width = "100%";
		canvasElement.style.height = "100%";
		canvasElement.style.display = "block";
		this.container.appendChild(canvasElement);

		this.canvas = this.container.querySelector("#" + containerID + "Canvas");
		this.context = this.canvas.getContext("2d");

		this.resizer = new ResizeObserver(e =>
		{
			this.resize();
		});
		this.resizer.observe(this.container);

		this.requestId = null;

		this.screenWidth = screenWidth;
		this.screenHeight = screenHeight;
		this.screenRatio = screenRatio;
		this.ratioChord = Math.sqrt(screenWidth * screenWidth + screenHeight * screenHeight);

		this.origin = { x: 0, y: 0 };
		this.lastTime = 0;

		this.camera = null;

		this.fullScreenHeight = this.screenHeight;
		this.fullScreenWidth = this.screenWidth;
		this.halfScreenHeight = this.screenHeight * 0.5;
		this.halfScreenWidth = this.screenWidth * 0.5;

		this.globalData = {};

		//Scenes
		this.scenes = {};
		this.currentScene = null;

		//Cameras
		this.cameras = {};
		this.currentCamera = null;

		//CollisionDetection
		this.neighbours = [];

		//InputDetection
		this.keysPressed = {};

		window.addEventListener('keydown', this.onKeyDown);
		window.addEventListener('keyup', this.onKeyUp);

		//MouseDetection
		this.canvas.addEventListener('click', this.onClick);
		this.currentClickObj = false;

		// Setup

		this.addScene("Default", new Scene());
		this.swapScene("Default");
		this.addCamera("Default");
		this.swapCamera("Default");

		// DebugDraws (NonObjects)
		this.ddCollisionGrid = false;
		this.ddActiveCollisionCells = false;
		this.ddSceneCenterRings = false;
	}

	// Canvas

	resize()
	{
		let canvasBoundingBox = this.canvas.getBoundingClientRect();

		this.width = canvasBoundingBox.width;
		this.height = canvasBoundingBox.height;

		this.canvas.width = this.width;
		this.canvas.height = this.height;

		this.scaleMod = Math.sqrt(this.width * this.width + this.height * this.height) / this.ratioChord;
		this.screenCenter = { x: this.width * 0.5, y: this.height * 0.5 };

		this.context.textAlign = "center";
		this.context.textBaseline = "middle";
	}

	// Rendering
	
	start()
	{
		if (!this.requestId)
		{
			this.resize();
			this.requestId = requestAnimationFrame((t) => this.renderLoop(t));
		}
		else
		{
			this.stop();
			this.start();
		}
	}

	stop()
	{
		if (this.requestId)
		{
			cancelAnimationFrame(this.requestId);
			this.requestId = null;
		}
	}

	swapScene(scene)
	{
		this.currentScene = scene;
	}

	renderLoop = (t) =>
	{
		const deltaTime = (t - this.lastTime) / 1000;
		this.lastTime = t;

		const currentScene = this.currentScene;
		const currentCamera = this.currentCamera;
		currentCamera.update();

		this.context.fillStyle = this.currentScene.backgroundColor;
		this.context.fillRect(-10, -10, this.width + 10, this.height + 10);

		this.context.save();

		this.setupGlobalCamera();

		currentScene.update(deltaTime, this.context);
		//currentScene.draw(this.context);

		this.context.restore();

		this.requestId = requestAnimationFrame((t) => this.renderLoop(t));
	}

	setupGlobalCamera()
	{	
		this.context.translate(this.screenCenter.x, this.screenCenter.y);
		this.context.scale((this.currentCamera.zoomX) * this.scaleMod, (this.currentCamera.zoomY) * this.scaleMod);
		this.context.rotate(Utils.getRadians(-this.currentCamera.rotation));
		this.context.translate(-this.currentCamera.positionX, -this.currentCamera.positionY);
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
				
				this.context.fillStyle = "magenta";

				if (neighbourCell)
				{
					this.context.fillStyle = "cyan";
					for (let k = 0; k < neighbourCell[1].length; k++)
					{
						const object = neighbourCell[1][k];
						if(!tempNeightbours.includes(object)) tempNeightbours.push(object);
					}					
				}
				
				if(this.ddActiveCollisionCells)
				{
					const posX = neighbourX * this.currentScene.gridSize + 50;
					const posY = neighbourY * this.currentScene.gridSize + 50;
					this.context.beginPath();
					this.context.arc(posX, posY, this.currentScene.gridSize * 0.25, 0, 2 * Math.PI);
					this.context.fill();
				}
			}
		}

		return tempNeightbours;
	}

	testNeighbourCells(neighbours)
	{
		for (let i = 0; i < neighbours.length; i++)
		{
			for (let j = 0; j < neighbours.length; j++)
			{
				const object1 = neighbours[i];
				const object2 = neighbours[j];
				if (object1.id == object2.id) continue;
				if (object1.collisionTestedAgainst.includes(object2)) continue;
				const isColliding = this.isColliding([object1, object2]);
				object1.collisionTestedAgainst.push(object2);
				object2.collisionTestedAgainst.push(object1);
				if (isColliding) 
				{
					object1.collidedWith?.(object2);
					object2.collidedWith?.(object1);
				}
			}
		}
	}

	isColliding(objectPair)
	{
		// Polygon x Polygon Collision
		if (!objectPair[0].isEllipse && !objectPair[1].isEllipse)
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
		// Polygon x Ellipse Collision (And Ellipse x Ellipse that estimates one as poly)
		else
		{
			const ellipse = objectPair[0].isEllipse ? objectPair[0] : objectPair[1];
			const box = objectPair[0].isEllipse ? objectPair[1] : objectPair[0];
			
			const verticies = (box.isEllipse) ? Utils.getPointsOnEllipsis(box, 16) : box.verticies;

			// for (let i = 0; i < verticies.length; i++)
			// {
			// 	const vert = verticies[i];
			// 	this.context.beginPath();
			// 	this.context.arc(vert[0], vert[1], 5, 0, 2 * Math.PI);
			// 	this.context.fill();
			// }
			// for (let i = 0; i < verticies.length - 1; i += 2)
			// {
			// 	const vert1 = verticies[i];
			// 	const vert2 = verticies[i+1];
			// 	this.context.beginPath();
			// 	this.context.moveTo(vert1[0], vert1[1]);
			// 	this.context.lineTo(vert2[0], vert2[1]);
			// 	this.context.fill();
			// }

			const cos = Math.cos(-Utils.getRadians(ellipse.rotation));
			const sin = Math.sin(-Utils.getRadians(ellipse.rotation));

			const invRx = 1 / (ellipse.width * 0.5);
			const invRy = 1 / (ellipse.height * 0.5);

			const cx = ellipse.positionX;
			const cy = ellipse.positionY;
			const r2 = 1;

			let inside = false;

			for (let i = 0, j = verticies.length - 1; i < verticies.length; j = i++) {

				// ===== transform current + next vertex =====
				let x1 = (verticies[i][0] - cx);
				let y1 = (verticies[i][1] - cy);

				let x2 = (verticies[j][0] - cx);
				let y2 = (verticies[j][1] - cy);

				// unrotate + scale (ellipse -> unit circle space)
				const tx1 = (x1 * cos - y1 * sin) * invRx;
				const ty1 = (x1 * sin + y1 * cos) * invRy;

				const tx2 = (x2 * cos - y2 * sin) * invRx;
				const ty2 = (x2 * sin + y2 * cos) * invRy;

				// ===== point in polygon (circle center at 0,0) =====
				const yi = ty1, xi = tx1;
				const yj = ty2, xj = tx2;

				if (((yi > 0) !== (yj > 0)) &&
					(0 < (xj - xi) * (0 - yi) / (yj - yi + 1e-12) + xi)) {
					inside = !inside;
				}

				// ===== edge distance check to circle center =====
				const abx = xj - xi, aby = yj - yi;
				const apx = -xi, apy = -yi;

				const t = Math.max(0, Math.min(1,
					(apx * abx + apy * aby) / (abx * abx + aby * aby + 1e-12)
				));

				const dx = xi + abx * t;
				const dy = yi + aby * t;

				if (dx * dx + dy * dy <= r2) return true;
			}

			return inside;
		}
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
		return this.keysPressed[keycode] ?? false;
	}

	// Mouse Detection

	onClick = (e) =>
	{
		const x = (((e.offsetX / this.scaleMod) - ((this.width * 0.5) / this.scaleMod)) + this.currentCamera.positionX) / (this.currentCamera.zoomX);
		const y = (((e.offsetY / this.scaleMod) - ((this.height * 0.5) / this.scaleMod)) + this.currentCamera.positionY) / (this.currentCamera.zoomY);
		const coords = { x, y };
		this.currentScene.onClick?.(coords);
		
		const gridSize = this.currentScene.gridSize;
		const gridX = Math.floor(x / gridSize);
		const gridY = Math.floor(y / gridSize);
	}
}