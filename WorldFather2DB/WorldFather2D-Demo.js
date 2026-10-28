const worldFather = await import("./libs/WorldFatherX/WorldFather2D.js");
const customScenes = await import("./WFD-Scenes.js");
const testScenes = await import("./libs/WorldFatherX/wf_Internal/wf_int_TestScenes.js")
const exampleScenes = await import("./libs/WorldFatherX/wf_Internal/wf_int_ExampleScenes.js")

const WFD = new worldFather.WorldFather2D("wfTest");

WFD.addScene("demoMenu", new customScenes.worldFather2DXDemo());
WFD.addScene("curTest", new testScenes.NewCameras());

WFD.swapScene("demoMenu");

WFD.start();