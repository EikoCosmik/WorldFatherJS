import { Scene } from "./wf_Scenes/wf_Scene.js";
import { ErrorManager } from "./wf_ErrorManager.js";
import { CameraEntity } from "./wf_Entities/wf_InternalEntities/wf_Camera.js";
import { debug_drawCamera } from "./wf_DebugSwitches.js";
import { Utils } from "./wf_Utils.js";
export class WorldFather2D {
    _renderID = null;
    get renderID() { return this._renderID; }
    ;
    _scenes;
    get scenes() { return this._scenes; }
    ;
    _currentScene;
    get currentScene() { return this._currentScene; }
    ;
    _cameras;
    get cameras() { return this._cameras; }
    ;
    _currentCamera;
    get currentCamera() { return this._currentCamera; }
    ;
    _lastScene;
    get lastScene() { return this._lastScene; }
    ;
    _lastTime = 0;
    get lastTime() { return this._lastTime; }
    ;
    _scaleMod = 0;
    get scaleMod() { return this._scaleMod; }
    ;
    _screenCenter = { x: 0, y: 0 };
    get screenCenter() { return this._screenCenter; }
    ;
    _container;
    get container() { return this._container; }
    ;
    _canvas;
    get canvas() { return this._canvas; }
    ;
    _context;
    get context() { return this._context; }
    ;
    _screenWidth;
    get screenWidth() { return this._screenWidth; }
    ;
    _screenHeight;
    get screenHeight() { return this._screenHeight; }
    ;
    _halfScreenWidth;
    get halfScreenWidth() { return this._halfScreenWidth; }
    ;
    _halfScreenHeight;
    get halfScreenHeight() { return this._halfScreenHeight; }
    ;
    _screenRatio;
    get screenRatio() { return this._screenRatio; }
    ;
    _ratioChord;
    get ratioChord() { return this._ratioChord; }
    ;
    _resizer;
    get resizer() { return this._resizer; }
    ;
    _keysPressed;
    get keysPressed() { return this._keysPressed; }
    ;
    constructor(containerID, screenWidth = 1440, screenHeight = 1080, screenRatio = 4 / 3) {
        this._cameras = { "DefaultCamera": new CameraEntity({ engine: this }) };
        const curCamera = ErrorManager.setIfExists(this._cameras["DefaultCamera"], `baseWorldFather.constructor(): this.cameras["DefaultCamera"] did not exist, setting curCamera`);
        this._currentCamera = curCamera;
        this._scenes = { "DefaultScene": new Scene() };
        const curScene = ErrorManager.setIfExists(this._scenes["DefaultScene"], `baseWorldFather.constructor(): this.scenes["DefaultScene"] did not exist, setting curScene`);
        this._lastScene = curScene;
        this._currentScene = curScene;
        curScene.onSwapTo();
        curScene._initialise();
        this._screenWidth = screenWidth;
        this._screenHeight = screenHeight;
        this._halfScreenWidth = screenWidth * 0.5;
        this._halfScreenHeight = screenHeight * 0.5;
        this._screenRatio = screenRatio;
        this._ratioChord = Math.sqrt(screenWidth * screenWidth + screenHeight * screenHeight);
        this._container = ErrorManager.setIfExists(document.getElementById(containerID), `wf_Renderer.setRenderVars(): document.getElementById(${containerID}) did not exist, setting this.context`);
        const canvasElement = document.createElement("canvas");
        canvasElement.id = containerID + "Canvas";
        canvasElement.style.width = "100%";
        canvasElement.style.height = "100%";
        canvasElement.style.display = "block";
        this._container.appendChild(canvasElement);
        this._canvas = ErrorManager.setIfExists(this._container.querySelector("#" + containerID + "Canvas"), `wf_Renderer.setRenderVars(): this.container.querySelector(${"#" + containerID + "Canvas"}) did not exist, setting this.canvas`);
        this._context = ErrorManager.setIfExists(this._canvas.getContext("2d"), `wf_Renderer.setRenderVars(): this.canvas.getContext("2d") did not exist, setting this.context`);
        this._resizer = new ResizeObserver(e => {
            this._resize();
        });
        this._resizer.observe(this._container);
        this._keysPressed = {};
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
        return this;
    }
    start() {
        if (this._renderID == null)
            this._renderID = requestAnimationFrame((t) => this._timeStep(t));
    }
    stop() {
        if (this._renderID !== null) {
            cancelAnimationFrame(this._renderID);
            this._renderID = null;
        }
    }
    addScene(name, scene, sceneOverrides = {}) {
        sceneOverrides["engine"] = this;
        const newScene = new scene(sceneOverrides);
        this._scenes[name] = newScene;
        newScene._initialise();
    }
    swapScene(name) {
        this._lastScene = this._currentScene;
        const curScene = ErrorManager.setIfExists(this._scenes[name], `wf_Rendered.constructor(): this.scenes[${name}] did not exist, setting this.context`);
        this._currentScene = curScene;
        curScene.onSwapTo();
    }
    swapToLastScene() {
        const tempHold = this._currentScene;
        this._currentScene = this._lastScene;
        this._lastScene = tempHold;
        this._currentScene.onSwapTo();
    }
    addCamera(name, overrides = {}) {
        const newCam = new CameraEntity(overrides);
        newCam._initialise();
        this._cameras[name] = newCam;
    }
    swapCamera(name) {
        this._currentCamera = ErrorManager.setIfExists(this._cameras[name], `baseWorldFather.swapCamera(): this.cameras[name] did not exist, setting this.currentCamera`);
    }
    _timeStep(t) {
        const deltaTime = (t - this._lastTime) / 1000;
        this._lastTime = t;
        this._currentScene._update(deltaTime);
        this._render(deltaTime);
        this._renderID = requestAnimationFrame((t) => this._timeStep(t));
    }
    _resize() {
        let canvasBoundingBox = this._canvas.getBoundingClientRect();
        const width = canvasBoundingBox.width;
        const height = canvasBoundingBox.height;
        this._canvas.width = width;
        this._canvas.height = height;
        this._scaleMod = Math.sqrt(width * width + height * height) / this._ratioChord;
        this._screenCenter = { x: width * 0.5, y: height * 0.5 };
        if (this._context) {
            this._context.textAlign = "center";
            this._context.textBaseline = "middle";
        }
    }
    _render(dt) {
        const ctx = this._context;
        const currentScene = this._currentScene;
        const currentCamera = this._currentCamera;
        currentCamera._update(dt);
        ctx.save();
        this._setupGlobalCamera();
        currentScene._draw(ctx);
        if (debug_drawCamera)
            currentCamera._draw(ctx);
        ctx.restore();
    }
    _setupGlobalCamera() {
        const currentCamera = this._currentCamera;
        this._context.translate(this._screenCenter.x, this._screenCenter.y);
        this._context.scale((currentCamera.scaleX) * this._scaleMod, (currentCamera.scaleY) * this._scaleMod);
        this._context.rotate(Utils.getRadians(-currentCamera.rotation));
        this._context.translate(-currentCamera.positionX, -currentCamera.positionY);
    }
    updateCollisionGrid(object, collisionGrid) {
        const objectCells = object.getGridCells();
        for (let j = 0; j < objectCells.length; j++) {
            let cellString = `${objectCells[j]}`;
            if (collisionGrid[cellString] == null)
                collisionGrid[cellString] = [objectCells[j], [object]];
            else if (!collisionGrid[cellString][1].includes(object))
                collisionGrid[cellString][1].push(object);
        }
    }
    testCollisionGrid(collisionGrid) {
        for (let key in collisionGrid) {
            const cellPosition = ErrorManager.setIfExists(collisionGrid[key], `wf_CollisionDetection.testCollisionGrid(): collisionGrid[key] did not exist, setting cellPosition`)[0];
            const neighbours = this.getCollisionNeighbours(cellPosition, collisionGrid);
            if (neighbours.length > 1) {
                this.testNeighbourCells(neighbours);
            }
        }
    }
    getCollisionNeighbours(cellPosition, collisionGrid) {
        const tempNeightbours = [];
        for (let i = -1; i < 2; i++) {
            const neighbourX = ErrorManager.setIfExists(cellPosition[0], `wf_CollisionDetection.getCollisionNeighbours(): cellPosition[0] did not exist, setting neighbourX`) + i;
            for (let j = -1; j < 2; j++) {
                const neighbourY = ErrorManager.setIfExists(cellPosition[1], `wf_CollisionDetection.getCollisionNeighbours(): cellPosition[1] did not exist, setting neighbourY`) + j;
                const neighbourCellKey = `${[neighbourX, neighbourY]}`;
                const neighbourCell = collisionGrid[neighbourCellKey];
                if (neighbourCell !== undefined) {
                    for (let k = 0; k < neighbourCell[1].length; k++) {
                        const object = neighbourCell[1][k];
                        if (!tempNeightbours.includes(object))
                            tempNeightbours.push(object);
                    }
                }
            }
        }
        return tempNeightbours;
    }
    testNeighbourCells(neighbours) {
        for (let i = 0; i < neighbours.length; i++) {
            for (let j = 0; j < neighbours.length; j++) {
                const object1 = ErrorManager.setIfExists(neighbours[i], `wf_CollisionDetection.testNeighbourCells(): neighbours[i] did not exist, setting object1`);
                const object2 = ErrorManager.setIfExists(neighbours[j], `wf_CollisionDetection.testNeighbourCells(): neighbours[j] did not exist, setting object2`);
                if (object1.id == object2.id)
                    continue;
                if (object1._collisionTestedAgainst.includes(object2))
                    continue;
                const isColliding = this.isColliding([object1, object2]);
                object1._collisionTestedAgainst.push(object2);
                object2._collisionTestedAgainst.push(object1);
                if (isColliding) {
                    object1.onCollision?.(object2);
                    object2.onCollision?.(object1);
                }
            }
        }
    }
    isColliding(objectPair) {
        for (let i = 0; i < 2; i++) {
            const objPi = ErrorManager.setIfExists(objectPair[i], `wf_CollisionDetection.isColliding(): objectPair[i] did not exist, setting objPi`);
            for (let j = 0; j < objPi.normals.length; j++) {
                let max = [-Infinity, -Infinity];
                let min = [Infinity, Infinity];
                let normal = objPi.normals[j];
                for (let k = 0; k < objectPair.length; k++) {
                    const objPk = ErrorManager.setIfExists(objectPair[k], `wf_CollisionDetection.isColliding(): objectPair[k] did not exist, setting objPk`);
                    for (const vertex of objPk.verticies) {
                        let dotProduct = normal.x * vertex.x + normal.y * vertex.y;
                        if (dotProduct > max[k])
                            max[k] = dotProduct;
                        if (dotProduct < min[k])
                            min[k] = dotProduct;
                    }
                    ;
                }
                const test = (max[0] >= min[1] && max[1] >= min[0]);
                if (!test)
                    return false;
            }
        }
        return true;
    }
    isKeyDown(key) {
        return this._keysPressed[key] ?? false;
    }
    onKeyDown = (e) => {
        this._keysPressed[e.code] = true;
    };
    onKeyUp = (e) => {
        delete this._keysPressed[e.code];
    };
}
//# sourceMappingURL=WorldFather2D.js.map