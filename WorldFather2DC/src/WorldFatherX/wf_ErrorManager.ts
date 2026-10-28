class ErrorManagerClass
{
	public constructor() {}

	public setIfExists(value: any, message: string = "unknown required error"): any
	{
		if (value == null)
		{
			throw new wf_ValidationError(message);
		}
		return value;
	}
	
	public testIfExists(value: any, message: string = "unknown required error"): void
	{
		if (value == null)
		{
			throw new wf_ValidationError(message);
		}
	}
}

class wf_ValidationError extends Error
{
	constructor(message: string, public field?: string)
	{
		super(message);
		this.name = 'wf_ValidationError';
		Object.setPrototypeOf(this, wf_ValidationError.prototype);
	}
}

export const ErrorManager = new ErrorManagerClass();