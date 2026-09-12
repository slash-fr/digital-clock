class Sanitizer
{
    /**
     * @param {string|bool} value "true", "false", true or false
     * @returns {boolean} The sanitized boolean value
     */
    static sanitizeBoolean(value)
    {
        if (typeof value === "boolean") {
            return value;
        }
        
        if (value === "true") {
            return true;
        }
        
        if (value === "false") {
            return false;
        }
        
        console.error('Invalid "boolean" value: ' + JSON.stringify(value));
        
        return false;
    }
    
    /**
     * @param {string|number} value 
     * @param {number} min Integer minimum
     * @param {number} max Integer maximum
     * @returns {number} The sanitized integer value
     */
    static sanitizeInt(value, min, max)
    {
        if (typeof value !== "number" || !Number.isInteger(value)) {
            const intValue = Number.parseInt(value);
            if (Number.isNaN(intValue)) {
                console.error('Invalid "integer" value: ' + JSON.stringify(value));
                intValue = 0;
            }
            value = intValue;
        }
        
        const clampedValue = MathHelper.clamp(value, min, max);
        
        if (clampedValue !== value) {
            console.warn("Integer value out of range: " + value + " clamped to [" + min + "-" + max + "]");
        }
        
        return clampedValue;
    }
    
    /**
     * @param {string|number} value 
     * @param {number} min Minimum
     * @param {number} max Maximum
     * @returns {number} The sanitized float value
     */
    static sanitizeFloat(value, min, max)
    {
        if (typeof value !== "number") {
            const floatValue = Number.parseFloat(value);
            if (Number.isNaN(floatValue)) {
                console.error('Invalid "float" value: ' + JSON.stringify(value));
                floatValue = 0;
            }
            value = floatValue;
        }
        
        const clampedValue = MathHelper.clamp(value, min, max);
        
        if (clampedValue !== value) {
            console.warn("Float value out of range: " + value + " clamped to [" + min + "-" + max + "]");
        }
        
        return clampedValue;
    }
}
