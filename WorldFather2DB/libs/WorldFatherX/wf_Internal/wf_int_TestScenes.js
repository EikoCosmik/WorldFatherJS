import { Scene } from "../wf_Scene.js";
import * as objects from "../wf_Objects.js";

export class TestScene extends Scene
{
	constructor() { super(); }

	onSetup()
	{
		this.wf.addCamera("TestSceneCam");

		this.addObject(new objects.BackButton({
			onClicked: (function (worldCoords, coords, data) { if (data.type == this.clickDetectionType) this.wf.swapScene("demoMenu") }),
		}), { layer: "_foreGround" });

		this.addObject(new objects.TextBox({
			borderColor: "#000077",
			text: "Test Scenes",
			fontSize: 40,
			height: 125,
			width: 500,
			positionY: -this.wf.halfScreenHeight + 62.5 + 25,
		}));

		this.addObject(new objects.Grid({
			width: this.wf.screenWidth,
			height: this.wf.screenHeight - 150,
			positionY: 75,
			gridGap: 25,
			padding: 25,
			gridRows: ["1fr", "1fr", "1fr", "1fr", "1fr"],
			gridColumns: ["1fr", "1fr", "1fr", "1fr", "1fr"],
		}), { name: "menuGrid" });

		this.addObject(new objects.Button({
			borderColor: "#000077",
			useParentSize: true,
			text: "Default Object Test",
			onClicked: (function (worldCoords, coords, data) { if (data.type == this.clickDetectionType) this.wf.addScene("testScene", new DefaultObjectTest()), this.wf.swapScene("testScene"); })
		}), { name: "DefaultObjectTest" });
		this.importantObjects["menuGrid"].getCellReference(0, 0).adoptChild(this.importantObjects["DefaultObjectTest"]);

		this.addObject(new objects.Button({
			borderColor: "#000077",
			useParentSize: true,
			text: "Camera Target & Click Coords",
			onClicked: (function (worldCoords, coords, data) { if (data.type == this.clickDetectionType) this.wf.addScene("testScene", new CameraTargetAndClickCoords()), this.wf.swapScene("testScene"); })
		}), { name: "CameraTargetAndClickCoords" });
		this.importantObjects["menuGrid"].getCellReference(0, 1).adoptChild(this.importantObjects["CameraTargetAndClickCoords"]);

		this.addObject(new objects.Button({
			borderColor: "#000077",
			useParentSize: true,
			text: "Click & Drag",
			onClicked: (function (worldCoords, coords, data) { if (data.type == this.clickDetectionType) this.wf.addScene("testScene", new ClickAndDrag()), this.wf.swapScene("testScene"); })
		}), { name: "ClickAndDrag" });
		this.importantObjects["menuGrid"].getCellReference(0, 2).adoptChild(this.importantObjects["ClickAndDrag"]);

		this.addObject(new objects.Button({
			borderColor: "#000077",
			useParentSize: true,
			text: "Parent Child Testing",
			onClicked: (function (worldCoords, coords, data) { if (data.type == this.clickDetectionType) this.wf.addScene("testScene", new ParentChildTesting()), this.wf.swapScene("testScene"); })
		}), { name: "ParentChildTesting" });
		this.importantObjects["menuGrid"].getCellReference(0, 3).adoptChild(this.importantObjects["ParentChildTesting"]);

		this.addObject(new objects.Button({
			borderColor: "#000077",
			useParentSize: true,
			text: "Basic Collision Detection",
			onClicked: (function (worldCoords, coords, data) { if (data.type == this.clickDetectionType) this.wf.addScene("testScene", new BasicCollisionDetection()), this.wf.swapScene("testScene"); })
		}), { name: "BasicCollisionDetection" });
		this.importantObjects["menuGrid"].getCellReference(0, 4).adoptChild(this.importantObjects["BasicCollisionDetection"]);

		this.addObject(new objects.Button({
			borderColor: "#000077",
			useParentSize: true,
			text: "Clickable Objects",
			onClicked: (function (worldCoords, coords, data) { if (data.type == this.clickDetectionType) this.wf.addScene("testScene", new ClickableObjects()), this.wf.swapScene("testScene"); })
		}), { name: "ClickableObjects" });
		this.importantObjects["menuGrid"].getCellReference(1, 0).adoptChild(this.importantObjects["ClickableObjects"]);

		this.addObject(new objects.Button({
			borderColor: "#000077",
			useParentSize: true,
			text: "Velocity Object",
			onClicked: (function (worldCoords, coords, data) { if (data.type == this.clickDetectionType) this.wf.addScene("testScene", new VelocityObject()), this.wf.swapScene("testScene"); })
		}), { name: "VelocityObject" });
		this.importantObjects["menuGrid"].getCellReference(1, 1).adoptChild(this.importantObjects["VelocityObject"]);

		this.addObject(new objects.Button({
			borderColor: "#000077",
			useParentSize: true,
			text: "Grid & UiTest",
			onClicked: (function (worldCoords, coords, data) { if (data.type == this.clickDetectionType) this.wf.addScene("testScene", new GridAndUiTest()), this.wf.swapScene("testScene"); })
		}), { name: "GridAndUiTest" });
		this.importantObjects["menuGrid"].getCellReference(1, 2).adoptChild(this.importantObjects["GridAndUiTest"]);

		this.addObject(new objects.Button({
			borderColor: "#000077",
			useParentSize: true,
			text: "Progress Bars",
			onClicked: (function (worldCoords, coords, data) { if (data.type == this.clickDetectionType) this.wf.addScene("testScene", new ProgressBars()), this.wf.swapScene("testScene"); })
		}), { name: "ProgressBars" });
		this.importantObjects["menuGrid"].getCellReference(1, 3).adoptChild(this.importantObjects["ProgressBars"]);

		this.addObject(new objects.Button({
			borderColor: "#000077",
			useParentSize: true,
			text: "Edge Detection / Inbounds Test",
			onClicked: (function (worldCoords, coords, data) { if (data.type == this.clickDetectionType) this.wf.addScene("testScene", new EdgeDectection()), this.wf.swapScene("testScene"); })
		}), { name: "EdgeDectection" });
		this.importantObjects["menuGrid"].getCellReference(1, 4).adoptChild(this.importantObjects["EdgeDectection"]);

		this.addObject(new objects.Button({
			borderColor: "#000077",
			useParentSize: true,
			text: "New Cameras",
			onClicked: (function (worldCoords, coords, data) { if (data.type == this.clickDetectionType) this.wf.addScene("testScene", new NewCameras()), this.wf.swapScene("testScene"); })
		}), { name: "NewCameras" });
		this.importantObjects["menuGrid"].getCellReference(2, 0).adoptChild(this.importantObjects["NewCameras"]);
	}

