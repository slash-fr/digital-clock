const settings = new Settings();

const currentTime = new CurrentTime(settings);

const svgClock = new SvgClock(
    settings,
    currentTime,
    document.getElementById("time-svg"),
    document.body,
    "", // No suffix for the IDs (because this is the original SVG)
    document.getElementById("grainy-background")
);

const favicon = new Favicon(settings, currentTime);

const ui = new UserInterface(settings, currentTime);

// Service worker, for offline mode:
const registerServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
        try {
            const registration = await navigator.serviceWorker.register("service-worker.js");
            
            // if (registration.installing) {
            //     console.log("Service worker installing");
            // } else if (registration.waiting) {
            //     console.log("Service worker installed");
            // } else if (registration.active) {
            //     console.log("Service worker active");
            // }
            
            navigator.serviceWorker.addEventListener("controllerchange", (event) => {
                // Users shouldn't have to hit "reload" twice to get updated code (it's a frigging *web* app),
                // so we'll do it for them (hopefully before they've started interacting with the page).
                window.location.reload();
                // I considered adding an "Applying update..." message right before reloading,
                // but it was more disturbing than anything, because the update is nearly instant,
                // as it's loaded from the (updated) cache.
            });
            
        } catch (error) {
            console.error(`Service worker registration failed with ${error}`);
        }
    }
};

registerServiceWorker();
