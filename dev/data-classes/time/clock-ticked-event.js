/**
 * The clock "ticks" twice per second, typically
 */
class ClockTickedEvent extends Event
{
    static #EVENT_TYPE = "clockticked";
    
    /**
     * Hours (0-23)
     * @type {number}
     */
    hours;
    
    /**
     * Minutes (0-59)
     * @type {number}
     */
    minutes;
    
    /**
     * Seconds (0-59)
     * @type {number}
     */
    seconds;
    
    /**
     * Milliseconds (0-999)
     * @type {number}
     */
    milliseconds;
    
    /**
     * @param {number} hours
     * @param {number} minutes
     * @param {number} seconds
     * @param {number} milliseconds
     */
    constructor(hours, minutes, seconds, milliseconds)
    {
        super(ClockTickedEvent.#EVENT_TYPE);
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
        this.milliseconds = milliseconds;
        Object.freeze(this);
    }
    
    /**
     * The event name, as a string, to use in event listeners
     * @return {string}
     */
    static toString()
    {
        return ClockTickedEvent.#EVENT_TYPE;
    }
}
