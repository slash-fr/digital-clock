class FormattingHelper
{
    static #twoDigitFormatter = Intl.NumberFormat("en-US", { minimumIntegerDigits: 2 });
    
    /**
     * Formats a number with a minimum of 2 integer digits. Will add a leading zero if necessary.
     * @param {number} number e.g. 1
     * @returns {string} e.g. "01"
     */
    static formatWithTwoDigits(number)
    {
        return FormattingHelper.#twoDigitFormatter.format(number);
    }
}
