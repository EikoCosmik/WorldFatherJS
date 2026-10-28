import { conwaysGameOfLife } from "./wf_int_ExampleScenes/wf_intExs_conwaysGameOfLife.js";
import { snake } from "./wf_int_ExampleScenes/wf_intExs_snake.js";
import { Scene } from "../wf_Scene.js";
import * as objects from "../wf_Objects.js";

export class ExampleScene extends Scene
{
	constructor() { super(); }

	onSetup()
	{
		this.addObject(new objects.BackButton({
			onClicked: (function (worldCoords, coords, data) { if (data.type == this.clickDetectionType) this.wf.swapScene("demoMenu") }),
		}), { layer: "_foreGround" });

		this.addObject(new objects.TextBox({
			borderColor: "#007700",
			text: "Example Scenes",
			fontSize: 40,
			height: 125,
			width: 500,
			positionY: -this.wf.halfScreenHeight + 62.5 + 25,
		}));

		this.addObject(new objects.Grid({
			//drawGrid: true,
			width: this.wf.screenWidth,
			height: this.wf.screenHeight - 150,
			positionY: 75,
			gridGap: 25,
			padding: 25,
			gridRows: ["1fr", "1fr", "1fr", "1fr", "1fr"],
			gridColumns: ["1fr", "1fr", "1fr", "1fr", "1fr"],
		}), { name: "menuGrid" });

		this.addObject(new objects.Button({
			borderColor: "#007700",
			backgroundColor: "red",
			useParentSize: true,
			text: "Conways Game Of Life",
			onClicked: (function (worldCoords, coords, data) { if (data.type == this.clickDetectionType) this.wf.addScene("exampleScene", new conwaysGameOfLife()), this.wf.swapScene("exampleScene"); })
		}), { name: "conwaysGame" });
		this.importantObjects["menuGrid"].getCellReference(0, 0).adoptChild(this.importantObjects["conwaysGame"]);

		this.addObject(new objects.Button({
			borderColor: "#007700",
			useParentSize: true,
			text: "Snake",
			onClicked: (function (worldCoords, coords, data) { if (data.type == this.clickDetectionType) this.wf.addScene("exampleScene", new snake()), this.wf.swapScene("exampleScene"); })
		}), { name: "snake" });
		this.importantObjects["menuGrid"].getCellReference(0, 1).adoptChild(this.importantObjects["snake"]);
	}

	onSwapTo()
	{
		this.wf.swapCamera("Default");
	}
}