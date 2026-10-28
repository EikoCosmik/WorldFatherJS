import { Utils } from "../wf_Utils.js";
import { BaseObject } from "./wf_objs_BaseObject.js";

export class Grid extends BaseObject
{
	constructor(inherited = {})
	{
		super(inherited);
		this.grid = [];
		this.gridTemplateRows = inherited.gridTemplateRows ?? ["1fr", "1fr"];
		this.gridTemplateColumns = inherited.gridTemplateColumns ?? ["1fr", "1fr"];
		this.padding = inherited.padding ?? 0;
		this.debugCells = inherited.debugCells ?? false;
		this.cellBackgroundColor = inherited.cellBackgroundColor ?? "lime";
		this.gridGap = inherited.gridGap ?? 0;
		this.cellBorderColor = inherited.cellBorderColor ?? "red";
		this.color = "transparent";
		this.items = [];
	}

	addItemReference(object, row, column)
	{
		this.items.push({object, row, column});
	}

	onSetup()
	{
		super.onSetup();

		// Testing

		this.color = "blue";
		this.rotation = 45;

		// Testing

		if (this.dirty) this.updateShape();
	}

	updateShape()
	{
		super.updateShape();
		this.calcGridObject();
	}

	calcGridObject()
	{
		let rowFractionalCount = 0;
		let rowReserved = 0;
		let columnFractionalCount = 0;
		let columnReserved = 0;

		for (let i = 0; i < this.gridTemplateRows.length; i++)
		{
			let currentItem = this.gridTemplateRows[i];
			let currentHeight = parseInt(currentItem);
			if (currentItem.endsWith("fr")) rowFractionalCount += currentHeight;
			else rowReserved += currentHeight;
		}

		for (let i = 0; i < this.gridTemplateColumns.length; i++)
		{
			let currentItem = this.gridTemplateColumns[i];
			let currentWidth = parseInt(currentItem);
			if (currentItem.endsWith("fr")) columnFractionalCount += currentWidth;
			else columnReserved += currentWidth;
		}

		const rowFraction = (this.scaleY - (this.padding * 2) - ((this.gridTemplateRows.length - 1) * this.gridGap) - rowReserved) / rowFractionalCount;
		const columnFraction = (this.scaleX - (this.padding * 2) - ((this.gridTemplateColumns.length - 1) * this.gridGap) - columnReserved) / columnFractionalCount;

		const newGrid = [];
		let rowsRunningYTotal = this.padding;

		for (let i = 0; i < this.gridTemplateRows.length; i++)
		{
			let currentRow = [];

			let rowHeight = null;
			if (this.gridTemplateRows[i].endsWith("fr")) rowHeight = parseInt(this.gridTemplateRows[i]) * rowFraction;
			else rowHeight = parseInt(this.gridTemplateRows[i]);

			let cellPositionY = rowsRunningYTotal;
			rowsRunningYTotal += rowHeight + this.gridGap;
			let columnsRunningXTotal = this.padding;

			for (let j = 0; j < this.gridTemplateColumns.length; j++)
			{
				let columnWidth = null;
				if (this.gridTemplateColumns[j].endsWith("fr")) columnWidth = parseInt(this.gridTemplateColumns[j]) * columnFraction;
				else columnWidth = parseInt(this.gridTemplateColumns[j]);

				let cellPositionX = columnsRunningXTotal;
				columnsRunningXTotal += columnWidth + this.gridGap;

				let worldX = -(this.scaleX * 0.5) + cellPositionX + this.positionX;
				let worldY = -(this.scaleY * 0.5) + cellPositionY + this.positionY;
				let centerX = worldX + (columnWidth * 0.5);
				let centerY = worldY + (rowHeight * 0.5);

				if(this.rotation != 0)
				{
					const newWorldPoints = Utils.rotatePointsAround(worldX, worldY, this.rotation, this.positionX, this.positionY);
					worldX = newWorldPoints[0];
					worldY = newWorldPoints[1];
					const newCenterPoints = Utils.rotatePointsAround(centerX, centerY, this.rotation, this.positionX, this.positionY);
					centerX = newCenterPoints[0];
					centerY = newCenterPoints[1];
				}

				currentRow.push({
					WorldX: worldX,
					WorldY: worldY,
					width: columnWidth,
					height: rowHeight,
					rotation: this.rotation,
					centerX: centerX,
					centerY: centerY
				});
			}
			newGrid.push(currentRow);
		}
		this.grid = newGrid;
		this.dirty = false;
	}

	draw(ctx)
	{
		if (this.dirty) this.updateShape();
			
		super.draw(ctx);

		for(let i = 0; i < this.items.length; i++)
		{
			const item = this.items[i];
			item.object.gridDraw?.(ctx, this.getCell(item.row, item.column));
		}

		if (this.debugCells)
		{
			for (let i = 0; i < this.grid.length; i++)
			{
				const curRow = this.grid[i];

				for (let j = 0; j < curRow.length; j++)
				{
					const curCell = curRow[j];

					ctx.fillStyle = this.cellBackgroundColor;
					ctx.strokeStyle = this.cellBorderColor;
					ctx.lineWidth = this.gridGap;
					ctx.beginPath();
					ctx.rect(curCell.WorldX, curCell.WorldY, curCell.width, curCell.height);
					ctx.fill();
					ctx.stroke();
				}
			}
		}
	}

	update(dt)
	{
		if (this.dirty) this.updateShape();

		for (let i = 0; i < this.items.length; i++)
		{
			const item = this.items[i];
			item.object.gridUpdate?.(dt, this.getCell(item.row, item.column));
		}

		return super.update(dt);
	}

	getCell(row, column)
	{
		return this.grid[row][column];
	}

	gridUpdate(dt, cell)
	{
		if (cell)
		{
			this.positionX = cell.centerX;
			this.positionY = cell.centerY;
			this.scaleX = cell.width;
			this.scaleY = cell.height;
			this.rotation = cell.rotation;
		}
		this.dirty = true;
	}
}