export type Point2D = {	x: number;	y: number; };

export type combineClasses<T = {}> = new (...args: any[]) => T; //export function getXXXXX<TBase extends combineClasses>(Base: TBase) { return class XXXXX extends Base { } }