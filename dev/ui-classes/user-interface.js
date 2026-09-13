class UserInterface
{
    /** @type {BurnInWarningDialog} */
    #burnInWarningDialog;
    
    /** @type {PresetDialog} */
    #presetDialog;
    
    /** @type {number|null} */
    #controlsDebounceTimestamp = null;
    
    /** @type {number|null} */
    #controlsVisibilityTimeout = null;
    
    /** @type {HTMLElement} */
    #controlsElement;
    
    /** @type {HTMLButtonElement} */
    #settingsButton;
    
    /** @type {SettingsDialog} */
    #settingsDialog;
    
    /** @type {HTMLButtonElement} */
    #enterFullscreenButton;
    
    /** @type {HTMLButtonElement} */
    #exitFullscreenButton;
    
    /** @type {WakeLockSentinel|null} */
    #wakeLock = null;
    
    /**
     * @param {Settings} settings 
     * @param {CurrentTime} currentTime
     */
    constructor(settings, currentTime)
    {
        this.#hideLoadingMessage();
        this.#setupBurnInWarning();
        this.#generateBackgroundGrain(); // Must be called *before* setupPresetDialog() (needed by some presets)
        this.#setupPresetDialog(settings, currentTime);
        this.#setupControls();
        this.#setupWakeLock();
        this.#setupSettingsDialog(settings);
        this.#setupFullscreenMode();
        this.#setupAccentColor();
    }
    
    #hideLoadingMessage()
    {
        document.getElementById("loading-message").style.display = "none";
    }
    
    #setupBurnInWarning()
    {
        this.#burnInWarningDialog = new BurnInWarningDialog();
        
        // "Burn-in warning..." button in the settings
        document.getElementById("burn-in-warning-button").addEventListener("click", (event) => {
            this.#burnInWarningDialog.show();
        });
    }
    
    /**
     * 
     * @param {Settings} mainSettings 
     * @param {CurrentTime} currentTime 
     */
    #setupPresetDialog(mainSettings, currentTime)
    {
        this.#presetDialog = new PresetDialog(mainSettings, currentTime);
        
        // "Presets..." button in the settings
        document.getElementById("presets-button").addEventListener("click", (event) => {
            this.#presetDialog.show();
        });
        
        // Detect the first run
        const riskAcceptedAt = Number.parseInt(localStorage.getItem("digital-clock_risk-accepted-at"));
        if (Number.isNaN(riskAcceptedAt)) {
            // First run
            this.#presetDialog.show();
        }
    }
    
    #setupControls()
    {
        this.#controlsElement = document.getElementById("controls");
        
        document.addEventListener('mousemove', this.#showControls.bind(this));
        document.addEventListener('mousedown', this.#showControls.bind(this));
        document.addEventListener('mouseup', this.#showControls.bind(this));
        document.addEventListener('wheel', this.#showControls.bind(this));
        document.addEventListener('touchstart', this.#showControls.bind(this));
        document.addEventListener('touchend', this.#showControls.bind(this));
        document.addEventListener('touchmove', this.#showControls.bind(this));
        document.addEventListener('keydown', this.#showControls.bind(this));
        document.addEventListener('keyup', this.#showControls.bind(this));
    }
    
    #showControls()
    {
        // Debounce (don't run showControls() more than once every 500 milliseconds)
        if (this.#controlsDebounceTimestamp !== null && this.#controlsDebounceTimestamp > performance.now() - 500) {
            return;
        }
        
        if (this.#burnInWarningDialog.isVisible || this.#settingsDialog.isVisible || this.#presetDialog.isVisible) {
            // No need to show the controls *behind* the dialogs
            // + it would mess with the "click" or "touch" events on iOS
            return;
        }
        
        this.#controlsDebounceTimestamp = performance.now();
        
        // Reset the visibility timeout
        if (this.#controlsVisibilityTimeout !== null) {
            clearTimeout(this.#controlsVisibilityTimeout);
            this.#controlsVisibilityTimeout = null;
        }
        
        // Show the controls
        this.#controlsElement.classList.add("visible");
        
        // Set the control timeout to 2 seconds (unless it gets cancelled in the meantime)
        this.#controlsVisibilityTimeout = setTimeout(() => {
            // Hide the controls
            this.#controlsElement.classList.remove("visible");
        }, 2000);
    }
    
    #setupWakeLock()
    {
        this.#requestWakeLock();

        // On iOS, the WakeLock request only works *after* the user interacts with the document
        document.addEventListener("click", this.#requestWakeLock.bind(this));
        
        // Reacquire the lock on visibilitychange
        document.addEventListener("visibilitychange", async () => {
            if (document.visibilityState === "visible") {
                this.#requestWakeLock();
            }
        });
        // TODO: Maybe don't use a wake lock when displaying the "burn-in warning" or the settings?
    }
    
    async #requestWakeLock()
    {
        if (this.#wakeLock !== null && !this.#wakeLock.released) {
            // There already is an active WakeLock
            return;
        }
        
        try {
            this.#wakeLock = await navigator.wakeLock.request("screen");
        } catch (error) {
            console.error(error);
        }
    }
    
    /**
     * @param {Settings} settings 
     */
    #setupSettingsDialog(settings)
    {
        this.#settingsButton = document.getElementById("settings-button");
        this.#settingsDialog = new SettingsDialog(settings);
        
        this.#settingsButton.addEventListener("click", (event) => {
            this.#settingsDialog.show();
            this.#controlsElement.classList.remove("visible");
            document.getElementById("time-svg").classList.add("mini-preview");
        });
        
        document.addEventListener(SettingsDialogClosedEvent, (event) => {
            document.getElementById("time-svg").classList.remove("mini-preview");
        });
    }
    
    #setupFullscreenMode()
    {
        this.#enterFullscreenButton = document.getElementById("enter-fullscreen-button");
        this.#exitFullscreenButton = document.getElementById("exit-fullscreen-button");
        
        if (!("requestFullscreen" in document.body)) {
            this.#enterFullscreenButton.style.display = "none";
        }

        // Enter fullscreen
        this.#enterFullscreenButton.addEventListener("click", (event) => {
            if (!document.fullscreenElement) { // We aren't already in fullscreen mode
                document.body.requestFullscreen({ navigationUI: "hide" });
            }
        });

        this.#exitFullscreenButton.addEventListener("click", (event) => {
            if (document.fullscreenElement) { // We are indeed in fullscreen mode
                document.exitFullscreen();
            }
        });

        document.body.addEventListener("fullscreenchange", (event) => {
            if (document.fullscreenElement) {
                this.#enterFullscreenButton.style.display = "none";
                this.#exitFullscreenButton.style.display = "block";
            } else {
                this.#exitFullscreenButton.style.display = "none";
                if ("requestFullscreen" in document.body) {
                    this.#enterFullscreenButton.style.display = "block";
                }
            }
        });
    }
    
    #generateBackgroundGrain()
    {
        const grainyBackgroundDiv = document.getElementById("grainy-background");
        const backgroundGrainInput = document.getElementById("background-grain-input");
        const grainCanvas = document.createElement("canvas");
        const grainCanvasContext = grainCanvas.getContext("2d");
        grainCanvas.width = 256;
        grainCanvas.height = 256;

        for (let x = 0; x < grainCanvas.width; x++) {
            for (let y = 0; y < grainCanvas.height; y++) {
                const brightnessValue = Math.random(); // Noise / static
                
                // if (brightnessValue < 0.5) {
                //     grainCanvasContext.fillStyle = "rgba(0, 0, 0, " + (0.5 - brightnessValue) * 2 + ")";
                //     grainCanvasContext.fillRect(x, y, 1, 1);
                // } else {
                //     grainCanvasContext.fillStyle = "rgba(255, 255, 255, " + (brightnessValue - 0.5) * 2 + ")";
                //     grainCanvasContext.fillRect(x, y, 1, 1);
                // }
                
                if (brightnessValue < 0.25) {
                    grainCanvasContext.fillStyle = "rgba(0, 0, 0, 1)";
                    grainCanvasContext.fillRect(x, y, 1, 1);
                } else if (brightnessValue > 0.75) {
                    grainCanvasContext.fillStyle = "rgba(255, 255, 255, 1)";
                    grainCanvasContext.fillRect(x, y, 1, 1);
                }
            }
        }
        
        grainyBackgroundDiv.style.backgroundImage = "url(" + grainCanvas.toDataURL() + ")";
    }
    
    #setupAccentColor()
    {
        document.body.style.accentColor = ColorHelper.getAccentColor();
        
        document.addEventListener(SettingChangedEvent, /** @param {SettingChangedEvent} event */ (event) => {
            if (event.setting === SettingsEnum.foregroundColor || event.setting === SettingsEnum.backgroundColor) {
                document.body.style.accentColor = ColorHelper.getAccentColor();
            }
        });
    }
}
