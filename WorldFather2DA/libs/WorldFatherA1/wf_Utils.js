export const Utils = {};

// Variables

Utils.maxRadians = 2 * Math.PI;

// Spatial Helpers

Utils.isInBounds = (halfScreenWidth, halfScreenHeight, positionX, positionY, bias) =>
{
	if (positionX > -halfScreenWidth - bias && positionX < halfScreenWidth + bias && positionY > -halfScreenHeight - bias && positionY < halfScreenHeight + bias) return true;
	return false;
}

// Draw Helpers

Utils.drawLineFromTo = (context, fromX, fromY, toX, toY, originX, originY, originRotation) =>
{
	let relativeFrom = Utils.getRelativePosition(originX, originY, originRotation, fromX, fromY);
	let relativeTo = Utils.getRelativePosition(originX, originY, originRotation, toX, toY);
	context.moveTo(relativeFrom[0], relativeFrom[1]);
	context.lineTo(relativeTo[0], relativeTo[1]);
}

Utils.getRelativePosition = (objectX, objectY, objectRotation, targetX, targetY) =>
{
	const dx = targetX - objectX;
	const dy = targetY - objectY;
	const distance = Math.sqrt(dx * dx + dy * dy);
	const angle = Utils.getAngleBetweenPoints(dx, dy);
	return [objectX + Math.cos(Utils.getRadians(objectRotation) - angle) * distance, objectY + Math.sin(Utils.getRadians(objectRotation) - angle) * distance];
}

Utils.getAngleBetweenPoints = (dx, dy) =>
{
	return Math.atan2(dy, dx);
}


// I think we got it!
// At least for squares!

Utils.getShape = (points, rotationBias = 0) =>
{
	const outShape = [];
	const steps = 360 / points;
	
	for (let i = 0; i < points; i++)
	{
		const angle = Utils.getRadians((steps * i));		
		let x = (rotationBias != 0) ? Math.cos(angle) * 0.5 * Math.sqrt(2) : Math.cos(angle) * 0.5;
		let y = (rotationBias != 0) ? Math.sin(angle) * 0.5 * Math.sqrt(2) : Math.sin(angle) * 0.5;
		
		if(rotationBias != 0)
		{
			let rotationAngle = Utils.getRadians(rotationBias);
			let rotationCos = Math.cos(rotationAngle);
			let rotationSin = Math.sin(rotationAngle);
			const tempX = x;
			const tempY = y;
			x = (tempX * rotationCos) - (tempY * rotationSin);
			y = (tempX * rotationSin) + (tempY * rotationCos);
		}	
		outShape.push([x, y]);
	}

	return outShape;
}

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

Utils.dotProduct = function (arrayOne, arrayTwo, strictSize = true)
{
	if (arrayOne.length !== arrayTwo.length && strictSize) throw new Error("Invalid Array Sizes. ArrayOne.length must = ArrayTwo.length");

	let outNum = 0;
	const length = strictSize ? arrayOne.length : Math.max(arrayOne.length, arrayTwo.length);

	for (let i = 0; i < length; i++) outNum += (arrayOne[i] ?? 0) * (arrayTwo[i] ?? 0);

	return outNum;
}

Utils.timeSince = (lastTime, thisTime = Date.now()) =>
{
	return thisTime - lastTime;
}

Utils.forceMod = (n, m) =>
{
	return ((n % m) + m) % m;
};

Utils.withinRange = (n, target, range) =>
{
	if (n < target + range && n > target - range) return true;
	return false;
}

// Randomness Generators

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
Utils.getRandomFloat = (min, max) =>
{
	return Utils.random() * (max - min) + min;
};

Utils.getRandomChance = (decimalChance, randomIn = Utils.random()) =>
{
	return randomIn <= decimalChance;
}

// Matrix Maths

Utils.matrixTranspose = function (matrix)
{
	const rows = matrix.length;
	const columns = matrix[0].length;
	const outMatrix = new Array(columns);

	for (let i = 0; i < columns; i++)
	{
		const outRow = new Array(rows);

		for (let j = 0; j < rows; j++) outRow[j] = matrix[j][i];

		outMatrix[i] = outRow;
	}

	return outMatrix;
}

Utils.matrixMultiplyRowVector = function (matrixOne, matrixTwo, strictSize = true)
{
	if (matrixOne[0].length !== matrixTwo.length && strictSize) throw new Error("Invalid Matrix Sizes. Need: MatrixOne = MxN, MatrixTwo = NxP");

	const transposedMatrixTwo = Utils.matrixTranspose(matrixTwo);
	const outMatrix = new Array(matrixOne.length);

	for (let i = 0; i < matrixOne.length; i++)
	{
		const outRow = new Array(transposedMatrixTwo.length);

		for (let j = 0; j < transposedMatrixTwo.length; j++) outRow[j] = Utils.dotProduct(matrixOne[i], transposedMatrixTwo[j], strictSize);

		outMatrix[i] = outRow;
	}

	return outMatrix;
}

Utils.matrixMultiplyColumnVector = function (matrixOne, matrixTwo, strictSize = true)
{
	if (matrixOne.length !== matrixTwo[0].length && strictSize) throw new Error("Invalid Matrix Sizes. Need: MatrixOne = MxN, MatrixTwo = NxP");

	const transposedMatrixOne = Utils.matrixTranspose(matrixOne);
	const outMatrix = new Array(matrixOne[0].length);

	for (let i = 0; i < transposedMatrixOne.length; i++)
	{
		const outRow = new Array(transposedMatrixOne.length);

		for (let j = 0; j < matrixTwo.length; j++) { outRow[j] = Utils.dotProduct(matrixTwo[j], transposedMatrixOne[i], strictSize); }

		outMatrix[i] = outRow;
	}

	return outMatrix;
}

Utils.scalarMultiply = function (matrix, scalar)
{
	const outMatrix = new Array(matrix.length);

	for (let i = 0; i < matrix.length; i++)
	{
		const curRow = matrix[i];
		const outRow = new Array(curRow.length);

		for (let j = 0; j < curRow.length; j++) outRow[j] = scalar * curRow[j];

		outMatrix[i] = outRow;
	}

	return outMatrix;
}