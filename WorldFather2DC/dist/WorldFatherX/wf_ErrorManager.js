class ErrorManagerClass {
    constructor() { }
    setIfExists(value, message = "unknown required error") {
        if (value == null) {
            throw new wf_ValidationError(message);
        }
        return value;
    }
    testIfExists(value, message = "unknown required error") {
        if (value == null) {
            throw new wf_ValidationError(message);
        }
    }
}
class wf_ValidationError extends Error {
    field;
    constructor(message, field) {
        super(message);
        this.field = field;
        this.name = 'wf_ValidationError';
        Object.setPrototypeOf(this, wf_ValidationError.prototype);
    }
}
export const ErrorManager = new ErrorManagerClass();
//# sourceMappingURL=wf_ErrorManager.js.map