	onSwapTo()
	{
		this.wf.swapCamera("TestSceneCam");
	}
}

export class DefaultObjectTest extends Scene
{
	constructor() { super(); }

	onSetup()
	{
		this.addObject(new objects.BackButton(), { layer: "_foreGround" });

		this.addObject(new objects.DefaultObj({
			useDebug: true,
			debugCenterCross: true,
			debugVerticies: true,
			debugBoundingBox: true,
			debugNormals: true,
		}));
	}
}

export class CameraTargetAndClickCoords extends Scene
{
	constructor() { super(); }

	onSetup()
	{
		this.debugCollisionGrid = true;
		this.debugSceneCenterRings = true;

		this.addObject(new objects.BackButton(), { layer: "_foreGround" });

		this.addObject(new objects.CameraTargetExample({
			debugDefaultConstructor: false
		}), { name: "camTarget" });

		// this.addObject(new objects.DevObj({
		// 	useDebug: true,
		// 	color: "#00000000",
		// 	useWorldData: true,
		// 	useParentChild: true,
		// 	tag: "_CamChildTest"
		// }), { name: "camTarget" });

		this.wf.addCamera("testCameraTargetCam");
		this.wf.cameras["testCameraTargetCam"].useDebug = true;

		//this.importantObjects["camTarget"].adoptChild(this.wf.cameras["testCameraTargetCam"]);
	}

