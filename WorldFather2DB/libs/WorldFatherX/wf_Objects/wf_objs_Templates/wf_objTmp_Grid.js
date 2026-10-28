import { DefaultObj } from "../wf_objs_DefaultObject/wf_objs_DefaultObj.js";

export class Grid extends DefaultObj
{
	constructor(inherited = {}) { super(inherited); }

	onSetup()
	{
		this.tag = this.overrides.tag ?? "_Grid";
		this.color = this.overrides.color ?? "#ff000055";
		this.width = this.overrides.width ?? 1000;
		this.height = this.overrides.height ?? 1000;

		this.cellColor = this.overrides.cellColor ?? "#00ff0055";
		this.drawGrid = this.overrides.drawGrid ?? false;
		this.drawCells = this.overrides.drawCells ?? false;

		this.gridCells = [];
		this.gridRows = this.overrides.gridRows ?? ["1fr", "1fr"];
		this.gridColumns = this.overrides.gridColumns ?? ["1fr", "1fr"];

		this.padding = this.overrides.padding ?? 0;
		this.gridGap = this.overrides.gridGap ?? 0;

		this._modules["useWorldData"].using = true;
		this._modules["useParentChild"].using = true;
		this.dirtyData = true;
	}

	draw(ctx)
	{
		if(this.drawGrid)
		{
			ctx.fillStyle = this.color;
			this.getPath(ctx);
			ctx.fill();
		}

		if (this.drawCells)
		{
			ctx.save();
			this._resetCamera(ctx);

			for (let i = 0; i < this.gridCells.length; i++)
			{
				const currentRow = this.gridCells[i];

				for (let j = 0; j < currentRow.length; j++)
				{
					const currentCell = currentRow[j];
					currentCell._draw(ctx);
				}
			}

			ctx.restore();
		}
	}
	
	onUpdateWorldData()
	{
		this.calcGridCells();

		for (let i = 0; i < this.gridCells.length; i++)
		{
			const currentRow = this.gridCells[i];

			for (let j = 0; j < currentRow.length; j++)
			{
				const currentCell = currentRow[j];
				currentCell._updateWorldData();
			}
		}
	}

	getCellReference(row, collumn)
	{debugger
		if (this.dirtyData) this._updateWorldData();
		return this.gridCells[row][collumn];
	}

	calcGridCells()
	{
		let rowFractionalCount = 0;
		let rowReserved = 0;
		let columnFractionalCount = 0;
		let columnReserved = 0;

		const reservedPadding = this.padding * 2;
		const reservedHeightGap = this.gridGap * (this.gridRows.length - 1);
		const reservedWidthGap = this.gridGap * (this.gridColumns.length - 1);
		const actualHeight = (this.height - reservedHeightGap - reservedPadding);
		const actualWidth = (this.width - reservedWidthGap - reservedPadding);

		for (let i = 0; i < this.gridRows.length; i++)
		{
			let currentItem = this.gridRows[i];
			if (typeof currentItem !== "string")
			{
				this.gridRows[i] = `${currentItem}`;
				currentItem = `${currentItem}`;
			}
			if (currentItem.endsWith("fr")) rowFractionalCount += parseInt(currentItem);
			else if (currentItem.endsWith("%")) rowReserved += actualHeight * (parseInt(currentItem) * 0.01);
			else rowReserved += parseInt(currentItem);
		}

		for (let i = 0; i < this.gridColumns.length; i++)
		{
			let currentItem = this.gridColumns[i];
			if (typeof currentItem !== "string")
			{
				this.gridColumns[i] = `${currentItem}`;
				currentItem = `${currentItem}`;
			}
			if (currentItem.endsWith("fr")) columnFractionalCount += parseInt(currentItem);
			else if (currentItem.endsWith("%")) columnReserved += actualWidth * (parseInt(currentItem) * 0.01);
			else columnReserved += parseInt(currentItem);
		}

		const rowFraction = (actualHeight - rowReserved) / rowFractionalCount;
		const columnFraction = (actualWidth - columnReserved) / columnFractionalCount;

		const newGrid = [];
		let rowsRunningYTotal = -this.height * 0.5 + this.padding;

		for (let i = 0; i < this.gridRows.length; i++)
		{
			let currentRow = [];

			let rowHeight = parseInt(this.gridRows[i]);
			if (this.gridRows[i].endsWith("fr")) rowHeight *= rowFraction;
			else if (this.gridRows[i].endsWith("%")) rowHeight *= (0.01 * actualHeight);

			let cellPositionY = rowsRunningYTotal + (rowHeight * 0.5);
			rowsRunningYTotal += rowHeight + this.gridGap;

			let columnsRunningXTotal = -this.width * 0.5 + this.padding;

			for (let j = 0; j < this.gridColumns.length; j++)
			{
				let columnWidth = parseInt(this.gridColumns[j]);
				if (this.gridColumns[j].endsWith("fr")) columnWidth *= columnFraction;
				else if (this.gridColumns[j].endsWith("%")) columnWidth *= (0.01 * actualWidth);

				let cellPositionX = columnsRunningXTotal + (columnWidth * 0.5);
				columnsRunningXTotal += columnWidth + this.gridGap;

				if (this.gridCells[i] && this.gridCells[i][j])
				{
					const oldCell = this.gridCells[i][j];
					oldCell.width = columnWidth;
					oldCell.height = rowHeight;
					oldCell.positionX = cellPositionX;
					oldCell.positionY = cellPositionY;
					oldCell.parent = this;
					oldCell.color = this.cellColor;
					currentRow.push(oldCell);
				}
				else
				{
					const newCell = new GridCell({width: columnWidth, height: rowHeight, positionX: cellPositionX, positionY: cellPositionY, parent: this, color: this.cellColor });
					newCell.wf = this.wf;
					newCell._initialise();
					currentRow.push(newCell);
				}

			}
			newGrid.push(currentRow);
		}
		this.gridCells = newGrid;
	}
}

class GridCell extends DefaultObj
{
	constructor(inherited = {})
	{
		super(inherited);
	}

	onSetup()
	{
		this.tag = this.overrides.tag ?? "_GridCell";
		this.useWorldData = true;
		this.useParentChild = true;
	}
}