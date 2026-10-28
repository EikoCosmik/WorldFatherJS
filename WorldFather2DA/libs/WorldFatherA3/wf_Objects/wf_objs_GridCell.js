import { Utils } from "../wf_Utils.js";
import { Empty } from "./wf_objs_Empty.js";
import { Solid } from "./wf_objs_Solid.js";

export class GridCell extends Solid
{
	constructor(inherited = {})
	{
		super(inherited);
		this.tag = inherited.tag ?? "_GridCell";
	}

	update(dt)
	{
		for(let key in this.children)
		{
			if(this.children[key].dirty) this.children[key].updateWorldData();
		}
	}
}