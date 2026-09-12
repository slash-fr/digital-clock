class MathHelper
{
    /**
     * Makes sure a value is within a specific range.
     * @param {number} value Value to clamp
     * @param {number} min Minimum allowed value
     * @param {number} max Maximum allowed value
     * @returns {number} The provided value, clamped to the specified interval
     */
    static clamp(value, min, max)
    {
        return Math.min(Math.max(min, value), max);
    }
}
