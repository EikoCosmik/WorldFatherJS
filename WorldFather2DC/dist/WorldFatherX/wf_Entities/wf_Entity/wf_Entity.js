import { ErrorManager } from "../../wf_ErrorManager.js";
import { Utils } from "../../wf_Utils.js";
import { debug_EntityDirection, debug_EntityBoundingBox, debug_EntityNormals, debug_EntityVerticies } from "../../wf_DebugSwitches.js";
import { WFColors, WFColorUtils } from "../../wf_Colors.js";
export class Entity {
    _id = Symbol("UID");
    get id() { return this._id; }
    _name;
    get name() { return this._name; }
    _ready;
    get ready() { return this._ready; }
    _dirtyData = true;
    get dirtyData() { return this._dirtyData; }
    _isLive;
    get isLive() { return this._isLive; }
    set isLive(value) { this._isLive = value; }
    _scaleX;
    get scaleX() { return this._scaleX; }
    set scaleX(value) { this._scaleX = value; this._dirtyData = true; }
    _scaleY;
    get scaleY() { return this._scaleY; }
    set scaleY(value) { this._scaleY = value; this._dirtyData = true; }
    _positionX;
    get positionX() {
        this._dirtyData = true;
        return this._positionX;
    }
    set positionX(value) { this._positionX = value; this._dirtyData = true; }
    _positionY;
    get positionY() {
        this._dirtyData = true;
        return this._positionY;
    }
    set positionY(value) { this._positionY = value; this._dirtyData = true; }
    _rotation = 0;
    get rotation() { return this._rotation; }
    set rotation(value) {
        this._rotation = Utils.forceMod(value, 360);
        const sin = Math.sin(Utils.getRadians(this._rotation));
        const cos = Math.cos(Utils.getRadians(this._rotation));
        this._sin = sin;
        this._cos = cos;
        this._forwardX = cos;
        this._forwardY = sin;
        this._rightX = -sin;
        this._rightY = cos;
        this._leftX = sin;
        this._leftY = -cos;
        this._backX = -cos;
        this._backY = -sin;
        this._dirtyData = true;
    }
    _sin = 0;
    get sin() { return this._sin; }
    _cos = 0;
    get cos() { return this._cos; }
    _forwardX = 0;
    get forwardX() { return this._forwardX; }
    _forwardY = 0;
    get forwardY() { return this._forwardY; }
    _rightX = 0;
    get rightX() { return this._rightX; }
    _rightY = 0;
    get rightY() { return this._rightY; }
    _leftX = 0;
    get leftX() { return this._leftX; }
    _leftY = 0;
    get leftY() { return this._leftY; }
    _backX = 0;
    get backX() { return this._backX; }
    _backY = 0;
    get backY() { return this._backY; }
    _worldPositionX;
    get worldPositionX() {
        if (this.dirtyData)
            this._updateWorldData();
        return this._worldPositionX;
    }
    _worldPositionY;
    get worldPositionY() {
        if (this.dirtyData)
            this._updateWorldData();
        return this._worldPositionY;
    }
    _worldRotation;
    get worldRotation() {
        if (this.dirtyData)
            this._updateWorldData();
        return this._worldRotation;
    }
    set worldRotation(value) {
        this._worldSin = Math.sin(Utils.getRadians(value));
        this._worldCos = Math.cos(Utils.getRadians(value));
        this._worldRotation = value;
    }
    _worldSin = 0;
    _worldCos = 0;
    _width = 0;
    get width() { return this._width; }
    set width(value) { this._width = value; this._halfWidth = value * 0.5; this._dirtyData = true; }
    _height = 0;
    get height() { return this._height; }
    set height(value) { this._height = value; this._halfHeight = value * 0.5; this._dirtyData = true; }
    _halfWidth = 0;
    get halfWidth() { return this._halfWidth; }
    _halfHeight = 0;
    get halfHeight() { return this._halfHeight; }
    _startTime;
    get startTime() { return this._startTime; }
    _shape;
    get shape() { return this._shape; }
    _color;
    get color() { return this._color; }
    set color(value) { this._color = value; }
    _WorldFather;
    get WorldFather() { return this._WorldFather; }
    _Scene;
    get Scene() { return this._Scene; }
    _collisionGridCells;
    get collisionGridCells() { return this._collisionGridCells; }
    _collisionTestedAgainst;
    get collisionTestedAgainst() { return this._collisionTestedAgainst; }
    _usingCollision = false;
    get usingCollision() { return this._usingCollision; }
    set usingCollision(value) { this._usingCollision = value; }
    _verticies = [];
    get verticies() { return this._verticies; }
    _normals = [];
    get normals() { return this._normals; }
    _entityReference = {};
    get entityReference() { return this._entityReference; }
    _parent;
    get parent() { return this._parent; }
    _debugExtras = {};
    constructor(inherited = {}) {
        this._WorldFather = inherited["engine"];
        this._Scene = inherited["scene"];
        this._id = Symbol("UID");
        this._name = inherited["name"] ?? "";
        this._ready = false;
        this._isLive = inherited["isLive"] ?? true;
        this._positionX = inherited["positionX"] ?? 0;
        this._positionY = inherited["positionY"] ?? 0;
        this._worldPositionX = inherited["positionX"] ?? 0;
        this._worldPositionY = inherited["positionY"] ?? 0;
        this._scaleX = inherited["scaleX"] ?? 1;
        this._scaleY = inherited["scaleY"] ?? 1;
        this.rotation = inherited["rotation"] ?? 0;
        this._worldRotation = inherited["rotation"] ?? 0;
        this._width = inherited["width"] ?? 100;
        this._height = inherited["height"] ?? 100;
        this._color = inherited["color"] ?? WFColors.magenta;
        this._startTime = Date.now();
        this._collisionGridCells = [];
        this._collisionTestedAgainst = [];
        this._shape = inherited["shape"] ?? Utils.getShape(4);
    }
    _initialise() {
        this._ready = true;
        this.onSetup();
    }
    onSetup() { }
    _update(dt) {
        this._collisionTestedAgainst = [];
        if (this.parent != null) {
            if (this.parent.dirtyData == true)
                this._dirtyData = true;
            if (this.parent.isLive == false)
                this.isLive = false;
        }
        if (this._dirtyData)
            this._updateWorldData();
        this.update(dt);
        this.onUpdate(dt);
    }
    update(dt) { }
    onUpdate(dt) { }
    _draw(ctx) {
        ctx.save();
        this.draw(ctx);
        this._drawDebuging?.(ctx);
        ctx.restore();
    }
    draw(ctx) {
        ctx.fillStyle = this._color.toString();
        this._getPath(ctx);
        ctx.fill();
    }
    _getPath(ctx) {
        ctx.beginPath();
        for (let i = 0; i < this._verticies.length; i++) {
            const vert = ErrorManager.setIfExists(this._verticies[i], `wf_Entity.draw(): this._verticies[i] did not exist, setting vert`);
            if (i == 0)
                ctx.moveTo(vert.x, vert.y);
            else
                ctx.lineTo(vert.x, vert.y);
        }
        ctx.closePath();
    }
    _drawDebuging(ctx) {
        if (debug_EntityVerticies) {
            for (let i = 0; i < this.verticies.length; i++) {
                ctx.beginPath();
                const vertex = ErrorManager.setIfExists(this.verticies[i], `wf_Entity_Debugging._drawDebuging(): this.verticies[i] did not exist, setting vertex`);
                ctx.arc(vertex.x, vertex.y, 10, 0, 2 * Math.PI);
                const color = (this._debugExtras["debugPrimaryColor"] != null) ? this._debugExtras["debugPrimaryColor"] : this._debugExtras["debugPrimaryColor"] = WFColorUtils.hueRotate(this._color, 130);
                ctx.strokeStyle = color;
                ctx.lineWidth = 4;
                ctx.stroke();
            }
        }
        if (debug_EntityBoundingBox) {
            ctx.save();
            this._getPath(ctx);
            ctx.clip();
            ctx.beginPath();
            for (let i = 0; i < this.verticies.length; i++) {
                const vertex = ErrorManager.setIfExists(this.verticies[i], `wf_Entity_Debugging._drawDebuging(): this.verticies[i] did not exist, setting vertex`);
                if (i == 0)
                    ctx.moveTo(vertex.x, vertex.y);
                ctx.lineTo(vertex.x, vertex.y);
            }
            ctx.closePath();
            const color = (this._debugExtras["debugSecondaryColor"] != null) ? this._debugExtras["debugSecondaryColor"] : this._debugExtras["debugSecondaryColor"] = WFColorUtils.hueRotate(this._color, 230);
            ctx.strokeStyle = color;
            ctx.lineWidth = 8;
            ctx.stroke();
            ctx.restore();
        }
        if (debug_EntityNormals) {
            for (let i = 0; i < 4; i++) {
                const normal = ErrorManager.setIfExists(this.normals[i], `wf_Entity_Debugging._drawDebuging(): this.normals[i] did not exist, setting normal`);
                ctx.beginPath();
                ctx.moveTo(this.worldPositionX - normal.x * this.width, this.worldPositionY - normal.y * this.height);
                ctx.lineTo(this.worldPositionX, this.worldPositionY);
                ctx.closePath();
                const color = (this._debugExtras["debugTertiaryColor"] != null) ? this._debugExtras["debugTertiaryColor"] : this._debugExtras["debugTertiaryColor"] = WFColorUtils.hueRotate(this._color, 65);
                ctx.strokeStyle = color;
                ctx.lineWidth = 4;
                ctx.stroke();
            }
        }
        if (debug_EntityDirection) {
            const tip = this.getWorldVertex({ x: 0.5, y: 0 });
            const up = this.getWorldVertex({ x: 0.25, y: 0.25 });
            const down = this.getWorldVertex({ x: 0.25, y: -0.25 });
            ctx.beginPath();
            ctx.moveTo(up.x, up.y);
            ctx.lineTo(tip.x, tip.y);
            ctx.lineTo(down.x, down.y);
            ctx.moveTo(tip.x, tip.y);
            ctx.lineTo(this.worldPositionX, this.worldPositionY);
            ctx.closePath();
            ctx.strokeStyle = this._color.invertString();
            ctx.lineWidth = 4;
            ctx.stroke();
        }
    }
    onDraw(ctx) { }
    _resetCamera(ctx) {
        ctx.resetTransform();
        this._WorldFather._setupGlobalCamera();
    }
    getGridCells() {
        if (this._collisionGridCells.length < 1)
            this._updateWorldData();
        return this._collisionGridCells;
    }
    _calcCollisionGridCells() {
        const scene = this._WorldFather.currentScene;
        const leftX = Math.floor((this._worldPositionX - this._width * 0.5) / scene.gridSize);
        const rightX = Math.floor((this._worldPositionX + this._width * 0.5) / scene.gridSize);
        const upY = Math.floor((this._worldPositionY - this._height * 0.5) / scene.gridSize);
        const downY = Math.floor((this._worldPositionY + this._height * 0.5) / scene.gridSize);
        const distanceX = rightX - leftX;
        const distanceY = downY - upY;
        const gridCells = [];
        for (let i = 0; i < distanceX + 1; i++) {
            for (let j = 0; j < distanceY + 1; j++) {
                gridCells.push([leftX + i, upY + j]);
            }
        }
        this._collisionGridCells = gridCells;
    }
    onCollision(collidedObject) { }
    _updateWorldData() {
        this.updateWorldData();
        this._setWorldRotation();
        this._setWorldPosition();
        this._updateWorldShape();
        if (this._usingCollision != null)
            this._calcCollisionGridCells();
        this._dirtyData = false;
        this.onUpdateWorldData();
    }
    updateWorldData() { }
    onUpdateWorldData() { }
    _setWorldPosition() {
        let outPosX = this._positionX;
        let outPosY = this._positionY;
        if (this.parent != null) {
            const parent = this.parent;
            const parentPosX = parent.positionX;
            const parentPosY = parent.positionY;
            const parentRotation = parent.rotation;
            outPosX = outPosX + parentPosX;
            outPosY += parentPosY;
            const rotated = Utils.rotatePoint(outPosX, outPosY, parentRotation, parentPosX, parentPosY);
            outPosX = rotated[0];
            outPosY = rotated[1];
        }
        this._worldPositionX = outPosX;
        this._worldPositionY = outPosY;
    }
    _setWorldRotation() {
        let outRotation = this.rotation;
        if (this.parent != null) {
            const parent = this.parent;
            const parentRotation = parent.worldRotation;
            outRotation = parentRotation;
        }
        this.worldRotation = outRotation;
    }
    getWorldVertex(vertexIn) {
        const scaledX = vertexIn.x * this._width;
        const scaledY = vertexIn.y * this._height;
        const rotatedX = (scaledX * this._worldCos) - (scaledY * this._worldSin);
        const rotatedY = (scaledX * this._worldSin) + (scaledY * this._worldCos);
        const outX = rotatedX + this._worldPositionX;
        const outY = rotatedY + this._worldPositionY;
        return { x: outX, y: outY };
    }
    _updateWorldShape() {
        let verticies = [null, null, null, null];
        const normals = [];
        for (let i = 0; i < this._shape.length; i++) {
            verticies[i] = (verticies[i] != null) ? verticies[i] : this.getWorldVertex(ErrorManager.setIfExists(this._shape[i], `wf_Entity_WorldData._updateWorldShape(): this.shape[i] did not exist, setting verticies[i]`));
            verticies[(i + 1) % verticies.length] = (verticies[(i + 1) % verticies.length] != null) ? verticies[(i + 1) % verticies.length] : this.getWorldVertex(ErrorManager.setIfExists(this._shape[(i + 1) % verticies.length], `wf_Entity_WorldData._updateWorldShape(): this.shape[i] did not exist, setting verticies[(i + 1) % verticies.length]`));
            let vertexOne = ErrorManager.setIfExists(verticies[i], `wf_Entity_WorldData._updateWorldShape(): verticies[i] did not exist, setting vertexOne`);
            let vertexTwo = ErrorManager.setIfExists(verticies[(i + 1) % verticies.length], `wf_Entity_WorldData._updateWorldShape(): verticies[secondVertFix] did not exist, setting vertexTwo`);
            const dx = (vertexTwo.x - vertexOne.x);
            const dy = (vertexTwo.y - vertexOne.y);
            const nx = -dy;
            const ny = dx;
            const length = Math.sqrt(nx * nx + ny * ny);
            normals[i] = { x: (length > 0) ? nx / length : 0, y: (length > 0) ? ny / length : 0 };
        }
        this._verticies = verticies;
        this._normals = normals;
    }
    _onDeath() {
        this.onDeath();
    }
    onDeath() { }
    addReference(entity) {
        this._entityReference[entity.name] = entity;
    }
    setParent(entity) {
        this._parent = entity;
    }
}
//# sourceMappingURL=wf_Entity.js.map