	onSwapTo()
	{
		this.wf.swapCamera("testCameraTargetCam");
	}

	mouseEvent(worldCoords, coords, data = {})
	{
		if (data.type == "up")
		{
			const worldCoords = this.wf.MouseSystem.getWorldCoords(coords);
			this.addObject(new objects.DefaultObj({ positionX: worldCoords.x, positionY: worldCoords.y, color: "#00ff00" }));
		}
	}
}

export class ClickAndDrag extends Scene
{
	constructor() { super(); }

	update(dt)
	{
		const middle = this.layers.default[this.layers.default.length - 1];
		if (middle !== undefined) this.layers.default = [middle];
	}

	onSetup()
	{
		this.wf.addCamera("dragCam");

		this.debugCollisionGrid = true;
		this.debugSceneCenterRings = true;

		this.layers =
		{
			"default": [],
			"survive": []
		}
		this.addObject(new objects.BackButton(), { layer: "survive" });

		this.addObject(new objects.DragObject({
			drawDebug: true,
			debugCenterCross: true,
			scaleX: 1,
			scaleY: 1
		}), { name: "camTarget", layer: "survive" });

		this.wf.cameras["dragCam"].follow(this.importantObjects["camTarget"]);
	}

	mouseEvent(coords, data)
	{
		const worldCoords = this.wf.MouseSystem.getWorldCoords(coords);

		switch (data.type)
		{
			case "move":
				this.addObject(new objects.Default({ isVisible: true, positionX: worldCoords.x, positionY: worldCoords.y, color: "blue" }));
				break;
			case "down":
				this.addObject(new objects.Default({ isVisible: true, positionX: worldCoords.x, positionY: worldCoords.y, color: "red" }));
				break;
			case "up":
				this.addObject(new objects.Default({ isVisible: true, positionX: worldCoords.x, positionY: worldCoords.y, color: "lime" }));
				break;
		}
	}

	onSwapTo()
	{
		this.wf.swapCamera("dragCam");
	}
}

export class ParentChildTesting extends Scene
{
	constructor() { super(); }

	onSetup()
	{
		this.addObject(new objects.BackButton(), { layer: "_foreGround" });

		this.addObject(new objects.CollisionDetectorExample({ positionY: 150 }));
		this.addObject(new objects.CollisionDetectorExample({ positionX: 300 }));

		this.addObject(new objects.MovementExample({
			useDebug: true,
			useWorldData: true,
			useParentChild: true
		}), { name: "parent" });

		this.addObject(new objects.DefaultObj({
			useDebug: true,
			useWorldData: true,
			useParentChild: true,
			useCollision: true,
			color: "purple",
			positionX: 150,
			tag: "_childTest"
		}), { name: "child" });

		////CHILD HERE DOES NOT COLLIDE. as in not being seen or the collision detectors and child are not being checked against

		this.importantObjects["parent"].adoptChild(this.importantObjects["child"]);
	}

	keyEvent(code, action)
	{
		if (action == "down" && code == "KeyQ") this.importantObjects["child"].leaveParent(this.importantObjects["child"].relativeID);
	}
}

export class BasicCollisionDetection extends Scene
{
	constructor() { super(); }

	onSetup()
	{
		this.debugCollisionGrid = true;

		this.addObject(new objects.BackButton(), { layer: "_foreGround" });

		this.addObject(new objects.CollisionDetectorExample({
			positionX: 250,
		}));

		this.addObject(new objects.MovementExample({
			useDebug: true,
			debugCenterCross: true,
			debugVerticies: true,
			debugBoundingBox: true,
			debugNormals: true,
			useWorldData: true,
			useCollision: true,
			positionX: -250
		}));
	}
}

export class ClickableObjects extends Scene
{
	constructor() { super(); }

	onSetup()
	{
		this.addObject(new objects.BackButton(), { layer: "_foreGround" });
		this.addObject(new objects.ClickableExample());
	}
}

export class VelocityObject extends Scene
{
	constructor() { super(); }

