

export function setupDefaultImage(obj)
{
	if (obj.drawImage == null) obj.drawImage = drawImage;
	if (obj.calcRatio == null) obj.calcRatio = calcRatio;

	if (obj.imageSrc == null) obj.imageSrc = obj.overrides.imageSrc ?? "./libs/worldFatherX/wf_Internal/LogoWhite_BlackBG.png";
	obj.imageWidth = obj.width;
	obj.imageHeight = obj.height;
	if (obj.aspectRatio == null) obj.aspectRatio = obj.overrides.aspectRatio ?? null;

	if (obj.imagePaddingX == null) obj.imagePaddingX = obj.overrides.imagePaddingX ?? 0;
	if (obj.imagePaddingY == null) obj.imagePaddingY = obj.overrides.imagePaddingY ?? 0;

	obj.image = { isReady: false, image: new Image() };
	obj.image.image.src = obj.imageSrc;
	obj.image.image.onload = () =>
	{
		obj.image.isReady = true;
	}
	if (obj.calcRatio == null) obj.imageDirty = true;

	obj.wf.ErrorManager.isExpected(obj._modules["useDrawing"].using, true, "Object Image Requires Object Drawing");
}

function drawImage(ctx)
{
	if (this.imageDirty && this.aspectRatio != null) this.calcRatio();
	if (this.image.isReady) ctx.drawImage(this.image.image, (-this.imageWidth * 0.5) + this.imagePaddingX, (-this.imageHeight * 0.5) + this.imagePaddingY, this.imageWidth - this.imagePaddingX * 2, this.imageHeight - this.imagePaddingY * 2);
}

function calcRatio()
{
	const isWidthSmaller = this.width < this.height;
	const aspectRatio = (this.aspectRatio > 1) ? 1 / this.aspectRatio : this.aspectRatio;
	this.imageHeight = (isWidthSmaller) ? this.width * aspectRatio : this.height;
	this.imageWidth = (isWidthSmaller) ? this.width : this.height * aspectRatio;
	this.imageDirty = false;
}