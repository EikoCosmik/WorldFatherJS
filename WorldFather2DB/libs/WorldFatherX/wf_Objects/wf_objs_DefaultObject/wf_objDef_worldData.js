import { Utils } from "../../wf_Utils.js";

export function setupDefaultWorldData(obj)
{
	obj.getWorldPosition = getWorldPosition;
	obj.getWorldRotation = getWorldRotation;
	obj._setWorldPosition = _setWorldPosition;
	obj._setWorldRotation = _setWorldRotation;
	obj.getWorldVertex = getWorldVertex;
	obj._updateWorldShape = _updateWorldShape;
	obj._updateWorldData = _updateWorldData;
	if (obj.onUpdateWorldData == null) obj.onUpdateWorldData = onUpdateWorldData;
	
	obj.worldPositionX = obj.positionX;
	obj.worldPositionY = obj.positionY;
	obj.worldRotation = obj.rotation;
	obj.worldCos = Math.cos(obj.wf.Utils.getRadians(obj.worldRotation));
	obj.worldSin = Math.sin(obj.wf.Utils.getRadians(obj.worldRotation));

	obj.verticies = [];
	obj.normals = [];
}

function getWorldPosition()
{
	if (this.dirtyData) this._updateWorldData();
	return [this.worldPositionX, this.worldPositionY];
}

function getWorldRotation()
{
	if (this.dirtyData) this._updateWorldData();
	return this.worldRotation;
}

function _setWorldPosition()
{
	let outPosX = this.positionX;
	let outPosY = this.positionY;

	if (this.parent != null)
	{
		const parentPos = this.parent.getWorldPosition();
		const parentRotation = this.parent.getWorldRotation();
		outPosX += parentPos[0];
		outPosY += parentPos[1];
		const rotated = this.wf.Utils.rotatePoint(outPosX, outPosY, parentRotation, parentPos[0], parentPos[1]);
		outPosX = rotated[0];
		outPosY = rotated[1];
	}

	this.worldPositionX = outPosX;
	this.worldPositionY = outPosY;
}

function _setWorldRotation()
{
	let outRotation = this.rotation;

	if (this.parent != null)
	{
		const parentRotation = this.parent.getWorldRotation(); 
		outRotation = parentRotation;
	}

	this.worldRotation = outRotation;
}

function getWorldVertex(shapeIn)
{
	const scaledX = shapeIn[0] * this.width;
	const scaledY = shapeIn[1] * this.height;
	const rotatedX = (scaledX * this.worldCos) - (scaledY * this.worldSin);
	const rotatedY = (scaledX * this.worldSin) + (scaledY * this.worldCos);
	const outX = rotatedX + this.worldPositionX;
	const outY = rotatedY + this.worldPositionY;
	return [outX, outY];
}

function _updateWorldShape()
{
	let verticies = new Array(this.shape.length);
	const normals = [];

	if (this.shape == "ellipse")
	{
		verticies = this.Utils.getPointsOnEllipsis(this, 16);
	}
	else
	{
		for (let i = 0; i < this.shape.length; i++)
		{
			const secondVertFix = (i + 1) % verticies.length;

			// Calculate vertex
			verticies[i] = verticies[i] ?? this.getWorldVertex(this.shape[i]);
			verticies[secondVertFix] = verticies[secondVertFix] ?? this.getWorldVertex(this.shape[secondVertFix]);
			let vertexOne = verticies[i];
			let vertexTwo = verticies[secondVertFix];

			// Calculate normals
			const normalX = -(vertexTwo[1] - vertexOne[1]);
			const normalY = (vertexTwo[0] - vertexOne[0]);
			const length = Math.sqrt(normalX * normalX + normalY * normalY);
			normals[i] = [(length > 0) ? normalX / length : normalX, (length > 0) ? normalY / length : normalY];
		}
	}

	this.verticies = verticies;
	this.normals = normals;
}

function _updateWorldData()
{
	for (let key in this.children) this.children[key].dirtyData = true;
	this._setWorldPosition();
	this._setWorldRotation();
	this._updateWorldShape();
	if (this._modules["useCollision"].using) this._calcCollisionGridCells();
	this.dirtyData = false;
	
	this.onUpdateWorldData();
}

function onUpdateWorldData() { }