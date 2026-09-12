class SettingsDialog extends AbstractDialog
{
    /** @type {Settings} */
    #settings;
    
    /** @type {HTMLElement} */
    #dialogElement;
    
    /** @type {HTMLButtonElement} */
    #closeButton;
    
    /** @type {HTMLInputElement} */
    #leadingZeroCheckbox;
    
    /** @type {HTMLInputElement} */
    #displaySecondsCheckbox;
    
    /** @type {HTMLInputElement} */
    #slantAngleInput;
    
    /** @type {HTMLInputElement} */
    #offSegmentsOpacityInput;
    
    /** @type {HTMLInputElement} */
    #wearLevelInput;
    
    /** @type {HTMLInputElement} */
    #foregroundColorInput;
    
    /** @type {HTMLInputElement} */
    #backgroundColorInput;
    
    /** @type {HTMLInputElement} */
    #backgroundGrainInput;
    
    /** @type {HTMLInputElement} */
    #shadowColorInput;
    
    /** @type {HTMLInputElement} */
    #shadowOpacityInput;
    
    /** @type {HTMLInputElement} */
    #shadowBlurInput;
    
    /** @type {HTMLInputElement} */
    #shadowOffsetXInput;
    
    /** @type {HTMLInputElement} */
    #shadowOffsetYInput;
    
    /**
     * @param {Settings} settings 
     */
    constructor(settings)
    {
        super();
        
        this.#settings = settings;
        this.#dialogElement = document.getElementById("settings-dialog");
        this.#setupCloseButton();
        this.#setupTwelveHourClockSetting();
        this.#setupDisplaySecondsSetting();
        this.#setupLeadingZeroSetting();
        this.#setupSharpDigitsSetting();
        this.#setupSlantAngleSetting();
        this.#setupOffSegmentOpacitySetting();
        this.#setupWearLevelSetting();
        this.#setupForegroundColorSetting();
        this.#setupBackgroundColorSetting();
        this.#setupBackgroundGrainSetting();
        this.#setupShadowColorSetting();
        this.#setupShadowOpacitySetting();
        this.#setupShadowBlurSetting();
        this.#setupShadowOffsetXSetting();
        this.#setupShadowOffsetYSetting();
        
        document.addEventListener(SettingChangedEvent, (event) => { this.#handleSettingChangedEvent(event); });
    }
    
    show()
    {
        super.show();
        this.#dialogElement.classList.add("visible");
    }
    
    hide()
    {
        super.hide();
        this.#dialogElement.classList.remove("visible");
        document.dispatchEvent(new SettingsDialogClosedEvent());
    }
    
    #setupCloseButton()
    {
        this.#closeButton = document.getElementById("close-settings-button");
        
        this.#closeButton.addEventListener("click", (event) => { this.hide(); });
    }
    
    #updateTwelveHourClockSettingControlValue()
    {
        const textValue = this.#settings.useTwelveHourClock ? "12" : "24";
        document.querySelector("input[name='time-convention'][value='" + textValue + "']").checked = true;
    }
    
    #setupTwelveHourClockSetting()
    {
        this.#updateTwelveHourClockSettingControlValue();
        
        for (const inputElement of document.getElementsByName("time-convention")) {
            inputElement.addEventListener("change", (event) => {
                this.#settings.useTwelveHourClock = (event.target.value === "12");
                this.#settings.saveUseTwelveHourClock();
            });
        }
    }
    
    #setupLeadingZeroSetting()
    {
        /** @type {HTMLInputElement} */
        this.#leadingZeroCheckbox = document.getElementById("leading-zero-checkbox");
        this.#leadingZeroCheckbox.checked = this.#settings.displayLeadingZero;
        
        this.#leadingZeroCheckbox.addEventListener("change", (event) => {
            this.#settings.displayLeadingZero = event.target.checked;
            this.#settings.saveDisplayLeadingZero();
        });
    }
    
    #setupDisplaySecondsSetting()
    {
        this.#displaySecondsCheckbox = document.getElementById("display-seconds-checkbox");
        this.#displaySecondsCheckbox.checked = this.#settings.displaySeconds;
        
        this.#displaySecondsCheckbox.addEventListener("change", (event) => {
            this.#settings.displaySeconds = event.target.checked;
            this.#settings.saveDisplaySeconds();
        });
    }
    
    #updateSharpDigitsControlValue()
    {
        const stringValue = this.#settings.useSharpDigits ? "sharp" : "rounded";
        document.querySelector("input[name='digit-shape'][value='" + stringValue + "']").checked = true;
    }
    
    #setupSharpDigitsSetting()
    {
        this.#updateSharpDigitsControlValue();
        
        for (const inputElement of document.getElementsByName("digit-shape")) {
            inputElement.addEventListener("change", (event) => {
                this.#settings.useSharpDigits = (event.target.value === "sharp");
                this.#settings.saveUseSharpDigits();
            });
        }
    }
    
    #setupSlantAngleSetting()
    {
        this.#slantAngleInput = document.getElementById("slant-digits-input");
        this.#slantAngleInput.value = this.#settings.slantAngle;
        
        this.#slantAngleInput.addEventListener("input", (event) => {
            this.#settings.slantAngle = event.target.value;
            this.#settings.saveSlantAngle();
        });
    }
    
    #setupOffSegmentOpacitySetting()
    {
        this.#offSegmentsOpacityInput = document.getElementById("off-segments-opacity-input");
        this.#offSegmentsOpacityInput.value = this.#settings.offSegmentsOpacity;
        
        this.#offSegmentsOpacityInput.addEventListener("input", (event) => {
            this.#settings.offSegmentsOpacity = event.target.value;
            this.#settings.saveOffSegmentsOpacity();
        });
    }
    
    #setupWearLevelSetting()
    {
        this.#wearLevelInput = document.getElementById("wear-level-input");
        this.#wearLevelInput.value = this.#settings.wearLevel;
        
        this.#wearLevelInput.addEventListener("input", (event) => {
            this.#settings.wearLevel = event.target.value;
            this.#settings.saveWearLevel();
        });
    }
    
    #setupForegroundColorSetting()
    {
        this.#foregroundColorInput = document.getElementById("foreground-color-input");
        this.#foregroundColorInput.value = this.#settings.foregroundColor;
        
        this.#foregroundColorInput.addEventListener("input", (event) => {
            this.#settings.foregroundColor = event.target.value;
            this.#settings.saveForegroundColor();
        });
    }
    
    #setupBackgroundColorSetting()
    {
        this.#backgroundColorInput = document.getElementById("background-color-input");
        this.#backgroundColorInput.value = this.#settings.backgroundColor;
        
        this.#backgroundColorInput.addEventListener("input", (event) => {
            this.#settings.backgroundColor = event.target.value;
            this.#settings.saveBackgroundColor();
        });
    }
    
    #setupBackgroundGrainSetting()
    {
        this.#backgroundGrainInput = document.getElementById("background-grain-input");
        this.#backgroundGrainInput.value = this.#settings.backgroundGrain;
        
        this.#backgroundGrainInput.addEventListener("input", (event) => {
            this.#settings.backgroundGrain = event.target.value;
            this.#settings.saveBackgroundGrain();
        });
    }
    
    #setupShadowColorSetting()
    {
        this.#shadowColorInput = document.getElementById("shadow-color-input");
        this.#shadowColorInput.value = this.#settings.shadowColor;
        
        this.#shadowColorInput.addEventListener("input", (event) => {
            this.#settings.shadowColor = event.target.value;
            this.#settings.saveShadowColor();
        });
    }
    
    #setupShadowOpacitySetting()
    {
        this.#shadowOpacityInput = document.getElementById("shadow-opacity-input");
        this.#shadowOpacityInput.value = this.#settings.shadowOpacity;
        
        this.#shadowOpacityInput.addEventListener("input", (event) => {
            this.#settings.shadowOpacity = event.target.value;
            this.#settings.saveShadowOpacity();
        });
    }
    
    #setupShadowBlurSetting()
    {
        this.#shadowBlurInput = document.getElementById("shadow-blur-input");
        this.#shadowBlurInput.value = this.#settings.shadowBlurRadius;
        
        this.#shadowBlurInput.addEventListener("input", (event) => {
            this.#settings.shadowBlurRadius = event.target.value;
            this.#settings.saveShadowBlurRadius();
        });
    }
    
    #setupShadowOffsetXSetting()
    {
        this.#shadowOffsetXInput = document.getElementById("shadow-x-offset-input");
        this.#shadowOffsetXInput.value = this.#settings.shadowOffsetX;
        
        this.#shadowOffsetXInput.addEventListener("input", (event) => {
            this.#settings.shadowOffsetX = event.target.value;
            this.#settings.saveShadowOffsetX();
        });
    }
    
    #setupShadowOffsetYSetting()
    {
        this.#shadowOffsetYInput = document.getElementById("shadow-y-offset-input");
        this.#shadowOffsetYInput.value = this.#settings.shadowOffsetY;
        
        this.#shadowOffsetYInput.addEventListener("input", (event) => {
            this.#settings.shadowOffsetY = event.target.value;
            this.#settings.saveShadowOffsetY();
        });
    }
    
    /**
     * @param {SettingChangedEvent} event 
     */
    #handleSettingChangedEvent(event)
    {
        // Fortunately, the "input" event isn't triggered when the value is changed via JavaScript
        // (Otherwise, we would end up in an infinite loop)
        
        if (event.setting === SettingsEnum.useTwelveHourClock) {
            this.#updateTwelveHourClockSettingControlValue();
            return;
        }
        
        if (event.setting === SettingsEnum.displayLeadingZero) {
            this.#leadingZeroCheckbox.checked = this.#settings.displayLeadingZero;
            return;
        }
        
        if (event.setting === SettingsEnum.displaySeconds) {
            this.#displaySecondsCheckbox.checked = this.#settings.displaySeconds;
            return;
        }
        
        if (event.setting === SettingsEnum.useSharpDigits) {
            this.#updateSharpDigitsControlValue();
            return;
        }
        
        if (event.setting === SettingsEnum.slantAngle) {
            this.#slantAngleInput.value = this.#settings.slantAngle;
            return;
        }
        
        if (event.setting === SettingsEnum.offSegmentsOpacity) {
            this.#offSegmentsOpacityInput.value = this.#settings.offSegmentsOpacity;
            return;
        }
        
        if (event.setting === SettingsEnum.wearLevel) {
            this.#wearLevelInput.value = this.#settings.wearLevel;
            return;
        }
        
        if (event.setting === SettingsEnum.foregroundColor) {
            this.#foregroundColorInput.value = this.#settings.foregroundColor;
            return;
        }
        
        if (event.setting === SettingsEnum.backgroundColor) {
            this.#backgroundColorInput.value = this.#settings.backgroundColor;
            return;
        }
        
        if (event.setting === SettingsEnum.backgroundGrain) {
            this.#backgroundGrainInput.value = this.#settings.backgroundGrain;
            return;
        }
        
        if (event.setting === SettingsEnum.shadowColor) {
            this.#shadowColorInput.value = this.#settings.shadowColor;
            return;
        }
        
        if (event.setting === SettingsEnum.shadowOpacity) {
            this.#shadowOpacityInput.value = this.#settings.shadowOpacity;
            return;
        }
        
        if (event.setting === SettingsEnum.shadowBlurRadius) {
            this.#shadowBlurInput.value = this.#settings.shadowBlurRadius;
            return;
        }
        
        if (event.setting === SettingsEnum.shadowOffsetX) {
            this.#shadowOffsetXInput.value = this.#settings.shadowOffsetX;
            return;
        }
        
        if (event.setting === SettingsEnum.shadowOffsetY) {
            this.#shadowOffsetYInput.value = this.#settings.shadowOffsetY;
            return;
        }
    }
}
