function retryCallback(callback) {
    let counter = 0;
    const maxRetries = 8;
    const timer = setInterval(() => {
        try {
            callback();
            clearInterval(timer);
        } catch (exc) {
            console.error(`Callback failed: ${++counter}`, exc);
            if (counter >= maxRetries) clearInterval(timer);
        }
    }, 250);
}

class GoogleChartsHelper {
    constructor(packages) {
        this.chartsPackages = packages;
        this.chartsLibraryLoaded = false;
        this.chartPendingCallbacks = [];

        google.charts.load('current', {
            'packages': ['corechart', 'bar', 'line'], 'callback': () => {
                this.chartsLibraryLoaded = true;
                this.pendingCallbacks.forEach(callback => retryCallback(callback));
            }
        });
    }

    /**
     * Resolve a promise once Google Charts has successfully loaded on this page.
     * @returns Promise
     */
    asyncLoad() {
        return new Promise(resolve => {
            if (this.chartsLibraryLoaded) retryCallback(resolve);
            else this.chartPendingCallbacks.push(resolve);
        });
    }
}
