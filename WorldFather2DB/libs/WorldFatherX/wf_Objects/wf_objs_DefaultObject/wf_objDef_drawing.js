export function setupDefaultDrawing(obj)
{
	if(obj.draw == null) obj.draw = draw;
	if(obj.getPath == null) obj.getPath = getPath;
	if(obj._setupCamera == null) obj._setupCamera = _setupCamera;
	if(obj._resetCamera == null) obj._resetCamera = _resetCamera;
	if(obj.color == null) obj.color = obj.overrides.color ?? "magenta";
	if(obj.disableDraw == null) obj.disableDraw = obj.overrides.disableDraw ?? false;
	
	const steps = [];

	steps.push((ctx) => { ctx.save() });
	steps.push((ctx) => obj._setupCamera(ctx));
	if (!obj.disableDraw) steps.push((ctx) => obj.draw(ctx));
	if (obj._modules["useImage"].using) steps.push((ctx) => obj.drawImage(ctx));
	if (obj._modules["useText"].using) steps.push((ctx) => obj.drawText(ctx));
	if (obj._modules["useDebug"].using) steps.push((ctx) => obj._drawDebuging(ctx));
	steps.push((ctx) => { ctx.restore() });

	obj._draw = (ctx) =>
	{
		for (const step of steps) step(ctx);
	}
}

function draw(ctx)
{
	ctx.fillStyle = this.color;
	this.getPath(ctx);
	ctx.fill();
}

function _setupCamera(ctx)
{
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	this.parent?._setupCamera(ctx);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	ctx.translate(this.positionX, this.positionY);
	ctx.rotate(this.wf.Utils.getRadians(this.rotation));
	ctx.scale(this.scaleX, this.scaleY);
}

function _resetCamera(ctx)
{
	ctx.resetTransform();
	this.wf.renderer._setupGlobalCamera();
}

function getPath(ctx)
{
	ctx.beginPath();

	if (this.shape == "ellipse")
	{
		ctx.ellipse(0, 0, this.halfWidth, this.halfHeight, 0, 0, 2 * Math.PI);
	}
	else
	{
		for (let i = 0; i < this.shape.length; i++)
		{
			if (i == 0) ctx.moveTo(this.shape[i][0] * this.width, this.shape[i][1] * this.height);
			ctx.lineTo(this.shape[i][0] * this.width, this.shape[i][1] * this.height);
		}
	}

	ctx.closePath();
}