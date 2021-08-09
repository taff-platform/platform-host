import {BrowserWindow} from "electron"
import {App} from "./index";
import {Host} from "../host";
import {AppOptions} from "./app-options";

export class AppProcess {
    public window: BrowserWindow;

    constructor(private host: Host, private app: App) {
    }

    public hide() {
        if (!this.window) {
            return;
        }

        this.window.hide();
    }

    public async ensure() {
        await this.host.ensure();

        this.window = this.window || new BrowserWindow(this.app.options.window);

        if (this.app.options.configure) {
            await this.app.options.configure(this.window);
        }
    }

    public configure(options: AppOptions) {
        const {
            window = {},
            animate = false
        } = options;

        if (window.hasOwnProperty('width')
         && window.hasOwnProperty('height')) {
            this.window.setSize(
                window.width,
                window.height,
                animate
            );
        }
    }

    async run(path: (any | string) = '', overrides = {}) {
        await this.ensure();

        let targetLocation = typeof path === 'string' ? path : '';

        const options = Object.assign({}, typeof path === 'string' ? {} : path, overrides || {});

        this.configure(options);

        let task;
        let location = this.app.target + targetLocation;

        if (location.startsWith("http")) {
            task = this.window.loadURL(location);
        } else {
            task = this.window.loadFile(location);
        }

        await task;

        return this;
    }

    async send(path = '', payload: any) {
        this.window.webContents.send(path, payload);

        return this;
    }
}
