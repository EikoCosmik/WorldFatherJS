import { ErrorManager } from "../wf_ErrorManager.js";
import { debug_sceneCenter, debug_sceneCenterRings, debug_collisionGrid } from "../wf_DebugSwitches.js";
export class Scene {
    _layers = { "_hindGrid": [], "default": [], "_foreGround": [] };
    get layers() { return this._layers; }
    ;
    _gridSize = 100;
    get gridSize() { return this._gridSize; }
    ;
    _startTime = Date.now();
    get startTime() { return this._startTime; }
    ;
    _backgroundColor = "#000000";
    get backgroundColor() { return this._backgroundColor; }
    ;
    _WorldFather;
    get WorldFather() { return this._WorldFather; }
    ;
    _collisionGrid = {};
    get collisionGrid() { return this._collisionGrid; }
    ;
    _importantObjects = {};
    get importantObjects() { return this._importantObjects; }
    ;
    constructor(inherited = {}) {
        this._WorldFather = inherited["engine"];
    }
    _initialise() {
        this.onSetup();
    }
    onSetup() { }
    onSwapTo() { }
    _update(dt) {
        this.update(dt);
        this._collisionGrid = {};
        Object.entries(this._layers).forEach(([key, layer]) => {
            for (let i = layer.length - 1; i > -1; i--) {
                const entity = ErrorManager.setIfExists(layer[i], `wf_Scene._update(): layer[i] did not exist, setting const entity`);
                entity._update(dt);
                if (!entity._isLive)
                    this.removeEntity(i, layer, entity);
                else if (entity.usingCollision != null && entity.usingCollision)
                    this._WorldFather.updateCollisionGrid(entity, this._collisionGrid);
            }
            ;
        });
        if (Object.keys(this._collisionGrid).length > 0)
            this._WorldFather.testCollisionGrid(this._collisionGrid);
        this.onUpdate(dt);
    }
    update(dt) { }
    onUpdate(dt) { }
    _draw(ctx) {
        const worldFather = this._WorldFather;
        ctx.fillStyle = this._backgroundColor;
        ctx.fillRect(-worldFather.halfScreenWidth - 10, -worldFather.halfScreenHeight - 10, worldFather.screenWidth + 10, worldFather.screenHeight + 10);
        this.draw(ctx);
        Object.entries(this._layers).forEach(([key, layer]) => {
            for (let i = layer.length - 1; i > -1; i--) {
                const entity = ErrorManager.setIfExists(layer[i], `wf_Scene._draw(): layer[i] did not exist, setting const entity`);
                entity._draw(ctx);
            }
            ;
        });
        this._drawDebuging(ctx);
        this.onDraw(ctx);
    }
    draw(ctx) { }
    _drawDebuging(ctx) {
        if (debug_collisionGrid) {
            ctx.strokeStyle = "white";
            const gridsLength = 1000;
            for (let i = 0; i < 10; i++) {
                ctx.beginPath();
                ctx.moveTo(this._gridSize * i, gridsLength);
                ctx.lineTo(this._gridSize * i, -gridsLength);
                ctx.moveTo(-this._gridSize * i, gridsLength);
                ctx.lineTo(-this._gridSize * i, -gridsLength);
                ctx.moveTo(gridsLength, this._gridSize * i);
                ctx.lineTo(-gridsLength, this._gridSize * i);
                ctx.moveTo(gridsLength, -this._gridSize * i);
                ctx.lineTo(-gridsLength, -this._gridSize * i);
                ctx.stroke();
            }
        }
        if (debug_sceneCenterRings) {
            const count = 15;
            const colChange = 255 / count;
            for (let i = 1; i <= count; i++) {
                const curColStep = colChange * i;
                ctx.strokeStyle = `#${(255 - curColStep).toString(16)}${curColStep.toString(16)}ff`;
                ctx.beginPath();
                ctx.arc(0, 0, (this._gridSize * i) - 50, 0, 2 * Math.PI);
                ctx.stroke();
            }
        }
        if (debug_sceneCenter) {
            ctx.fillStyle = "cyan";
            ctx.beginPath();
            ctx.arc(0, 0, 25, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
    onDraw(ctx) { }
    removeEntity(index, layer, entity) {
        layer.splice(index, 1);
        if (this.importantObjects[entity.name] != "")
            delete this.importantObjects[entity.name];
        entity._onDeath();
    }
    addEntity(entity, entityOverrides = {}) {
        entityOverrides["engine"] = this._WorldFather;
        entityOverrides["scene"] = this;
        const newEntity = new entity(entityOverrides);
        this._layers["default"]?.unshift(newEntity);
        if (entityOverrides["name"] != null)
            this._importantObjects[entityOverrides["name"]] = newEntity;
        newEntity._initialise();
    }
}
//# sourceMappingURL=wf_Scene.js.map