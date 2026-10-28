import { Scene } from "./libs/WorldFatherAX/wf_Scene.js";
import { Utils } from "./libs/WorldFatherAX/wf_Utils.js";
import { WFD } from "./WFD-Scenes.js";
import * as objects from "./libs/WorldFatherAX/wf_Objects.js";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///// TestScenes Menu ////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class TestScenesMenu extends Scene
{
	constructor()
	{
		super();
		this.backgroundColor = "black";
	}

	onSetup()
	{
		this.addObject(new objects.DivObject({
			backgroundColor: "#0a0a0a",
			borderColor: "#9a2121",
			borderWidth: 10,
			borderRadius: 15,
			canCollide: true,
			width: 75,
			height: 50,
			positionY: -this.engine.halfScreenHeight + 50,
			positionX: -this.engine.halfScreenWidth + 75
		}), { name: "return", layer: "ui1" });

		this.addObject(new objects.TextObject({
			text: "Back",
			fontSize: 15
		}), { name: "backButtonText", layer: "ui2"});		
		this.importantObjs["return"].adoptChild(this.importantObjs["backButtonText"])

		this.importantObjs["return"].onClicked = () =>
		{
			if (!this.engine.scenes["WFD"]) this.engine.addScene("WFD", new WFD()); 
			this.engine.swapScene("WFD");
		}
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		this.addObject(new objects.Grid({
			gridColumns: ["1fr", "1fr", "1fr", "1fr"],
			gridRows: ["1fr", "1fr", "1fr"],
			width: this.engine.fullScreenWidth - 50,
			height: 375,
			gridGap: 25
		}), { layer: "grids", name: "menuGrid" });

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		this.addObject(new objects.DivObject({ useParentSize: true, backgroundColor: "#0a0a0a", borderColor: "#21219a", borderWidth: 10, borderRadius: 15, canCollide: true }), 
		{ name: "ObjectTestButton", layer: "ui1" });

		this.addObject(new objects.TextObject({ text: "ObjectTest" }), 
		{ name: "ObjectTestButtonText", layer: "ui2"});

		this.importantObjs["ObjectTestButton"].onClicked = () =>
		{
			if (!this.engine.scenes["ObjectTest"]) this.engine.addScene("ObjectTest", new ObjectTest()); 
			this.engine.swapScene("ObjectTest");
		}

		this.importantObjs["menuGrid"].getCellReference(0, 0).adoptChild(this.importantObjs["ObjectTestButton"]);
		this.importantObjs["ObjectTestButton"].adoptChild(this.importantObjs["ObjectTestButtonText"])
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		this.addObject(new objects.DivObject({ useParentSize: true, backgroundColor: "#0a0a0a", borderColor: "#21219a", borderWidth: 10, borderRadius: 15, canCollide: true }), 
		{ name: "GridTestButton", layer: "ui1" });

		this.addObject(new objects.TextObject({ text: "GridTest" }), 
		{ name: "GridTestButtonText", layer: "ui2"});

		this.importantObjs["GridTestButton"].onClicked = () =>
		{
			if (!this.engine.scenes["GridTest"]) this.engine.addScene("GridTest", new GridTest()); 
			this.engine.swapScene("GridTest");
		}

		this.importantObjs["menuGrid"].getCellReference(0, 1).adoptChild(this.importantObjs["GridTestButton"]);
		this.importantObjs["GridTestButton"].adoptChild(this.importantObjs["GridTestButtonText"])
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		this.addObject(new objects.DivObject({ useParentSize: true, backgroundColor: "#0a0a0a", borderColor: "#21219a", borderWidth: 10, borderRadius: 15, canCollide: true }), 
		{ name: "UiTestButton", layer: "ui1" });

		this.addObject(new objects.TextObject({ text: "UiTest" }), 
		{ name: "UiTestButtonText", layer: "ui2"});

		this.importantObjs["UiTestButton"].onClicked = () =>
		{
			if (!this.engine.scenes["UiTest"]) this.engine.addScene("UiTest", new UiTest()); 
			this.engine.swapScene("UiTest");
		}

		this.importantObjs["menuGrid"].getCellReference(0, 2).adoptChild(this.importantObjs["UiTestButton"]);
		this.importantObjs["UiTestButton"].adoptChild(this.importantObjs["UiTestButtonText"])
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		this.addObject(new objects.DivObject({ useParentSize: true, backgroundColor: "#0a0a0a", borderColor: "#21219a", borderWidth: 10, borderRadius: 15, canCollide: true }), 
		{ name: "UiSubGridTestButton", layer: "ui1" });

		this.addObject(new objects.TextObject({ text: "UiSubGridTest" }), 
		{ name: "UiSubGridTestButtonText", layer: "ui2"});

		this.importantObjs["UiSubGridTestButton"].onClicked = () =>
		{
			if (!this.engine.scenes["UiSubGridTest"]) this.engine.addScene("UiSubGridTest", new UiSubGridTest()); 
			this.engine.swapScene("UiSubGridTest");
		}

		this.importantObjs["menuGrid"].getCellReference(0, 3).adoptChild(this.importantObjs["UiSubGridTestButton"]);
		this.importantObjs["UiSubGridTestButton"].adoptChild(this.importantObjs["UiSubGridTestButtonText"])
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		this.addObject(new objects.DivObject({ useParentSize: true, backgroundColor: "#0a0a0a", borderColor: "#21219a", borderWidth: 10, borderRadius: 15, canCollide: true }), 
		{ name: "SpiralTestButton", layer: "ui1" });

		this.addObject(new objects.TextObject({ text: "SpiralTest" }), 
		{ name: "SpiralTestButtonText", layer: "ui2"});

		this.importantObjs["SpiralTestButton"].onClicked = () =>
		{
			if (!this.engine.scenes["SpiralTest"]) this.engine.addScene("SpiralTest", new SpiralTest()); 
			this.engine.swapScene("SpiralTest");
		}

		this.importantObjs["menuGrid"].getCellReference(1, 0).adoptChild(this.importantObjs["SpiralTestButton"]);
		this.importantObjs["SpiralTestButton"].adoptChild(this.importantObjs["SpiralTestButtonText"])
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		this.addObject(new objects.DivObject({ useParentSize: true, backgroundColor: "#0a0a0a", borderColor: "#21219a", borderWidth: 10, borderRadius: 15, canCollide: true }), 
		{ name: "CollisionTestButton", layer: "ui1" });

		this.addObject(new objects.TextObject({ text: "CollisionTest" }), 
		{ name: "CollisionTestButtonText", layer: "ui2"});

		this.importantObjs["CollisionTestButton"].onClicked = () =>
		{
			if (!this.engine.scenes["CollisionTest"]) this.engine.addScene("CollisionTest", new CollisionTest()); 
			this.engine.swapScene("CollisionTest");
		}

		this.importantObjs["menuGrid"].getCellReference(1, 1).adoptChild(this.importantObjs["CollisionTestButton"]);
		this.importantObjs["CollisionTestButton"].adoptChild(this.importantObjs["CollisionTestButtonText"])
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		this.addObject(new objects.DivObject({ useParentSize: true, backgroundColor: "#0a0a0a", borderColor: "#21219a", borderWidth: 10, borderRadius: 15, canCollide: true }), 
		{ name: "ChildCollisionTestButton", layer: "ui1" });

		this.addObject(new objects.TextObject({ text: "ChildCollisionTest" }), 
		{ name: "ChildCollisionTestButtonText", layer: "ui2"});

		this.importantObjs["ChildCollisionTestButton"].onClicked = () =>
		{
			if (!this.engine.scenes["ChildCollisionTest"]) this.engine.addScene("ChildCollisionTest", new ChildCollisionTest()); 
			this.engine.swapScene("ChildCollisionTest");
		}

		this.importantObjs["menuGrid"].getCellReference(1, 2).adoptChild(this.importantObjs["ChildCollisionTestButton"]);
		this.importantObjs["ChildCollisionTestButton"].adoptChild(this.importantObjs["ChildCollisionTestButtonText"])
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		this.addObject(new objects.DivObject({ useParentSize: true, backgroundColor: "#0a0a0a", borderColor: "#21219a", borderWidth: 10, borderRadius: 15, canCollide: true }), 
		{ name: "ParentReferenceButton", layer: "ui1" });

		this.addObject(new objects.TextObject({ text: "ParentReference" }), 
		{ name: "ParentReferenceButtonText", layer: "ui2"});

		this.importantObjs["ParentReferenceButton"].onClicked = () =>
		{
			if (!this.engine.scenes["ParentReference"]) this.engine.addScene("ParentReference", new ParentReference()); 
			this.engine.swapScene("ParentReference");
		}

		this.importantObjs["menuGrid"].getCellReference(1, 3).adoptChild(this.importantObjs["ParentReferenceButton"]);
		this.importantObjs["ParentReferenceButton"].adoptChild(this.importantObjs["ParentReferenceButtonText"])
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		this.addObject(new objects.DivObject({ useParentSize: true, backgroundColor: "#0a0a0a", borderColor: "#21219a", borderWidth: 10, borderRadius: 15, canCollide: true }), 
		{ name: "TextTestButton", layer: "ui1" });

		this.addObject(new objects.TextObject({ text: "TextTest" }), 
		{ name: "TextTestButtonText", layer: "ui2"});

		this.importantObjs["TextTestButton"].onClicked = () =>
		{
			if (!this.engine.scenes["TextTest"]) this.engine.addScene("TextTest", new TextTest()); 
			this.engine.swapScene("TextTest");
		}

		this.importantObjs["menuGrid"].getCellReference(2, 0).adoptChild(this.importantObjs["TextTestButton"]);
		this.importantObjs["TextTestButton"].adoptChild(this.importantObjs["TextTestButtonText"])
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///// Object Test ////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class ObjectTest extends Scene
{
	constructor()
	{
		super();
		this.backgroundColor = "black";
	}

	onSetup()
	{
		this.addObject(new objects.DivObject({
			backgroundColor: "#0a0a0a",
			borderColor: "#9a2121",
			borderWidth: 10,
			borderRadius: 15,
			canCollide: true,
			width: 75,
			height: 50,
			positionY: -this.engine.halfScreenHeight + 50,
			positionX: -this.engine.halfScreenWidth + 75
		}), { name: "return", layer: "ui1" });

		this.addObject(new objects.TextObject({
			text: "Back",
			fontSize: 15
		}), { name: "backButtonText", layer: "ui2"});		
		this.importantObjs["return"].adoptChild(this.importantObjs["backButtonText"])

		this.importantObjs["return"].onClicked = () =>
		{
			if (!this.engine.scenes["TestScenesMenu"]) this.engine.addScene("TestScenesMenu", new TestScenesMenu()); 
			this.engine.swapScene("TestScenesMenu");
		}
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		this.addObject(new objects.Empty({
			dDraw: true,
			ddCross: true,
			positionX: -250
		}));
		this.addObject(new objects.Solid({
			dDraw: true,
			ddCross: true
		}));
		this.addObject(new objects.Dynamic({
			dDraw: true,
			ddCross: true,
			ddVerticies: true,
			ddBoundingBox: true,
			ddNormals: true,
			positionX: 250
		}));
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///// Grid Test //////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class GridTest extends Scene
{
	constructor()
	{
		super();
		this.backgroundColor = "black";
	}

	onSetup()
	{
		this.addObject(new objects.DivObject({
			backgroundColor: "#0a0a0a",
			borderColor: "#9a2121",
			borderWidth: 10,
			borderRadius: 15,
			canCollide: true,
			width: 75,
			height: 50,
			positionY: -this.engine.halfScreenHeight + 50,
			positionX: -this.engine.halfScreenWidth + 75
		}), { name: "return", layer: "ui1" });

		this.addObject(new objects.TextObject({
			text: "Back",
			fontSize: 15
		}), { name: "backButtonText", layer: "ui2"});		
		this.importantObjs["return"].adoptChild(this.importantObjs["backButtonText"])

		this.importantObjs["return"].onClicked = () =>
		{
			if (!this.engine.scenes["TestScenesMenu"]) this.engine.addScene("TestScenesMenu", new TestScenesMenu()); 
			this.engine.swapScene("TestScenesMenu");
		}
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
		this.addObject(new objects.DevObj({ width: 50, height: 50, dDraw: true, ddCross: true }), {name: "DevObj"});

		this.addObject(new objects.Grid({
			drawCells: true,
			drawGrid: true,
			color: "#ff000055",
			gridGap: 50
		}), { layer: "grids", name: "menuGrid" });
		this.importantObjs["DevObj"].adoptChild(this.importantObjs["menuGrid"]);

		this.addObject(new objects.Dynamic({
			dDraw: true,
			ddCross: true,
			ddVerticies: true,
			ddBoundingBox: true,
			ddNormals: true,
			positionX: 0,
			useParentSize: true
		}), { name: "solidChildTest" });
		this.importantObjs["menuGrid"].getCellReference(0, 0).adoptChild(this.importantObjs["solidChildTest"]);

		this.addObject(new objects.DivObject({
			dDraw: true,
			ddCross: true,
			ddVerticies: true,
			ddBoundingBox: true,
			ddNormals: true,
			useParentSize: true,
			backgroundColor: "#0a0a0a",
			borderColor: "#9a2121",
			borderWidth: 10,
			borderRadius: 15,
		}), { name: "testDiv" });
		this.importantObjs["menuGrid"].getCellReference(1, 1).adoptChild(this.importantObjs["testDiv"]);
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///// Ui Test ////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class UiTest extends Scene
{
	constructor()
	{
		super();
		this.backgroundColor = "black";
	}

	onSetup()
	{
		this.addObject(new objects.DivObject({
			backgroundColor: "#0a0a0a",
			borderColor: "#9a2121",
			borderWidth: 10,
			borderRadius: 15,
			canCollide: true,
			width: 75,
			height: 50,
			positionY: -this.engine.halfScreenHeight + 50,
			positionX: -this.engine.halfScreenWidth + 75
		}), { name: "return", layer: "ui1" });

		this.addObject(new objects.TextObject({
			text: "Back",
			fontSize: 15
		}), { name: "backButtonText", layer: "ui2"});		
		this.importantObjs["return"].adoptChild(this.importantObjs["backButtonText"])

		this.importantObjs["return"].onClicked = () =>
		{
			if (!this.engine.scenes["TestScenesMenu"]) this.engine.addScene("TestScenesMenu", new TestScenesMenu()); 
			this.engine.swapScene("TestScenesMenu");
		}
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		this.addObject(new objects.DevObj({ width: 50, height: 50, dDraw: true, ddCross: true }), {name: "DevObj"});

		this.addObject(new objects.Grid({
			drawCells: true,
			color: "#ff000055",
			cellColor: "#00ff0055",
			gridColumns: ["1fr", "250", "125", "500"],
			gridRows: ["1fr", "1fr", "1fr", "1fr"],
			width: this.engine.fullScreenWidth - 50,
			height: 1030,
			gridGap: 15
		}), { layer: "grids", name: "menuGrid" });
		this.importantObjs["DevObj"].adoptChild(this.importantObjs["menuGrid"]);

		//Titles
		this.addObject(new objects.DivObject({
			useParentSize: true,
			backgroundColor: "#0a0a0a",
			borderColor: "#9a2121",
			borderWidth: 10,
			borderRadius: 15,
		}), { name: "titleText1" });
		this.importantObjs["menuGrid"].getCellReference(0, 0).adoptChild(this.importantObjs["titleText1"]);
		this.addObject(new objects.TextObject({	text: `ContentType = "Text"\nText: String\n\nDoes not auto size the text.\nUse fontSize: Float`	}),
		{ name: "titleText1Text", layer: "ui2"});		
		this.importantObjs["titleText1"].adoptChild(this.importantObjs["titleText1Text"]);

		this.addObject(new objects.DivObject({
			useParentSize: true,
			backgroundColor: "#0a0a0a",
			borderColor: "#9a2121",
			borderWidth: 10,
			borderRadius: 15
		}), { name: "titleText2" });
		this.importantObjs["menuGrid"].getCellReference(1, 0).adoptChild(this.importantObjs["titleText2"]);
		this.addObject(new objects.TextObject({	text:  `Supports Multi-Line with:\ntextWrap: true (default)\nusing \\n in Text: String`	}),
		{ name: "titleText2Text", layer: "ui2"});		
		this.importantObjs["titleText2"].adoptChild(this.importantObjs["titleText2Text"]);

		this.addObject(new objects.DivObject({
			useParentSize: true,
			backgroundColor: "#0a0a0a",
			borderColor: "#9a2121",
			borderWidth: 10,
			borderRadius: 15
		}), { name: "titleText3" });
		this.importantObjs["menuGrid"].getCellReference(2, 0).adoptChild(this.importantObjs["titleText3"]);
		this.addObject(new objects.TextObject({	text: `Images will fill space\nContentType: "image"\nimgSrc: String` }),
		{ name: "titleText3Text", layer: "ui2"});		
		this.importantObjs["titleText3"].adoptChild(this.importantObjs["titleText3Text"]);

		this.addObject(new objects.DivObject({
			useParentSize: true,
			backgroundColor: "#0a0a0a",
			borderColor: "#9a2121",
			borderWidth: 10,
			borderRadius: 15
		}), { name: "titleText4" });
		this.importantObjs["menuGrid"].getCellReference(3, 0).adoptChild(this.importantObjs["titleText4"]);
		this.addObject(new objects.TextObject({	text: `aspectRatio: Float\nWill assume smallest Width/Height fills` }),
		{ name: "titleText4Text", layer: "ui2"});		
		this.importantObjs["titleText4"].adoptChild(this.importantObjs["titleText4Text"]);

		//Text
		this.addObject(new objects.DivObject({
			useParentSize: true,
			backgroundColor: "#0a0a0a",
			borderColor: "#9a2121",
			borderWidth: 10,
			borderRadius: 15
		}), { name: "textText1" });
		this.importantObjs["menuGrid"].getCellReference(0, 1).adoptChild(this.importantObjs["textText1"]);
		this.addObject(new objects.TextObject(),
		{ name: "textText1Text", layer: "ui2"});		
		this.importantObjs["textText1"].adoptChild(this.importantObjs["textText1Text"]);

		this.addObject(new objects.DivObject({
			useParentSize: true,
			fontSize: 15,
			backgroundColor: "#0a0a0a",
			borderColor: "#9a2121",
			borderWidth: 10,
			borderRadius: 15
		}), { name: "textText2" });
		this.importantObjs["menuGrid"].getCellReference(0, 2).adoptChild(this.importantObjs["textText2"]);
		this.addObject(new objects.TextObject(),
		{ name: "textText2Text", layer: "ui2"});		
		this.importantObjs["textText2"].adoptChild(this.importantObjs["textText2Text"]);

		this.addObject(new objects.DivObject({
			useParentSize: true,
			backgroundColor: "#0a0a0a",
			borderColor: "#9a2121",
			borderWidth: 10,
			borderRadius: 15
		}), { name: "textText3" });
		this.importantObjs["menuGrid"].getCellReference(0, 3).adoptChild(this.importantObjs["textText3"]);
		this.addObject(new objects.TextObject(),
		{ name: "textText3Text", layer: "ui2"});		
		this.importantObjs["textText3"].adoptChild(this.importantObjs["textText3Text"]);

		//Text
		this.addObject(new objects.DivObject({
			useParentSize: true,
			backgroundColor: "#0a0a0a",
			borderColor: "#9a2121",
			borderWidth: 10,
			borderRadius: 15
		}), { name: "nText1" });
		this.importantObjs["menuGrid"].getCellReference(1, 1).adoptChild(this.importantObjs["nText1"]);
		this.addObject(new objects.TextObject({	
			text: `Lorem\nipsum dolor sit\namet, consectetur adipiscing elit, sed do\neiusmod\ntempor incididunt ut labore et dolore\n\nmagna aliqua.`
		}),
		{ name: "nText1Text", layer: "ui2"});		
		this.importantObjs["nText1"].adoptChild(this.importantObjs["nText1Text"]);

		this.addObject(new objects.DivObject({
			useParentSize: true,
			backgroundColor: "#0a0a0a",
			borderColor: "#9a2121",
			borderWidth: 10,
			borderRadius: 15
		}), { name: "nText2" });
		this.importantObjs["menuGrid"].getCellReference(1, 2).adoptChild(this.importantObjs["nText2"]);
		this.addObject(new objects.TextObject({	
			text: `Lorem\nipsum dolor sit\namet, consectetur adipiscing elit, sed do\neiusmod\ntempor incididunt ut labore et dolore\n\nmagna aliqua.`
		}),
		{ name: "nText2Text", layer: "ui2"});		
		this.importantObjs["nText2"].adoptChild(this.importantObjs["nText2Text"]);

		this.addObject(new objects.DivObject({
			useParentSize: true,
			backgroundColor: "#0a0a0a",
			borderColor: "#9a2121",
			borderWidth: 10,
			borderRadius: 15
		}), { name: "nText3" });
		this.importantObjs["menuGrid"].getCellReference(1, 3).adoptChild(this.importantObjs["nText3"]);
		this.addObject(new objects.TextObject({	
			text: `Lorem\nipsum dolor sit\namet, consectetur adipiscing elit, sed do\neiusmod\ntempor incididunt ut labore et dolore\n\nmagna aliqua.`
		}),
		{ name: "nText3Text", layer: "ui2"});		
		this.importantObjs["nText3"].adoptChild(this.importantObjs["nText3Text"]);
		
		//Image
		this.addObject(new objects.DivObject({
			useParentSize: true,
			backgroundColor: "#0a0a0a",
			borderColor: "#9a2121",
			borderWidth: 10,
			borderRadius: 15
		}), { name: "imageText1" });
		this.importantObjs["menuGrid"].getCellReference(2, 1).adoptChild(this.importantObjs["imageText1"]);
		this.addObject(new objects.ImageObject(	{
			useParentSize: true,
			imageSrc: "./libs/WorldFatherAX/wf_InternalData/LogoWhite_BlackBG.png"
		}), { name: "imageText1Image", layer: "ui2" });
		this.importantObjs["imageText1"].adoptChild(this.importantObjs["imageText1Image"]);

		this.addObject(new objects.DivObject({
			useParentSize: true,
			backgroundColor: "#0a0a0a",
			borderColor: "#9a2121",
			borderWidth: 10,
			borderRadius: 15
		}), { name: "imageText2" });
		this.importantObjs["menuGrid"].getCellReference(2, 2).adoptChild(this.importantObjs["imageText2"]);
		this.addObject(new objects.ImageObject(	{
			useParentSize: true,
			imageSrc: "./libs/WorldFatherAX/wf_InternalData/LogoWhite_BlackBG.png"
		}), { name: "imageText2Image", layer: "ui2" });
		this.importantObjs["imageText2"].adoptChild(this.importantObjs["imageText2Image"]);

		this.addObject(new objects.DivObject({
			useParentSize: true,
			backgroundColor: "#0a0a0a",
			borderColor: "#9a2121",
			borderWidth: 10,
			borderRadius: 15
		}), { name: "imageText3" });
		this.importantObjs["menuGrid"].getCellReference(2, 3).adoptChild(this.importantObjs["imageText3"]);
		this.addObject(new objects.ImageObject(	{
			useParentSize: true,
			imageSrc: "./libs/WorldFatherAX/wf_InternalData/LogoWhite_BlackBG.png"
		}), { name: "imageText3Image", layer: "ui2" });
		this.importantObjs["imageText3"].adoptChild(this.importantObjs["imageText3Image"]);

		//Image Aspect
		this.addObject(new objects.DivObject({
			useParentSize: true,
			backgroundColor: "#0a0a0a",
			borderColor: "#9a2121",
			borderWidth: 10,
			borderRadius: 15
		}), { name: "imageText11" });
		this.importantObjs["menuGrid"].getCellReference(3, 1).adoptChild(this.importantObjs["imageText11"]);
		this.addObject(new objects.ImageObject(	{
			aspectRatio: 1,
			useParentSize: true,
			imageSrc: "./libs/WorldFatherAX/wf_InternalData/LogoWhite_BlackBG.png"
		}), { name: "imageText11Image", layer: "ui2" });
		this.importantObjs["imageText11"].adoptChild(this.importantObjs["imageText11Image"]);

		this.addObject(new objects.DivObject({
			useParentSize: true,
			backgroundColor: "#0a0a0a",
			borderColor: "#9a2121",
			borderWidth: 10,
			borderRadius: 15
		}), { name: "imageText12" });
		this.importantObjs["menuGrid"].getCellReference(3, 2).adoptChild(this.importantObjs["imageText12"]);
		this.addObject(new objects.ImageObject(	{
			aspectRatio: 1,
			useParentSize: true,
			imageSrc: "./libs/WorldFatherAX/wf_InternalData/LogoWhite_BlackBG.png"
		}), { name: "imageText12Image", layer: "ui2" });
		this.importantObjs["imageText12"].adoptChild(this.importantObjs["imageText12Image"]);

		this.addObject(new objects.DivObject({
			useParentSize: true,
			backgroundColor: "#0a0a0a",
			borderColor: "#9a2121",
			borderWidth: 10,
			borderRadius: 15
		}), { name: "imageText13" });
		this.importantObjs["menuGrid"].getCellReference(3, 3).adoptChild(this.importantObjs["imageText13"]);
		this.addObject(new objects.ImageObject(	{
			aspectRatio: 1,
			useParentSize: true,
			imageSrc: "./libs/WorldFatherAX/wf_InternalData/LogoWhite_BlackBG.png"
		}), { name: "imageText13Image", layer: "ui2" });
		this.importantObjs["imageText13"].adoptChild(this.importantObjs["imageText13Image"]);
	}
}

export class UiSubGridTest extends Scene
{
	constructor()
	{
		super();
		this.backgroundColor = "black";
	}

	onSetup()
	{	
		this.addObject(new objects.DivObject({
			backgroundColor: "#0a0a0a",
			borderColor: "#9a2121",
			borderWidth: 10,
			borderRadius: 15,
			canCollide: true,
			width: 75,
			height: 50,
			positionY: -this.engine.halfScreenHeight + 50,
			positionX: -this.engine.halfScreenWidth + 75
		}), { name: "return", layer: "ui1" });

		this.addObject(new objects.TextObject({
			text: "Back",
			fontSize: 15
		}), { name: "backButtonText", layer: "ui2"});		
		this.importantObjs["return"].adoptChild(this.importantObjs["backButtonText"])

		this.importantObjs["return"].onClicked = () =>
		{
			if (!this.engine.scenes["TestScenesMenu"]) this.engine.addScene("TestScenesMenu", new TestScenesMenu()); 
			this.engine.swapScene("TestScenesMenu");
		}
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		this.addObject(new objects.Grid({
			gridGap: 50,
			width: this.engine.fullScreenWidth - 50,
			height: this.engine.fullScreenHeight - 50,
			gridColumns: ["1fr", "1000", "1fr"],
			gridRows: ["1fr", "100", "1fr"],
		}), { layer: "grids", name: "menuGrid" });

		this.addObject(new objects.DivObject({
			useParentSize: true,
			backgroundColor: "#0a0a0a",
			borderColor: "#9a2121",
			borderWidth: 10,
			borderRadius: 15
		}), { name: "gridHolder" });
		this.importantObjs["menuGrid"].getCellReference(1, 1).adoptChild(this.importantObjs["gridHolder"]);
		
		this.addObject(new objects.Grid({
			useParentSize: true,
			gridColumns: ["150", "1fr"],
			gridRows: ["1fr"],
			gridGap: 10
		}), { layer: "ui1", name: "subGrid" });
		this.importantObjs["gridHolder"].adoptChild(this.importantObjs["subGrid"]);

		this.addObject(new objects.ImageObject({
			useParentSize: true,
			aspectRatio: 1
		}), { layer: "ui2", name: "imageDiv" });
		this.importantObjs["subGrid"].getCellReference(0, 0).adoptChild(this.importantObjs["imageDiv"]);

		this.addObject(new objects.TextObject({
			useParentSize: true,
			fontSize: 25,
			textAlign: "left"
		}), { layer: "ui2", name: "textDiv" });
		this.importantObjs["subGrid"].getCellReference(0, 1).adoptChild(this.importantObjs["textDiv"]);

	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///// Spiral Parent / Child Test /////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class SpiralTest extends Scene
{
	constructor()
	{
		super();
		this.backgroundColor = "black";
	}

	onSetup()
	{
		this.addObject(new objects.DivObject({
			backgroundColor: "#0a0a0a",
			borderColor: "#9a2121",
			borderWidth: 10,
			borderRadius: 15,
			canCollide: true,
			width: 75,
			height: 50,
			positionY: -this.engine.halfScreenHeight + 50,
			positionX: -this.engine.halfScreenWidth + 75
		}), { name: "return", layer: "ui1" });

		this.addObject(new objects.TextObject({
			text: "Back",
			fontSize: 15
		}), { name: "backButtonText", layer: "ui2"});		
		this.importantObjs["return"].adoptChild(this.importantObjs["backButtonText"])

		this.importantObjs["return"].onClicked = () =>
		{
			if (!this.engine.scenes["TestScenesMenu"]) this.engine.addScene("TestScenesMenu", new TestScenesMenu()); 
			this.engine.swapScene("TestScenesMenu");
		}
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		this.addObject(new SpiralTestObj({
			dDraw: true,
			ddCross: true
		}),{ name: "parent" });

		this.addObject(new SpiralTestObj({
			parent: this.importantObjs["parent"],
			positionX: 100,
			dDraw: true,
			ddCross: true
		}), { name: "Child0" });

		for (let i = 0; i < 5; i++)
		{
			this.addObject(new SpiralTestObj({
				parent: this.importantObjs[`Child${i}`],
				positionX: 100,
				dDraw: true,
				ddCross: true
			}), { name: `Child${i + 1}` });
		}
	}
}

class SpiralTestObj extends objects.Empty
{
	constructor(inherited)
	{
		super(inherited);
		this.tag = "spiralTestObj";
	}

	update(dt)
	{
		const ifKeyA = this.engine.isKeyDown("KeyA");
		const ifKeyD = this.engine.isKeyDown("KeyD");
		if (ifKeyA) this.rotation -= 100 * dt;
		if (ifKeyD) this.rotation += 100 * dt;
		return super.update(dt);
	}

	draw(ctx)
	{
		ctx.strokeStyle = "orange";
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(this.width, 0);
		ctx.stroke();
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///// Collision Test /////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class CollisionTest extends Scene
{
	constructor()
	{
		super();
		this.backgroundColor = "black";
	}

	onSetup()
	{
		this.addObject(new objects.DivObject({
			backgroundColor: "#0a0a0a",
			borderColor: "#9a2121",
			borderWidth: 10,
			borderRadius: 15,
			canCollide: true,
			width: 75,
			height: 50,
			positionY: -this.engine.halfScreenHeight + 50,
			positionX: -this.engine.halfScreenWidth + 75
		}), { name: "return", layer: "ui1" });

		this.addObject(new objects.TextObject({
			text: "Back",
			fontSize: 15
		}), { name: "backButtonText", layer: "ui2"});		
		this.importantObjs["return"].adoptChild(this.importantObjs["backButtonText"])

		this.importantObjs["return"].onClicked = () =>
		{
			if (!this.engine.scenes["TestScenesMenu"]) this.engine.addScene("TestScenesMenu", new TestScenesMenu()); 
			this.engine.swapScene("TestScenesMenu");
		}
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		// Ellipse x Ellipse
		//this.addObject(new objects.Dynamic({ positionX: 150, rotation: 45, width: 100, height: 200, canCollide: true, dDraw: true, isEllipse: true }));
		//this.addObject(new objects.DevObj({ positionX: 0, positionY: -150, isEllipse: true, dDraw: true, ddCross: true }));

		// Ellipse x Box
		//this.addObject(new objects.Dynamic({ positionX: 150, rotation: 45, width: 100, height: 200, canCollide: true, dDraw: true, isEllipse: false }));
		//this.addObject(new objects.DevObj({ positionX: 0, positionY: -150, isEllipse: true, dDraw: true, ddCross: true }));

		// Box x Box
		this.addObject(new objects.Dynamic({ positionX: 150, rotation: 45, width: 100, height: 200, canCollide: true, dDraw: true, isEllipse: false }));
		this.addObject(new objects.DevObj({ positionX: 0, positionY: -150, isEllipse: false, dDraw: true, ddCross: true, shape: Utils.getShape(3, false) }));
	}
}

export class ChildCollisionTest extends Scene
{	
	constructor()
	{
		super();
		this.backgroundColor = "black";
	}

	onSetup()
	{
		this.addObject(new objects.DivObject({
			backgroundColor: "#0a0a0a",
			borderColor: "#9a2121",
			borderWidth: 10,
			borderRadius: 15,
			canCollide: true,
			width: 75,
			height: 50,
			positionY: -this.engine.halfScreenHeight + 50,
			positionX: -this.engine.halfScreenWidth + 75
		}), { name: "return", layer: "ui1" });

		this.addObject(new objects.TextObject({
			text: "Back",
			fontSize: 15
		}), { name: "backButtonText", layer: "ui2"});		
		this.importantObjs["return"].adoptChild(this.importantObjs["backButtonText"])

		this.importantObjs["return"].onClicked = () =>
		{
			if (!this.engine.scenes["TestScenesMenu"]) this.engine.addScene("TestScenesMenu", new TestScenesMenu()); 
			this.engine.swapScene("TestScenesMenu");
		}
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		this.addObject(new objects.DevObj({
			tag: 'Parent1',
			positionX: -250,
			positionY: -250,
			canCollide: true,
			dDraw: true,
			ddCross: true,
			isEllipse: true
		}), { name: "Parent1" });
		this.addObject(new objects.Dynamic({
			tag: 'Child1',
			color: "blue",
			positionY: 250,
			canCollide: true,
			isEllipse: true
		}), { name: "Child1" });
		this.importantObjs["Parent1"].adoptChild(this.importantObjs["Child1"]);

		this.addObject(new objects.DevObj({
			tag: 'Parent2',
			color: "green",
			positionX: 250,
			positionY: 250,
			rotation: 180,
			canCollide: true,
			dDraw: true,
			ddCross: true,
			isEllipse: false
		}), { name: "Parent2" });
		this.addObject(new objects.Dynamic({
			tag: 'Child2',
			color: "purple",
			positionY: 250,
			canCollide: true
		}), { name: "Child2" });
		this.importantObjs["Parent2"].adoptChild(this.importantObjs["Child2"]);

		this.importantObjs["Child2"].collidedWith = (collidedObject) =>
		{
			console.log(`${this.importantObjs["Child2"].tag} collided with ${collidedObject.tag}`);
		}
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///// Parent Reference Test //////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class ParentReference extends Scene
{
	constructor()
	{
		super();
		this.backgroundColor = "black";
	}

	onSetup()
	{
		this.addObject(new objects.DivObject({
			backgroundColor: "#0a0a0a",
			borderColor: "#9a2121",
			borderWidth: 10,
			borderRadius: 15,
			canCollide: true,
			width: 75,
			height: 50,
			positionY: -this.engine.halfScreenHeight + 50,
			positionX: -this.engine.halfScreenWidth + 75
		}), { name: "return", layer: "ui1" });

		this.addObject(new objects.TextObject({
			text: "Back",
			fontSize: 15
		}), { name: "backButtonText", layer: "ui2"});		
		this.importantObjs["return"].adoptChild(this.importantObjs["backButtonText"])

		this.importantObjs["return"].onClicked = () =>
		{
			if (!this.engine.scenes["TestScenesMenu"]) this.engine.addScene("TestScenesMenu", new TestScenesMenu()); 
			this.engine.swapScene("TestScenesMenu");
		}
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		this.addObject(new objects.DevObj({ dDraw: true, ddCross: true, rotation: 270 }), { name: "parentObj" });	
		this.addObject(new childUsingParentAsRefernce({ color: "blue", positionX: 150, parentAsReference: true, dDraw: true, ddCross: true }), { name: "childObj" });
		this.addObject(new textBubble({ parentAsReference: true, fontSize: 20, text: "The child (blue) object does not inherit from the parent (magenta) object but holds reference to use later.\nIn this case its X & Y are updated to follow at a distance."}), { name: "textBubble", layer: "ui2" });



		this.importantObjs["parentObj"].adoptChild(this.importantObjs["childObj"]);
		this.importantObjs["childObj"].adoptChild(this.importantObjs["textBubble"]);
	}
}

class textBubble extends objects.TextObject
{
	constructor(inherited = {})
	{
		super(inherited);
	}

	update(dt)
	{
		console.log(this.width)
		this.positionX = this.parent.positionX;
		this.positionY = this.parent.positionY - 150;
	}
}

class childUsingParentAsRefernce extends objects.Dynamic
{
	constructor(inherited = {})
	{
		super(inherited);
	}

	update(dt)
	{
		this.positionX = this.parent.positionX;
		this.positionY = this.parent.positionY - 150;
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///// Text / Image Test //////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class TextTest extends Scene
{
	constructor()
	{
		super();
		this.backgroundColor = "black";
	}

	onSetup()
	{
		this.addObject(new objects.DivObject({
			backgroundColor: "#0a0a0a",
			borderColor: "#9a2121",
			borderWidth: 10,
			borderRadius: 15,
			canCollide: true,
			width: 75,
			height: 50,
			positionY: -this.engine.halfScreenHeight + 50,
			positionX: -this.engine.halfScreenWidth + 75
		}), { name: "return", layer: "ui1" });

		this.addObject(new objects.TextObject({
			text: "Back",
			fontSize: 15
		}), { name: "backButtonText", layer: "ui2"});		
		this.importantObjs["return"].adoptChild(this.importantObjs["backButtonText"])

		this.importantObjs["return"].onClicked = () =>
		{
			if (!this.engine.scenes["TestScenesMenu"]) this.engine.addScene("TestScenesMenu", new TestScenesMenu()); 
			this.engine.swapScene("TestScenesMenu");
		}
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


		this.addObject(new objects.DevObj({ rotation: 0, dDraw: true, ddCross: true }), { name: "devObj" })

		this.addObject(new objects.Grid( {
			drawCells: true,
			gridGap: 10
		}), { name: "grid", layer: "grids" });
		this.importantObjs["devObj"].adoptChild(this.importantObjs["grid"])

		//Text
		this.addObject(new objects.TextObject({
			text: "This is a standalone text object!",
			fontSize: 50,
			useParentSize: true
		}), { name: "textObj", layer: "ui2" });
		this.importantObjs["grid"].getCellReference(0,0).adoptChild(this.importantObjs["textObj"])

		//Text Under Div
		this.addObject(new objects.DivObject({
			useParentSize: true			
		}), { name: "divObj", layer: "ui1" });
		this.importantObjs["grid"].getCellReference(0,1).adoptChild(this.importantObjs["divObj"]);
		
		this.addObject(new objects.TextObject({
			text: "This is a text object adopted by a DivObject!",
			fontSize: 50,
			useParentSize: true
		}), { name: "subText", layer: "ui2" });
		this.importantObjs["divObj"].adoptChild(this.importantObjs["subText"]);


		this.addObject(new objects.ImageObject({
			useParentSize: true
		}), { name: "imageObj", layer: "ui2" });
		this.importantObjs["grid"].getCellReference(1,0).adoptChild(this.importantObjs["imageObj"]);

		//Image
		this.addObject(new objects.DivObject({
			useParentSize: true			
		}), { name: "imageDiv", layer: "ui1" });
		this.importantObjs["grid"].getCellReference(1,1).adoptChild(this.importantObjs["imageDiv"]);

		this.addObject(new objects.ImageObject({
			useParentSize: true
		}), { name: "subImage", layer: "ui2" });
		this.importantObjs["imageDiv"].adoptChild(this.importantObjs["subImage"]);
	}
}