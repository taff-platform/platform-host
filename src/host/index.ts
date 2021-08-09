import {Application} from "./application";
import {Host} from "./host";
import {Container} from "inversify";

export {Application, Host}

const container = new Container();

container.bind<Host>(Host).to(Host);

export function register<T>(app) {
    container.bind<T>(app).to(app);
}

export function start(app) {
    const runtime = container.resolve(app); 

    return runtime;
}
