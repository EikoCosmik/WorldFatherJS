import { DefaultObj } from "../wf_objs_DefaultObject/wf_objs_DefaultObj.js";

export class TextBox extends DefaultObj
{
	constructor(inherited = {}) { super(inherited); }

	onSetup()
	{
		this.tag = "_TextBox";

		this.useWorldData = this.overrides.useWorldData ?? true;
		this.useParentChild = this.overrides.useParentChild ?? true;
		this.useText = this.overrides.useText ?? true;
		this.useParentSize = true;

		this.paddingX = this.overrides.paddingX ?? 7.5;
		this.paddingY = this.overrides.paddingY ?? 7.5;
		
		this.color = this.overrides.backgroundColor ?? "#111111";
		this.borderColor = this.overrides.borderColor ?? "#770000";
		this.borderWidth = this.overrides.borderWidth ?? 15;
		this.borderRadius = this.overrides.borderRadius ?? 10;
	}

	draw(ctx)
	{
		this.wf.Utils.Drawers.roundedBox(ctx, this);
	}
}