	onSetup()
	{
		this.addObject(new objects.BackButton(), { layer: "_foreGround" });
		this.addObject(new objects.VelocityExample({ isVisible: true }), { name: "VelObj" });
	}
}

export class GridAndUiTest extends Scene
{
	constructor() { super(); }

	onSetup()
	{
		this.layers =
		{
			"behind": [],
			"default": [],
			"_foreGround": []
		}
		this.addObject(new objects.BackButton(), { layer: "_foreGround" });

		this.addObject(new objects.DevObj({
			useWorldData: true,
			useParentChild: true
		}), { name: "devObj", layer: "behind" });

		this.addObject(new objects.Grid({
			useWorldData: true,
			useParentChild: true,
			gridColumns: ["1fr", "2fr", "1fr"],
			gridRows: ["1fr", "2fr", "1fr"],
			padding: 25,
			gridGap: 25,
			drawGrid: true,
			drawCells: true
		}), { name: "grid", layer: "behind" });

		this.addObject(new objects.DefaultObj({
			useWorldData: true,
			useParentChild: true,
			useParentSize: true,
			tag: "testing",
			useText: true,
			textOutlineWidth: 10,
			text: "Using the new Default Object, Text and Images are included in one Object",
			useImage: true,
			imagePaddingX: 10,
			imagePaddingY: 10
		}), { name: "object" });

		this.addObject(new objects.TextBox(), { name: "tx1" });
		this.importantObjects["grid"].getCellReference(0, 0).adoptChild(this.importantObjects["tx1"]);
		this.addObject(new objects.TextBox(), { name: "tx2" });
		this.importantObjects["grid"].getCellReference(1, 0).adoptChild(this.importantObjects["tx2"]);
		this.addObject(new objects.TextBox(), { name: "tx3" });
		this.importantObjects["grid"].getCellReference(2, 2).adoptChild(this.importantObjects["tx3"]);
		this.addObject(new objects.TextBox(), { name: "tx4" });
		this.importantObjects["grid"].getCellReference(2, 1).adoptChild(this.importantObjects["tx4"]);

		this.importantObjects["devObj"].adoptChild(this.importantObjects["grid"]);
		this.importantObjects["grid"].getCellReference(1, 1).adoptChild(this.importantObjects["object"]);
	}
}

export class ProgressBars extends Scene
{
	constructor() { super(); }

	onSetup()
	{
		this.addObject(new objects.BackButton(), { layer: "_foreGround" });

		// this.addObject(new objects.DefaultObj({
		// 	color: "Red",
		// 	useWorldData: true,
		// 	useParentChild: true,
		// 	useParentSize: true,
		// }), { name: "testObj" })
		// this.importantObjects["gridTest"].getCellReference(0, 0).adoptChild(this.importantObjects["testObj"]);

		this.addStatBars();
		this.addClickTest();
		this.addStrechedGrid();
		this.addDragTest();

		this.addObject(new objects.StatusBar({
			positionX: -100,
			positionY: 75,
			rotation: 45
		}), { name: "StatusBarR", });

		this.count = 0;
		this.addSubCount = 50;

	}

	addStatBars()
	{
		const groupX = -400;
		const groupY = -150;
		const groupPadding = 75;

		this.addObject(new objects.TextBox({
			text: "Bars no Parent",
			width: 385,
			height: 75,
			positionX: groupX,
			positionY: groupY - groupPadding * 3.25
		}));

		this.addObject(new objects.TextBox({
			text: "isVerticle (F/T)",
			width: 250,
			height: 50,
			positionX: groupX,
			positionY: groupY - groupPadding * 2.25
		}));

		this.addObject(new objects.TextBox({
			text: "isInverted (T/F)",
			width: 250,
			height: 50,
			positionX: groupX - groupPadding * 2.25,
			positionY: groupY,
			rotation: 270
		}));

		this.addObject(new objects.StatusBar({
			isInverted: false,
			isVerticle: false,
			positionX: groupX - groupPadding,
			positionY: groupY - groupPadding
		}), { name: "StatusBar1", });

		this.addObject(new objects.StatusBar({
			isInverted: false,
			isVerticle: true,
			positionX: groupX + groupPadding,
			positionY: groupY - groupPadding
		}), { name: "StatusBar2", });

		this.addObject(new objects.StatusBar({
			isInverted: true,
			isVerticle: false,
			positionX: groupX - groupPadding,
			positionY: groupY + groupPadding
		}), { name: "StatusBar3", });

		this.addObject(new objects.StatusBar({
			isInverted: true,
			isVerticle: true,
			positionX: groupX + groupPadding,
			positionY: groupY + groupPadding
		}), { name: "StatusBar4", });
	}

