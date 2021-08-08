import {app, ipcMain, Menu} from "electron"
import {RuntimeProcess} from "./runtime-process";
import {App, AppRegistry} from "../app";

export class Runtime {

    private task: Map<string, App> = new Map<string, App>();
    private boot: Promise<any>;

    constructor(public options = {
        debug: false,
    }) {
    }

    public setup() {
        Menu.setApplicationMenu(null);

        app.addListener('window-all-closed', this.quit);

        ipcMain.on('system:cmd', (event, action) => {

            switch (action) {
                case "exit":
                    this.quit()
            }
        });
    }

    public register(registry: AppRegistry | any): Runtime {
        for (let registryKey in registry) {
            if (!registry.hasOwnProperty(registryKey)) {
                continue;
            }

            const app: App = registry[registryKey];

            this.add(registryKey, app);
        }

        return this;
    }

    public add(key, app: App) {
        this.task.set(key, app);
    }

    public async ensure() {
        if (this.boot) {
            return await this.boot;
        }

        this.boot = app
            .whenReady()
            .then(() => this.setup());

        await this.boot;
    }

    public get(key) {
        return new RuntimeProcess(this, this.task.get(key));
    }

    private quit() {
        app.removeListener('window-all-closed', this.quit);
        app.quit();
    }

}
