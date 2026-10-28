import { Utils } from "./wf_Utils.js";

export class Renderer
{
	constructor(containerID, engine, screenWidth = 1440, screenHeight = 1080, screenRatio = 4/3)
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

		this.engine = engine;

		this.requestId = null;

		this.screenWidth = screenWidth;
		this.screenHeight = screenHeight;
		this.screenRatio = screenRatio;
		this.ratioChord = Math.sqrt(screenWidth * screenWidth + screenHeight * screenHeight); 

		this.origin = {x: 0, y: 0};
		this.lastTime = 0;

		this.camera = null;
	}

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

	swapScene(scene)
	{
		this.currentScene = scene;
	}

	stop()
	{
		if (this.requestId)
		{
			cancelAnimationFrame(this.requestId);
			this.requestId = null;
		}
	}

	resize()
	{
		let canvasBoundingBox = this.canvas.getBoundingClientRect();	
		
		this.width = canvasBoundingBox.width;
		this.height = canvasBoundingBox.height;

		this.canvas.width = this.width;
		this.canvas.height = this.height;

		this.scaleMod = Math.sqrt(this.width * this.width + this.height * this.height) / this.ratioChord;
		this.screenCenter = {x: this.width * 0.5, y: this.height * 0.5};

		this.context.textAlign = "center";
		this.context.textBaseline = "middle";
	}

	renderLoop = (t) =>
	{
		const deltaTime = (t - this.lastTime) / 1000;
		this.lastTime = t;

		const currentScene = this.engine.currentScene;
		const currentCamera = this.engine.currentCamera;

		currentCamera.update();
		
		this.context.fillStyle = this.engine.currentScene.backgroundColor;
		this.context.fillRect(-10, -10, this.width + 10, this.height + 10);

		this.context.save();
		
		this.context.translate(this.screenCenter.x, this.screenCenter.y);
		this.context.scale(currentCamera.scaleX * this.scaleMod, currentCamera.scaleY * this.scaleMod);
		this.context.rotate(Utils.getRadians(-currentCamera.rotation));
		this.context.translate(-currentCamera.positionX, -currentCamera.positionY);
		currentScene.update(deltaTime);
		currentScene.draw(this.context);

		this.context.restore();

		this.requestId = requestAnimationFrame((t) => this.renderLoop(t));
	}
}