	addClickTest()
	{
		this.addObject(new objects.Grid({
			gridColumns: ["1fr"],
			gridRows: ["1fr", "1fr", "1fr"],
			gridGap: 25,
			width: 400,
			height: 300,
			positionX: -400,
			positionY: 250
		}), { name: "clickerGrid", layer: "_hindGrid" });

		this.addObject(new objects.TextBox({
			text: "Controled by Button",
		}), { name: "clickText" });
		this.importantObjects["clickerGrid"].getCellReference(0, 0).adoptChild(this.importantObjects["clickText"]);

		this.addObject(new objects.StatusBar({
			useWorldData: true,
			useParentChild: true,
			useParentSize: true,
			isInverted: false,
			isVerticle: false
		}), { name: "StatusBarAS", });
		this.importantObjects["clickerGrid"].getCellReference(1, 0).adoptChild(this.importantObjects["StatusBarAS"]);

		this.addObject(new objects.Grid({
			useParentSize: true,
			gridColumns: ["1fr", "1fr"],
			gridRows: ["1fr"],
			gridGap: 25,
		}), { name: "buttonGrid", layer: "_hindGrid" });
		this.importantObjects["clickerGrid"].getCellReference(2, 0).adoptChild(this.importantObjects["buttonGrid"]);

		this.addObject(new objects.Button({
			useParentSize: true,
			text: "+",
			onClicked: (function (worldCoords, coords, data) { if (data.type == this.clickDetectionType) this.scene.addSubCount = this.scene.addSubCount + 5 })
		}), { name: "Add" });
		this.importantObjects["buttonGrid"].getCellReference(0, 0).adoptChild(this.importantObjects["Add"]);

		this.addObject(new objects.Button({
			useParentSize: true,
			text: "-",
			onClicked: (function (worldCoords, coords, data) { if (data.type == this.clickDetectionType) this.scene.addSubCount = this.scene.addSubCount - 5 })
		}), { name: "Sub" });
		this.importantObjects["buttonGrid"].getCellReference(0, 1).adoptChild(this.importantObjects["Sub"]);
	}

	addStrechedGrid()
	{
		this.addObject(new objects.TextBox({
			text: "Bars In Grid (useParentSize: true)",
			width: 500,
			height: 75,
			positionX: 250,
			positionY: -425,
		}));

		this.addObject(new objects.Grid({
			drawGrid: true,
			drawCells: true,
			gridColumns: ["1fr", "1fr"],
			gridRows: ["1fr", "1fr"],
			gridGap: 100,
			padding: 50,
			width: 800,
			height: 300,
			positionX: 250,
			positionY: -200
		}), { name: "gridB", layer: "_hindGrid" });


		this.addObject(new objects.StatusBar({
			useWorldData: true,
			useParentChild: true,
			useParentSize: true,
			isInverted: false,
			isVerticle: false
		}), { name: "StatusBar1GB", });
		this.importantObjects["gridB"].getCellReference(0, 0).adoptChild(this.importantObjects["StatusBar1GB"]);

		this.addObject(new objects.StatusBar({
			useWorldData: true,
			useParentChild: true,
			useParentSize: true,
			isInverted: false,
			isVerticle: true
		}), { name: "StatusBar2GB", });
		this.importantObjects["gridB"].getCellReference(0, 1).adoptChild(this.importantObjects["StatusBar2GB"]);

		this.addObject(new objects.StatusBar({
			useWorldData: true,
			useParentChild: true,
			useParentSize: true,
			isInverted: true,
			isVerticle: false
		}), { name: "StatusBar3GB", });
		this.importantObjects["gridB"].getCellReference(1, 0).adoptChild(this.importantObjects["StatusBar3GB"]);

		this.addObject(new objects.StatusBar({
			useWorldData: true,
			useParentChild: true,
			useParentSize: true,
			isInverted: true,
			isVerticle: true
		}), { name: "StatusBar4GB", });
		this.importantObjects["gridB"].getCellReference(1, 1).adoptChild(this.importantObjects["StatusBar4GB"]);
	}

