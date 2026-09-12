class Settings extends SettingsInterface
{
    static #LOCAL_STORAGE_PREFIX = "digital-clock_";
    
    /**
     * Use a "PM" indicator if true, a 24-hour clock otherwise
     * @type {boolean}
     */
    #useTwelveHourClock = false;
    
    /**
     * Whether to display the seconds
     * @type {boolean}
     */
    #displaySeconds = false;
    
    /**
     * Whether to display a leading zero for the hours
     * @type {boolean}
     */
    #displayLeadingZero = false;
    
    /**
     * Whether to use sharp digits. If not, use slightly rounded digits.
     * @type {boolean}
     */
    #useSharpDigits = false;
    
    /**
     * Angle to use to slant the whole SVG, in degrees [0-10]
     * @type {number}
     */
    #slantAngle = 5;
    static #SLANT_ANGLE_MIN = 0;
    static #SLANT_ANGLE_MAX = 10;
    
    /**
     * Opacity of the "off" segments in percent [0-30]
     * @type {number}
     */
    #offSegmentsOpacity = 0;
    static #OFF_SEGMENTS_OPACITY_MIN = 0;
    static #OFF_SEGMENTS_OPACITY_MAX = 30;
    
    /**
     * Digit's wear level in percent [0-100]
     * @type {number}
     */
    #wearLevel = 0;
    static #WEAR_LEVEL_MIN = 0;
    static #WEAR_LEVEL_MAX = 50;
    
    /**
     * Color to use for the digits
     * @type {string}
     */
    #foregroundColor = "#ff0000";
    
    /**
     * Color to use for the background
     * @type {string}
     */
    #backgroundColor = "#000000";
    
    /**
     * Background grain opacity in percent [0-10]
     * @type {number}
     */
    #backgroundGrain = 0;
    static #BACKGROUND_GRAIN_MIN = 0;
    static #BACKGROUND_GRAIN_MAX = 10;
    
    /**
     * Color to use for the digit's shadow / glow
     * @type {string}
     */
    #shadowColor = "#ff0000";
    
    /**
     * Opacity of the digit's shadow / glow [0-100]
     */
    #shadowOpacity = 0;
    static #SHADOW_OPACITY_MIN = 0;
    static #SHADOW_OPACITY_MAX = 100;
    
    /**
     * Blur radius for the digit's shadow / glow [0-12]
     */
    #shadowBlurRadius = 12;
    static #SHADOW_BLUR_RADIUS_MIN = 0;
    static #SHADOW_BLUR_RADIUS_MAX = 12;
    
    /**
     * Horizontal offset for the digit's shadow / glow
     * @type {number}
     */
    #shadowOffsetX = 0;
    static #SHADOW_OFFSET_X_MIN = -10;
    static #SHADOW_OFFSET_X_MAX = 10;
    
    /**
     * Vertical offset for the digit's shadow / glow
     * @type {number}
     */
    #shadowOffsetY = 0;
    static #SHADOW_OFFSET_Y_MIN = -10;
    static #SHADOW_OFFSET_Y_MAX = 10;
    
    constructor()
    {
        super();
        
        const dummyDateTimeFormatter = new Intl.DateTimeFormat(navigator.language, {timeStyle: "short"});
        const dateTimeParts = dummyDateTimeFormatter.formatToParts(Date.now());
        const useTwelveHourClockByDefault = (dateTimeParts.findIndex((element) => element.type === "dayPeriod") > -1);
        
        this.#useTwelveHourClock = this.#getBooleanFromLocalStorage(
            Settings.#LOCAL_STORAGE_PREFIX + SettingsEnum.useTwelveHourClock,
            useTwelveHourClockByDefault // Default value, in case the value from localStorage can't be parsed.
        );
        
        this.#displaySeconds = this.#getBooleanFromLocalStorage(
            Settings.#LOCAL_STORAGE_PREFIX + SettingsEnum.displaySeconds,
            this.#displaySeconds // Keep the initial value if the value from localStorage can't be parsed.
        );
        
        this.#displayLeadingZero = this.#getBooleanFromLocalStorage(
            Settings.#LOCAL_STORAGE_PREFIX + SettingsEnum.displayLeadingZero,
            this.#displayLeadingZero
        );
        
        this.#useSharpDigits = this.#getBooleanFromLocalStorage(
            Settings.#LOCAL_STORAGE_PREFIX + SettingsEnum.useSharpDigits,
            this.#useSharpDigits
        );
        
        this.#slantAngle = this.#getIntFromLocalStorage(
            Settings.#LOCAL_STORAGE_PREFIX + SettingsEnum.slantAngle,
            Settings.#SLANT_ANGLE_MIN,
            Settings.#SLANT_ANGLE_MAX,
            this.#slantAngle
        );
        
        this.#offSegmentsOpacity = this.#getIntFromLocalStorage(
            Settings.#LOCAL_STORAGE_PREFIX + SettingsEnum.offSegmentsOpacity,
            Settings.#OFF_SEGMENTS_OPACITY_MIN,
            Settings.#OFF_SEGMENTS_OPACITY_MAX,
            this.#offSegmentsOpacity
        );
        
        this.#wearLevel = this.#getIntFromLocalStorage(
            Settings.#LOCAL_STORAGE_PREFIX + SettingsEnum.wearLevel,
            Settings.#WEAR_LEVEL_MIN,
            Settings.#WEAR_LEVEL_MAX,
            this.#wearLevel
        );
        
        this.#foregroundColor = localStorage.getItem(
            Settings.#LOCAL_STORAGE_PREFIX + SettingsEnum.foregroundColor
        ) ?? this.#foregroundColor;
        
        this.#backgroundColor = localStorage.getItem(
            Settings.#LOCAL_STORAGE_PREFIX + SettingsEnum.backgroundColor
        ) ?? this.#backgroundColor;
        
        this.#backgroundGrain = this.#getIntFromLocalStorage(
            Settings.#LOCAL_STORAGE_PREFIX + SettingsEnum.backgroundGrain,
            Settings.#BACKGROUND_GRAIN_MIN,
            Settings.#BACKGROUND_GRAIN_MAX,
            this.#backgroundGrain
        );
        
        this.#shadowColor = localStorage.getItem(
            Settings.#LOCAL_STORAGE_PREFIX + SettingsEnum.shadowColor
        ) ?? this.#shadowColor;
        
        this.#shadowOpacity = this.#getIntFromLocalStorage(
            Settings.#LOCAL_STORAGE_PREFIX + SettingsEnum.shadowOpacity,
            Settings.#SHADOW_OPACITY_MIN,
            Settings.#SHADOW_OPACITY_MAX,
            this.#shadowOpacity
        );
        
        this.#shadowBlurRadius = this.#getFloatFromLocalStorage( // Note: Float, not Int
            Settings.#LOCAL_STORAGE_PREFIX + SettingsEnum.shadowBlurRadius,
            Settings.#SHADOW_BLUR_RADIUS_MIN,
            Settings.#SHADOW_BLUR_RADIUS_MAX,
            this.#shadowBlurRadius
        );
        
        this.#shadowOffsetX = this.#getIntFromLocalStorage(
            Settings.#LOCAL_STORAGE_PREFIX + SettingsEnum.shadowOffsetX,
            Settings.#SHADOW_OFFSET_X_MIN,
            Settings.#SHADOW_OFFSET_X_MAX,
            this.#shadowOffsetX
        );
        
        this.#shadowOffsetY = this.#getIntFromLocalStorage(
            Settings.#LOCAL_STORAGE_PREFIX + SettingsEnum.shadowOffsetY,
            Settings.#SHADOW_OFFSET_Y_MIN,
            Settings.#SHADOW_OFFSET_Y_MAX,
            this.#shadowOffsetY
        );
        
        window.addEventListener("storage", (event) => { this.#handleStorageEvent(event) });
    }
    
    
    // Getters / Setters / Saving methods
    
    /**
     * Use a "PM" indicator if true, a 24-hour clock otherwise.
     * @returns {boolean}
     */
    get useTwelveHourClock()
    {
        return this.#useTwelveHourClock;
    }
    
    /**
     * @param {string|boolean} newValue "true", "false", true or false
     */
    set useTwelveHourClock(newValue)
    {
        this.#useTwelveHourClock = Sanitizer.sanitizeBoolean(newValue);
    }
    
    saveUseTwelveHourClock()
    {
        localStorage.setItem(
            Settings.#LOCAL_STORAGE_PREFIX + SettingsEnum.useTwelveHourClock,
            this.#useTwelveHourClock ? "true" : "false"
        );
        document.dispatchEvent(new SettingChangedEvent(SettingsEnum.useTwelveHourClock, this.#useTwelveHourClock));
    }
    
    /**
     * Whether to display the seconds
     * @returns {boolean}
     */
    get displaySeconds()
    {
        return this.#displaySeconds;
    }
    
    /**
     * @param {string|boolean} newValue "true", "false", true or false
     */
    set displaySeconds(newValue)
    {
        this.#displaySeconds = Sanitizer.sanitizeBoolean(newValue);
    }
    
    saveDisplaySeconds()
    {
        localStorage.setItem(
            Settings.#LOCAL_STORAGE_PREFIX + SettingsEnum.displaySeconds,
            this.#displaySeconds ? "true" : "false"
        );
        document.dispatchEvent(new SettingChangedEvent(SettingsEnum.displaySeconds, this.#displaySeconds));
    }
    
    /**
     * Whether to display a leading zero for the hours
     * @returns {boolean}
     */
    get displayLeadingZero()
    {
        return this.#displayLeadingZero;
    }
    
    /**
     * @param {string|boolean} newValue "true", "false", true or false
     */
    set displayLeadingZero(newValue)
    {
        this.#displayLeadingZero = Sanitizer.sanitizeBoolean(newValue);
    }
    
    saveDisplayLeadingZero()
    {
        localStorage.setItem(
            Settings.#LOCAL_STORAGE_PREFIX + SettingsEnum.displayLeadingZero,
            this.#displayLeadingZero ? "true" : "false"
        );
        document.dispatchEvent(new SettingChangedEvent(SettingsEnum.displayLeadingZero, this.#displayLeadingZero));
    }
    
    /**
     * Whether to use sharp digits. If not, use slightly rounded digits.
     * @returns {boolean}
     */
    get useSharpDigits()
    {
        return this.#useSharpDigits;
    }
    
    /**
     * @param {string|boolean} newValue "true", "false", true or false
     */
    set useSharpDigits(newValue)
    {
        this.#useSharpDigits = Sanitizer.sanitizeBoolean(newValue);
    }
    
    saveUseSharpDigits()
    {
        localStorage.setItem(
            Settings.#LOCAL_STORAGE_PREFIX + SettingsEnum.useSharpDigits,
            this.#useSharpDigits ? "true" : "false"
        );
        document.dispatchEvent(new SettingChangedEvent(SettingsEnum.useSharpDigits, this.#useSharpDigits));
    }
    
    /**
     * Angle to use to slant the whole SVG, in degrees [0-10]
     * @returns {number}
     */
    get slantAngle()
    {
        return this.#slantAngle;
    }
    
    /**
     * @param {string|number} newValue e.g. "5", 6, ...
     */
    set slantAngle(newValue)
    {
        this.#slantAngle = Sanitizer.sanitizeInt(newValue, Settings.#SLANT_ANGLE_MIN, Settings.#SLANT_ANGLE_MAX);
    }
    
    saveSlantAngle()
    {
        localStorage.setItem(
            Settings.#LOCAL_STORAGE_PREFIX + SettingsEnum.slantAngle,
            JSON.stringify(this.#slantAngle));
        document.dispatchEvent(new SettingChangedEvent(SettingsEnum.slantAngle, this.#slantAngle));
    }
    
    /**
     * Opacity of the "off" segments in percent [0-30]
     * @returns {number}
     */
    get offSegmentsOpacity()
    {
        return this.#offSegmentsOpacity;
    }
    
    /**
     * @param {string|number} newValue e.g. "0", 10, ...
     */
    set offSegmentsOpacity(newValue)
    {
        this.#offSegmentsOpacity = Sanitizer.sanitizeInt(
            newValue,
            Settings.#OFF_SEGMENTS_OPACITY_MIN,
            Settings.#OFF_SEGMENTS_OPACITY_MAX
        );
    }
    
    saveOffSegmentsOpacity()
    {
        localStorage.setItem(
            Settings.#LOCAL_STORAGE_PREFIX + SettingsEnum.offSegmentsOpacity,
            JSON.stringify(this.#offSegmentsOpacity)
        );
        document.dispatchEvent(new SettingChangedEvent(SettingsEnum.offSegmentsOpacity, this.#offSegmentsOpacity));
    }
    
    /**
     * Digit's wear level in percent [0-100]
     * @returns {number}
     */
    get wearLevel()
    {
        return this.#wearLevel;
    }
    
    /**
     * @param {string|number} newValue e.g. "0", 10, ...
     */
    set wearLevel(newValue)
    {
        this.#wearLevel = Sanitizer.sanitizeInt(newValue, Settings.#WEAR_LEVEL_MIN, Settings.#WEAR_LEVEL_MAX);
    }
    
    saveWearLevel()
    {
        localStorage.setItem(Settings.#LOCAL_STORAGE_PREFIX + SettingsEnum.wearLevel, JSON.stringify(this.#wearLevel));
        document.dispatchEvent(new SettingChangedEvent(SettingsEnum.wearLevel, this.#wearLevel));
    }
    
    /**
     * Color to use for the digits
     * @returns {string}
     */
    get foregroundColor()
    {
        return this.#foregroundColor;
    }
    
    /**
     * @param {string} newValue e.g. "rgb(255, 0, 0)"
     */
    set foregroundColor(newValue)
    {
        this.#foregroundColor = newValue;
    }
    
    saveForegroundColor()
    {
        localStorage.setItem(Settings.#LOCAL_STORAGE_PREFIX + SettingsEnum.foregroundColor, this.#foregroundColor);
        document.dispatchEvent(new SettingChangedEvent(SettingsEnum.foregroundColor, this.#foregroundColor));
    }
    
    /**
     * Color to use for the background
     * @returns {string}
     */
    get backgroundColor()
    {
        return this.#backgroundColor;
    }
    
    /**
     * @param {string} newValue e.g. "rgb(0, 0, 0)"
     */
    set backgroundColor(newValue)
    {
        this.#backgroundColor = newValue;
    }
    
    saveBackgroundColor()
    {
        localStorage.setItem(Settings.#LOCAL_STORAGE_PREFIX + SettingsEnum.backgroundColor, this.#backgroundColor);
        document.dispatchEvent(new SettingChangedEvent(SettingsEnum.backgroundColor, this.#backgroundColor));
    }
    
    /**
     * Background grain opacity in percent [0-10]
     * @returns {number}
     */
    get backgroundGrain()
    {
        return this.#backgroundGrain;
    }
    
    /**
     * @param {string|number}
     */
    set backgroundGrain(newValue)
    {
        this.#backgroundGrain = Sanitizer.sanitizeInt(
            newValue,
            Settings.#BACKGROUND_GRAIN_MIN,
            Settings.#BACKGROUND_GRAIN_MAX
        );
    }
    
    saveBackgroundGrain()
    {
        localStorage.setItem(
            Settings.#LOCAL_STORAGE_PREFIX + SettingsEnum.backgroundGrain,
            JSON.stringify(this.#backgroundGrain)
        );
        document.dispatchEvent(new SettingChangedEvent(SettingsEnum.backgroundGrain, this.#backgroundGrain));
    }
    
    /**
     * Color to use for the digit's shadow / glow
     * @returns {string}
     */
    get shadowColor()
    {
        return this.#shadowColor;
    }
    
    /**
     * @param {string} newValue e.g. "rgb(255, 0, 0)"
     */
    set shadowColor(newValue)
    {
        this.#shadowColor = newValue;
    }
    
    saveShadowColor()
    {
        localStorage.setItem(Settings.#LOCAL_STORAGE_PREFIX + SettingsEnum.shadowColor, this.#shadowColor);
        document.dispatchEvent(new SettingChangedEvent(SettingsEnum.shadowColor, this.#shadowColor));
    }
    
    /**
     * Opacity of the digit's shadow / glow [0-100]
     * @returns {number}
     */
    get shadowOpacity()
    {
        return this.#shadowOpacity;
    }
    
    set shadowOpacity(newValue)
    {
        this.#shadowOpacity = Sanitizer.sanitizeInt(
            newValue,
            Settings.#SHADOW_OPACITY_MIN,Settings.#SHADOW_OPACITY_MAX
        );
    }
    
    saveShadowOpacity()
    {
        localStorage.setItem(Settings.#LOCAL_STORAGE_PREFIX + SettingsEnum.shadowOpacity, this.#shadowOpacity);
        document.dispatchEvent(new SettingChangedEvent(SettingsEnum.shadowOpacity, this.#shadowOpacity));
    }
    
    /**
     * Blur radius for the digit's shadow / glow [0-12]
     * @returns {number}
     */
    get shadowBlurRadius()
    {
        return this.#shadowBlurRadius;
    }
    
    set shadowBlurRadius(newValue)
    {
        // Float, not int
        this.#shadowBlurRadius = Sanitizer.sanitizeFloat(
            newValue,
            Settings.#SHADOW_BLUR_RADIUS_MIN,
            Settings.#SHADOW_BLUR_RADIUS_MAX
        );
    }
    
    saveShadowBlurRadius()
    {
        localStorage.setItem(Settings.#LOCAL_STORAGE_PREFIX + SettingsEnum.shadowBlurRadius, this.#shadowBlurRadius);
        document.dispatchEvent(new SettingChangedEvent(SettingsEnum.shadowBlurRadius, this.#shadowBlurRadius));
    }
    
    /**
     * Horizontal offset for the digit's shadow / glow [0-100]
     * @returns {number}
     */
    get shadowOffsetX()
    {
        return this.#shadowOffsetX;
    }
    
    set shadowOffsetX(newValue)
    {
        this.#shadowOffsetX = Sanitizer.sanitizeInt(
            newValue,
            Settings.#SHADOW_OFFSET_X_MIN,
            Settings.#SHADOW_OFFSET_X_MAX
        );
    }
    
    saveShadowOffsetX()
    {
        localStorage.setItem(Settings.#LOCAL_STORAGE_PREFIX + SettingsEnum.shadowOffsetX, this.#shadowOffsetX);
        document.dispatchEvent(new SettingChangedEvent(SettingsEnum.shadowOffsetX, this.#shadowOffsetX));
    }
    
    /**
     * Vertical offset for the digit's shadow / glow [0-100]
     * @returns {number}
     */
    get shadowOffsetY()
    {
        return this.#shadowOffsetY;
    }
    
    set shadowOffsetY(newValue)
    {
        this.#shadowOffsetY = Sanitizer.sanitizeInt(
            newValue,
            Settings.#SHADOW_OFFSET_Y_MIN,
            Settings.#SHADOW_OFFSET_Y_MAX
        );
    }
    
    saveShadowOffsetY()
    {
        localStorage.setItem(Settings.#LOCAL_STORAGE_PREFIX + SettingsEnum.shadowOffsetY, this.#shadowOffsetY);
        document.dispatchEvent(new SettingChangedEvent(SettingsEnum.shadowOffsetY, this.#shadowOffsetY));
    }
    
    
    // Event handlers
    
    /**
     * @param {StorageEvent} event 
     */
    #handleStorageEvent(event)
    {        
        for (const settingName in SettingsEnum) {
            const settingStr = SettingsEnum[settingName];
            if (event.key === Settings.#LOCAL_STORAGE_PREFIX + settingStr) {
                this[settingName] = event.newValue;
                document.dispatchEvent(
                    // Dispatch the event with `this[settingName]` (correct type),
                    // *not* with `event.newValue` (always a string).
                    new SettingChangedEvent(settingStr, this[settingName])
                );
                return;
            }
        }
    }
    
    
    // Initialization methods

    #getBooleanFromLocalStorage(key, defaultValue)
    {
        const rawValue = localStorage.getItem(key);
        
        if (rawValue === "true") {
            return true;
        }
        
        if (rawValue === "false") {
            return false;
        }
        
        return defaultValue;
    }
    
    #getIntFromLocalStorage(key, min, max, defaultValue)
    {
        const rawValue = localStorage.getItem(key);
        const numberValue = Number.parseInt(rawValue);
        
        if (Number.isNaN(numberValue)) {
            return defaultValue;
        }
        
        return MathHelper.clamp(numberValue, min, max);
    }
    
    #getFloatFromLocalStorage(key, min, max, defaultValue)
    {
        const rawValue = localStorage.getItem(key);
        const numberValue = Number.parseFloat(rawValue);
        
        if (Number.isNaN(numberValue)) {
            return defaultValue;
        }
        
        return MathHelper.clamp(numberValue, min, max);
    }
}
