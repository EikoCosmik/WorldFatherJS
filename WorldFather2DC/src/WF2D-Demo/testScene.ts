import { Scene } from "../WorldFatherX/wf_Scenes/wf_Scene.js";
import { Entity } from "../WorldFatherX/wf_Entities/wf_Entity/wf_Entity.js";
import { WFColor, WFColors, WFColorUtils } from "../WorldFatherX/wf_Colors.js";
import { Point2D } from "../WorldFatherX/wf_CustomTypes.js";

export class testScene extends Scene
{
	private _center: Point2D = { x: 0, y: 0 };

	override onSetup(): void
	{
		this.addEntity(testObj, { name: "testObj" });
		
		this.addEntity(collisionObj, { positionY: this._center.y - 150, positionX: this._center.x - 300, color: WFColors.red, name: "importantObjectTest" });
		this.addEntity(collisionObj, { positionY: this._center.y - 300, positionX: this._center.x - 150, color: WFColors.orange, name: "parentDeath" });
		this.addEntity(collisionObj, { positionY: this._center.y - 300, positionX: this._center.x + 150, color: WFColors.lime });
		this.addEntity(collisionObj, { positionY: this._center.y - 150, positionX: this._center.x + 300, color: WFColors.green });
		this.addEntity(collisionObj, { positionY: this._center.y + 150, positionX: this._center.x + 300, color: WFColors.cyan });
		this.addEntity(collisionObj, { positionY: this._center.y + 300, positionX: this._center.x + 150, color: WFColors.azure });
		this.addEntity(collisionObj, { positionY: this._center.y + 300, positionX: this._center.x - 150, color: WFColors.purple });
		this.addEntity(collisionObj, { positionY: this._center.y + 150, positionX: this._center.x - 300, color: WFColors.magenta });

		this.addEntity(collisionObj, { positionY: this._center.y + 300, positionX: this._center.x /* */, color: WFColors.blue, name: "deathTest" });
		this.addEntity(childMoveTest, { positionY: this._center.y - 300, positionX: this._center.x /* */, color: WFColors.yellow, name: "childMoveTest" });

		this.addEntity(parentObject, { positionY: this._center.y /* */, positionX: this._center.x + 300, color: WFColors.aqua, name: "parentTest" });
		this.addEntity(collisionObj, { positionY: this._center.y /* */, positionX: this._center.x - 300, color: WFColors.ruby, name: "childTest" });

		this.importantObjects["parentTest"].addReference(this.importantObjects["childTest"]);
		this.importantObjects["childMoveTest"].setParent(this.importantObjects["testObj"]);
	}

	override update(dt: number): void
	{
		if (this.importantObjects["importantObjectTest"] != null && this.importantObjects["importantObjectTest"].isColliding) console.log(this.importantObjects["importantObjectTest"]);
	}
}

class collisionObj extends Entity
{
	private originalColor: WFColor = WFColors.magenta;
	private invertedColor: WFColor = WFColors.magenta;
	public isColliding: boolean = false;

	override onSetup(): void
	{
		this.originalColor = this.color;
		this.invertedColor = WFColorUtils.hueRotate(this.color, 180);
		this.usingCollision = true;
	}

	override update(dt: number): void
	{
		this.isColliding = false;
		this.color = this.originalColor;
		this._debugExtras["debugPrimaryColor"] = null;
		this._debugExtras["debugSecondaryColor"] = null;
		this._debugExtras["debugTertiaryColor"] = null;
	}

	override onCollision(collidedObject: Entity): void
	{
		this.isColliding = true;
		this.color = this.invertedColor;
		this._debugExtras["debugPrimaryColor"] = null;
		this._debugExtras["debugSecondaryColor"] = null;
		this._debugExtras["debugTertiaryColor"] = null;

		if (this.name == "deathTest") { this.isLive = false; }
	}

	override onDeath(): void
	{
		console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
	}
}

class parentObject extends collisionObj
{
	override onCollision(collidedObject: Entity): void
	{
		super.onCollision(collidedObject);
		if (this.entityReference["childTest"] != null) this.entityReference["childTest"].isLive = false;
	}
}

class childMoveTest extends collisionObj
{
	override onUpdate(dt: number): void
	{
	}
}

class testObj extends collisionObj
{
	override update(dt: number): void
	{
		super.update(dt);

		if (this.WorldFather.isKeyDown("KeyW"))
		{
			this.positionX += 250 * this.forwardX * dt;
			this.positionY += 250 * this.forwardY * dt;
		}
		if (this.WorldFather.isKeyDown("KeyS"))
		{
			this.positionX += 250 * this.backX * dt;
			this.positionY += 250 * this.backY * dt;
		}
		if (this.WorldFather.isKeyDown("KeyA")) this.rotation -= 100 * dt;
		if (this.WorldFather.isKeyDown("KeyD")) this.rotation += 100 * dt;
	}

	override onCollision(collidedObject: Entity): void
	{
		super.onCollision(collidedObject);
		if (collidedObject.name == "parentDeath") this.isLive = false;
		console.log(this.Scene.importantObjects)
	}
}