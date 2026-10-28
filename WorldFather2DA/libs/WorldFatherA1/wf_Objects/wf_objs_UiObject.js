import { Empty } from "./wf_objs_Empty.js";

export class UiObject extends Empty
{
	constructor(inherited = {})
	{
		super(inherited);

		this.type = inherited.type ?? "Text";

		this.text = inherited.text ?? "Unset Text Object";

		this.font = inherited.font ?? "Arial";
		this.fontSize = inherited.fontSize ?? 50;
		this.textBaseline = inherited.textBaseline ?? "middle";
		this.textAlign = inherited.textAlign ?? "center";
		this.textStrokeColor = inherited.textStrokeColor ?? "black";
		this.textStrokeWidth = inherited.textStrokeWidth ?? 0;

		this.minWidth = inherited.minWidth ?? 0;
		this.maxWidth = inherited.maxWidth ?? 999999999;

		this.hasBackground = inherited.hasBackground ?? false;
		this.autoBackground = inherited.autoBackground ?? false;
		this.backgroundPadding = inherited.backgroundPadding ?? 0;
		this.backgroundColor = inherited.backgroundColor ?? "magenta";
		this.backgroundStrokeColor = inherited.backgroundStrokeColor ?? "black";
		this.backgroundStrokeWidth = inherited.backgroundStrokeWidth ?? 0;
		this.backgroundRounding = inherited.backgroundRounding ?? 0;
		this.backgroundHeightUnderhangBias = inherited.backgroundHeightUnderhangBias ?? 1.75;
	}

	getWidth()
	{
		const ctx = this.engine.Renderer.context;
		ctx.font = `${this.fontSize}px ${this.font}`;
		return ctx.measureText(this.text).width;
	}

	getHeight()
	{
		return this.fontSize;
	}

	draw(ctx)
	{
		ctx.textBaseline = this.textBaseline;
		ctx.textAlign = this.textAlign;
		ctx.font = `${this.fontSize}px ${this.font}`;

		if(this.hasBackground)
		{
			ctx.lineWidth = this.backgroundStrokeWidth;
			ctx.strokeStyle = this.backgroundStrokeColor;
			ctx.fillStyle = this.backgroundColor;
			ctx.beginPath();

			let textWidth = ctx.measureText(this.text).width + this.backgroundPadding * 2;
			let textHeight = this.fontSize + this.backgroundPadding * this.backgroundHeightUnderhangBias;

			let startX = this.positionX;
			let startY = this.positionY;
			switch (this.textAlign)
			{
				case "center":
					startX = this.positionX - textWidth * 0.5;
					startY = this.positionY - textHeight * 0.5;
					break;
			}

			if(this.autoBackground)
			{
				let backgroundWidth = textWidth;
				if (backgroundWidth < this.minWidth) backgroundWidth = this.minWidth;
				const backgroundHeight = textHeight;
				ctx.roundRect(startX, startY, backgroundWidth, backgroundHeight, this.backgroundRounding);
			}
			else
			{
				ctx.roundRect(this.positionX - this.scaleX * 0.5, this.positionY - this.scaleY * 0.5, this.scaleX, this.scaleY, this.backgroundRounding);
			}

			ctx.stroke();
			ctx.fill();
		}

		ctx.lineWidth = this.textStrokeWidth;
		ctx.strokeStyle = this.textStrokeColor;
		ctx.fillStyle = this.color;
		ctx.fillText(this.text, this.positionX + this.backgroundPadding, this.positionY + this.backgroundPadding, this.maxWidth);
	}

	gridUpdate(dt, cell)
	{
		if (cell)
		{
			this.positionX = cell.centerX;
			this.positionY = cell.centerY;
			this.scaleX = cell.width;
			this.scaleY = cell.height;
			this.rotation = cell.rotation;
		}
		this.dirty = true;
	}
}