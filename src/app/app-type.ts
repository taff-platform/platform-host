
export class AppType {

    static MODAL = {
        window: {
            menuBarVisible: false,
            transparent: true,
            skipTaskbar: true,
            frame: false,
            show: true,
            alwaysOnTop: true,
        }
    }

    static FULLSCREEN = {
        window: {
            show: false
        },
        configure: window => {
            window.maximize();
            window.show();
        }
    }

}
