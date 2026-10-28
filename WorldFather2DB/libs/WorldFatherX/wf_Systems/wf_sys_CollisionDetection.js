import { BaseSystem } from "./wf_sys_BaseSystem.js";

export class CollisionDetection extends BaseSystem
{
	constructor(inherited)
	{
		super("CollisionDetection", inherited);
		this.debugActiveCollisionCells = true;
		this.cellsForDebug = [];
	}

	updateCollisionGrid(object, collisionGrid)
	{
		const objectCells = object.getGridCells();

		for (let j = 0; j < objectCells.length; j++)
		{
			let cellString = `${objectCells[j]}`;
			if (!collisionGrid[cellString]) collisionGrid[cellString] = [objectCells[j], [object]];
			else if (!collisionGrid[cellString].includes(object)) collisionGrid[cellString][1].push(object);
		}
	}

	testCollisionGrid(collisionGrid)
	{
		if (this.debugActiveCollisionCells) this.cellsForDebug = [];

		for (let key in collisionGrid)
		{
			const cellPosition = collisionGrid[key][0];
			const neighbours = this.getCollisionNeighbours(cellPosition, collisionGrid);

			if (neighbours.length > 1)
			{
				this.testNeighbourCells(neighbours)
			}
		}
	}

	getCollisionNeighbours(cellPosition, collisionGrid)
	{
		const tempNeightbours = [];
		
		for (let i = -1; i < 2; i++)
		{
			const neighbourX = cellPosition[0] + i;
			for (let j = -1; j < 2; j++)
			{
				const neighbourY = cellPosition[1] + j;
				const neighbourCellKey = `${[neighbourX, neighbourY]}`;
				const neighbourCell = collisionGrid[neighbourCellKey];

				if (neighbourCell !== undefined)
				{
					if (this.debugActiveCollisionCells) this.addToCellsForDebug(neighbourX, neighbourY, "cyan");


					for (let k = 0; k < neighbourCell[1].length; k++)
					{
						const object = neighbourCell[1][k];
						if (!tempNeightbours.includes(object)) tempNeightbours.push(object);
					}
				}
				else if (this.debugActiveCollisionCells)
				{
					this.addToCellsForDebug(neighbourX, neighbourY, "magenta");
				}
			}
		}

		return tempNeightbours;
	}

	addToCellsForDebug(neighbourX, neighbourY, color)
	{

		const gridSize = this.wf.currentScene.gridSize;
		const posX = neighbourX * gridSize + (gridSize * 0.5);
		const posY = neighbourY * gridSize + (gridSize * 0.5);
		this.cellsForDebug.push([posX, posY, color]);
	}

	testNeighbourCells(neighbours)
	{
		for (let i = 0; i < neighbours.length; i++)
		{
			for (let j = 0; j < neighbours.length; j++)
			{
				const object1 = neighbours[i];
				const object2 = neighbours[j];
				if (object1.id == object2.id) continue;
				if (object1._collisionTestedAgainst.includes(object2)) continue;
				const isColliding = this.isColliding([object1, object2]);
				object1._collisionTestedAgainst.push(object2);
				object2._collisionTestedAgainst.push(object1);
				if (isColliding) 
				{
					object1.onCollision?.(object2);
					object2.onCollision?.(object1);
				}
			}
		}
	}

	isColliding(objectPair)
	{
		const is0Ellipse = (objectPair[0].shape == "ellipse");
		const is1Ellipse = (objectPair[1].shape == "ellipse");
		
		if(objectPair[0].tag == "_CollisionDetectorExample" && objectPair[1].tag == "_childTest") debugger;
		if(objectPair[1].tag == "_CollisionDetectorExample" && objectPair[0].tag == "_childTest") debugger;
		
		if (!is0Ellipse && !is1Ellipse)
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
					const test = (max[0] >= min[1] && max[1] >= min[0]);
					
					if (!test) return false;
				}
			}
			
			return true;
		}
		else
		{
			const bothEllipse = objectPair[0].shape == "ellipse" && objectPair[1].shape == "ellipse";
			const ellipse = objectPair[0].shape == "ellipse" ? objectPair[0] : objectPair[1];
			const box = objectPair[0].shape == "ellipse" ? objectPair[1] : objectPair[0];
			const verticies = (box.shape == "ellipse") ? this.wf.Utils.getPointsOnEllipsis(box, 16) : box.verticies;
			
			const inverseRadiusX = 1 / (ellipse.width * 0.5);
			const inverseRadiusY = 1 / (ellipse.height * 0.5);

			let inside = false;

			for (let i = 0, j = verticies.length - 1; i < verticies.length; j = i++)
			{
				const x1 = (bothEllipse) ? (verticies[i][0] - ellipse.globalPositionX) + box.globalPositionX : (verticies[i][0] - ellipse.globalPositionX);
				const y1 = (bothEllipse) ? (verticies[i][1] - ellipse.globalPositionY) + box.globalPositionY : (verticies[i][1] - ellipse.globalPositionY);
				const x2 = (bothEllipse) ? (verticies[j][0] - ellipse.globalPositionX) + box.globalPositionX : (verticies[j][0] - ellipse.globalPositionX);
				const y2 = (bothEllipse) ? (verticies[j][1] - ellipse.globalPositionY) + box.globalPositionY : (verticies[j][1] - ellipse.globalPositionY);
				const xi = (x1 * ellipse.cos + y1 * ellipse.sin) * inverseRadiusX;
				const yi = (y1 * ellipse.cos - x1 * ellipse.sin) * inverseRadiusY;
				const xj = (x2 * ellipse.cos + y2 * ellipse.sin) * inverseRadiusX;
				const yj = (y2 * ellipse.cos - x2 * ellipse.sin) * inverseRadiusY;
				const dx1 = xj - xi;
				const dy1 = yj - yi;

				if ((yi > 0 !== yj > 0) && (0 < dx1 * -yi / dy1 + xi)) inside = !inside;

				const t = Math.max(0, Math.min(1, (-xi * dx1 + -yi * dy1) / (dx1 * dx1 + dy1 * dy1)));
				const dx2 = xi + dx1 * t;
				const dy2 = yi + dy1 * t;

				if (dx2 * dx2 + dy2 * dy2 <= 1) return true;
			}

			return inside;
		}
	}
}