import { Renderer } from "./wf_Renderer.js";
import { Scene } from "./wf_Scene.js";
import { Camera } from "./wf_Camera.js"
import * as objects from "./wf_Objects.js";

export class WorldFather 
{
	constructor()
	{
		this.cameras = {};
		this.scenes = {};
		this.currentScene = null;
		this.currentCamera = null;
		// this.debugKeys = 
		// {
		// 	objectGridCalculation: true,
		// 	objectForwardVector: true,
		// 	sceneGrid: false,
		// 	sceneOriginPoint: true
		// };
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

	// Systems

	addSystem(system)
	{
		system.engine = this;
		this[system.name] = system;
		this[system.name].onSetup();
	}

	removeSystem(systemName)
	{
		this[systemName].onDeath();
		delete this[systemName];
	}
}