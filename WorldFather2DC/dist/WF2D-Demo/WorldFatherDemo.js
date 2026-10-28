import { WorldFather2D } from "../WorldFatherX/WorldFather2D.js";
import { testScene } from "./testScene.js";
const WorldFather = new WorldFather2D("wfTest");
WorldFather.addScene("testScene", testScene);
WorldFather.swapScene("testScene");
WorldFather.start();
//# sourceMappingURL=WorldFatherDemo.js.map