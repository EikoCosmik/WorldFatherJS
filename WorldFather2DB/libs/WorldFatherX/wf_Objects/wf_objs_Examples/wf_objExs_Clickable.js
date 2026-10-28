import { DefaultObj } from "../wf_objs_DefaultObject/wf_objs_DefaultObj.js";

export class ClickableExample extends DefaultObj
{
	constructor(inherited = {}) { super(inherited); }

	onSetup()
	{
		this.tag = "_ClickableExample";
		this.useWorldData = true;
		this.useCollision = true;
		this.useClickable = true;
		this.clickedAs = "white";
	}

	// update(dt)
	// {
	// 	this.color = this.clickedAs;
	// 	this.clickedAs = "white";
	// }

	onClicked(worldCoords, coords, data = {})
	{
		if (data.type == this.clickDetectionType)
		{
			console.log("Clicked!");
			console.log(data);
			switch (data.button)
			{
				case 0:
					console.log('Left button clicked.');
					this.color = "red";
					this.clickedAs = "red";
					break;
				case 1:
					console.log('Middle button clicked.');
					this.color = "lime";
					this.clickedAs = "lime";
					break;
				case 2:
					console.log('Right button clicked.');
					this.color = "blue";
					this.clickedAs = "blue";
					break;
				default:
					console.log(`non-standard: ${data.button} clicked`);
			}
		}
	}
}