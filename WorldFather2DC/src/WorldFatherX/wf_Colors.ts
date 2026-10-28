import { Utils } from "./wf_Utils.js"; 

export class WFColor
{
	public r: number;
	public g: number;
	public b: number;
	public a: number;

	constructor({ r = 255, g = 0, b = 255, a = 255 }: { r?: number; g?: number; b?: number; a?: number; } = {})
	{
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}

	public toString(): string
	{
		return `#${this.cleanNumber(this.r)}${this.cleanNumber(this.g)}${this.cleanNumber(this.b)}${this.cleanNumber(this.a)}`;
	}

	public invertString(): string
	{
		return `#${this.cleanNumber(255 - this.r)}${this.cleanNumber(255 - this.g)}${this.cleanNumber(255 - this.b)}${this.cleanNumber(this.a)}`;
	}

	private cleanNumber(num: number): string
	{
		const clamped = Utils.clamp(num, 0, 255);
		return clamped.toString(16).padStart(2, '0');
	}
}

export class WFColors
{
	static red: WFColor = new WFColor({ r: 255, g: 0, b: 0 });
	static orange: WFColor = new WFColor({ r: 255, g: 127, b: 0 });
	static yellow: WFColor = new WFColor({ r: 255, g: 255, b: 0 });
	static lime: WFColor = new WFColor({ r: 127, g: 255, b: 0 });
	static green: WFColor = new WFColor({ r: 0, g: 255, b: 0 });
	static aqua: WFColor = new WFColor({ r: 0, g: 255, b: 127 });
	static cyan: WFColor = new WFColor({ r: 0, g: 255, b: 255 });
	static azure: WFColor = new WFColor({ r: 0, g: 127, b: 255 });
	static blue: WFColor = new WFColor({ r: 0, g: 0, b: 255 });
	static purple: WFColor = new WFColor({ r: 127, g: 0, b: 255 });
	static magenta: WFColor = new WFColor({ r: 255, g: 0, b: 255 });
	static ruby: WFColor = new WFColor({ r: 255, g: 0, b: 127 });
}

export class WFColorUtils
{
	static hueRotate(color: WFColor, degrees: number): WFColor
	{
		let hsla = this.wfColorToHsla(color);
		
		hsla.h = Utils.forceMod(hsla.h + degrees, 360);
		if (hsla.h < 0) hsla.h += 360;

		return this.hslaToWfColor(hsla);
	}

	static wfColorToHsla(color: WFColor): { h: number; s: number; l: number; a: number; }
	{
		const red = color.r * 0.003921568627;
		const green = color.g * 0.003921568627;
		const blue = color.b * 0.003921568627;
		const max = Math.max(red, green, blue);
		const min = Math.min(red, green, blue);
		const avg = (max + min) * 0.5;
		let hue = avg;
		let saturation = avg;
		let lightness = avg;

		if (max === min)
		{
			hue = 0;
			saturation = 0;
		}
		else
		{
			const difference = max - min;

			saturation = lightness > 0.5 ? difference / (2 - difference) : difference / (max + min);

			switch (max)
			{
				case red:
					hue = (green - blue) / difference + (green < blue ? 6 : 0);
					break;
				case green:
					hue = (blue - red) / difference + 2;
					break;
				case blue:
					hue = (red - green) / difference + 4;
					break;
			}

			hue *= 0.1666666667;
		}

		return { h: hue * 360, s: saturation * 100, l: lightness * 100, a: color.a };
	}

	static hslaToWfColor(hsla: { h: number; s: number; l: number; a: number; }): WFColor
	{
		const h = hsla.h * 0.002777777778;
		const s = hsla.s * 0.01;
		const l = hsla.l * 0.01;
		let red;
		let green;
		let blue;

		if (s === 0)
		{
			red = l;
			green = l;
			blue = l;
		}
		else
		{
			const q = (l < 0.5) ? l * (1 + s) : l + s - l * s;
			const p = 2 * l - q;
			red = this.hueToRgb(p, q, h + 0.3333333333);
			green = this.hueToRgb(p, q, h);
			blue = this.hueToRgb(p, q, h - 0.3333333333);
		}

		return new WFColor({ r: Math.round(red * 255), g: Math.round(green * 255), b: Math.round(blue * 255), a: hsla.a });
	}

	static hueToRgb(p: number, q: number, t: number): number
	{
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 0.1666666667) return p + (q - p) * 6 * t;
		if (t < 0.5) return q;
		if (t < 0.6666666667) return p + (q - p) * (0.6666666667 - t) * 6;
		return p;
	}
}