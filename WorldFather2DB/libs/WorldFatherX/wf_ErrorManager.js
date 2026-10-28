export class ErrorManager
{
	constructor(wf)
	{
		this.wf = wf;
		this.errorStack = [];
	}

	printStack()
	{
		this.errorStack.forEach(err =>
		{
			console.error(`${err.name}: ${err.message}`);
		})
		throw new Error("ErrorStack")
	}

	throw(message = "unset ER Throw", forceHalt = false)
	{
		if (forceHalt) throw new Error(`${message}`);
		this.errorStack.push(new Error(`${message}`));
	}

	isExpected(value, expected, message = "unknown isExpected error", forceHalt = false)
	{
		if (value != expected)
		{
			this.throw(`isExpected: ${message}`, forceHalt);
		}
		return true;
	}

	required(value, message, forceHalt = false)
	{
		if (value == null)
		{
			if (forceHalt) throw new Error(`required: ${message}`);
			this.errorStack.push(new Error(`required: ${message}`));
		}
		return value;
	}

	requiredType(value, message, type, forceHalt = false)
	{
		this.required(value, name);
		if (typeof value !== type)
		{
			if (forceHalt) throw new Error(`requiredType: ${message}`);
			this.errorStack.push(new Error(`requiredType: ${message}`));
		}
		return value;
	}

	requiredValue(value, message, expectedVal, forceHalt = false)
	{
		this.required(value, name);
		if (value !== expectedVal)
		{
			if (forceHalt) throw new Error(`requiredValue: ${message}`);
			this.errorStack.push(new Error(`requiredValue: ${message}`));
		}
		return value;
	}

	belowMax(value, message, max, forceHalt = false)
	{
		if (value > max)
		{
			if (forceHalt) throw new Error(`belowMax: ${message}`);
			this.errorStack.push(new Error(`belowMax: ${message}`));
		} 
	}

	aboveMin(value, message, min, forceHalt = false)
	{
		if (value < min)
		{
			if (forceHalt) throw new Error(`aboveMin: ${message}`);
			this.errorStack.push(new Error(`aboveMin: ${message}`));
		}
	}
}