import {BrowserWindow, BrowserWindowConstructorOptions} from "electron";

export interface AppOptions {
    window: BrowserWindowConstructorOptions;
    animate?: boolean;
    configure?: (window: BrowserWindow) => any
}

export type AppOptionsLike = AppOptions | BrowserWindowConstructorOptions;
export function isAppOptions(optionsLike: AppOptionsLike): optionsLike is AppOptions {
    return (optionsLike as AppOptions).window !== undefined;

}
