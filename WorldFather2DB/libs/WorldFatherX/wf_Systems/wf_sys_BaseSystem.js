export class BaseSystem
{
	constructor(name, wf)
	{
		this.name = name ?? "BaseSystem";
		this.wf = wf;
	}

	onSetup() { }
	onDeath() { }
}