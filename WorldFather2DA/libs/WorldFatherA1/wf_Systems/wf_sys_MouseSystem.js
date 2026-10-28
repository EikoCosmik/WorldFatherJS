import { BaseSystem } from "./wf_sys_BaseSystem.js";

export class MouseSystem extends BaseSystem
{
	constructor()
	{
		super("MouseSystem");
	}

	onSetup()
	{
		this.Renderer = this.engine.Renderer;
		this.engine.Renderer.canvas.addEventListener('click', this.onClick);
	}

	onClick = (e) =>
	{
		let x = (((e.offsetX / this.Renderer.scaleMod) - ((this.Renderer.width * 0.5) / this.Renderer.scaleMod)) + this.engine.currentCamera.positionX) / this.engine.currentCamera.scaleY;;
		let y = (((e.offsetY / this.Renderer.scaleMod) - ((this.Renderer.height * 0.5) / this.Renderer.scaleMod)) + this.engine.currentCamera.positionY) / this.engine.currentCamera.scaleY;
		this.engine.currentScene.onClick?.({x, y})
	}

	onDeath()
	{
		this.engine.Renderer.canvas.removeEventListener('click', this.onClick);
	}
}