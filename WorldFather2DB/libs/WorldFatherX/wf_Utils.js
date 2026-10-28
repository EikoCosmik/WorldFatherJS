export class Utils
{
	constructor(wf)
	{
		this.wf = wf;
		this.maxRadians = 2 * Math.PI;
		this.Tau = 2 * Math.PI;
		this.random = this.mulberry32();
		this.Drawers = new Drawers(wf);
	}

	//MathLikes

	getRadians(degrees)
	{
		return degrees * (Math.PI / 180);
	}
	
	getDegrees(radians)
	{
		return radians * (180 / Math.PI);
	}

	absolute(x)
	{
		let mask = x >> 31;
		return (x + mask) ^ mask;
	}

	timeSince(lastTime, thisTime = Date.now())
	{
		return thisTime - lastTime;
	}

	getAngleBetweenPoints(dx, dy)
	{
		return Math.atan2(dy, dx);
	}

	forceMod(n, m)
	{
		return ((n % m) + m) % m;
	}

	clamp(x, min, max)
	{
		return Math.max(min, Math.min(max, x));
	}

	// Randomness

	mulberry32(seed = Date.now() ^ (Math.random() * 0xffffffff))
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

	getRandomInteger(min, max)
	{
		min = Math.ceil(min);
		max = max | 0;
		return (this.random() * (max - min) | 0) + min;
	}

	getRandomIntegerInclusive(min, max)
	{
		min = Math.ceil(min);
		max = max | 0;
		return (this.random() * (max - min + 1) | 0) + min;
	}

	getRandomFloat(min, max)
	{
		return this.random() * (max - min) + min;
	}

	getRandomChance(decimalChance, randomIn = this.random())
	{
		return randomIn <= decimalChance;
	}

	// Shape Helpers

	getShape(points, fitToFace = true)
	{
		const outShape = [];
		const steps = 360 / points;

		let minX = Infinity;
		let maxX = -Infinity;
		let minY = Infinity;
		let maxY = -Infinity;

		for (let i = 0; i < points; i++)
		{
			let angle = i * (this.Tau / points);
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

	rotatePoint(x, y, angle, centerX = 0, centerY = 0)
	{
		const cos = Math.cos(this.getRadians(angle));
		const sin = Math.sin(this.getRadians(angle));
		const newX = ((x - centerX) * cos) - ((y - centerY) * sin) + centerX;
		const newY = ((x - centerX) * sin) + ((y - centerY) * cos) + centerY;
		return [newX, newY];
	}

	getLocalOfFrom(ofObj, fromObj)
	{
		let localX = ofObj.globalPositionX;
		let localY = ofObj.globalPositionY;

		localX -= fromObj.globalPositionX;
		localY -= fromObj.globalPositionY;

		[localX, localY] = this.rotatePoint(localX, localY, this.getRadians(-fromObj.globalRotation));

		return [localX, localY]
	}

	getPointsOnEllipsis(ellipse, segments)
	{
		const pts = [];

		const cosR = Math.cos(getRadians(ellipse.rotation));
		const sinR = Math.sin(getRadians(ellipse.rotation));

		for (let i = 0; i < segments; i++) {
			const t = (i / segments) * Math.PI * 2;

			let x = (ellipse.width * 0.5) * Math.cos(t);
			let y = (ellipse.height * 0.5) * Math.sin(t);

			const rx = x * cosR - y * sinR;
			const ry = x * sinR + y * cosR;

			pts.push([rx, ry]);
		}

		return pts;
	}

	getRelativePosition(objectX, objectY, objectRotation, targetX, targetY)
	{
		const dx = targetX - objectX;
		const dy = targetY - objectY;
		const distance = Math.sqrt(dx * dx + dy * dy);
		const angle = getAngleBetweenPoints(dx, dy);
		return [objectX + Math.cos(getRadians(objectRotation) - angle) * distance, objectY + Math.sin(getRadians(objectRotation) - angle) * distance];
	}

	// Draw Helpers

	// Value Checkers

	isValid(value, name)
	{
		if (value != null) return true;
		return false;
	}

	isWithinRange(value, min, max)
	{
		return (value <= max && value >= min);
	}

	isOnEdge(x, y, x1, y1, x2, y2)
	{
		const dx = (x2 - x1);
		const dy = (y2 - y1);
		const px = (x - x1);
		const py = (y - y1);
		const localPoint = px * dy - py * dx;

		if (localPoint !== 0) return false;

		return Math.min(x1, x2) <= x && x <= Math.max(x1, x2) && Math.min(y1, y2) <= y && y <= Math.max(y1, y2);
	}

	isInsidePolygon(polygon, pointX, pointY)
	{
		const n = polygon.verticies.length;
		let inside = false;

		for (let i = 0, j = n - 1; i < n; j = i++)
		{
			const x1 = polygon.verticies[i][0];
			const y1 = polygon.verticies[i][1];
			const x2 = polygon.verticies[j][0];
			const y2 = polygon.verticies[j][1];
			
			if (this.isOnEdge(pointX, pointY, x1, y1, x2, y2)) return true;
			
			const dx = (x2 - x1);
			const dy = (y2 - y1);
			const py = (pointY - y1);
			const t = (py / dy);
			const px = (dx * t);

			if (((y1 > pointY) !== (y2 > pointY)) && (pointX < px + x1)) inside = !inside;
		}
		
		return inside;
	}
}

class Drawers
{
	constructor(wf)
	{
		this.wf = wf;
	}

	roundedBox(ctx, obj)
	{
		if (obj.verifiedUtilsDrawersRoundedBoxVars == null)
		{
			this.wf.ErrorManager.required(obj.color, `Utils.Drawers.roundedBox: color is required on ${obj.tag}`);
			this.wf.ErrorManager.required(obj.borderColor, `Utils.Drawers.roundedBox: borderColor is required on ${obj.tag}`);
			this.wf.ErrorManager.required(obj.borderWidth, `Utils.Drawers.roundedBox: borderWidth is required on ${obj.tag}`);
			this.wf.ErrorManager.required(obj.halfWidth, `Utils.Drawers.roundedBox: halfWidth is required on ${obj.tag}`);
			this.wf.ErrorManager.required(obj.paddingX, `Utils.Drawers.roundedBox: paddingX is required on ${obj.tag}`);
			this.wf.ErrorManager.required(obj.halfHeight, `Utils.Drawers.roundedBox: halfHeight is required on ${obj.tag}`);
			this.wf.ErrorManager.required(obj.paddingY, `Utils.Drawers.roundedBox: paddingY is required on ${obj.tag}`);
			this.wf.ErrorManager.required(obj.width, `Utils.Drawers.roundedBox: width is required on ${obj.tag}`);
			this.wf.ErrorManager.required(obj.height, `Utils.Drawers.roundedBox: height is required on ${obj.tag}`);
			this.wf.ErrorManager.required(obj.borderRadius, `Utils.Drawers.borderRadius: height is required on ${obj.tag}`);
			obj.verifiedUtilsDrawersRoundedBoxVars = true;
		} 

		ctx.lineWidth = obj.borderWidth;
		ctx.strokeStyle = obj.borderColor;
		ctx.fillStyle = obj.color;

		ctx.beginPath();
		ctx.roundRect(-obj.halfWidth + obj.paddingX, -obj.halfHeight + obj.paddingY, obj.width - obj.paddingX * 2, obj.height - obj.paddingY * 2, obj.borderRadius);
		ctx.closePath();

		if (obj.borderWidth > 0) ctx.stroke();
		ctx.fill();
	}
}