import { DefaultScene } from "./wf_Internal/wf_int_DefaultScene.js";
import { Engine } from "./wf_Engine.js";
import * as objects from "./wf_Objects.js";
import { Renderer } from "./wf_Renderer.js";
import { Scene } from "./wf_Scene.js";
import * as systems from "./wf_Systems.js";
import { Utils } from "./wf_Utils.js";
import { ErrorManager } from "./wf_ErrorManager.js";

export class WorldFather2D
{
	constructor(containerID, screenWidth = 1440, screenHeight = 1080, screenRatio = 4 / 3)
	{
		// Components
		this.engine = new Engine(this);
		this.renderer = new Renderer(this, containerID);
		this.addSystem(new systems.KeyInputs(this));
		this.addSystem(new systems.MouseSystem(this));
		this.addSystem(new systems.CollisionDetection(this));

		this.Utils = new Utils(this);
		this.ErrorManager = new ErrorManager(this);

		this.renderID;

		this.screenWidth = screenWidth;
		this.screenHeight = screenHeight;
		this.halfScreenWidth = screenWidth * 0.5;
		this.halfScreenHeight = screenHeight * 0.5;
		this.screenRatio = screenRatio;
		this.ratioChord = Math.sqrt(screenWidth * screenWidth + screenHeight * screenHeight);

		//Scenes
		this.scenes = {};
		this.currentScene = null;
		this.lastScene = null;

		//Cameras
		this.cameras = {};
		this.currentCamera = null;

		// Setup
		this.addScene("DefaultScene", new DefaultScene());
		this.swapScene("DefaultScene");
		this.addCamera("Default");
		this.swapCamera("Default");
	}

	start()
	{
		if (!this.renderID)
		{
			this.renderer._resize();
			this.renderID = requestAnimationFrame((t) => this.engine._timeStep(t));
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

	// Systems

	addSystem(system)
	{
		system.wf = this;
		this[system.name] = system;
		this[system.name].onSetup();
	}

	removeSystem(systemName)
	{
		this[systemName].onDeath();
		delete this[systemName];
	}

	// Scenes

	addScene(name, scene)
	{
		scene.wf = this;
		this.scenes[name] = scene;
		scene._initialise();
	}

	swapScene(name)
	{
		this.lastScene = this.currentScene;
		this.currentScene = this.scenes[name];
		this.scenes[name].onSwapTo();
	}

	swapToLastScene()
	{
		const tempHold = this.currentScene
		this.currentScene = this.lastScene;
		this.lastScene = tempHold;
		this.currentScene.onSwapTo();
	}

	// Cameras

	addCamera(name, ovr = {})
	{
		const newCam = new objects.Camera();
		newCam.wf = this;
		newCam._initialise();
		this.cameras[name] = newCam;
	}

	swapCamera(name)
	{
		this.currentCamera = this.cameras[name];
	}
}