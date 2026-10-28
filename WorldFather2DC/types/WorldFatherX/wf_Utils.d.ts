import { Point2D } from "./wf_CustomTypes.js";
export declare class Utils {
    static readonly maxRadians: number;
    static readonly Tau: number;
    static readonly random: () => number;
    static getRadians(degrees: number): number;
    static combineFunctions<T>(...funcs: Array<(arg: T) => T>): (initialValue: T) => T;
    static clamp(x: number, min: number, max: number): number;
    static timeSince(lastTime: number, thisTime?: number): number;
    static trigWiggle(startTime: number, frequency: number, amplitude: number, func?: Function): number;
    static getShape(points: number, fitToFace?: boolean): Point2D[];
    static forceMod(number: number, mod: number): number;
    static rotatePoint(x: number, y: number, angle: number, centerX?: number, centerY?: number): [number, number];
    static mulberry32(seed?: number): () => number;
    static getRandomInteger(min: number, max: number): number;
    static getRandomIntegerInclusive(min: number, max: number): number;
    static getRandomFloat(min: number, max: number): number;
    static getRandomChance(decimalChance: number, randomIn?: number): boolean;
}
//# sourceMappingURL=wf_Utils.d.ts.map