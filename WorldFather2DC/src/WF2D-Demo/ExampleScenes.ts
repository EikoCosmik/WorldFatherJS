// import { Scene } from "../WorldFatherX/wf_Scenes/wf_Scene.js";
// import { hexColor } from "../WorldFatherX/wf_CustomTypes.js";
// import { createEntity } from "../WorldFatherX/wf_Entities.js";
// import { EntityDrawingInterface } from "../WorldFatherX/wf_Entities/OLDwf_Entity/wf_Entity_Drawing.js";
// import { Entity, drawTypes, updateTypes } from "../WorldFatherX/wf_Entities.js";
// import { Utils } from "../WorldFatherX/wf_Utils.js";

// // #region =========================================================
// // #region =================| solarSystem |=========================
// // #region =========================================================

// function drawAsCircle(this: EntityDrawingInterface & Entity, ctx: CanvasRenderingContext2D)
// {
// 	ctx.fillStyle = this.color;
// 	ctx.beginPath();
// 	ctx.arc(0, 0, this.halfWidth, 0, 2 * Math.PI);
// 	ctx.fill();
// }

// export class solarSystem extends Scene
// {
// 	override onSetup(): void
// 	{
// 		const ent = createEntity({ drawType: drawTypes.basic, updateType: updateTypes.basic });
// 		this.addEntity(new ent({ width: 50, height: 50, draw: drawAsCircle, color: new hexColor({ r: 255, g: Utils.getRandomIntegerInclusive(75, 175), b: 0 }) }));

// 		const planetCount = 10;

// 		for (let i = 0; i < planetCount; i++)
// 		{
// 			const size = Utils.getRandomFloat(10, 20);
// 			this.addEntity(new planet({ width: size, height: size, radius: 50 + i * 30, color: new hexColor({ r: Utils.getRandomIntegerInclusive(0, 255), g: Utils.getRandomIntegerInclusive(0, 255), b: Utils.getRandomIntegerInclusive(0, 255) }) }));
// 		}

// 	}
// }

// class planet extends createEntity({ drawType: drawTypes.basic, updateType: updateTypes.basic })
// {
// 	private radius: number;
// 	private speed: number;

// 	constructor(inherited: any = {})
// 	{
// 		super(inherited);

// 		this.radius = inherited.radius ?? 50;
// 		this.speed = 100;

// 		this.positionY = -this.radius;
// 	}

// 	override update(dt: number): void
// 	{
// 		this.rotation = ((this.rotation + this.speed / this.radius) ) % 360;
// 		this.positionX = this.forwardX * this.radius;
// 		this.positionY = this.forwardY * this.radius;
// 	}

// 	override draw(ctx: CanvasRenderingContext2D): void
// 	{
// 		ctx.fillStyle = this.color.toString();
// 		ctx.beginPath();
// 		ctx.arc(0, 0, this.halfWidth, 0, 2 * Math.PI);
// 		ctx.fill();

// 		// ctx.strokeStyle = "red"
// 		// ctx.beginPath();
// 		// ctx.moveTo(0, 0);
// 		// ctx.lineTo(-this.radius, 0);
// 		// ctx.stroke();
// 	}
// }

// // #endregion ==============| solarSystem |=========================