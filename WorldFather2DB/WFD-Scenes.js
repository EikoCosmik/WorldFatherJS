import * as objects from "./libs/WorldFatherX/wf_Objects.js"
import { Scene } from "./libs/WorldFatherX/wf_Scene.js";
import { TestScene } from "./libs/WorldFatherX/wf_Internal/wf_int_TestScenes.js";
import { ExampleScene } from "./libs/WorldFatherX/wf_Internal/wf_int_ExampleScenes.js";

export class worldFather2DXDemo extends Scene
{
	constructor() { super(); }

	onSetup()
	{
		this.addObject(new objects.Grid({
			drawGrid:true,
			drawCells:true,
			width: this.wf.screenWidth,
			height: this.wf.screenHeight,
			padding: 25,
			gridGap: 25,
			gridColumns: ["75", "4fr", "75"],
			gridRows: ["75", "175", "1fr", "75"],
		}), { name: "sceneGrid", layer: "_hindGrid" });

		this.generateTitle();
		this.generateMenu();

		this.addObject(new objects.Button({
			useParentSize: true,
			useImage: true,
			useText: false,
			borderWidth: 10,
			paddingX: 5,
			paddingY: 5,
			imageSrc: "./libs/worldFatherX/wf_Internal/LogoWhite.png",
			imagePaddingX: 10,
			imagePaddingY: 10
		}), { name: "UnsetTestObj1" });
		this.importantObjects["sceneGrid"].getCellReference(3, 0).adoptChild(this.importantObjects["UnsetTestObj1"]);

		this.addObject(new objects.Button({
			useParentSize: true,
			useImage: true,
			useText: false,
			borderWidth: 10,
			paddingX: 5,
			paddingY: 5,
			imageSrc: "./libs/worldFatherX/wf_Internal/LogoWhite.png",
			imagePaddingX: 10,
			imagePaddingY: 10
		}), { name: "UnsetTestObj2" });
		this.importantObjects["sceneGrid"].getCellReference(3, 2).adoptChild(this.importantObjects["UnsetTestObj2"]);
	}

	generateTitle()
	{
		this.addObject(new objects.Grid({
			gridColumns: ["175", "4fr", "175"],
			gridRows: ["1fr"],
			gridGap: 25,
			useParentSize: true
		}), { name: "titleGrid" });
		this.importantObjects["sceneGrid"].getCellReference(1, 1).adoptChild(this.importantObjects["titleGrid"]);

		this.addObject(new objects.TextBox({
			text: "-   WorldFather2D Demo   -",
			fontSize: 40,
		}), { name: "title" });
		this.importantObjects["titleGrid"].getCellReference(0, 1).adoptChild(this.importantObjects["title"]);

		this.addObject(new objects.DefaultObj({
			useParentChild: true,
			useWorldData: true,
			useParentSize: true,
			useImage: true,
			disableDraw: true,
			imageSrc: "./libs/worldFatherX/wf_Internal/LogoWhite_Large.png",
			imagePaddingX: 25,
			imagePaddingY: 25
		}), { name: "leftTitleImage" });
		this.importantObjects["titleGrid"].getCellReference(0, 0).adoptChild(this.importantObjects["leftTitleImage"]);

		this.addObject(new objects.DefaultObj({
			useParentChild: true,
			useWorldData: true,
			useParentSize: true,
			useImage: true,
			disableDraw: true,
			imageSrc: "./libs/worldFatherX/wf_Internal/LogoWhite_Large.png",
			imagePaddingX: 25,
			imagePaddingY: 25
		}), { name: "rightTitleImage" });
		this.importantObjects["titleGrid"].getCellReference(0, 2).adoptChild(this.importantObjects["rightTitleImage"]);
	}

	generateMenu()
	{
		const buttonHeight = 125;

		this.addObject(new objects.Grid({
			useParentSize: true,
			gridGap: 25,
			padding: 25,
			gridColumns: ["150", "1fr", "1fr", "150"],
			gridRows: [buttonHeight, "1fr"],
		}), { name: "menuGrid", layer: "_hindGrid" });
		this.importantObjects["sceneGrid"].getCellReference(2, 1).adoptChild(this.importantObjects["menuGrid"]);

		this.addObject(new objects.Button({
			borderColor: "#000077",
			useParentSize: true,
			text: "Test Scenes",
			onClicked: (function (worldCoords, coords, data) { if (data.type == this.clickDetectionType) this.wf.addScene("testScene", new TestScene()), this.wf.swapScene("testScene"); })
		}), { name: "TestScenes", clickable: true });
		this.importantObjects["menuGrid"].getCellReference(0, 1).adoptChild(this.importantObjects["TestScenes"]);

		this.addObject(new objects.Button({
			borderColor: "#007700",
			useParentSize: true,
			text: "Example Scenes",
			onClicked: (function (worldCoords, coords, data) { if (data.type == this.clickDetectionType) this.wf.addScene("exampleScene", new ExampleScene()), this.wf.swapScene("exampleScene"); })
		}), { name: "ExampleScenes" });
		this.importantObjects["menuGrid"].getCellReference(0, 2).adoptChild(this.importantObjects["ExampleScenes"]);
	}
}