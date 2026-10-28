export const Utils = {};

// Variables

Utils.maxRadians = 2 * Math.PI;
Utils.Tau = 2 * Math.PI;

// Math Likes

Utils.getRadians = (degrees) =>
{
	return degrees * (Math.PI / 180);
}

Utils.getDegrees = (radians) =>
{
	return radians * (180 / Math.PI);
}

Utils.absolute = (x) =>
{
	let mask = x >> 31;
	return (x + mask) ^ mask;
};

Utils.timeSince = (lastTime, thisTime = Date.now()) =>
{
	return thisTime - lastTime;
}

Utils.getAngleBetweenPoints = (dx, dy) =>
{
	return Math.atan2(dy, dx);
}

Utils.forceMod = (n, m) =>
{
	return ((n % m) + m) % m;
};

// Draw Helpers

Utils.getShape = (points, fitToFace = true) =>
{
	const outShape = [];
	const steps = 360 / points;

	let minX = Infinity;
	let maxX = -Infinity;
	let minY = Infinity;
	let maxY = -Infinity;

	for (let i = 0; i < points; i++)
	{
		let angle = i * (Utils.Tau / points);
		if (fitToFace) angle += (Math.PI / points);
		let x = Math.cos(angle) * 0.5;
		if (x < minX) minX = x;
		if (x > maxX) maxX = x;
		let y = Math.sin(angle) * 0.5;
		if (y < minY) minY = y;
		if (y > maxY) maxY = y;	
		outShape.push([x, y]);
	}

	const scaleFix = 1 / Math.max(maxX - minX, maxY - minY);

	for (let i = 0; i < outShape.length; i++)
	{
		outShape[i][0] *= scaleFix;
		outShape[i][1] *= scaleFix;
	}
	
	return outShape;
}

// Randomness

Utils.mulberry32 = (seed = Date.now() ^ (Math.random() * 0xffffffff)) =>
{
	seed |= 0;
	return function ()
	{
		let t = seed += 0x6D2B79F5;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	}
};

Utils.random = Utils.mulberry32();

Utils.getRandomInteger = (min, max) =>
{
	min = Math.ceil(min);
	max = max | 0;
	return (Utils.random() * (max - min) | 0) + min;
};

Utils.getRandomIntegerInclusive = (min, max) =>
{
	min = Math.ceil(min);
	max = max | 0;
	return (Utils.random() * (max - min + 1) | 0) + min;
};

Utils.getRandomFloat = (min, max) =>
{
	return Utils.random() * (max - min) + min;
};

Utils.getRandomChance = (decimalChance, randomIn = Utils.random()) =>
{
	return randomIn <= decimalChance;
}