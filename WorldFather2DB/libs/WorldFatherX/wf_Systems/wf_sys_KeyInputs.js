import { BaseSystem } from "./wf_sys_BaseSystem.js";

export class KeyInputs extends BaseSystem
{
	constructor(wf)
	{
		super("KeyInputs", wf);
		this.keysPressed = {};
	}

	onSetup()
	{
		this.wf.isKeyDown = (key) =>
		{
			return this.keysPressed[key];
		};

		window.addEventListener('keydown', this.onKeyDown);
		window.addEventListener('keyup', this.onKeyUp);
	}

	onKeyDown = (e) =>
	{
		//if (e.repeat) return;
		this.keysPressed[e.code] = true;
		this.wf.currentScene._keyEvent?.(e.code, "down");
	}

	onKeyUp = (e) =>
	{
		//if (e.repeat) return;
		delete this.keysPressed[e.code];
		this.wf.currentScene._keyEvent?.(e.code, "up");
	}

	onDeath()
	{
		window.removeEventListener('keydown', this.onKeyDown);
		window.removeEventListener('keyup', this.onKeyUp);
		delete this.wf.isKeyDown;
	}
}