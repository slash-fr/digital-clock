class Favicon
{
    /**
     * @type {SettingsInterface}
     */
    #settings;
    
    /**
     * @type {CurrentTime}
     */
    #currentTime;
    
    // Yes, it's "88:88" again
    #hourStr = "88";
    #minuteStr = "88";
    #isPmIndicatorOn = false;
    
    /**
     * @type {HTMLLinkElement}
     */
    #faviconElement;
    
    /**
     * @type {HTMLCanvasElement}
     */
    #canvas;
    
    /**
     * @type {CanvasRenderingContext2D}
     */
    #canvasContext;
    
    /**
     * Bitmaps for each digit to draw inside the favicon.
     */
    static #ASCII_DIGIT_BITMAPS = {
        // Spaces are OFF pixels, hashes are ON pixels
        // Each pixel is doubled horizontally in the ASCII version, for visual clarity
        
        0: [
            "######",
            "##  ##",
            "##  ##",
            "##  ##",
            "######",
        ],
        
        1: [
            "    ##",
            "  ####", // Yes, that looks different from our 7-segment version,
            "    ##", // but #1 priority is readability.
            "    ##", // (With only 3x5 pixels per digit?! Good luck with that...)
            "    ##",
        ],
        
        2: [
            "####  ", // Rounded
            "    ##",
            "  ##  ", // Rounded (Left + Right)
            "##    ",
            "######",
        ],
        
        3: [
            "####  ", // Rounded + Shorter middle bar
            "    ##",
            "  ##  ", // Rounded + Shorter middle bar
            "    ##",
            "####  ", // Rounded
        ],
        
        4: [
            "##  ##",
            "##  ##",
            "######",
            "    ##",
            "    ##",
        ],
        
        5: [
            "######",
            "##    ",
            "####  ", // Rounded (Right only)
            "    ##",
            "####  ", // Rounded
        ],
        
        6: [
            "######",
            "##    ",
            "######",
            "##  ##",
            "######",
        ],
        
        7: [
            "######",
            "    ##",
            "  ##  ", // Quite different design again
            "##    ",
            "##    ",
        ],
        
        8: [
            "######",
            "##  ##",
            "  ##  ", // Kinda ugly, but makes it look different enough from a zero, a six, or a nine
            "##  ##",
            "######",
        ],
        
        9: [
            "######",
            "##  ##",
            "######",
            "    ##",
            "######",
        ],
    };
    
    static #PM_INDICATOR_ASCII = [
        // Each pixel is doubled horizontally in the ASCII version, for visual clarity
        "######    ##      ##",
        "##    ##  ####  ####",
        "######    ##  ##  ##",
        "##        ##      ##",
        "##        ##      ##",
    ];
    
    static #SETTINGS_TO_MONITOR = [
        SettingsEnum.useTwelveHourClock,
        SettingsEnum.foregroundColor,
        SettingsEnum.backgroundColor,
        SettingsEnum.useTwelveHourClock,
        SettingsEnum.displayLeadingZero,
    ];
    
    /**
     * @param {SettingsInterface} settings
     * @param {CurrentTime} currentTime 
     */
    constructor(settings, currentTime)
    {
        this.#settings = settings;
        this.#currentTime = currentTime;
        
        this.#faviconElement = document.getElementById("favicon");
        this.#canvas = document.createElement("canvas");
        this.#canvas.width = 16;
        this.#canvas.height = 16;
        this.#canvasContext = this.#canvas.getContext("2d");
        
        this.#refreshFavicon(true);
        
        document.addEventListener(ClockTickedEvent, (event) => {
            this.#refreshFavicon();
        });
        
        document.addEventListener(SettingChangedEvent, (event) => {
            if (Favicon.#SETTINGS_TO_MONITOR.includes(event.setting)) {
                this.#refreshFavicon(true);
            }
        });
    }
    
    #refreshFavicon(force = false)
    {   
        const hourToDisplayStr = FormattingHelper.formatWithTwoDigits(this.#currentTime.hour);
        const minuteToDisplayStr = FormattingHelper.formatWithTwoDigits(this.#currentTime.minute);
        const needToDisplayPmIndicator = this.#currentTime.isPmIndicatorOn;
        
        if (
            !force && hourToDisplayStr === this.#hourStr && minuteToDisplayStr === this.#minuteStr
            && needToDisplayPmIndicator === this.#isPmIndicatorOn
        ) {
            return; // Nothing to update
        }
        
        this.#canvasContext.fillStyle = this.#settings.backgroundColor;
        this.#canvasContext.fillRect(0, 0, 16, 16); // Clear everything
        
        this.#canvasContext.fillStyle = this.#settings.foregroundColor;
        
        let verticalDigitPosition = 6;
        if (needToDisplayPmIndicator) {
            verticalDigitPosition = 2; // Move digits up, to make room for the PM indicator below them
        }
        
        if (hourToDisplayStr[0] !== "0" || this.#settings.displayLeadingZero) {
            this.#drawDigitInsideCanvas(hourToDisplayStr[0], 0, verticalDigitPosition);
        }
        this.#drawDigitInsideCanvas(hourToDisplayStr[1], 4, verticalDigitPosition);
        
        // There isn't enough room for a colon separator (:) between hours and minutes.
        // Instead, dim the minutes, so the user can tell them apart more easily.
        
        // Try to use the configured foreground color, with reduced opacity.
        this.#canvasContext.fillStyle = ColorHelper.getFaviconMinuteColor();
    
        this.#drawDigitInsideCanvas(minuteToDisplayStr[0], 9, verticalDigitPosition);
        this.#drawDigitInsideCanvas(minuteToDisplayStr[1], 13, verticalDigitPosition);
        
        // Draw the "PM" letters, with the same color as the minutes
        if (needToDisplayPmIndicator) {
            this.#drawPmIndicator(3, 9);
        }
        
        this.#faviconElement.href = this.#canvas.toDataURL();
        
        this.#hourStr = hourToDisplayStr;
        this.#minuteStr = minuteToDisplayStr;
        this.#isPmIndicatorOn = needToDisplayPmIndicator;
    }
    
    /**
     * @param {number|string} digit The digit to draw (0-9)
     * @param {number} digitPositionX Horizontal coordinate of the top left pixel of the digit (0-15)
     * @param {number} digitPositionY Vertical coordinate of the top left pixel of the digit (0-15)
     */
    #drawDigitInsideCanvas(digit, digitPositionX, digitPositionY)
    {
        for (let bitmapX = 0; bitmapX < 3; bitmapX++) {
            for (let bitmapY = 0; bitmapY < 5; bitmapY++) {
                if (Favicon.#ASCII_DIGIT_BITMAPS[digit][bitmapY][bitmapX * 2] === "#") {
                    this.#canvasContext.fillRect(digitPositionX + bitmapX, digitPositionY + bitmapY, 1, 1);
                }
            }
        }
    }
    
    /**
     * @param {number} positionX 
     * @param {number} positionY 
     */
    #drawPmIndicator(positionX, positionY)
    {
        const pmWidth = Favicon.#PM_INDICATOR_ASCII[0].length / 2; // The actual width is half the ASCII width
        const pmHeight = Favicon.#PM_INDICATOR_ASCII.length;
        for (let bitmapX = 0; bitmapX < pmWidth; bitmapX++) {
            for (let bitmapY = 0; bitmapY < pmHeight; bitmapY++) {
                if (Favicon.#PM_INDICATOR_ASCII[bitmapY][bitmapX * 2] === "#") {
                    this.#canvasContext.fillRect(positionX + bitmapX, positionY + bitmapY, 1, 1);
                }
            }
        }
    }
}
