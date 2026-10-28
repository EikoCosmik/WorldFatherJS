export function setupDefaultCollisions(obj)
{
	if (obj._calcCollisionGridCells == null) obj._calcCollisionGridCells = _calcCollisionGridCells;
	if (obj.getGridCells == null) obj.getGridCells = getGridCells;
	if (obj.onCollision == null) obj.onCollision = onCollision;
	
	obj._collisionGridCells = [];
	obj._collisionTestedAgainst = [];

	obj.wf.ErrorManager.isExpected(obj._modules["useWorldData"].using, true, "Object Collision Requires Object WorldData ");
}

function getGridCells()
{
	if (this._collisionGridCells.length < 1) this._updateWorldData();
	return this.collisionGridCells;
}

function _calcCollisionGridCells()
{
	const leftX = Math.floor((this.worldPositionX - this.width * 0.5) / this.scene.gridSize);
	const rightX = Math.floor((this.worldPositionX + this.width * 0.5) / this.scene.gridSize);
	const upY = Math.floor((this.worldPositionY - this.height * 0.5) / this.scene.gridSize);
	const downY = Math.floor((this.worldPositionY + this.height * 0.5) / this.scene.gridSize);

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

function onCollision(collidedObject) { }