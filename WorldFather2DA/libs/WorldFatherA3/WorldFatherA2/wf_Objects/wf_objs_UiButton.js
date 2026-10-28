import { UiTextBox } from "./wf_objs_UiTextBox.js";

export class UiButton extends UiTextBox
{
	constructor(inherited = {})
	{
		super(inherited);
		this.isClickable = true;
	}

	onClicked()
	{
		console.log(this, " Was Clicked")
	}
}