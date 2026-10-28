import { UiTextBox } from "./wf_objs_UiTextBox.js";

export class UiButton extends UiTextBox
{
	constructor(inherited = {})
	{
		super(inherited);

		this.tag = inherited.tag ?? "UiButton";
		this.canCollide = inherited.canCollide ?? true;
	}
	
	onClicked()
	{
		console.log("Unset Button onClicked Triggered: ", this.id);
	}
}