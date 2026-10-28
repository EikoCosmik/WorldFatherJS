export class Renderer 
{
	constructor(WF, containerID)
	{
		this.wf = WF;

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
			this._resize();
		});
		this.resizer.observe(this.container);
	}

	// Canvas

	_resize()
	{
		let canvasBoundingBox = this.canvas.getBoundingClientRect();

		this.width = canvasBoundingBox.width;
		this.height = canvasBoundingBox.height;

		this.canvas.width = this.width;
		this.canvas.height = this.height;

		this.scaleMod = Math.sqrt(this.width * this.width + this.height * this.height) / this.wf.ratioChord;
		this.screenCenter = { x: this.width * 0.5, y: this.height * 0.5 };

		this.context.textAlign = "center";
		this.context.textBaseline = "middle";
	}

	// Rendering

	_render()
	{
		const currentScene = this.wf.currentScene;
		const currentCamera = this.wf.currentCamera;

		currentCamera._update();

		this.context.fillStyle = currentScene.backgroundColor;
		this.context.fillRect(-10, -10, this.width + 10, this.height + 10);

		this.context.save();

		this._setupGlobalCamera();

		if (this.wf.CollisionDetection.cellsForDebug.length > 0)
		{
			const collisionDetectionDebug = this.wf.CollisionDetection.cellsForDebug;

			for (let i = 0; i < collisionDetectionDebug.length; i++)
			{
				this.context.fillStyle = collisionDetectionDebug[i][2];
				this.context.beginPath();
				this.context.arc(collisionDetectionDebug[i][0], collisionDetectionDebug[i][1], this.wf.currentScene.gridSize * 0.25, 0, 2 * Math.PI);
				this.context.fill();
			}
		}

		currentScene._drawObjects(this.context);

		currentCamera._draw(this.context);

		this.context.restore();
	}

	_setupGlobalCamera()
	{
		const currentCamera = this.wf.currentCamera;
		this.context.translate(this.screenCenter.x, this.screenCenter.y);
		this.context.scale((currentCamera.scaleX) * this.scaleMod, (currentCamera.scaleY) * this.scaleMod);
		this.context.rotate(this.wf.Utils.getRadians(-currentCamera.getWorldRotation()));
		const camPos = currentCamera.getWorldPosition()
		this.context.translate(-camPos[0], -camPos[1]);
	}
}