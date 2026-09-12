class CurrentTime
{
    #hour = 88;
    #minute = 88;
    #second = 88;
    #millisecond = 888;
    #isPmIndicatorOn = false;
    
    #nextUpdateDueAt = 0; // Unit: milliseconds
    
    #dateTimeOptions;
    #dateTimeFormatter;
    
    /**
     * @param {SettingsInterface} settings 
     */
    constructor(settings)
    {
        this.#setupDateTimeFormatter(settings);
        requestAnimationFrame(this.#makeClockTick.bind(this));
    }
    
    /**
     * The current hour
     * @returns {number}
     */
    get hour()
    {
        return this.#hour;
    }
    
    /**
     * The current minute
     * @returns {number}
     */
    get minute()
    {
        return this.#minute;
    }
    
    /**
     * The current second
     * @returns {number}
     */
    get second()
    {
        return this.#second;
    }
    
    /**
     * The current millisecond
     * @returns {number}
     */
    get millisecond()
    {
        return this.#millisecond;
    }
    
    /**
     * True if the "PM" indicator needs to be displayed, false otherwise.
     * @returns {boolean}
     */
    get isPmIndicatorOn()
    {
        return this.#isPmIndicatorOn;
    }
    
    #setupDateTimeFormatter(settings)
    {
        this.#dateTimeOptions = {
            hour: "numeric",
            hour12: settings.useTwelveHourClock,
            minute: "numeric",
            second: "numeric",
            fractionalSecondDigits: 3,
        };
        
        this.#dateTimeFormatter = Intl.DateTimeFormat("en-US", this.#dateTimeOptions);
        
        document.addEventListener(
            SettingChangedEvent,
            /**
             * @param {SettingChangedEvent} event
             */
            (event) => {
                if (event.setting === SettingsEnum.useTwelveHourClock) {
                    this.#dateTimeOptions.hour12 = event.newValue;
                    this.#dateTimeFormatter = Intl.DateTimeFormat("en-US", this.#dateTimeOptions);
                    this.#updateCurrentTime();
                }
            }
        );
    }
    
    /**
     * Triggers a ClockTickedEvent if necessary (i.e. twice per second)
     * @param {number} timestamp 
     */
    #makeClockTick(timestamp)
    {
        if (timestamp < this.#nextUpdateDueAt) { // No need to update yet
            // Don't call the date/time formatter on every frame, that would be wasteful.
            requestAnimationFrame(this.#makeClockTick.bind(this));
            return;
        }
        
        this.#updateCurrentTime();
        
        document.dispatchEvent(new ClockTickedEvent(this.#hour, this.#minute, this.#second, this.#millisecond));
        
        // Setup the next frame for the next half second (without drifting)
        const millisecondOffset = (this.#millisecond % 500); // Catch up if need be
        this.#nextUpdateDueAt = document.timeline.currentTime + 500 - millisecondOffset;
        requestAnimationFrame(this.#makeClockTick.bind(this));
    }
    
    #updateCurrentTime()
    {
        const parts = this.#dateTimeFormatter.formatToParts(Date.now());
        
        this.#hour = Number.parseInt(parts.find((element) => element.type === "hour").value);
        this.#minute = Number.parseInt(parts.find((element) => element.type === "minute").value);
        this.#second = Number.parseInt(parts.find((element) => element.type === "second").value);
        this.#millisecond = Number.parseInt(parts.find((element) => element.type === "fractionalSecond").value);
        const dayPeriod = parts.find((element) => element.type === "dayPeriod")?.value;
        this.#isPmIndicatorOn = (["PM", "pm", "P.M.", "p.m."].includes(dayPeriod));
        
        // If you want to hard-code the time (for screenshots), this is the place to do so:
        //this.#hour = 13;
        //this.#minute = 37;
        //this.#millisecond = 501;
    }
}
