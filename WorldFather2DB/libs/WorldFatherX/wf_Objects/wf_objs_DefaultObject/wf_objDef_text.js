export function setupDefaultText(obj)
{
	if (obj.drawText == null) obj.drawText = drawText;
	if (obj.testMultiLine == null) obj.testMultiLine = testMultiLine;
	
	if(obj.text == null) obj.text = (obj.overrides.text !== undefined) ? [obj.overrides.text] : ["Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."];
	if(obj.font == null) obj.font = obj.overrides.font ?? "Arial";
	if(obj.fontSize == null) obj.fontSize = obj.overrides.fontSize ?? 25;
	if(obj.linePadding == null) obj.linePadding = obj.overrides.linePadding ?? 2;
	if(obj.textColor == null) obj.textColor = obj.overrides.textColor ?? "White";
	if(obj.textAlign == null) obj.textAlign = obj.overrides.textAlign ?? "center";
	if(obj.textOutlineColor == null) obj.textOutlineColor = obj.overrides.textOutlineColor ?? "black";
	if(obj.textOutlineWidth == null) obj.textOutlineWidth = obj.overrides.textOutlineWidth ?? 0;
	if(obj.textWrap == null) obj.textWrap = obj.overrides.textWrap ?? true;
	obj.multiLineDirty = true;
	if(obj.textPadding == null) obj.textPadding = obj.overrides.textPadding ?? 10;
	//this.textBaseline = obj.overrides.textBaseline ?? "middle";

	obj.wf.ErrorManager.isExpected(obj._modules["useDrawing"].using, true, "Object Text Requires Object Drawing");
}

function drawText(ctx)
{
	if (!Array.isArray(this.text)) this.text = [this.text];

	ctx.textBaseline = "middle";
	ctx.textAlign = this.textAlign;
	ctx.font = `${this.fontSize}px ${this.font}`;
	ctx.lineWidth = this.textOutlineWidth;
	ctx.strokeStyle = this.textOutlineColor;
	ctx.fillStyle = this.textColor;

	let posX = 0;

	switch (this.textAlign)
	{
		case "left":
			posX = (-this.width * 0.5) + this.textPadding;
			break;
		case "right":
			posX = (this.width * 0.5) - this.textPadding;
			break;
	}

	if (this.textWrap && this.multiLineDirty)
	{
		this.testMultiLine(ctx);
	}

	for (let i = 0; i < this.text.length; i++)
	{
		const posY = ((-this.text.length * 0.5 + i) * (this.fontSize + this.linePadding)) + this.fontSize * 0.5 + this.linePadding;
		ctx.beginPath();
		if (this.textOutlineWidth > 0) ctx.strokeText(this.text[i], posX, posY, this.width);
		ctx.fillText(this.text[i], posX, posY, this.width);
	}
} 

function testMultiLine(ctx)
{
	this.text = [this.text.join(" ")];
	const newLineArr = this.text[0].split(" ");
	let stopper = Infinity;

	let curLine = "";

	for (let i = 0; i < stopper; i++)
	{
		if (newLineArr[0].includes("\n"))
		{
			const lineBroken = newLineArr.shift().split('\n');
			this.text[i] = (curLine == "") ? lineBroken.shift() : curLine + " " + lineBroken.shift();
			newLineArr.unshift(lineBroken.join("\n"));
			curLine = "";
		}
		else if (ctx.measureText(curLine + newLineArr[0]).width < this.width - this.textPadding*2)
		{
			curLine += (curLine == "") ? newLineArr.shift() : " " + newLineArr.shift();
			i--;
		}
		else if (ctx.measureText(newLineArr[0]).width > this.width - this.textPadding * 2 && curLine == "")
		{
			this.text[i] = newLineArr.shift();
		}
		else
		{
			this.text[i] = curLine;
			curLine = "";
		}
		if (newLineArr.length == 0)
		{
			if (curLine != "") this.text[i + 1] = curLine;
			stopper = -Infinity;
		}
	}
	this.multiLineDirty = false;
}