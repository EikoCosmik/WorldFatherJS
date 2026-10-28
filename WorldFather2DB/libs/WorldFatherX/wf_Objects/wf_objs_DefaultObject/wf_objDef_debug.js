export function setupDefaultDebug(obj)
{
	if(obj.drawDebug == null) obj.drawDebug = obj.overrides.drawDebug ?? true;
	if(obj.debugCenterCross == null) obj.debugCenterCross = obj.overrides.debugCenterCross ?? true;
	if(obj.debugVerticies == null) obj.debugVerticies = obj.overrides.debugVerticies ?? true;
	if(obj.debugBoundingBox == null) obj.debugBoundingBox = obj.overrides.debugBoundingBox ?? true;
	if(obj.debugNormals == null) obj.debugNormals = obj.overrides.debugNormals ?? true;
	if (obj._drawDebuging == null) obj._drawDebuging = _drawDebuging;

	obj.wf.ErrorManager.isExpected(obj._modules["useDrawing"].using, true, "Object Debugging Requires Object Drawing");
}

function _drawDebuging(ctx)
{
	if(this._modules["useWorldData"].using)
	{
		ctx.save();
		this._resetCamera(ctx);
		ctx.lineWidth = 3;

		if (this.debugVerticies)
		{
			ctx.strokeStyle = "cyan";
			for (let i = 0; i < this.verticies.length; i++)
			{
				ctx.beginPath();
				const vertex = this.verticies[i];
				ctx.arc(vertex[0], vertex[1], 5, 0, 2 * Math.PI);
				ctx.stroke();
			}
		}

		if (this.debugBoundingBox)
		{
			ctx.strokeStyle = "red";
			ctx.beginPath();
			for (let i = 0; i < this.verticies.length; i++)
			{
				const vertex = this.verticies[i];
				if (i == 0) ctx.moveTo(vertex[0], vertex[1]);
				ctx.lineTo(vertex[0], vertex[1]);
			}
			ctx.closePath();
			ctx.stroke();
		}

		if (this.debugNormals)
		{
			ctx.strokeStyle = "blue";
			
			for (let i = 0; i < this.normals.length; i++)
			{
				const normal = this.normals[i];
				ctx.beginPath();
				ctx.moveTo(this.worldPositionX - normal[0] * this.width, this.worldPositionY - normal[1] * this.height);
				ctx.lineTo(this.worldPositionX, this.worldPositionY);
				ctx.closePath();
				ctx.stroke();
			}
		}

		ctx.restore();
	}

	if (this.debugCenterCross)
	{
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(this.halfWidth, 0)
		ctx.lineTo(-this.halfWidth, 0)
		ctx.moveTo(0, this.halfHeight)
		ctx.lineTo(0, -this.halfHeight)
		ctx.closePath();
		ctx.strokeStyle = "red";
		ctx.stroke();
		ctx.strokeStyle = "Lime";
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(this.halfWidth, 0);
		ctx.closePath();
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(this.halfWidth, 0);
		ctx.lineTo(this.halfWidth * 0.5, -this.halfHeight * 0.5);
		ctx.closePath();
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(this.halfWidth, 0);
		ctx.lineTo(this.halfWidth * 0.5, this.halfHeight * 0.5)
		ctx.closePath();
		ctx.stroke();
	}
}