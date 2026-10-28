import { playerObject, asteroid, redAsteroid, goldAsteroid } from "./WFD-Objects.js";
import { DivObject, Grid, Solid, TextObject } from "./libs/WorldFatherAX/wf_Objects.js";
import { Scene } from "./libs/WorldFatherAX/wf_Scene.js";
import { Utils } from "./libs/WorldFatherAX/wf_Utils.js";
import { objects } from "./libs/WorldFatherAX/WorldFather2D.js";

export class GameScene extends Scene
{
	constructor()
	{
		super();
		this.backgroundColor = "Black";
		this.asteroidDelay = 1500;
		this.lastAsteroid = this.asteroidDelay;
		this.minMaxAngleBias = 0.1;
		this.asteroidCount = 0;
		this.points = 0;
	}

	onSetup()
	{
		this.addObject(new playerObject(), { name: "PlayerObject", layer: "main" });

		this.addObject(new DivObject({
			backgroundColor: "#0a0a0a",
			borderColor: "#9a2121",
			borderWidth: 10,
			borderRadius: 15,
			positionX: -this.engine.halfScreenWidth + 25 + 250,
			positionY: -this.engine.halfScreenHeight + 25 + (75 * 0.5),
			width: 500,
			height: 75
		}), { name: "pointsDiv", layer: "ui1" });

		this.addObject(new Grid({
			drawCells: false,
			useParentSize: true,
			gridColumns: ["75", "1fr"],
			gridRows: ["1fr"],
			gridGap: 10,
			padding: 10
		}), { name: "pointsGrid", layer: "ui2" });
		this.importantObjs["pointsDiv"].adoptChild(this.importantObjs["pointsGrid"]);

		this.addObject(new TextObject({
			text: "Score:"
		}), { name: "pointsTitle", layer: "ui2" });
		this.importantObjs["pointsGrid"].getCellReference(0,0).adoptChild(this.importantObjs["pointsTitle"]);

		this.addObject(new TextObject({
			text: this.points,
			textAlign: "left"
		}), { name: "pointsPoints", layer: "ui2" });
		this.importantObjs["pointsGrid"].getCellReference(0,1).adoptChild(this.importantObjs["pointsPoints"]);
	}

	update(dt, ctx)
	{
		this.importantObjs["pointsPoints"].text = [this.points];

		if (Utils.timeSince(this.lastAsteroid) > this.asteroidDelay && this.asteroidCount < 10)
		{
			this.lastAsteroid = Date.now();
			this.spawnNewAsteroid();
		}
	}

	spawnNewAsteroid()
	{
		this.asteroidCount += 1;
		const randomRoll = Math.random();
		const goldRoll = Utils.getRandomChance(0.01, randomRoll);
		const redRoll = Utils.getRandomChance(0.1, randomRoll);

		const newAsteroid = {};

		let scale = Utils.getRandomIntegerInclusive(25, 250);

		if (goldRoll)
		{
			scale = Utils.getRandomIntegerInclusive(10, 30);
		}
		else if (redRoll)
		{
			scale = Utils.getRandomIntegerInclusive(200, 400);
		}

		newAsteroid.width = scale;
		newAsteroid.height = scale;

		let maxY;
		let maxX;
		let maxAngle;
		let minAngle;

		switch (Utils.getRandomInteger(0, 4))
		{
			case 0: // Top
				newAsteroid.positionY = -this.engine.halfScreenHeight - scale;
				maxY = (this.engine.fullScreenHeight * this.minMaxAngleBias) - this.engine.halfScreenHeight;
				newAsteroid.positionX = Utils.getRandomFloat(-this.engine.halfScreenWidth, this.engine.halfScreenWidth);
				maxAngle = Utils.getAngleBetweenPoints(-this.engine.halfScreenWidth - newAsteroid.positionX, maxY - newAsteroid.positionY);
				minAngle = Utils.getAngleBetweenPoints(this.engine.halfScreenWidth - newAsteroid.positionX, maxY - newAsteroid.positionY);
				break;
			case 1: // Bottom
				newAsteroid.positionY = this.engine.halfScreenHeight + scale;
				maxY = this.engine.halfScreenHeight - (this.engine.fullScreenHeight * this.minMaxAngleBias);
				newAsteroid.positionX = Utils.getRandomFloat(-this.engine.halfScreenWidth, this.engine.halfScreenWidth);
				maxAngle = Utils.getAngleBetweenPoints(-this.engine.halfScreenWidth - newAsteroid.positionX, maxY - newAsteroid.positionY);
				minAngle = Utils.getAngleBetweenPoints(this.engine.halfScreenWidth - newAsteroid.positionX, maxY - newAsteroid.positionY);
				break;
			case 2: // Left
				newAsteroid.positionX = -this.engine.halfScreenWidth - scale;
				newAsteroid.positionY = Utils.getRandomFloat(-this.engine.halfScreenHeight, this.engine.halfScreenHeight);
				maxX = (this.engine.fullScreenWidth * this.minMaxAngleBias) - this.engine.halfScreenWidth;
				maxAngle = Utils.getAngleBetweenPoints(maxX - newAsteroid.positionX, -this.engine.halfScreenHeight - newAsteroid.positionY);
				minAngle = Utils.getAngleBetweenPoints(maxX - newAsteroid.positionX, this.engine.halfScreenHeight - newAsteroid.positionY);
				break;
			case 3: // Right
				newAsteroid.positionX = this.engine.halfScreenWidth + scale;
				newAsteroid.positionY = Utils.getRandomFloat(-this.engine.halfScreenHeight, this.engine.halfScreenHeight);
				maxX = this.engine.halfScreenWidth - (this.engine.fullScreenWidth * this.minMaxAngleBias);
				maxAngle = Utils.forceMod(Utils.getAngleBetweenPoints(maxX - newAsteroid.positionX, -this.engine.halfScreenHeight - newAsteroid.positionY), Utils.maxRadians);
				minAngle = Utils.forceMod(Utils.getAngleBetweenPoints(maxX - newAsteroid.positionX, this.engine.halfScreenHeight - newAsteroid.positionY), Utils.maxRadians);
				break;
		}
		newAsteroid.driftDirection = Utils.getDegrees(Utils.getRandomFloat(minAngle, maxAngle));


		if (goldRoll)
		{
			this.addObject(new goldAsteroid(newAsteroid));
		}
		else if (redRoll)
		{
			this.addObject(new redAsteroid(newAsteroid));
		}
		else
		{
			this.addObject(new asteroid(newAsteroid));
		}
	}

