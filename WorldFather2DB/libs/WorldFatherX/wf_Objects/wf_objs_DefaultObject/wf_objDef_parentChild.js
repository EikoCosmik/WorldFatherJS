export function setupDefaultParentChild(obj)
{
	if (obj.adoptChild == null) obj.adoptChild = adoptChild;
	if (obj._onAdoption == null) obj._onAdoption = _onAdoption;
	if (obj.onAdoption == null) obj.onAdoption = onAdoption;
	if (obj.removeChild == null) obj.removeChild = removeChild;
	if (obj.leaveParent == null) obj.leaveParent = leaveParent;

	if (obj.parent == null) obj.parent = obj.overrides.parent ?? null;
	if (obj.useParentSize == null) obj.useParentSize = obj.overrides.useParentSize ?? false;

	if (obj.children == null) obj.children = {};
	if (obj.childRunningCount == null) obj.childRunningCount = 0;
	if (obj.relativeID == null) obj.relativeID = -1;

	obj.wf.ErrorManager.isExpected(obj._modules["useWorldData"].using, true, "Object ParentChild Requires Object WorldData ");
}

function adoptChild(child)
{
	child.relativeID = this.childRunningCount++;
	this.children[child.relativeID] = child;
	child.dirtyData = true;
	child.parent = this;
	child._onAdoption(this);
}

function _onAdoption(parent)
{
	if (this.useParentSize)
	{
		this.width = parent.width;
		this.height = parent.height;
	}
}

function onAdoption(parent) { }

function removeChild(childID)
{
	delete this.children[childID];
}

function leaveParent()
{
	this.positionX = this.worldPositionX;
	this.positionY = this.worldPositionY;
	this.rotation = this.worldRotation;
	this.parent.removeChild(this.relativeID);
	this.parent = null;
}