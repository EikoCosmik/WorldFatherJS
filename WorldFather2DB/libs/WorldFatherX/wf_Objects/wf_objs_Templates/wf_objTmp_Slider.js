import { StatusBar } from "./wf_objTmp_StatusBar.js";

export class Slider extends StatusBar
{
	constructor(inherited = {}) { super(inherited); }

	onSetup()
	{		
		super.onSetup();

		this.initialValue = this.value;

		this.useWorldData = true;
		this.useClickable = true;

		// Dragging:
		this.currentX = 0;
		this.currentY = 0;
		this.worldCoords = {};
	}

	getValuePosition()
	{
		return (this.positionX - this.halfWidth) + (this.height * this.percent)
	}

	update(dt)
	{
		if (this.wf.isMouseDown() && this._isHover)
		{
			const curWorldCoords = this.wf.MouseSystem.getWorldCoords(this.wf.MouseSystem.rawMove);

			if (this.isVerticle)
			{
				const topEdge = (this.positionY - this.height * 0.5);
				if (this.isInverted) this.updateStat((((curWorldCoords.y - this.positionY) / this.height) + 0.5) * 100);
				else this.updateStat((((this.positionY - curWorldCoords.y) / this.height) + 0.5) * 100);
			}
			else
			{
				const leftEdge = (this.positionX - this.width * 0.5);
				if (this.isInverted) this.updateStat((((this.positionX - curWorldCoords.x) / this.width) + 0.5) * 100);
				else this.updateStat((((curWorldCoords.x - this.positionX) / this.width) + 0.5) * 100);
			}	
		}
	}

	draw(ctx)
	{
		super.draw(ctx);
		const leftEdge = (this.positionX - this.width * 0.5);
		const topEdge = (this.positionX - this.width * 0.5);
	}

	onClicked(worldCoords, coords, data) { }
}