	spawnBrokenAsteroid(positionX, positionY, scale)
	{
		this.asteroidCount += 1;
		const newAsteroid = { positionX: positionX, positionY: positionY, width: scale, height: scale };
		newAsteroid.driftDirection = Utils.getRandomFloat(0, 360);
		this.addObject(new asteroid(newAsteroid))
	}
}

export class MenuScene extends Scene
{
	constructor()
	{
		super();
		this.backgroundColor = "black";
		this.debugsOn = false;
	}

	onSetup()
	{
		this.addObject(new objects.Grid({
			gridColumns: ["75", "1fr", "75"],
			gridRows: ["1fr", "150", "400", "1fr", "75"],
			width: this.engine.fullScreenWidth - 100,
			height: this.engine.fullScreenHeight - 100,
			gridGap: 50
		}), { layer: "grids", name: "menuGrid" });

		this.addObject(new objects.Grid({
			useParentSize: true,
			gridColumns: ["1fr", "500", "1fr"],
			gridRows: ["1fr", "1fr", "1fr"],
			gridGap: 50
		}), { layer: "grids", name: "buttonGrid" });
		this.importantObjs["menuGrid"].getCellReference(2, 1).adoptChild(this.importantObjs["buttonGrid"]);

		this.addObject(new objects.DivObject({
			useParentSize: true,
			backgroundColor: "#0a0a0a",
			borderColor: "#9a2121",
			borderWidth: 10,
			borderRadius: 15,
		}), { layer: "ui1", name: "title" });
		this.addObject(new objects.TextObject({
			fontSize: 50,
			text: "Kata-Asteroids"
		}), { name: "titleText", layer: "ui2"});
		this.importantObjs["menuGrid"].getCellReference(1, 1).adoptChild(this.importantObjs["title"]);
		this.importantObjs["title"].adoptChild(this.importantObjs["titleText"]);
		
		this.addObject(new objects.DivObject({
			useParentSize: true,
			backgroundColor: "#0a0a0a",
			borderColor: "#9a2121",
			borderWidth: 10,
			borderRadius: 15,
			canCollide: true
		}), { name: "button", layer: "ui1" });
		this.addObject(new objects.TextObject({
			fontSize: 30,
			text: "Start"
		}), { name: "buttonText", layer: "ui2"});
		this.importantObjs["buttonGrid"].getCellReference(0, 1).adoptChild(this.importantObjs["button"]);
		this.importantObjs["button"].adoptChild(this.importantObjs["buttonText"]);
		this.importantObjs["button"].onClicked = () =>	{ this.engine.swapScene("GameScene"); }		

		this.addObject(new objects.DivObject({
			useParentSize: true,
			backgroundColor: "#0a0a0a",
			borderColor: "#9a2121",
			borderWidth: 10,
			borderRadius: 15,
			canCollide: true
		}), { name: "infoButton", layer: "ui1" });
		this.addObject(new objects.ImageObject({
			paddingX: 15,
			paddingY: 15
		}), { name: "infoButtonImage", layer: "ui2"});
		this.importantObjs["menuGrid"].getCellReference(4, 2).adoptChild(this.importantObjs["infoButton"]);
		this.importantObjs["infoButton"].adoptChild(this.importantObjs["infoButtonImage"]);
		this.importantObjs["infoButton"].onClicked = () => { this.engine.swapScene("DefaultScene"); };
	}
}

