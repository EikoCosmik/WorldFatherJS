import { Dynamic } from "./wf_objs_Dynamic.js";

export class UiTextBox extends Dynamic
{
	constructor(inherited = {})
	{
		super(inherited);

		this.tag = inherited.type ?? "Text";

		this.text = inherited.text ?? "Unset Text Object";

		this.font = inherited.font ?? "Arial";
		this.fontSize = inherited.fontSize ?? 50;
		this.textBaseline = inherited.textBaseline ?? "middle";
		this.textAlign = inherited.textAlign ?? "center";
		this.textStrokeColor = inherited.textStrokeColor ?? "black";
		this.textStrokeWidth = inherited.textStrokeWidth ?? 0;

		this.hasBackground = inherited.hasBackground ?? false;
		this.backgroundPadding = inherited.backgroundPadding ?? 0;
		this.backgroundColor = inherited.backgroundColor ?? "magenta";
		this.backgroundStrokeColor = inherited.backgroundStrokeColor ?? "black";
		this.backgroundStrokeWidth = inherited.backgroundStrokeWidth ?? 0;
		this.backgroundRounding = inherited.backgroundRounding ?? 0;
		this.backgroundHeightUnderhangBias = inherited.backgroundHeightUnderhangBias ?? 1.75;
	}

	draw(ctx)
	{
		ctx.save();
		ctx.textBaseline = this.textBaseline;
		ctx.textAlign = this.textAlign;
		ctx.font = `${this.fontSize}px ${this.font}`;
		this.setupCamera(ctx);

		if (this.parent !== null && (this.parent.width != this.width || this.parent.height != this.height))
		{
			this.width = this.parent.width;
			this.height = this.parent.height;
			this.dirty = true;
		}

		if (this.hasBackground)
		{
			ctx.lineWidth = this.backgroundStrokeWidth;
			ctx.strokeStyle = this.backgroundStrokeColor;
			ctx.fillStyle = this.backgroundColor;

			this.getPath(ctx);

			if (this.backgroundStrokeWidth > 0) ctx.stroke();
			ctx.fill();
		}

		ctx.lineWidth = this.textStrokeWidth;
		ctx.strokeStyle = this.textStrokeColor;
		ctx.fillStyle = this.color;

		if (this.textStrokeWidth > 0) ctx.strokeText(this.text, this.backgroundPadding, this.backgroundPadding, this.width);
		ctx.fillText(this.text, this.backgroundPadding, this.backgroundPadding, this.width);
		
		if (this.dDraw) this.debugDrawing(ctx);
		ctx.restore();
	}

	getPath(ctx)
	{
		ctx.beginPath();
		if (this.parent !== null) ctx.roundRect(-this.parent.halfWidth, -this.parent.halfHeight, this.parent.width, this.parent.height, this.backgroundRounding);
		else ctx.roundRect(-this.halfWidth, -this.halfHeight, this.width, this.height, this.backgroundRounding);
		ctx.closePath();
	}
}