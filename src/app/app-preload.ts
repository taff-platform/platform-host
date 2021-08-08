import {ipcRenderer} from "electron";

document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {
        document.querySelectorAll('[data-runtime-cmd]').forEach(element => {
            const [event, action] = element.getAttribute('data-runtime-cmd').split(":");
            console.log(element, 'system:cmd', action)

            element.addEventListener(event, () => {
                console.log('system:cmd', action)

                ipcRenderer.send(`system:cmd`, action);
            });
        });
    }
});

window.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.on('www:set', (event, payload) => {
        const {
            select,
            content
        } = payload;

        document.querySelector(select).innerText = content;
    });
})
