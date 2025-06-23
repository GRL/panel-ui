import {createRoot} from 'react-dom/client'
import {Widget} from './Widget'
import {App} from "@/models/app.ts"
import {Provider} from 'react-redux'

import {store} from './store'
import {setApp} from "@/models/appSlice.ts";

(function () {

    // Finding the script tag on the page..
    const scriptTags = document.querySelectorAll('script[data-bpuid]');
    let currentScript: HTMLScriptElement | null = null;
    for (const tag of scriptTags) {
        currentScript = tag as HTMLScriptElement;
    }

    // GRL Snippet configuration options
    const settings: App = {
        targetId: currentScript?.getAttribute("data-target") || 'grl-widget',
        bpid: currentScript?.getAttribute("data-bpid") || "invalid-bpid-from-snippet",
        bpuid: currentScript?.getAttribute("data-bpuid") || "invalid-bpuid-from-snippet",
        offerwall: currentScript?.getAttribute("data-offerwall") || "37d1da64",
        walletMode: Boolean(currentScript?.getAttribute("data-wallet")) || true,
        panelName: currentScript?.getAttribute("data-panel") || null,
        leaderboard: Boolean(currentScript?.getAttribute("data-leaderboard")) || false,

        currentPage: "offerwall"
    } as App
    store.dispatch(setApp(settings))

    // Avoid adding the widget multiple times
    const container: HTMLElement | null = document.getElementById(settings.targetId)
    if (container) {
        // ensure that it's empty?
    } else {
        let container = document.createElement('div')
        container.id = settings.targetId
        document.body.appendChild(container)
    }

    const root = createRoot(container)
    root.render(
        // <React.StrictMode>
            <Provider store={store}>
                <Widget/>
            </Provider>
        // </React.StrictMode>
    );

})()