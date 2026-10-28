import { Button } from "../wf_objs_Templates/wf_objTmp_Button.js";

export class BackButton extends Button
{
	constructor(inherited = {}) { super(inherited); }

	onSetup()
	{
		super.onSetup();

		this.width = 75;
		this.height = 50;
		this.positionX = -this.wf.halfScreenWidth + 25 + 37.5;
		this.positionY = -this.wf.halfScreenHeight + 25 + 25;
		this.fontSize = 15;
		this.text = "Back";
		this.onClicked = this.overrides.onClicked ?? (function (worldCoords, coords, data) { if (data.type == this.clickDetectionType) this.wf.swapToLastScene() });
	}
}