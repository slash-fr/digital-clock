class ColorHelper
{   
    /**
     * Gets the RGB components of the currently used color (foreground or background)
     * @param {string} colorType "foreground" or "background"
     * @returns {Object|null} The color components (e.g. {red: 0, green: 128, blue: 255}) or null if parsing failed
     */
    static getColorComponents(colorType)
    {
        let computedColor;
        
        if (colorType === "background") {
            computedColor = getComputedStyle(document.body).backgroundColor;
        } else {
            computedColor = getComputedStyle(document.getElementById("time-svg")).color;
        }
        
        const matchArray = computedColor.match(
            /rgba?\(([0-9\.]+), ([0-9\.]+), ([0-9\.]+)(, [0-9\.]+)?\)/
        );
        
        if (matchArray === null) {
            console.warn("Could not parse " + colorType + " color: " + '"' + computedColor + '"');
            return null;
        }
        
        return {
            red: Number.parseInt(matchArray[1]),
            green: Number.parseInt(matchArray[2]),
            blue: Number.parseInt(matchArray[3]),
        };
    }
    
    /**
     * Computes the luminance of a color from its RGB components.
     * @param {number} red Integer number from 0 to 255
     * @param {number} green Integer number from 0 to 255
     * @param {number} blue Integer number from 0 to 255
     * @returns {number} Floating-point number from 0.0 to 1.0
     */
    static getLuminance(red, green, blue)
    {
        return 0.2126 * red / 255 + 0.7152 * green / 255 + 0.0722 * blue / 255;
    }
    
    /**
     * Returns the foreground color to use for the minutes in the favicon.
     * @param {SettingsInterface} settings
     * @returns {string} e.g. "rgba(255, 0, 0, 0.8)"
     */
    static getFaviconMinuteColor(settings)
    {
        const foregroundColorRGB = ColorHelper.getColorComponents("foreground");
            
        if (foregroundColorRGB === null) { // Could not parse the configured foreground color
            // Oh well... Just use the unmodified foreground color.
            return settings.foregroundColor;
        }
        
        const backgroundColorRGB = ColorHelper.getColorComponents("background");
        
        let opacity = 0.8;
        
        if (backgroundColorRGB !== null) {
            const backgroundLuminance = ColorHelper.getLuminance(
                backgroundColorRGB.red,
                backgroundColorRGB.green,
                backgroundColorRGB.blue,
            );
            
            if (backgroundLuminance > 0.6) {
                // On bright backgrounds, dim the minutes a lot more
                opacity = 0.3;
            }
        }
        
        return "rgba("
            + foregroundColorRGB.red + ", "
            + foregroundColorRGB.green + ", " 
            + foregroundColorRGB.blue + ", "
            + opacity + ")"; // Opacity
    }
    
    /**
    * Determines whether the current foreground color is lighter than the current background color.
    * @returns {boolean}
    */
    static isForegroundLighter()
    {
        const foregroundColorRGB = ColorHelper.getColorComponents("foreground");
        const backgroundColorRGB = ColorHelper.getColorComponents("background");
        
        if (foregroundColorRGB === null || backgroundColorRGB === null) {
            // Could not parse (at least) one of the colors
            return false;
        }
        
        const foregroundColorLuminance = ColorHelper.getLuminance(
            foregroundColorRGB.red,
            foregroundColorRGB.green,
            foregroundColorRGB.blue
        );
        
        const backgroundColorLuminance = ColorHelper.getLuminance(
            backgroundColorRGB.red,
            backgroundColorRGB.green,
            backgroundColorRGB.blue
        );
        
        return foregroundColorLuminance > backgroundColorLuminance;
    }
    
    static #MAX_ACCENT_COLOR_LUMINANCE = 0.67;
    
    /**
     * @returns {string} e.g. "rgb(255, 0, 0)"
     */
    static getAccentColor()
    {
        const foregroundColorRGB = ColorHelper.getColorComponents("foreground");
        const backgroundColorRGB = ColorHelper.getColorComponents("background");
        
        if (foregroundColorRGB === null || backgroundColorRGB === null) {
            // Could not parse (at least) one of the colors
            return "red";
        }
        
        const foregroundColorLuminance = ColorHelper.getLuminance(
            foregroundColorRGB.red,
            foregroundColorRGB.green,
            foregroundColorRGB.blue
        );
        
        const backgroundColorLuminance = ColorHelper.getLuminance(
            backgroundColorRGB.red,
            backgroundColorRGB.green,
            backgroundColorRGB.blue
        );
        
        let accentColorRGB;
        let accentColorLuminance;
        
        if (backgroundColorLuminance > foregroundColorLuminance) {
            accentColorRGB = backgroundColorRGB;
            accentColorLuminance = backgroundColorLuminance;
        } else {
            accentColorRGB = foregroundColorRGB;
            accentColorLuminance = foregroundColorLuminance;
        }
        
        if (accentColorLuminance > ColorHelper.#MAX_ACCENT_COLOR_LUMINANCE) {
            const luminanceCorrection = 1 - accentColorLuminance + ColorHelper.#MAX_ACCENT_COLOR_LUMINANCE;
            
            // Yes, it also desaturates the color, but it's no big deal
            accentColorRGB.red *= luminanceCorrection;
            accentColorRGB.green *= luminanceCorrection;
            accentColorRGB.blue *= luminanceCorrection;
        }
        
        return "rgb(" + accentColorRGB.red + ", " + accentColorRGB.green + ", " + accentColorRGB.blue + ")";
    }
    
}
