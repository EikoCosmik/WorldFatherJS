import { BaseSystem } from "./wf_sys_BaseSystem.js";

export class MouseSystem extends BaseSystem
{
	constructor(inherited)
	{
		super("MouseSystem", inherited);
		this.isMouseDown = false;
		this.sampleRate = 250;
		this.sampleTimer = Date.now();
		this.rawMove;
		this.rawDown;
		this.rawUp;
		this.worldCoords;
	}

	onSetup()
	{
		this.wf.isMouseDown = () =>
		{
			return this.isMouseDown;
		};

		this.wf.renderer.canvas.addEventListener('mousemove', this.mouseMove);
		this.wf.renderer.canvas.addEventListener('mousedown', this.mouseDown);
		this.wf.renderer.canvas.addEventListener('mouseup', this.mouseUp);
	}

	mouseMove = (e) =>
	{
		this.rawMove = e;
	}
	
	mouseDown = (e) =>
	{
		this.rawDown = e;
		this.isMouseDown = true;
		this.wf.currentScene._mouseEvent?.(e, { type: "down", button: e.button });
	}
	
	mouseUp = (e) =>
	{
		this.rawUp = e;
		this.isMouseDown = false;
		this.wf.currentScene._mouseEvent?.(e, { type: "up", button: e.button });
	}

	getWorldCoords(coords)
	{
		const renderer = this.wf.renderer;
		const currentCamera = this.wf.currentCamera;
		const scaleMod = renderer.scaleMod;

		const cursorX = (((coords.offsetX - (renderer.width * 0.5)) / scaleMod) / currentCamera.scaleX) + currentCamera.positionX;
		const cursorY = (((coords.offsetY - (renderer.height * 0.5)) / scaleMod) / currentCamera.scaleY) + currentCamera.positionY;

		const rotatedCoords = this.wf.Utils.rotatePoint(cursorX, cursorY, currentCamera.rotation, currentCamera.positionX, currentCamera.positionY);
		
		return { x: rotatedCoords[0], y: rotatedCoords[1] };

		// (((e.offsetX / scaleMod) - ((renderer.width * 0.5) / scaleMod)) + (currentCamera.positionX * currentCamera.zoomX)) / currentCamera.zoomX == (((e.offsetX - (renderer.width * 0.5)) / scaleMod) / currentCamera.zoomX) + currentCamera.positionX
	}

	onDeath()
	{
		this.wf.renderer.canvas.removeEventListener('click', this.mouseEvent);
		delete this.wf.isMouseDown;
	}
}