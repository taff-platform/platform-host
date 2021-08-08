import {join} from 'path';
import {AppOptions, AppOptionsLike, isAppOptions} from "./app-options";
import {BrowserWindowConstructorOptions} from "electron";

const DEFAULT_APP_WINDOW = {
    width: 500,
    height: 500,
    webPreferences: {
        preload: join(__dirname, 'app-preload.js'),
        nodeIntegration: true,
        contextIsolation: false
    },
};

export class App {

    public options: AppOptions;

    constructor(public target: string, options: AppOptions) {
        this.options = Object.assign({}, {
            window: DEFAULT_APP_WINDOW,
            animate: false
        }, options)
    }

    static for(uri: string[] | string, ...options: AppOptionsLike[]) {
        const target = join(...[].concat(uri));

        let resolved: AppOptions = {
            configure: []
        } as any;

        for (let option of options) {
            if (isAppOptions(option)) {
                Object.assign(resolved, {
                    window: Object.assign({},
                        DEFAULT_APP_WINDOW,
                        resolved.window,
                        option.window
                    ),
                    animate: resolved.animate || option.animate,
                    configure: [...(resolved as any).configure, option.configure]
                });

            } else {
                Object.assign(resolved, {
                    window: Object.assign({},
                        DEFAULT_APP_WINDOW,
                        resolved.window,
                        option
                    )
                });
            }
        }

        const taskList = [...(resolved as any).configure];
        resolved.configure = window => {
            taskList.forEach(configure => {
                if (configure)
                    configure(window)
            });
        }

        return new App(target, resolved);
    }

}
