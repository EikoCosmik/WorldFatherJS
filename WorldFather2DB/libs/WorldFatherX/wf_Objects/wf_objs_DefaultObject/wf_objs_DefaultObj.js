import { setupDefaultDebug } from "./wf_objDef_debug.js";
import { setupDefaultDrawing } from "./wf_objDef_drawing.js";
import { setupDefaultCollisions } from "./wf_objDef_collisions.js";
import { setupDefaultParentChild } from "./wf_objDef_parentChild.js";
import { setupDefaultText } from "./wf_objDef_text.js";
import { setupDefaultImage } from "./wf_objDef_image.js";
import { setupDefaultWorldData } from "./wf_objDef_worldData.js";
import { _getProxyHandler, _getModuleHandler } from "./wf_objDef_proxyHandler.js";

export class DefaultObj
{
	constructor(inherited = {})
	{
		this._ready = false;
		this.overrides = inherited;
		if(inherited.debugDefaultConstructor) debugger;

		//Let this object return the proxy, do not re-return just overwrite getProxyHandler()
		//return new Proxy(this, (this._getProxyHandler != null) ? this._getProxyHandler() : _getProxyHandler());
		return new Proxy(this, _getProxyHandler());
	}

	_initialise(opts = {})
	{
		//Add self to Scene
		if (this.scene != null)
		{
			const name = opts.name ?? false;
			if (name != false)
			{
				this.scene.importantObjects[name] = this;
				this.importantName = name;
			}
			this.scene.layers[opts.layer ?? "default"].push(this);
			this.layer = opts.layer;
		}

		// Identity
		this.id = Symbol("UID");
		this.isLive = true;
		this.tag = this.overrides.tag ?? "_Default";
		this.dirtyData = true;
		this.references = this.overrides.references ?? {};

		// Required
		this.positionX = this.overrides.positionX ?? 0;
		this.positionY = this.overrides.positionY ?? 0;
		this.scaleX = this.overrides.scaleX ?? 1;
		this.scaleY = this.overrides.scaleY ?? 1;
		this.rotation = this.overrides.rotation ?? 0;
		this.width = this.overrides.width ?? 100;
		this.height = this.overrides.height ?? 100;
		this.halfWidth = this.width * 0.5;
		this.halfHeight = this.height * 0.5;
		this.shape = this.overrides.shape ?? this.wf.Utils.getShape(4); // Can be "ellipse"
		this.clickDetectionType = this.overrides.clickDetectionType ?? "up";

		//Trigs
		const cos = Math.cos(this.wf.Utils.getRadians(this.rotation));
		const sin = Math.sin(this.wf.Utils.getRadians(this.rotation));
		this.cos = cos;
		this.sin = sin;
		this.forwardX = cos;
		this.forwardY = sin;
		this.backX = -cos;
		this.backY = -sin;
		this.leftX = sin;
		this.leftY = -cos;
		this.rightX = -sin;
		this.rightY = cos;

		// Toggles
		const useDeath = this.overrides.useDeath ?? true;
		const useDebug = this.overrides.useDebug ?? false;
		const useDrawing = this.overrides.useDrawing ?? true;
		const useText = this.overrides.useText ?? false; // Requires: useDrawing
		const useImage = this.overrides.useImage ?? false; // Requires: useDrawing
		const useUpdate = this.overrides.useUpdate ?? true;
		const useWorldData = this.overrides.useWorldData ?? false;
		const useCollision = this.overrides.useCollision ?? false; // Requires: useWorldData
		const useParentChild = this.overrides.useParentChild ?? false; // Requires: useWorldData
		const useClickable = this.overrides.useClickable ?? false;
		
		this._resetModules = false;
		this._modules = 
		{
			useDrawing: { using: useDrawing, reset: useDrawing, remove: false, Setup: this.overrides.drawingModuleSetup ?? this.setupDefaultDrawing },
			useDeath: { using: useDeath, reset: useDeath, remove: false, Setup: this.overrides.deathModuleSetup ?? this.setupDefaultDeath },
			useDebug: { using: useDebug, reset: useDebug, remove: false, Setup: this.overrides.debugModuleSetup ?? setupDefaultDebug },
			useText: { using: useText, reset: useText, remove: false, Setup: this.overrides.textModuleSetup ?? setupDefaultText },
			useImage: { using: useImage, reset: useImage, remove: false, Setup: this.overrides.imageModuleSetup ?? setupDefaultImage },
			useUpdate: { using: useUpdate, reset: useUpdate, remove: false, Setup: this.overrides.updateModuleSetup ?? this.setupDefaultUpdate },
			useWorldData: { using: useWorldData, reset: useWorldData, remove: false, Setup: this.overrides.worldDataModuleSetup ?? setupDefaultWorldData },
			useCollision: { using: useCollision, reset: useCollision, remove: false, Setup: this.overrides.collisionsModuleSetup ?? setupDefaultCollisions },
			useParentChild: { using: useParentChild, reset: useParentChild, remove: false, Setup: this.overrides.parentChildModuleSetup ?? setupDefaultParentChild },
			useClickable: { using: useClickable, reset: useClickable, remove: false, Setup: this.overrides.clickablleModuleSetup ?? this.setupDefaultClickable },
		};

		this._setupModules();
		
		this._ready = true;

		this.onSetup();

		if(this._resetModules) this._setupModules();
	}

