export class Flag {

    constructor(public key: string) {
    }

    static for(key: string) {
        return new Flag(key);
    }

    resolve(action: () => any, orElse: () => any) {
        if (Flag.is(this.key)) {
            return action();
        }
        return orElse();
    }

    static is(key: string) {
        return ["Y", "y", "TRUE", "true"].includes(process.env[key]);
    }
}
