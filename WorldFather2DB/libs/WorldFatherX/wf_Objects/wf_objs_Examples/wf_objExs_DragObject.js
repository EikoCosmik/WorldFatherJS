import { DefaultObj } from "../wf_objs_DefaultObject/wf_objs_DefaultObj.js";

export class DragObject extends DefaultObj
{
	constructor(inherited = {})
	{
		super(inherited);
		this.tag = "_DragObject";
		this.startX = 0;
		this.startY = 0;
		this.downX = 0;
		this.downY = 0;
		this.currentX = 0;
		this.currentY = 0;
		this.dragging = false;
	}

	update(dt)
	{
		if(this.wf.isMouseDown())
		{
			if (this.dragging == false)
			{
				this.dragging = true;
				this.downX = this.wf.MouseSystem.rawDown.offsetX;
				this.downY = this.wf.MouseSystem.rawDown.offsetY;
				this.startX = this.positionX;
				this.startY = this.positionY;
			}
			this.currentX = this.wf.MouseSystem.rawMove.offsetX;
			this.currentY = this.wf.MouseSystem.rawMove.offsetY;

			const dx = this.downX - this.currentX;
			const dy = this.downY - this.currentY;
			this.positionX = this.startX + dx;
			this.positionY = this.startY + dy;
		}
		else
		{
			this.dragging = false;
		}
	}
}