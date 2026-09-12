class PresetDialog extends AbstractDialog
{
    /**
     * @type {Settings}
     */
    #mainSettings;
    
    #presetStringMapping = {};
    
    /**
     * @param {Settings} mainSettings
     * @param {CurrentTime} currentTime
     */
    constructor(mainSettings, currentTime)
    {
        super();
        
        this.#mainSettings = mainSettings;
        
        document.getElementById("close-presets-button").addEventListener("click", (event) => { this.hide(); });
        
        this.#initializePresets();
        this.#initializeButtons(currentTime);
    }
    
    show()
    {
        super.show();
        document.getElementById("preset-dialog").classList.add("visible");
    }
    
    hide()
    {
        super.hide();
        document.getElementById("preset-dialog").classList.remove("visible");
    }
    
    #initializePresets()
    {
        this.#presetStringMapping["red"] = new SettingsPreset(
            settings,
            false, // useSharpDigits
            5, // slantAngle
            0, // offSegmentsOpacity
            0, // wearLevel
            "#ff0000", // foregroundColor
            "#000000", // backgroundColor
            0, // backgroundGrain
            "#ff0000", //shadowColor
            0, // shadowOpacity
            0, // shadowBlurRadius
            0, // shadowOffsetX
            0, // shadowOffsetY
        );
        
        this.#presetStringMapping["blue"] = new SettingsPreset(
            settings,
            false, // useSharpDigits
            4, // slantAngle
            2, // offSegmentsOpacity
            50, // wearLevel
            "#80ffff", // foregroundColor
            "#000000", // backgroundColor
            0, // backgroundGrain
            "#0080ff", //shadowColor
            100, // shadowOpacity
            12, // shadowBlurRadius
            0, // shadowOffsetX
            0, // shadowOffsetY
        );
        
        this.#presetStringMapping["green"] = new SettingsPreset(
            settings,
            false, // useSharpDigits
            5, // slantAngle
            10, // offSegmentsOpacity
            0, // wearLevel
            "#80ff80", // foregroundColor
            "#000000", // backgroundColor
            0, // backgroundGrain
            "#00ff00", //shadowColor
            50, // shadowOpacity
            4, // shadowBlurRadius
            0, // shadowOffsetX
            0, // shadowOffsetY
        );
        
        this.#presetStringMapping["black"] = new SettingsPreset(
            settings,
            true, // useSharpDigits
            3, // slantAngle
            0, // offSegmentsOpacity
            0, // wearLevel
            "#202020", // foregroundColor
            "#bbc6b9", // backgroundColor
            5, // backgroundGrain
            "#000000", //shadowColor
            33, // shadowOpacity
            1.5, // shadowBlurRadius
            10, // shadowOffsetX
            10, // shadowOffsetY
        );
    }
    
    /**
     * @param {CurrentTime} currentTime 
     */
    #initializeButtons(currentTime)
    {
        const mainTimeSvg = document.getElementById("time-svg");
        
        let copyNumber = 1;
        
        for (const presetButton of document.querySelectorAll(".preset-button")) {
            // 1. Show a preview SvgClock
            const idSuffix = "-" + copyNumber.toString(); // Add a incrementing suffix to the IDs and HREFs
            copyNumber++;
            
            const newTimeSvg = mainTimeSvg.cloneNode(true);
            newTimeSvg.id += idSuffix;
            for (const elementWithId of newTimeSvg.querySelectorAll("[id]")) {
                elementWithId.id += idSuffix;
            }
            
            for (const elementWithHref of newTimeSvg.querySelectorAll("use[href^='#']")) {
                // e.g. `use="#first-hour-digit"`
                elementWithHref.setAttribute(
                    "href",
                    elementWithHref.getAttribute("href") + idSuffix // Match the id
                );
            }
            
            for (const elementWithFilter of newTimeSvg.querySelectorAll("[filter^='url(#']")) {
                // e.g. `filter="url(#shadow)"`
                const filterStr = elementWithFilter.getAttribute("filter");
                elementWithFilter.setAttribute(
                    "filter",
                    // Insert the suffix before the closing parenthesis (round bracket)
                    filterStr.slice(0, -1) + idSuffix + ")" // Match the id
                );
            }
            
            const backgroundDiv = document.createElement("div");
            backgroundDiv.className = "clock-background";
            backgroundDiv.append(newTimeSvg);
            presetButton.prepend(backgroundDiv);
            
            const preset = this.#getPresetForButton(presetButton);
            let grainyBackgroundElement = null;
            if (preset.backgroundGrain > 0) {
                grainyBackgroundElement = document.getElementById("grainy-background").cloneNode(true);
                grainyBackgroundElement.id += idSuffix;
                grainyBackgroundElement.className = "grainy-background";
                backgroundDiv.prepend(grainyBackgroundElement);
            }
            
            const newSvgClock = new SvgClock(
                preset,
                currentTime,
                newTimeSvg,
                backgroundDiv,
                idSuffix,
                grainyBackgroundElement,
            );
            
            // 2. Setup the "click" event
            presetButton.addEventListener("click", this.#presetButtonClicked.bind(this));
        }
    }
    
    /**
     * @param {HTMLButtonElement} presetButton A button with a "data-preset" attribute
     * @returns {SettingsPreset}
     */
    #getPresetForButton(presetButton)
    {
        const presetStr = presetButton.dataset.preset;
        
        if (!presetStr in this.#presetStringMapping) {
            throw new Error("Unknown preset: " + '"' + presetStr + '"');
        }

        return this.#presetStringMapping[presetStr];
    }
    
    /**
     * @param {MouseEvent} event 
     */
    #presetButtonClicked(event)
    {
        const settingsToApply = this.#getPresetForButton(event.target.closest("button.preset-button"));
        
        this.#mainSettings.useSharpDigits = settingsToApply.useSharpDigits;
        this.#mainSettings.saveUseSharpDigits();
        this.#mainSettings.slantAngle = settingsToApply.slantAngle;
        this.#mainSettings.saveSlantAngle();
        this.#mainSettings.offSegmentsOpacity = settingsToApply.offSegmentsOpacity;
        this.#mainSettings.saveOffSegmentsOpacity();
        this.#mainSettings.wearLevel = settingsToApply.wearLevel;
        this.#mainSettings.saveWearLevel();
        this.#mainSettings.foregroundColor = settingsToApply.foregroundColor;
        this.#mainSettings.saveForegroundColor();
        this.#mainSettings.backgroundColor = settingsToApply.backgroundColor;
        this.#mainSettings.saveBackgroundColor();
        this.#mainSettings.backgroundGrain = settingsToApply.backgroundGrain;
        this.#mainSettings.saveBackgroundGrain();
        this.#mainSettings.shadowColor = settingsToApply.shadowColor;
        this.#mainSettings.saveShadowColor();
        this.#mainSettings.shadowOpacity = settingsToApply.shadowOpacity;
        this.#mainSettings.saveShadowOpacity();
        this.#mainSettings.shadowBlurRadius = settingsToApply.shadowBlurRadius;
        this.#mainSettings.saveShadowBlurRadius();
        this.#mainSettings.shadowOffsetX = settingsToApply.shadowOffsetX;
        this.#mainSettings.saveShadowOffsetX();
        this.#mainSettings.shadowOffsetY = settingsToApply.shadowOffsetY;
        this.#mainSettings.saveShadowOffsetY();
        
        this.hide();
    }
}
