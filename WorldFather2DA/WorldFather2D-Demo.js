const worldFather = await import("./libs/WorldFatherAX/WorldFather2D.js");
const customScenes = await import("./WFD-Scenes.js");
const testScenes = await import("./WFD_TestScenes.js");
// const customObjects = await import("./KTA-Objects.js")

const KTAsteroids = new worldFather.WorldFather("wfTest");

KTAsteroids.addSystem(new worldFather.systems.CollisionDetection());
KTAsteroids.addSystem(new worldFather.systems.KeyInputs());
KTAsteroids.addSystem(new worldFather.systems.MouseSystem());

KTAsteroids.addCamera("GameCamera");
KTAsteroids.swapCamera("GameCamera");

KTAsteroids.addScene("WFD", new customScenes.WFD());
KTAsteroids.addScene("MenuScene", new customScenes.MenuScene());
KTAsteroids.addScene("GameScene", new customScenes.GameScene());
KTAsteroids.addScene("testScenes", new testScenes.TestScenesMenu());

KTAsteroids.swapScene("WFD");

KTAsteroids.start(); 