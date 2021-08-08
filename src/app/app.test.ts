import {App, APP_FALLBACK_OPTIONS} from "./app";

const TARGET = 'test.html';

describe('App', () => {
    test('App options are defaulted when none are provided', () => {
        const app = new App(TARGET);

        expect(app).toBeDefined();
        expect(app.options).toMatchObject(APP_FALLBACK_OPTIONS);
    });
    test('App options will default when partially provided ', () => {
        const app = new App(TARGET, {
            window: {
                height: -1
            }
        });

        expect(app).toBeDefined();

        expect(app.options.window.height).toEqual(-1);
        expect(app.options.window.width).toEqual(APP_FALLBACK_OPTIONS.window.width);
    });

});
