/**
 * "Fixed" settings (apart from a few display options that come from the main settings)
 */
class SettingsPreset extends SettingsInterface
{
    /**
     * @type {SettingsInterface}
     */
    #mainSettings;
    
    #useSharpDigits;
    #slantAngle;
    #offSegmentsOpacity;
    #wearLevel;
    #foregroundColor;
    #backgroundColor;
    #backgroundGrain;
    #shadowColor;
    #shadowOpacity;
    #shadowBlurRadius;
    #shadowOffsetX;
    #shadowOffsetY;
    
    /**
     * @param {SettingsInterface} mainSettings 
     * @param {boolean} useSharpDigits 
     * @param {number} slantAngle 
     * @param {number} offSegmentsOpacity 
     * @param {number} wearLevel 
     * @param {string} foregroundColor 
     * @param {number} backgroundColor 
     * @param {number} backgroundGrain 
     * @param {string} shadowColor 
     * @param {number} shadowOpacity 
     * @param {number} shadowBlurRadius 
     * @param {number} shadowOffsetX 
     * @param {number} shadowOffsetY 
     */
    constructor(
        mainSettings,
        useSharpDigits,
        slantAngle,
        offSegmentsOpacity,
        wearLevel,
        foregroundColor,
        backgroundColor,
        backgroundGrain,
        shadowColor,
        shadowOpacity,
        shadowBlurRadius,
        shadowOffsetX,
        shadowOffsetY,
    ) {
        super();
        
        this.#mainSettings = mainSettings;
        
        this.#useSharpDigits = useSharpDigits;
        this.#slantAngle = slantAngle;
        this.#offSegmentsOpacity = offSegmentsOpacity;
        this.#wearLevel = wearLevel;
        this.#foregroundColor = foregroundColor;
        this.#backgroundColor = backgroundColor;
        this.#backgroundGrain = backgroundGrain;
        this.#shadowColor = shadowColor;
        this.#shadowOpacity = shadowOpacity;
        this.#shadowBlurRadius = shadowBlurRadius;
        this.#shadowOffsetX = shadowOffsetX;
        this.#shadowOffsetY = shadowOffsetY;
    }
    
    // A few settings aren't overridden by presets:
    
    get useTwelveHourClock()
    {
        return this.#mainSettings.useTwelveHourClock;
    }
    
    get displayLeadingZero()
    {
        return this.#mainSettings.displayLeadingZero;
    }
    
    get displaySeconds()
    {
        return this.#mainSettings.displaySeconds;
    }
    
    // Settings below are impacted by the presets
    
    get useSharpDigits()
    {
        return this.#useSharpDigits;
    }
    
    get slantAngle()
    {
        return this.#slantAngle;
    }
    
    get offSegmentsOpacity()
    {
        return this.#offSegmentsOpacity;
    }
    
    get wearLevel()
    {
        return this.#wearLevel;
    }
    
    get foregroundColor()
    {
        return this.#foregroundColor;
    }
    
    get backgroundColor()
    {
        return this.#backgroundColor;
    }
    
    get backgroundGrain()
    {
        return this.#backgroundGrain;
    }
    
    get shadowColor()
    {
        return this.#shadowColor;
    }
    
    get shadowOpacity()
    {
        return this.#shadowOpacity;
    }
    
    get shadowBlurRadius()
    {
        return this.#shadowBlurRadius;
    }
    
    get shadowOffsetX()
    {
        return this.#shadowOffsetX;
    }
    
    get shadowOffsetY()
    {
        return this.#shadowOffsetY;
    }
}
