import { Utils } from "../wf_Utils.js";
import { BaseObject } from "./wf_objs_BaseObject.js";

export class UiTextBox extends BaseObject
{
	constructor(inherited = {})
	{
		super(inherited);

		this.tag = inherited.type ?? "Text";
		this.scaleX = 10;
		this.scaleY = 10;

		this.text = inherited.text ?? "Unset Text Object";

		this.font = inherited.font ?? "Arial";
		this.fontSize = inherited.fontSize ?? 1;
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

		this.gridCell = null;
	}

	draw(ctx)
	{
		ctx.textBaseline = this.textBaseline;
		ctx.textAlign = this.textAlign;
		ctx.font = `${this.fontSize}px ${this.font}`;

		if(this.gridCell !== null)
		{
			ctx.save();
			ctx.translate(this.gridCell.grid.positionX, this.gridCell.grid.positionY);
			ctx.rotate(Utils.getRadians(this.gridCell.grid.rotation));
			ctx.translate(this.positionX, this.positionY);
		}
		else this.setupCamera(ctx);		
		
		if (this.hasBackground)
		{
			ctx.lineWidth = this.backgroundStrokeWidth;
			ctx.strokeStyle = this.backgroundStrokeColor;
			ctx.fillStyle = this.backgroundColor;

			ctx.beginPath();
			if (this.gridCell !== null) ctx.roundRect(-0.5 * this.scaleX, -0.5 * this.scaleY, this.scaleX, this.scaleY, this.backgroundRounding);
			else ctx.roundRect(-0.5, -0.5, 1, 1, this.backgroundRounding / ((this.scaleX * this.scaleY) / 2));			
			ctx.closePath();

			if (this.backgroundStrokeWidth > 0) ctx.stroke();
			ctx.fill();
		}

		ctx.lineWidth = this.textStrokeWidth;
		ctx.strokeStyle = this.textStrokeColor;
		ctx.fillStyle = this.color;

		if (this.textStrokeWidth > 0) ctx.strokeText(this.text, this.backgroundPadding, this.backgroundPadding);
		ctx.fillText(this.text, this.backgroundPadding, this.backgroundPadding);

		this.restoreCamera(ctx);
	}

	gridUpdate(cell)
	{
		this.gridCell = cell;
		this.scaleX = cell.scaleX * cell.grid.scaleX;
		this.scaleY = cell.scaleY * cell.grid.scaleY;
		this.positionX = cell.centerX * cell.grid.scaleX;
		this.positionY = cell.centerY * cell.grid.scaleY;
	}
}