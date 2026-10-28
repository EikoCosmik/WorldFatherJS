import { Utils } from "../wf_Utils.js";
import { Solid } from "./wf_objs_Solid.js";

export class Dynamic extends Solid
{
	constructor(inherited = {})
	{
		super(inherited);

		this.tag = inherited.tag ?? "Dynamic";

		this.canCollide = inherited.canCollide ?? false;
		this.maxRadius = -Infinity;
		this.collisionGridCells = [];
		this.collisionTestedAgainst = [];
	}

	update(dt)
	{
		this.collisionTestedAgainst = [];
		return super.update(dt);
	}

	getGridCells()
	{
		if (this.collisionGridCells.length < 1) this.updateWorldData();
		return this.collisionGridCells;
	}

	updateWorldData()
	{
		super.updateWorldData();
		this.calcCollisionGridCells();
	}

	calcCollisionGridCells()
	{
		let parentPos = [0, 0];
		let parentRotation = 0;
		
		if (this.parent !== null)
		{
			parentPos = this.getGlobalPosition();
			parentRotation = this.getGlobalRotation();
		}

		const leftX = Math.floor((this.positionX + parentPos[0] - this.width * 0.5) / this.scene.gridSize);
		const rightX = Math.floor((this.positionX + parentPos[0] + this.width * 0.5) / this.scene.gridSize);
		const upY = Math.floor((this.positionY + parentPos[1] - this.height * 0.5) / this.scene.gridSize);
		const downY = Math.floor((this.positionY + parentPos[1] + this.height * 0.5) / this.scene.gridSize);

		const distanceX = rightX - leftX;
		const distanceY = downY - upY;

		const gridCells = [];

		for (let i = 0; i < distanceX + 1; i++)
		{
			for (let j = 0; j < distanceY + 1; j++)
			{
				gridCells.push([leftX + i, upY + j]);
			}
		}

		this.collisionGridCells = gridCells;
	}

	collidedWith(collidedObject){}
	
	onClicked(){}
}