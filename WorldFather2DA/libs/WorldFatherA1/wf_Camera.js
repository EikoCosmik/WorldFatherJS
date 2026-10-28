export class Camera
{
	constructor(name, inherited = {})
	{
		this.name = name;
		this.positionX = inherited.positionX ?? 0;
		this.positionY = inherited.positionY ?? 0;
		this.rotation = inherited.rotation ?? 0;
		this.scaleX = inherited.scaleX ?? 1;
		this.scaleY = inherited.scaleY ?? 1;
		this.following = { positionX: this.positionX, positionY: this.positionY, rotation: this.rotation, scaleX: this.scaleX, scaleY: this.scaleY };
	}

	update()
	{
		this.positionX = this.following.positionX;
		this.positionY = this.following.positionY;
		this.rotation = this.following.rotation;
		this.scaleX = this.following.scaleX;
		this.scaleY = this.following.scaleY;
	}

	follow(obj)
	{
		this.following = obj;
	}
}