	addDragTest()
	{
		const groupX = 250;
		const groupY = 325;

		this.addObject(new objects.TextBox({
			text: "objects.Slider inherits from StatusBar",
			width: 500,
			height: 75,
			positionX: groupX,
			positionY: groupY - 200
		}));

		this.addObject(new objects.TextBox({
			text: "isVerticle (F/T)",
			width: 250,
			height: 50,
			positionX: groupX,
			positionY: groupY - 125
		}));

		this.addObject(new objects.TextBox({
			text: "isInverted (T/F)",
			width: 250,
			height: 50,
			positionX: groupX - 375,
			positionY: groupY,
			rotation: 270
		}));

		this.addObject(new objects.Slider({
			width: 300,
			height: 50,
			isInverted: false,
			isVerticle: false,
			positionX: groupX - 175,
			positionY: groupY - 50
		}), { name: "StatusBarDrag1", });

		this.addObject(new objects.Slider({
			width: 300,
			height: 50,
			isInverted: false,
			isVerticle: true,
			positionX: groupX + 175,
			positionY: groupY - 50
		}), { name: "StatusBarDrag2", });

		this.addObject(new objects.Slider({
			width: 300,
			height: 50,
			isInverted: true,
			isVerticle: false,
			positionX: groupX - 175,
			positionY: groupY + 50
		}), { name: "StatusBarDrag3", });

		this.addObject(new objects.Slider({
			width: 300,
			height: 50,
			isInverted: true,
			isVerticle: true,
			positionX: groupX + 175,
			positionY: groupY + 50
		}), { name: "StatusBarDrag4", });
	}

	update()
	{
		this.count = (this.count + 1) % 101;

		this.importantObjects["StatusBar1"].updateStat(this.count);
		this.importantObjects["StatusBar2"].updateStat(this.count);
		this.importantObjects["StatusBar3"].updateStat(this.count);
		this.importantObjects["StatusBar4"].updateStat(this.count);
		this.importantObjects["StatusBar1GB"].updateStat(this.count);
		this.importantObjects["StatusBar2GB"].updateStat(this.count);
		this.importantObjects["StatusBar3GB"].updateStat(this.count);
		this.importantObjects["StatusBar4GB"].updateStat(this.count);

		this.importantObjects["StatusBarAS"].updateStat(this.addSubCount);

		this.importantObjects["StatusBarR"].updateStat(this.count);
	}
}

export class EdgeDectection extends Scene
{
	constructor() { super(); }

	onSetup()
	{
		this.addObject(new objects.BackButton(), { layer: "_foreGround" });

		this.addObject(new objects.Grid({
			width: this.wf.screenWidth,
			height: this.wf.screenHeight - 75,
			positionY: 37.5,
			padding: 25,
			gridGap: 25,
			gridColumns: ["400", "1fr"],
			gridRows: ["1fr"],
		}), { name: "grid" });

		const gridCell01 = this.importantObjects["grid"].getCellReference(0, 1);

		this.addObject(new objects.TextBox({
			textPadding: 25
		}), { name: "output" });
		this.importantObjects["grid"].getCellReference(0, 0).adoptChild(this.importantObjects["output"]);

		this.addObject(new objects.DefaultObj({
			useWorldData: true,
			useDebug: true,
			positionX: gridCell01.positionX,
			rotation: 35,
			width: 400,
			height: 400
		}), { name: "inboundsDetector" });
	}

