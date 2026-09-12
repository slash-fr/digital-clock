class SettingChangedEvent extends Event
{
    static #EVENT_TYPE = "settingchanged";
    
    /**
     * The setting that has just been updated (one of the values from SettingsEnum).
     * @type {string}
     */
    setting;
    
    /**
     * The new value for the modified setting.
     * @type {any}
     */
    newValue;
    
    /**
     * 
     * @param {string} setting The setting that has just been updated (one of the values from SettingsEnum)
     * @param {any} newValue The new value of the modified setting
     */
    constructor(setting, newValue)
    {
        super(SettingChangedEvent.#EVENT_TYPE);
        this.setting = setting;
        this.newValue = newValue;
        Object.freeze(this);
    }
    
    /**
     * The event name, as a string, to use in event listeners
     * @return {string}
     */
    static toString()
    {
        return SettingChangedEvent.#EVENT_TYPE;
    }
}
