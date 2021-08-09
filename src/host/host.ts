import {injectable} from "inversify";

@injectable()
export class Host {
    public go(path: string) {
        return "hit!";
    }
}
