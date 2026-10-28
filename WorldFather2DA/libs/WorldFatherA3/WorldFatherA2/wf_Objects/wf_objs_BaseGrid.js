import { Utils } from "../wf_Utils.js";
import { Empty } from "./wf_objs_Empty.js";
import { GridCell } from "./wf_objs_gridCell.js";

export class BaseGrid extends Empty
{
	constructor(inherited = {})
	{
		super(inherited);

		this.tag = inherited.tag ?? "Grid";

		this.shape = inherited.shape ?? Utils.getShape(4);		
		this.color = inherited.color ?? "transparent";

		this.gridCells = [];
		this.gridRows = inherited.gridRows ?? ["1fr", "1fr"];
		this.gridColumns = inherited.gridColumns ?? ["1fr", "1fr"];
		this.drawCells = inherited.drawCells ?? false;
		this.cellColor = inherited.cellColor ?? "red";
	}

	draw(ctx)
	{
		this.setupCamera(ctx);

		this.getPath(ctx);
		ctx.fillStyle = this.color;
		ctx.fill();
		this.restoreCamera(ctx);

		if(this.drawCells)
		{
			for (let i = 0; i < this.gridCells.length; i++)
			{
				const curRow = this.gridCells[i]

				for (let j = 0; j < curRow.length; j++)
				{
					const curCell = curRow[j];
					curCell.draw(ctx);
				}
			}
		}
	}

	getPath(ctx)
	{
		ctx.beginPath();
		for (let i = 0; i < this.shape.length; i++)
		{
			if (i == 0) ctx.moveTo(this.shape[i][0], this.shape[i][1]);
			ctx.lineTo(this.shape[i][0], this.shape[i][1]);
		}
		ctx.closePath();
	}

	onSetup()
	{
		this.calcGridCells();
	}

	calcGridCells()
	{
		let rowFractionalCount = 0;
		let rowReserved = 0;
		let columnFractionalCount = 0;
		let columnReserved = 0;

		for (let i = 0; i < this.gridRows.length; i++)
		{
			let currentItem = this.gridRows[i];
			if (currentItem.endsWith("fr")) rowFractionalCount += parseInt(currentItem);
			else rowReserved += parseInt(currentItem);
		}

		for (let i = 0; i < this.gridColumns.length; i++)
		{
			let currentItem = this.gridColumns[i];
			if (currentItem.endsWith("fr")) columnFractionalCount += parseInt(currentItem);
			else columnReserved += parseInt(currentItem);
		}

		const rowFraction = (this.scaleY - rowReserved) / rowFractionalCount;
		const columnFraction = (this.scaleX - columnReserved) / columnFractionalCount;

		const newGrid = [];
		let rowsRunningYTotal = -this.scaleY * 0.5;

		for (let i = 0; i < this.gridRows.length; i++)
		{
			let currentRow = [];

			let rowHeight = parseInt(this.gridRows[i]);
			if (this.gridRows[i].endsWith("fr")) rowHeight *= rowFraction;

			let cellPositionY = rowsRunningYTotal + (rowHeight * 0.5);
			rowsRunningYTotal += rowHeight;

			let columnsRunningXTotal = -this.scaleX * 0.5;

			for (let j = 0; j < this.gridColumns.length; j++)
			{
				let columnWidth = parseInt(this.gridColumns[j]);
				if (this.gridColumns[j].endsWith("fr")) columnWidth *= columnFraction;

				let cellPositionX = columnsRunningXTotal + (columnWidth * 0.5);
				columnsRunningXTotal += columnWidth;

				currentRow.push(new GridCell({ scaleX: columnWidth, scaleY: rowHeight, positionX: cellPositionX, positionY: cellPositionY, rotation: this.rotation, parent: this, color: this.cellColor }));
			}
			newGrid.push(currentRow);
		}
		this.gridCells = newGrid;
	}
}