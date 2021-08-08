import {join} from 'path';
import {merge} from 'lodash';
import {AppOptions, AppOptionsLike, isAppOptions} from "./app-options";
import {BrowserWindowConstructorOptions} from "electron";

export const APP_FALLBACK_OPTIONS = {
    window: {
        width: 500,
        height: 500,
        webPreferences: {
            preload: join(__dirname, 'app-preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        },
    },
    animate: false
}

export class App {

    public options: AppOptions;

    constructor(public target: string, options: AppOptions = APP_FALLBACK_OPTIONS) {
        this.options = merge(APP_FALLBACK_OPTIONS, options);
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
                        APP_FALLBACK_OPTIONS.window,
                        resolved.window,
                        option.window
                    ),
                    animate: resolved.animate || option.animate,
                    configure: [...(resolved as any).configure, option.configure]
                });

            } else {
                Object.assign(resolved, {
                    window: Object.assign({},
                        APP_FALLBACK_OPTIONS.window,
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

export function isAppModel(model: any): model is App {
    return (model as App).target !== undefined &&
           (model as App).options !== undefined;
}
