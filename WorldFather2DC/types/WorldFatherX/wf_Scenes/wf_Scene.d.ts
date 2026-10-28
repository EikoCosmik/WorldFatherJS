import { WorldFather2D } from "../WorldFather2D.js";
import { Entity } from "../wf_Entities/wf_Entity/wf_Entity.js";
export declare class Scene {
    private _layers;
    get layers(): Record<string, Entity[]>;
    private _gridSize;
    get gridSize(): number;
    private _startTime;
    get startTime(): number;
    private _backgroundColor;
    get backgroundColor(): string;
    private _WorldFather;
    get WorldFather(): WorldFather2D;
    private _collisionGrid;
    get collisionGrid(): Record<string, [string, Entity[]]>;
    private _importantObjects;
    get importantObjects(): Record<string, Entity | any>;
    constructor(inherited?: Record<string, any>);
    _initialise(): void;
    onSetup(): void;
    onSwapTo(): void;
    _update(dt: number): void;
    update(dt: number): void;
    onUpdate(dt: number): void;
    _draw(ctx: CanvasRenderingContext2D): void;
    draw(ctx: CanvasRenderingContext2D): void;
    _drawDebuging(ctx: CanvasRenderingContext2D): void;
    onDraw(ctx: CanvasRenderingContext2D): void;
    removeEntity(index: number, layer: Object[], entity: Entity): void;
    addEntity(entity: typeof Entity, entityOverrides?: Record<string, any>): void;
}
//# sourceMappingURL=wf_Scene.d.ts.map