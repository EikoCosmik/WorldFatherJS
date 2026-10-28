import { ErrorManager } from "./wf_ErrorManager.js";
export class Utils {
    static maxRadians = 2 * Math.PI;
    static Tau = 2 * Math.PI;
    static random = this.mulberry32();
    static getRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
    static combineFunctions(...funcs) {
        return (initialValue) => {
            return funcs.reduce((acc, currentFunc) => currentFunc(acc), initialValue);
        };
    }
    static clamp(x, min, max) {
        return Math.max(min, Math.min(max, x));
    }
    static timeSince(lastTime, thisTime = Date.now()) {
        return thisTime - lastTime;
    }
    static trigWiggle(startTime, frequency, amplitude, func = Math.sin) {
        return func(this.timeSince(startTime) * frequency) * amplitude;
    }
    static getShape(points, fitToFace = true) {
        const outShape = [];
        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;
        for (let i = 0; i < points; i++) {
            let angle = i * (Utils.Tau / points);
            if (fitToFace)
                angle += (Math.PI / points);
            let x = Math.cos(angle) * 0.5;
            if (x < minX)
                minX = x;
            if (x > maxX)
                maxX = x;
            let y = Math.sin(angle) * 0.5;
            if (y < minY)
                minY = y;
            if (y > maxY)
                maxY = y;
            const out = { x: x, y: y };
            outShape.push(out);
        }
        const scaleFix = 1 / Math.max(maxX - minX, maxY - minY);
        for (let i = 0; i < outShape.length; i++) {
            const vert = ErrorManager.setIfExists(outShape[i], `wf_Utils.getShape(): outShape[i] did not exist, setting vert`);
            vert.x *= scaleFix;
            vert.y *= scaleFix;
        }
        return outShape;
    }
    static forceMod(number, mod) {
        return ((number % mod) + mod) % mod;
    }
    static rotatePoint(x, y, angle, centerX = 0, centerY = 0) {
        const cos = Math.cos(this.getRadians(angle));
        const sin = Math.sin(this.getRadians(angle));
        const newX = ((x - centerX) * cos) - ((y - centerY) * sin) + centerX;
        const newY = ((x - centerX) * sin) + ((y - centerY) * cos) + centerY;
        return [newX, newY];
    }
    static mulberry32(seed = Date.now() ^ (Math.random() * 0xffffffff)) {
        seed |= 0;
        return function () {
            let t = seed += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }
    ;
    static getRandomInteger(min, max) {
        min = Math.ceil(min);
        max = max | 0;
        return (this.random() * (max - min) | 0) + min;
    }
    static getRandomIntegerInclusive(min, max) {
        min = Math.ceil(min);
        max = max | 0;
        return (this.random() * (max - min + 1) | 0) + min;
    }
    static getRandomFloat(min, max) {
        return this.random() * (max - min) + min;
    }
    static getRandomChance(decimalChance, randomIn = this.random()) {
        return randomIn <= decimalChance;
    }
}
//# sourceMappingURL=wf_Utils.js.map