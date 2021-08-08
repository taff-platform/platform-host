import {app, ipcMain, Menu} from "electron"
import {RuntimeProcess} from "./runtime-process";
import {App, AppRegistry} from "../app";
import {isAppModel} from "../app/app";

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

    public start(application: AppRegistry | App,
                 path?: RuntimeStartPath | RuntimeStartCallback,
                 callback: RuntimeStartCallback = typeof path === 'function' ? path : undefined) {

        const registry = isAppModel(application) ? {
            [`${application.target}`]: application
        } : (application as any);

        this.register(registry);

        const pathMap = toApplicationRegistryPathMap(registry, path as any);
        const taskList = Object.keys(registry)
            .filter(key => isAppModel(registry[key]))
            .map(appId => this.get(appId)
            .run(pathMap[appId])
            .then(process => {
                return {
                    appId,
                    process
                }
            }));

        const startup = Promise.all(taskList)
            .then(runtimeList => {
                return runtimeList.reduce((map, processEntry) => {
                    return {
                        ...map,
                        [processEntry.appId]: process
                    }
                }, {});
            });

        if (!callback) {
            return startup;
        }

        return startup.then((processMap: RuntimeProcessMap) => {
                if (callback) {
                    callback(null, processMap);
                }
            }).catch(error => {
                if (callback) {
                    callback(error, null);
                } else {
                    throw error;
                }
            });
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

export interface RuntimeProcessMap {
    [key: string]: RuntimeProcess;
}

export interface ApplicationRegistryPathMap {
    [key: string]: string;
}

export type RuntimeStartPath = ApplicationRegistryPathMap | string;
export type RuntimeStartCallback = (error: Error, processMap: RuntimeProcessMap) => any;

function toApplicationRegistryPathMap(registry: AppRegistry, path: RuntimeStartPath): ApplicationRegistryPathMap {
    if (typeof path === 'object') {
        return path as ApplicationRegistryPathMap;
    }

    if (typeof path === 'string') {
        return Object.keys(registry).reduce((map, appId) => {
            return {
                ...map,
                [appId]: path
            }
        }, {})
    }

    return {};
}