	_setupModules()
	{
		Object.entries(this._modules).forEach(([key, module]) =>
		{
			if (module.using && module.reset) { module.Setup(this); module.reset = false; }
		});
		this._resetModules = false;

		// if (this.useUpdate) this.setupDefaultUpdate();
		// if (this.useDebug) this.setupDefaultDebug();
		// if (this.useDrawing) this.setupDefaultDrawing();
		// if (this.useText) this.setupDefaultText(this);
		// if (this.useImage) this.setupDefaultImage(this);
		// if (this.useWorldData) this.setupDefaultWorldData(this);
		// if (this.useCollision) this.setupDefaultCollisions(this);
		// if (this.useParentChild) this.setupDefaultParentChild(this);
		// if (this.useClickable) this.setupDefaultClickable(this);
	}

	modifyModule()
	{
		if (!("status" in dict))
		{
			console.log("Key does not exist!");
		}
	}

	setupDefaultDeath(obj)
	{
		if (obj.onDeath == null) obj.onDeath = () => { };

		const steps = [];

		if (obj._modules["useParentChild"].using) steps.push(() => 
		{
			if (obj.parent != null) obj.parent.removeChild(obj.relativeID);
			for (let i = 0; i < obj.childRunningCount; i++) obj.children[i].isLive = false;
		});

		steps.push(() => obj.onDeath());

		obj._onDeath = () =>
		{
			for (const step of steps) step();
		}
	}

	setupDefaultUpdate(obj)
	{
		if (obj.update == null) obj.update = (dt) => { };

		const steps = [];

		if (obj._modules["useWorldData"].using) steps.push(() => { if (obj.dirtyData) obj._updateWorldData(); })
		if (obj._modules["useCollision"].using) steps.push(() => obj._collisionTestedAgainst = []);
		steps.push((dt) => obj.update(dt));

		obj._update = (dt) =>
		{
			for (const step of steps) step(dt);
			return obj.isLive;
		}
	}

	setupDefaultDebug(obj) { setupDefaultDebug(obj); }

	setupDefaultDrawing(obj) { setupDefaultDrawing(obj); }

	setupDefaultWorldData(obj) { setupDefaultWorldData(obj); }

	setupDefaultCollisions(obj) { setupDefaultCollisions(obj); }

	setupDefaultParentChild(obj) { setupDefaultParentChild(obj); }

	setupDefaultText(obj) { setupDefaultText(obj); }

	setupDefaultImage(obj) { setupDefaultImage(obj); }

	setupDefaultClickable(obj)
	{
		if (obj.clickID != null) delete obj.scene.clickableObjects[obj.clickID];

		obj.wf.ErrorManager.isExpected(obj._modules["useWorldData"].using, true, "Object Clickable Requires Object WorldData ");

		if (obj.onClicked == null) obj.onClicked = (function (worldCoords, coords, data) { if (data.type == obj.clickDetectionType) console.log("Unset onClicked") });
		obj._isHover = false;

		obj.clickID = Object.keys(obj.scene.clickableObjects).length;
		obj.scene.clickableObjects[obj.clickID] = obj;
	}

	addReference(key, object)
	{
		this.references[key] = object;
	}

	_testHover(worldCoords)
	{
		this._isHover = this.wf.Utils.isInsidePolygon(this, worldCoords.x, worldCoords.y);
	}

	_draw(ctx) { }

	_update(dt) { return this.isLive; }

	onSetup() { }

	keyEvent(code, action) { }
}