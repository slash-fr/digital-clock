class SettingsInterface
{
    /**
     * Use a "PM" indicator if true, a 24-hour clock otherwise.
     * @returns {boolean}
     */
    get useTwelveHourClock()
    {
        throw new Error("Not implemented");
    }
    
    /**
     * Whether to display the seconds
     * @returns {boolean}
     */
    get displaySeconds()
    {
        throw new Error("Not implemented");
    }
    
    /**
     * Whether to display a leading zero for the hours
     * @returns {boolean}
     */
    get displayLeadingZero()
    {
        throw new Error("Not implemented");
    }
    
    /**
     * Whether to use sharp digits. If not, use slightly rounded digits.
     * @returns {boolean}
     */
    get useSharpDigits()
    {
        throw new Error("Not implemented");
    }
    
    /**
     * Angle to use to slant the whole SVG, in degrees [0-10]
     * @returns {number}
     */
    get slantAngle()
    {
        throw new Error("Not implemented");
    }
    
    /**
     * Opacity of the "off" segments in percent [0-30]
     * @returns {number}
     */
    get offSegmentsOpacity()
    {
        throw new Error("Not implemented");
    }
    
    /**
     * Digit's wear level in percent [0-100]
     * @returns {number}
     */
    get wearLevel()
    {
        throw new Error("Not implemented");
    }
    
    /**
     * Color to use for the digits
     * @returns {string}
     */
    get foregroundColor()
    {
        throw new Error("Not implemented");
    }
    
    /**
     * Color to use for the background
     * @returns {string}
     */
    get backgroundColor()
    {
        throw new Error("Not implemented");
    }
    
    /**
     * Background grain opacity in percent [0-10]
     * @returns {number}
     */
    get backgroundGrain()
    {
        throw new Error("Not implemented");
    }
    
    /**
     * Color to use for the digit's shadow / glow
     * @returns {string}
     */
    get shadowColor()
    {
        throw new Error("Not implemented");
    }
    
    /**
     * Opacity of the digit's shadow / glow [0-100]
     * @returns {number}
     */
    get shadowOpacity()
    {
        throw new Error("Not implemented");
    }
    
    /**
     * Blur radius for the digit's shadow / glow [0-100]
     * @returns {number}
     */
    get shadowBlurRadius()
    {
        throw new Error("Not implemented");
    }
    
    /**
     * Horizontal offset for the digit's shadow / glow [0-100]
     * @returns {number}
     */
    get shadowOffsetX()
    {
        throw new Error("Not implemented");
    }
    
    /**
     * Vertical offset for the digit's shadow / glow [0-100]
     * @returns {number}
     */
    get shadowOffsetY()
    {
        throw new Error("Not implemented");
    }
}
