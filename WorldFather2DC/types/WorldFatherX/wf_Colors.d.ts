export declare class WFColor {
    r: number;
    g: number;
    b: number;
    a: number;
    constructor({ r, g, b, a }?: {
        r?: number;
        g?: number;
        b?: number;
        a?: number;
    });
    toString(): string;
    invertString(): string;
    private cleanNumber;
}
export declare class WFColors {
    static red: WFColor;
    static orange: WFColor;
    static yellow: WFColor;
    static lime: WFColor;
    static green: WFColor;
    static aqua: WFColor;
    static cyan: WFColor;
    static azure: WFColor;
    static blue: WFColor;
    static purple: WFColor;
    static magenta: WFColor;
    static ruby: WFColor;
}
export declare class WFColorUtils {
    static hueRotate(color: WFColor, degrees: number): WFColor;
    static wfColorToHsla(color: WFColor): {
        h: number;
        s: number;
        l: number;
        a: number;
    };
    static hslaToWfColor(hsla: {
        h: number;
        s: number;
        l: number;
        a: number;
    }): WFColor;
    static hueToRgb(p: number, q: number, t: number): number;
}
//# sourceMappingURL=wf_Colors.d.ts.map