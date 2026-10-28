import { BaseObject } from "./wf_objs_BaseObject.js";
import { Empty } from "./wf_objs_Empty.js";

export class clickObject extends BaseObject
{
	constructor(inherited)
	{
		super(inherited);
		this.tag = "clickObj";
		this.isLive = false;
	} 
	
	collidedWith(collidedObject)
	{
		this.scene.lastClicked = collidedObject;
	}
}