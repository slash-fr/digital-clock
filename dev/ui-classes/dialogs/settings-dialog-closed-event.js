class SettingsDialogClosedEvent extends Event
{
    static #EVENT_TYPE = "settingsdialogclosed";
    
    constructor()
    {
        super(SettingsDialogClosedEvent.#EVENT_TYPE);
    }
    
    /**
     * @returns {string} The event name, as a string, to use in event listeners
     */
    static toString()
    {
        return SettingsDialogClosedEvent.#EVENT_TYPE;
    }
}
