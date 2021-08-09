import {Container, interfaces} from "inversify";
import {AppProcess} from "./core";

const container = new Container();

// container.bind<AppProcess>("Katana").toDynamicValue((context: interfaces.Context) => { return new Katana(); });