export class WFD extends Scene
{
	constructor()
	{
		super();
		this.backgroundColor = "black";
		this.debugsOn = false;
	}

	onSetup()
	{
		this.addObject(new objects.Grid({
			gridColumns: ["75", "1fr", "75"],
			gridRows: ["1fr", "150", "400", "1fr", "75"],
			width: this.engine.fullScreenWidth - 100,
			height: this.engine.fullScreenHeight - 100,
			gridGap: 50
		}), { layer: "grids", name: "menuGrid" });

		this.addObject(new objects.Grid({
			useParentSize: true,
			gridColumns: ["1fr", "500", "1fr"],
			gridRows: ["1fr", "1fr"],
			gridGap: 50,
			padding: 50
		}), { layer: "grids", name: "buttonGrid" });
		this.importantObjs["menuGrid"].getCellReference(2, 1).adoptChild(this.importantObjs["buttonGrid"]);

		this.addObject(new objects.DivObject({
			useParentSize: true,
			backgroundColor: "#0a0a0a",
			borderColor: "#219a21",
			borderWidth: 10,
			borderRadius: 15,
		}), { layer: "ui1", name: "title" });
		this.addObject(new objects.TextObject({
			fontSize: 50,
			text: "WorldFather2D Demo"
		}), { name: "titleText", layer: "ui2"});
		this.importantObjs["menuGrid"].getCellReference(1, 1).adoptChild(this.importantObjs["title"]);
		this.importantObjs["title"].adoptChild(this.importantObjs["titleText"]);
		
		this.addObject(new objects.DivObject({
			useParentSize: true,
			backgroundColor: "#0a0a0a",
			borderColor: "#219a21",
			borderWidth: 10,
			borderRadius: 15,
			canCollide: true
		}), { name: "testScenesButton", layer: "ui1" });
		this.addObject(new objects.TextObject({
			fontSize: 30,
			text: "TestScenes"
		}), { name: "testScenesButtonText", layer: "ui2"});
		this.importantObjs["buttonGrid"].getCellReference(0, 1).adoptChild(this.importantObjs["testScenesButton"]);
		this.importantObjs["testScenesButton"].adoptChild(this.importantObjs["testScenesButtonText"]);
		this.importantObjs["testScenesButton"].onClicked = () =>	{ this.engine.swapScene("testScenes"); }		
		
		this.addObject(new objects.DivObject({
			useParentSize: true,
			backgroundColor: "#0a0a0a",
			borderColor: "#219a21",
			borderWidth: 10,
			borderRadius: 15,
			canCollide: true
		}), { name: "button", layer: "ui1" });
		this.addObject(new objects.TextObject({
			fontSize: 30,
			text: "Start Kata-Asteroids Demo"
		}), { name: "buttonText", layer: "ui2"});
		this.importantObjs["buttonGrid"].getCellReference(1, 1).adoptChild(this.importantObjs["button"]);
		this.importantObjs["button"].adoptChild(this.importantObjs["buttonText"]);
		this.importantObjs["button"].onClicked = () =>	{ this.engine.swapScene("MenuScene"); }		

		this.addObject(new objects.DivObject({
			useParentSize: true,
			backgroundColor: "#0a0a0a",
			borderColor: "#219a21",
			borderWidth: 10,
			borderRadius: 15,
			canCollide: true
		}), { name: "infoButton", layer: "ui1" });
		this.addObject(new objects.ImageObject({
			paddingX: 15,
			paddingY: 15
		}), { name: "infoButtonImage", layer: "ui2"});
		this.importantObjs["menuGrid"].getCellReference(4, 2).adoptChild(this.importantObjs["infoButton"]);
		this.importantObjs["infoButton"].adoptChild(this.importantObjs["infoButtonImage"]);
		this.importantObjs["infoButton"].onClicked = () => { this.engine.swapScene("DefaultScene"); };
	}
}