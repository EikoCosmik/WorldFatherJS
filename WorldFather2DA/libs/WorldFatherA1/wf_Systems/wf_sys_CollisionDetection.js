import { BaseSystem } from "./wf_sys_BaseSystem.js";

export class CollisionDetection extends BaseSystem
{
	constructor()
	{
		super("CollisionDetection");
	}

	isColliding(objectPair)
	{
		for (let i = 0; i < 2; i++)
		{
			for (let j = 0; j < objectPair[i].normals.length; j++)
			{
				let max = [-Infinity, -Infinity];
				let min = [Infinity, Infinity];
				let normal = [...objectPair[i].normals[j]];

				for (let k = 0; k < objectPair.length; k++)
				{
					for (const vertex of objectPair[k].verticies)
					{
						let dotProduct = normal[0] * vertex[0] + normal[1] * vertex[1];
						if (dotProduct > max[k]) max[k] = dotProduct;
						if (dotProduct < min[k]) min[k] = dotProduct;

					};


				}
				if (!(max[0] >= min[1] && max[1] >= min[0])) return false;
			}
		}

		return true;
	}

	updateCollisionGrid(object, index, collisionGrid)
	{
		if (object.canCollide)
		{
			const objectCells = object.gridCells;
			for (let j = 0; j < objectCells.length; j++)
			{
				let cellString = `${objectCells[j]}`;
				if (!collisionGrid[cellString]) collisionGrid[cellString] = [objectCells[j], [object]];
				else if (!collisionGrid[cellString].includes(object)) collisionGrid[cellString][1].push(object);
			}
		}
	}

	testCollisionGrid(collisionGrid)
	{
		for (let key in collisionGrid)
		{
			const cellPosition = collisionGrid[key][0];
			const neighbours = [];

			for (let i = -1; i < 2; i++)
			{
				const neighbourX = cellPosition[0] + i;
				for (let j = -1; j < 2; j++)
				{
					const neighbourY = cellPosition[1] + j;
					const neighbourCellKey = `${[neighbourX, neighbourY]}`;
					const neighbourCell = collisionGrid[neighbourCellKey];
					if (neighbourCell)
					{
						for (let k = 0; k < neighbourCell[1].length; k++)
						{
							let object = neighbourCell[1][k];
							if (!neighbours.includes(object)) neighbours.push(object);
						}
					}
				}
			}
			if (neighbours.length > 1)
			{
				for (let j = 0; j < neighbours.length - 1; j++)
				{
					const object1 = neighbours[j];
					const object2 = neighbours[j + 1];
					if (object1.id == object2.id) continue;
					if (object1.hasCollidedWith.includes(object2)) continue;
					const isColliding = this.isColliding([object1, object2]);
					if (isColliding) 
					{
						object1.hasCollidedWith.push(object2);
						object2.hasCollidedWith.push(object1);
						object1.collidedWith?.(object2);
						object2.collidedWith?.(object1);
					}
				}
			}
		}
	}
}