	update(dt)
	{
		const idObj = this.importantObjects["inboundsDetector"];

		let outString = `New Utils.isInsidePolygon(obj,x,y) can determine if a point is inside an object. Essentially, lighter collision detection for basic interatction, no more mouse collision!\n\n`
		const idVerts = idObj.verticies;
		outString += `Verts:\n`;
		for (let i = 0; i < idVerts.length; i++)
		{
			outString += `${idVerts[i][0].toFixed(2)} : ${idVerts[i][1].toFixed(2)}\n`;
		}

		const worldCoords = this.wf.MouseSystem.getWorldCoords(this.wf.MouseSystem.rawMove);
		outString += `\nWorld Mouse:\n`;
		outString += `${worldCoords.x.toFixed(2)} : ${worldCoords.y.toFixed(2)}\n`;

		const inX = this.wf.Utils.isWithinRange(worldCoords.x, idObj.positionX - idObj.halfWidth, idObj.positionX + idObj.halfWidth);
		const inY = this.wf.Utils.isWithinRange(worldCoords.y, idObj.positionY - idObj.halfHeight, idObj.positionY + idObj.halfHeight);
		const inFlat = inX && inY;
		outString += `\nFlat Inbounds:\n`;
		outString += `in X: ${inX}\n`;
		outString += `in Y: ${inY}\n`;
		outString += `in Both: ${inFlat}\n`;

		const isInsideUtilsTest = this.wf.Utils.isInsidePolygon(idObj, worldCoords.x, worldCoords.y);
		outString += `\nUtils.isInsidePolygon():\n`;
		outString += `${isInsideUtilsTest}\n`;


		this.importantObjects["output"].text = outString;
	}

	draw(ctx)
	{
		const idObj = this.importantObjects["inboundsDetector"];
		const zoneExaduration = 1000;
		ctx.fillStyle = "purple";
		ctx.beginPath();
		ctx.moveTo(idObj.positionX - idObj.halfWidth, idObj.positionY - zoneExaduration);
		ctx.lineTo(idObj.positionX + idObj.halfWidth, idObj.positionY - zoneExaduration);
		ctx.lineTo(idObj.positionX + idObj.halfWidth, idObj.positionY + zoneExaduration);
		ctx.lineTo(idObj.positionX - idObj.halfWidth, idObj.positionY + zoneExaduration);
		ctx.closePath();
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(idObj.positionX - zoneExaduration, idObj.positionY - idObj.halfHeight);
		ctx.lineTo(idObj.positionX + zoneExaduration, idObj.positionY - idObj.halfHeight);
		ctx.lineTo(idObj.positionX + zoneExaduration, idObj.positionY + idObj.halfHeight);
		ctx.lineTo(idObj.positionX - zoneExaduration, idObj.positionY + idObj.halfHeight);
		ctx.closePath();
		ctx.fill();

		ctx.fillStyle = "yellow";
		ctx.beginPath();
		ctx.moveTo(idObj.positionX - idObj.halfWidth, idObj.positionY - idObj.halfHeight);
		ctx.lineTo(idObj.positionX + idObj.halfWidth, idObj.positionY - idObj.halfHeight);
		ctx.lineTo(idObj.positionX + idObj.halfWidth, idObj.positionY + idObj.halfHeight);
		ctx.lineTo(idObj.positionX - idObj.halfWidth, idObj.positionY + idObj.halfHeight);
		ctx.closePath();
		ctx.fill();
	}
}

export class NewCameras extends Scene
{
	constructor() { super(); }

	onSetup()
	{
		this.wf.addCamera("NewCamerasCam");
		this.wf.cameras["NewCamerasCam"].useDebug = true;
		// this.addObject(new objects.BackButton(), { layer: "_foreGround" });
		this.addObject(new objects.DevObj({
			useDebug: true,
			color: "#00000000",
			useWorldData: true,
			useParentChild: true,
			tag: "_CamChildTest"
		}), { name: "devObj" });
		this.importantObjects["devObj"].adoptChild(this.wf.cameras["NewCamerasCam"]);

		this.addObject(new objects.DefaultObj({
		}), { name: "stuckObject" });
	}

	onSwapTo()
	{
		this.wf.swapCamera("NewCamerasCam");
	}
}