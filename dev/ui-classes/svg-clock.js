class SvgClock
{
    /** @type {SettingsInterface} */
    #settings;
    
    /** @type {CurrentTime} */
    #currentTime;
    
    /** @type {SVGSVGElement} */
    #svgElement;
    
    /**
     * HTML Element for the background *color* (not grain)
     * @type {HTMLElement}
     */
    #backgroundElement;
    
    /**
     * Suffix to append to IDs (and HREFs)
     * @type {string}
     */
    #idSuffix;
    
    /** @type {HTMLDivElement|null} */
    #grainyBackgroundElement;
    
    /** @type {SVGFEDropShadowElement} */
    #dropShadowElement;
    
    /** @type {SVGPathElement} */
    #pmIndicatorElement;
    
    /** @type {SVGGElement} */
    #firstHourDigitElement;
    
    /** @type {SVGGElement} */
    #firstHourDigitOffSegmentsElement;
    
    /** @type {SVGGElement} */
    #secondHourDigitElement;
    
    /** @type {SVGGElement} */
    #secondHourDigitOffSegmentsElement;
    
    /** @type {SVGGElement} */
    #blinkingDotsElement;
    
    /** @type {SVGGElement} */
    #firstMinuteDigitElement;
    
    /** @type {SVGGElement} */
    #firstMinuteDigitOffSegmentsElement;
    
    /** @type {SVGGElement} */
    #secondMinuteDigitElement;
    
    /** @type {SVGGElement} */
    #secondMinuteDigitOffSegmentsElement;
    
    /** @type {SVGGElement} */
    #firstSecondDigitElement;
    
    /** @type {SVGGElement} */
    #firstSecondDigitOffSegmentsElement;
    
    /** @type {SVGGElement} */
    #secondSecondDigitElement;
    
    /** @type {SVGGElement} */
    #secondSecondDigitOffSegmentsElement;
    
    #isPmIndicatorOn = true;
    #firstHourDigitStr = "8";
    #secondHourDigitStr = "8";
    #areBlinkingDotsOn = true;
    #firstMinuteDigitStr = "8";
    #secondMinuteDigitStr = "8";
    #firstSecondDigitStr = "8";
    #secondSecondDigitStr = "8";
        
    static #ASCII_DIGITS = {
        " ": [
            "     ",
            "     ",
            "     ",
            "     ",
            "     ",
        ],
        
        0: [
            // SvgClock.#ASCII_DIGITS[0][0][2] is NOT a space => The top segment is on
            // ↓
            " --- ",
            "|   |", // ← Characters 0 and 4 are NOT spaces => The top-left and top-right segments are on
            "     ", // ← Character 2 is a space => The middle segment is OFF
            "|   |", // ← Characters 0 and 4 are NOT spaces => The bottom-left and bottom-right segments are on
            " --- ",
            // ↑
            // SvgClock.#ASCII_DIGITS[0][4][2] is NOT a space => The bottom segment is on
        ],
         
        1: [
            "     ",
            "    |",
            "     ",
            "    |",
            "     ",
        ],
         
        2: [
            " --- ",
            "    |",
            " --- ",
            "|    ",
            " --- ",
        ],
         
        3: [
            " --- ",
            "    |",
            " --- ",
            "    |",
            " --- ",
        ],
         
        4: [
            "     ",
            "|   |",
            " --- ",
            "    |",
            "     ",
        ],
         
        5: [
            " --- ",
            "|    ",
            " --- ",
            "    |",
            " --- ",
        ],
         
        6: [
            " --- ",
            "|    ",
            " --- ",
            "|   |",
            " --- ",
        ],
         
        7: [
            " --- ",
            "    |",
            "     ",
            "    |",
            "     ",
        ],
        
        8: [
            " --- ",
            "|   |",
            " --- ",
            "|   |",
            " --- ",
        ],
        
        9: [
            " --- ",
            "|   |",
            " --- ",
            "    |",
            " --- ",
        ],
    };
    
    /**
     * Position of each segment in the ASCII-art version of the 7-segment digits.
     * If the character in the ASCII-art string is a space, the segment is off. Otherwise, it's on.
     * @see SvgClock.#ASCII_DIGITS
     */
    static #SEGMENT_ASCII_COORDS = {
        "top": { row: 0, column: 2 },
        "top-left": { row: 1, column: 0 },
        "top-right": { row: 1, column: 4 },
        "middle": { row: 2, column: 2 },
        "bottom-left": { row: 3, column: 0 },
        "bottom-right": { row: 3, column: 4 },
        "bottom": { row: 4, column: 2 },
    };
    
    /**
     * These settings need to be updated even if we're using a preset
     */
    static #NON_PRESET_SETTINGS = [
        SettingsEnum.useTwelveHourClock,
        SettingsEnum.displaySeconds,
        SettingsEnum.displayLeadingZero,
    ];
    
    /**
     * These settings require fully refreshing the clock immediately, even if the clock didn't tick.
     * (Conversely, the slant angle, colors, background grain, and shadow options are independent from refreshes).
     */
    static #FORCE_REFRESH_SETTINGS = [
        SettingsEnum.useTwelveHourClock,
        SettingsEnum.displaySeconds,
        SettingsEnum.displayLeadingZero,
        SettingsEnum.useSharpDigits,
        SettingsEnum.offSegmentsOpacity,
        SettingsEnum.wearLevel,
    ];
    
    static #PM_INDICATOR_WIDTH = 92;
    static #LEADING_ZERO_ADDITIONAL_WIDTH = 68;
    
    static #DIGIT_POSITION = {
        firstHourDigit: 0,
        secondHourDigit: 1,
        firstMinuteDigit: 2,
        secondMinuteDigit: 3,
        firstSecondDigit: 4,
        secondSecondDigit: 5,
    };
    
    static #SECOND_DIGITS = [
        SvgClock.#DIGIT_POSITION.firstSecondDigit,
        SvgClock.#DIGIT_POSITION.secondSecondDigit,
    ];
    
    /**
     * Percentage of the time each segment is ON (decimal number between 0 and 1).
     * *Maybe* this should be computed, rather than hard-coded. (Maybe).
     * This whole "some-segments-age-faster-than-others" feature is overkill, anyway.
     */
    static #DIGIT_WEAR_LEVEL = {
        0: { // firstHourDigit
            "12-hour": {
                "with-leading-zero": { // The first digit will be 0 (for 9 hours) then 1 (for 3 hours [10, 11, 12])
                    "top": 9/12, // The top segment is ON 9 hours per 12 hour period
                    "top-left": 9/12,
                    "top-right": 12/12, // Yup, always ON
                    "middle": 0, // Always OFF
                    "bottom-left": 9/12,
                    "bottom-right": 12/12, // Also always ON
                    "bottom": 9/12,
                },
                "without-leading-zero": { // The first digit will be OFF (for 9 hours) then 1 (for 3 hours [10, 11, 12])
                    "top": 0,
                    "top-left": 0,
                    "top-right": 3/12,
                    "middle": 0,
                    "bottom-left": 0,
                    "bottom-right": 3/12,
                    "bottom": 0,
                },
            },
            "24-hour": {
                "with-leading-zero": { // 0 (for 10 hours) then 1 (for 10 hours) then 2 (for 4 hours)
                    "top": 14/24, // The top segment is ON 14 hours per day
                    "top-left": 10/24,
                    "top-right": 24/24, // Yup, always ON
                    "middle": 4/24,
                    "bottom-left": 14/24,
                    "bottom-right": 20/24,
                    "bottom": 14/24,
                },
                "without-leading-zero": { // OFF (for 10 hours) then 1 (for 10 hours) then 2 (for 4 hours)
                    "top": 4/24, // The top segment is ON 4 hours per day
                    "top-left": 0, // Never ON
                    "top-right": 14/24,
                    "middle": 4/24,
                    "bottom-left": 4/24,
                    "bottom-right": 10/24,
                    "bottom": 4/24,
                },
            },
        },
        1: { // secondHourDigit
            "12-hour": { // The second hour digit will be 2, then [1-9], then 0, then 1 (=> 1 and 2 are ON twice)
                "top": 9/12,
                "top-left": 6/12,
                "top-right": 10/12,
                "middle": 8/12,
                "bottom-left": 6/12,
                "bottom-right": 10/12,
                "bottom": 8/12,
            },
            "24-hour": { // The second hour digit will be [0-9], then [0-9] again, then [0-3]
                "top": 19/24,
                "top-left": 13/24,
                "top-right": 20/24,
                "middle": 16/24,
                "bottom-left": 10/24,
                "bottom-right": 21/24,
                "bottom": 17/24,
            },
        },
        2: { // firstMinuteDigit [0-5]
            "top": 40/60,
            "top-left": 30/60,
            "top-right": 50/60,
            "middle": 40/60,
            "bottom-left": 20/60,
            "bottom-right": 50/60,
            "bottom": 40/60,
        },
        3: { // secondMinuteDigit [0-9]
            "top": 8/10,
            "top-left": 6/10,
            "top-right": 8/10,
            "middle": 7/10,
            "bottom-left": 4/10,
            "bottom-right": 9/10,
            "bottom": 7/10,
        },
        4: { // firstSecondDigit [0-5]
            "top": 40/60,
            "top-left": 30/60,
            "top-right": 50/60,
            "middle": 40/60,
            "bottom-left": 20/60,
            "bottom-right": 50/60,
            "bottom": 40/60,
        },
        5: { // secondSecondDigit [0-9]
            "top": 8/10,
            "top-left": 6/10,
            "top-right": 8/10,
            "middle": 7/10,
            "bottom-left": 4/10,
            "bottom-right": 9/10,
            "bottom": 7/10,
        },
    };
    
    /**
     * 
     * @param {SettingsInterface} settings 
     * @param {CurrentTime} currentTime
     * @param {SVGSVGElement} svgElement 
     * @param {HTMLElement} backgroundElement
     * @param {HTMLDivElement|null} grainyBackgroundElement 
     */
    constructor(settings, currentTime, svgElement, backgroundElement, idSuffix = "", grainyBackgroundElement = null)
    {
        this.#settings = settings;
        this.#currentTime = currentTime;
        this.#svgElement = svgElement;
        this.#backgroundElement = backgroundElement;
        this.#idSuffix = idSuffix;
        this.#grainyBackgroundElement = grainyBackgroundElement;
        
        this.#dropShadowElement = this.#svgElement.querySelector("#shadow" + idSuffix + " feDropShadow");
        this.#pmIndicatorElement = this.#svgElement.getElementById("pm-indicator" + idSuffix);
        
        this.#firstHourDigitElement = this.#svgElement.getElementById("first-hour-digit" + idSuffix);
        this.#firstHourDigitOffSegmentsElement = this.#svgElement.getElementById(
            "first-hour-digit-off-segments" + idSuffix
        );
        
        this.#secondHourDigitElement = this.#svgElement.getElementById("second-hour-digit" + idSuffix);
        this.#secondHourDigitOffSegmentsElement = this.#svgElement.getElementById(
            "second-hour-digit-off-segments" + idSuffix
        );
        
        this.#blinkingDotsElement = this.#svgElement.getElementById("blinking-dots" + idSuffix);
        
        this.#firstMinuteDigitElement = this.#svgElement.getElementById("first-minute-digit" + idSuffix);
        this.#firstMinuteDigitOffSegmentsElement = this.#svgElement.getElementById(
            "first-minute-digit-off-segments" + idSuffix
        );
        
        this.#secondMinuteDigitElement = this.#svgElement.getElementById("second-minute-digit" + idSuffix);
        this.#secondMinuteDigitOffSegmentsElement = this.#svgElement.getElementById(
            "second-minute-digit-off-segments" + idSuffix
        );
        
        this.#firstSecondDigitElement = this.#svgElement.getElementById("first-second-digit" + idSuffix);
        this.#firstSecondDigitOffSegmentsElement = this.#svgElement.getElementById(
            "first-second-digit-off-segments" + idSuffix
        );
        
        this.#secondSecondDigitElement = this.#svgElement.getElementById("second-second-digit" + idSuffix);
        this.#secondSecondDigitOffSegmentsElement = this.#svgElement.getElementById(
            "second-second-digit-off-segments" + idSuffix
        );
        
        this.#applyInitialSettings();
        this.#updateClock(true);
        
        document.addEventListener(ClockTickedEvent, (event) => { this.#updateClock(); });
        document.addEventListener(SettingChangedEvent, this.#handleSettingChangedEvent.bind(this));
    }
    
    #applyInitialSettings()
    {
        this.#svgElement.style.transform = "skew(" + -this.#settings.slantAngle + "deg)";
        this.#svgElement.style.color = this.#settings.foregroundColor;
        this.#backgroundElement.style.background = this.#settings.backgroundColor;
        if (this.#grainyBackgroundElement !== null) {
            this.#grainyBackgroundElement.style.opacity = this.#settings.backgroundGrain + "%";
        }
        this.#dropShadowElement.setAttribute("flood-color", this.#settings.shadowColor);
        this.#dropShadowElement.setAttribute("flood-opacity", this.#settings.shadowOpacity + "%");
        this.#dropShadowElement.setAttribute("stdDeviation", this.#settings.shadowBlurRadius);
        this.#dropShadowElement.setAttribute("dx", this.#settings.shadowOffsetX);
        this.#dropShadowElement.setAttribute("dy", this.#settings.shadowOffsetY);
        
        this.#updateViewbox();
    }
    
    #updateClock(force = false)
    {
        if (force || this.#currentTime.isPmIndicatorOn !== this.#isPmIndicatorOn) {
            let pmIndicatorOpacity = "0";
            
            if (this.#settings.useTwelveHourClock) {
                pmIndicatorOpacity = this.#settings.offSegmentsOpacity + "%";
            }
            
            if (this.#currentTime.isPmIndicatorOn) {
                pmIndicatorOpacity = (100 - 0.5 * this.#settings.wearLevel) + "%";
            }
            
            this.#pmIndicatorElement.setAttribute("opacity", pmIndicatorOpacity);
            
            if (this.#currentTime.isPmIndicatorOn) {
                this.#pmIndicatorElement.setAttribute("filter", "url(#shadow" + this.#idSuffix + ")");
            } else {
                this.#pmIndicatorElement.setAttribute("filter", "url(#desaturate" + this.#idSuffix + ")");
            }
            this.#isPmIndicatorOn = this.#currentTime.isPmIndicatorOn;
        }
        
        // Hours
        let hourToDisplayStr = FormattingHelper.formatWithTwoDigits(this.#currentTime.hour);
        if (hourToDisplayStr[0] === "0" && !this.#settings.displayLeadingZero) {
            hourToDisplayStr = " " + hourToDisplayStr[1];
        }
        
        if (force || hourToDisplayStr[0] !== this.#firstHourDigitStr) {
            this.#refreshDigit(
                this.#firstHourDigitElement,
                this.#firstHourDigitOffSegmentsElement,
                hourToDisplayStr[0],
                SvgClock.#DIGIT_POSITION.firstHourDigit
            );
            this.#firstHourDigitStr = hourToDisplayStr[0];
        }
        
        if (force || hourToDisplayStr[1] !== this.#secondHourDigitStr) {
            this.#refreshDigit(
                this.#secondHourDigitElement,
                this.#secondHourDigitOffSegmentsElement,
                hourToDisplayStr[1],
                SvgClock.#DIGIT_POSITION.secondHourDigit
            );
            this.#secondHourDigitStr = hourToDisplayStr[1];
        }
        
        // Separator
        const shouldBlinkingDotsBeOn = (this.#settings.displaySeconds || this.#currentTime.millisecond >= 500);
        if (force || shouldBlinkingDotsBeOn !== this.#areBlinkingDotsOn) {
            let blinkingDotsOpacity = this.#settings.offSegmentsOpacity + "%";
            
            if (shouldBlinkingDotsBeOn) {
                const blinkingDotsWear = this.#settings.displaySeconds ? 1 : 0.5;
                // The blinking dots don't actually blink when seconds are displayed
                // => They will wear out faster
                blinkingDotsOpacity = (100 - blinkingDotsWear * this.#settings.wearLevel) + "%";
            }
            
            this.#blinkingDotsElement.setAttribute("opacity", blinkingDotsOpacity);
            
            if (shouldBlinkingDotsBeOn) {
                this.#blinkingDotsElement.setAttribute("filter", "url(#shadow" + this.#idSuffix + ")");
            } else {
                this.#blinkingDotsElement.setAttribute("filter", "url(#desaturate" + this.#idSuffix + ")");
            }
            
            this.#areBlinkingDotsOn = shouldBlinkingDotsBeOn;
        }
        
        // Minutes
        const minuteToDisplayStr = FormattingHelper.formatWithTwoDigits(this.#currentTime.minute);
        
        if (force || minuteToDisplayStr[0] !== this.#firstMinuteDigitStr) {
            this.#refreshDigit(
                this.#firstMinuteDigitElement,
                this.#firstMinuteDigitOffSegmentsElement,
                minuteToDisplayStr[0],
                SvgClock.#DIGIT_POSITION.firstMinuteDigit
            );
            this.#firstMinuteDigitStr = minuteToDisplayStr[0];
        }
        
        if (force || minuteToDisplayStr[1] !== this.#secondMinuteDigitStr) {
            this.#refreshDigit(
                this.#secondMinuteDigitElement,
                this.#secondMinuteDigitOffSegmentsElement,
                minuteToDisplayStr[1],
                SvgClock.#DIGIT_POSITION.secondMinuteDigit
            );
            this.#secondMinuteDigitStr = minuteToDisplayStr[1];
        }
        
        // Seconds
        const secondToDisplayStr = FormattingHelper.formatWithTwoDigits(this.#currentTime.second);
        
        if (force || secondToDisplayStr[0] !== this.#firstSecondDigitElement) {
            this.#refreshDigit(
                this.#firstSecondDigitElement,
                this.#firstSecondDigitOffSegmentsElement,
                secondToDisplayStr[0],
                SvgClock.#DIGIT_POSITION.firstSecondDigit
            );
            this.#firstSecondDigitStr = secondToDisplayStr[0];
        }
        
        if (force || secondToDisplayStr[1] !== this.#secondSecondDigitStr) {
            this.#refreshDigit(
                this.#secondSecondDigitElement,
                this.#secondSecondDigitOffSegmentsElement,
                secondToDisplayStr[1],
                SvgClock.#DIGIT_POSITION.secondSecondDigit
            );
            this.#secondSecondDigitStr = secondToDisplayStr[1];
        }
    }


    /**
     * @param {SVGGElement} digitElement
     * @param {SVGGElement} digitOffSegmentsElement
     * @param {string} digitStr "0" to "9"
     * @param {number} digitPosition First/second hour/minute/second. Use one of the SvgClock.#DIGIT_POSITION constants. 
     */
    #refreshDigit(digitElement, digitOffSegmentsElement, digitStr, digitPosition)
    {
        for (const isSharp of [true, false]) {
            for (const segmentStr in SvgClock.#SEGMENT_ASCII_COORDS) {
                
                const querySelectorStr = "use[href='#" // <- Note the single quote before the hash
                    + (SvgClock.#SECOND_DIGITS.includes(digitPosition) ? "smaller-" : "")
                    + (isSharp ? "sharp-" : "rounded-")
                    + segmentStr + "-bar" + this.#idSuffix + "']"; // <- Note the ending single quote
                
                const segmentElement = digitElement.querySelector(querySelectorStr);
                
                segmentElement.setAttribute(
                    "opacity",
                    this.#getSegmentOpacity(digitStr, isSharp, false, segmentStr, digitPosition)
                );
                
                const offSegmentElement = digitOffSegmentsElement.querySelector(querySelectorStr);
                
                offSegmentElement.setAttribute(
                    "opacity",
                    this.#getSegmentOpacity(digitStr, isSharp, true, segmentStr, digitPosition)
                );
            }
        }
    }
    
    /**
     * 
     * @param {string} digit "0" to "9"
     * @param {boolean} isSharp true if the SVG path represents a rounded segment
     * @param {boolean} isOffSegment true if the SVG path represents an OFF segment, false otherwise
     * @param {string} segmentStr e.g. "top-left"
     * @param {number} digitPosition First/second hour/minute/second. Use one of the SvgClock.#DIGIT_POSITION constants.
     * @returns {string} e.g. "0", "10%"
     */
    #getSegmentOpacity(digit, isSharp, isOffSegment, segmentStr, digitPosition = null)
    {
        if (isSharp !== this.#settings.useSharpDigits) {
            return "0";
        }
        
        if (!this.#settings.displaySeconds && SvgClock.#SECOND_DIGITS.includes(digitPosition)) {
            // Seconds are fully off when not enabled
            return "0";
        }
        
        if (this.#isSegmentOn(digit, isSharp, segmentStr)) {
            // The segment is ON
            
            if (isOffSegment) {
                return "0";
            }
            
            if (digitPosition === SvgClock.#DIGIT_POSITION.firstHourDigit) {
                const clockModeStr = this.#settings.useTwelveHourClock ? "12-hour" : "24-hour"; 
                const leadingZeroStr = this.#settings.displayLeadingZero ? "with-leading-zero" : "without-leading-zero";
                const segmentWear = SvgClock.#DIGIT_WEAR_LEVEL[digitPosition][clockModeStr][leadingZeroStr][segmentStr];
                
                return (100 - segmentWear * this.#settings.wearLevel) + "%";
            }
            
            if (digitPosition === SvgClock.#DIGIT_POSITION.secondHourDigit) {
                const clockModeStr = this.#settings.useTwelveHourClock ? "12-hour" : "24-hour"; 
                const segmentWear = SvgClock.#DIGIT_WEAR_LEVEL[digitPosition][clockModeStr][segmentStr];
                
                return (100 - segmentWear * this.#settings.wearLevel) + "%";
            }
            
            const segmentWear = SvgClock.#DIGIT_WEAR_LEVEL[digitPosition][segmentStr];
            
            return (100 - segmentWear * this.#settings.wearLevel) + "%";
        } else {
            // The segment is OFF
            
            if (!isOffSegment) {
                return "0";
            }
        
            if (
                digitPosition === SvgClock.#DIGIT_POSITION.firstHourDigit
                && this.#settings.useTwelveHourClock && !this.#settings.displayLeadingZero
                && segmentStr !== "top-right" && segmentStr !== "bottom-right"
            ) {
                // Special case: In 12-hour mode, with no leading zero, the first digit is either "1" or off.
                // => The first digit doesn't even *have* other segments than "top-right" and "bottom-right".
                return "0";
            }
            
            return this.#settings.offSegmentsOpacity + "%";
        }
    }
    
    /**
     * 
     * @param {string} digit "0" to "9"
     * @param {boolean} isSharp true if the SVG path represents a rounded segment
     * @param {string} segmentStr e.g. "top-left"
     */
    #isSegmentOn(digit, isSharp, segmentStr)
    {
        if (isSharp !== this.#settings.useSharpDigits) {
            return false;
        }
        
        const segmentAsciiCoords = SvgClock.#SEGMENT_ASCII_COORDS[segmentStr];
        
        return (SvgClock.#ASCII_DIGITS[digit][segmentAsciiCoords.row][segmentAsciiCoords.column] !== " ");
    }
    
    #updateViewbox()
    {
        const leftOffset = this.#getViewboxLeftOffset();
        
        if (this.#settings.useTwelveHourClock) {
            this.#svgElement.querySelector("[href='#pm-indicator" + this.#idSuffix + "']").setAttribute(
                "x",
                // If there's no leading zero, the first digit is either a "1", or nothing. (No wider digit).
                // => Nudge the "PM indicator" to the right.
                this.#settings.displayLeadingZero ? "0" : SvgClock.#LEADING_ZERO_ADDITIONAL_WIDTH.toString()
            );
        }
        
        const rightOffset = this.#settings.displaySeconds ? 650 : 530;
        
        const width = rightOffset - leftOffset;
        
        this.#svgElement.setAttribute("viewBox", leftOffset.toString() + " 0 " + width.toString() + " 176");
    }
    
    #getViewboxLeftOffset()
    {
        if (!this.#settings.useTwelveHourClock) {
            // No PM indicator => Let's save some space
            return SvgClock.#PM_INDICATOR_WIDTH;
        }
        
        if (!this.#settings.displayLeadingZero) {
            // No leading zero (in 12-hour mode) => Let's save a little bit of space, too.
            
            // Note: In 24-hour mode, the first digit can turn into a "2",
            //       which does not allow us to crop the leftmost part of the first digit,
            //       even when the "leading-zero" setting is off.
            
            return SvgClock.#LEADING_ZERO_ADDITIONAL_WIDTH;
        }
        
        // PM indicator + leading zero => Cannot crop the viewbox from the left
        return 0;
    }
    
    /**
     * @param {SettingChangedEvent} event 
     */
    #handleSettingChangedEvent(event)
    {
        if (this.#settings instanceof SettingsPreset && !SvgClock.#NON_PRESET_SETTINGS.includes(event.setting)) {
            // Don't manipulate the DOM if a "fixed" (i.e. preset) setting was modified
            return;
        }
        
        this.#updateViewbox();
        
        if (SvgClock.#FORCE_REFRESH_SETTINGS.includes(event.setting)) {
            this.#updateClock(true);
            return;
        }
        
        // Use values from `this.#settings` rather than `event.newValue`, to make sure preset values apply
        
        if (event.setting === SettingsEnum.slantAngle) {
            this.#svgElement.style.transform = "skew(" + -this.#settings.slantAngle + "deg)";
            return;
        }
        
        if (event.setting === SettingsEnum.foregroundColor) {
            this.#svgElement.style.color = this.#settings.foregroundColor;
            return;
        }
        
        if (event.setting === SettingsEnum.backgroundColor) {
            this.#backgroundElement.style.background = this.#settings.backgroundColor;
            return;
        }
        
        if (event.setting === SettingsEnum.backgroundGrain) {
            if (this.#grainyBackgroundElement !== null) {
                this.#grainyBackgroundElement.style.opacity = this.#settings.backgroundGrain + "%";
            }
            return;
        }
        
        if (event.setting === SettingsEnum.shadowColor) {
            this.#dropShadowElement.setAttribute("flood-color", this.#settings.shadowColor);
            return;
        }
        
        if (event.setting === SettingsEnum.shadowOpacity) {
            this.#dropShadowElement.setAttribute("flood-opacity", this.#settings.shadowOpacity + "%");
            return;
        }
        
        if (event.setting === SettingsEnum.shadowBlurRadius) {
            this.#dropShadowElement.setAttribute("stdDeviation", this.#settings.shadowBlurRadius);
            return;
        }
        
        if (event.setting === SettingsEnum.shadowOffsetX) {
            this.#dropShadowElement.setAttribute("dx", this.#settings.shadowOffsetX);
            return;
        }
        
        if (event.setting === SettingsEnum.shadowOffsetY) {
            this.#dropShadowElement.setAttribute("dy", this.#settings.shadowOffsetY);
            return;
        }
    }
}
