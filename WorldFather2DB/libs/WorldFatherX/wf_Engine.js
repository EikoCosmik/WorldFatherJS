export class Engine 
{
	constructor(WF)
	{
		this.wf = WF;

		this._lastTime = 0;
	}

	_timeStep(t)
	{
		const deltaTime = (t - this._lastTime) / 1000;
		this._lastTime = t;
		this.wf.currentScene._updateObjects(deltaTime);
		this.wf.renderer._render();
		if(this.wf.ErrorManager.errorStack.length > 0) this.wf.ErrorManager.printStack();
		this.wf.renderID = requestAnimationFrame((t) => this._timeStep(t));
	}
}