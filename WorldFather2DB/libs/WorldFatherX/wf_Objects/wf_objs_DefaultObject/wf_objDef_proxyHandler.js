import { Utils } from "../../wf_Utils.js";

export function _getProxyHandler()
{
	const handler =
	{
		set(target, prop, value, receiver)
		{
			target[prop] = value;

			if(target._ready)
			{
				switch (prop)
				{
					case "rotation":
						const sin = Math.sin(target.wf.Utils.getRadians(value));
						const cos = Math.cos(target.wf.Utils.getRadians(value));
						target.sin = sin;
						target.cos = cos;
						target.forwardX = cos;
						target.forwardY = sin;
						target.rightX = -sin;
						target.rightY = cos;
						target.leftX = sin;
						target.leftY = -cos;
						target.backX = -cos;
						target.backY = -sin;
						target[prop] = target.wf.Utils.forceMod(value, 360);
						target.dirtyData = true;
						break;
					case "positionX":
					case "positionY":
					case "scaleX":
					case "scaleY":
						target.dirtyData = true;
						break;
					case "width":
						target.halfWidth = value * 0.5;
						target.imageWidth = value;
						target.imageDirty = true;
						target.dirtyData = true;
					case "height":
						target.halfHeight = value * 0.5;
						target.imageHeight = value;
						target.imageDirty = true;
						target.dirtyData = true;
						break;
					case "worldRotation":
						target.worldCos = Math.cos(target.wf.Utils.getRadians(value));
						target.worldSin = Math.sin(target.wf.Utils.getRadians(value));
						target[prop] = target.wf.Utils.forceMod(value, 360);
						break;
					case "text":
						target.multiLineDirty = true;
						break;
				}
			}

			return true;
		}
	};

	return handler;
}

// export function _getModuleHandler(container, key, _modules)
// {

// 	const handler =
// 	{
// 		set(target, prop, value, receiver)
// 		{
// 			if (container._ready)
// 			{
// 				if(value == true)
// 				{
// 					container._ready = false;
// 					if ((key == "useWorldData")) _modules["useCollision"].reset = true;
// 					if ((key == "useParentChild")) _modules["useDeath"].reset = true;
// 					if ((key == "useWorldData" || key == "useCollision")) _modules["useUpdate"].reset = true;
// 					if ((key == "useText" || key == "useImage" || key == "useDebug")) _modules["useDrawing"].reset = true;
// 					if ((key == "useCollision" || key == "useParentChild")) _modules["useWorldData"].reset = true;
// 					receiver[prop] = value;
// 					receiver["reset"] = true;
// 					container._resetModules = true;
// 					container._ready = true;
// 				}
// 			}

// 			return true;
// 		}
// 	};

// 	return handler;
// }