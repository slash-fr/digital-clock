class BurnInWarningDialog extends AbstractDialog
{
    /** @type {HTMLDivElement} */
    #dialogElement;
    
    constructor()
    {
        super();
        
        this.#dialogElement = document.getElementById("burn-in-warning");
        this.#initialize();
    }
    
    show()
    {
        super.show();
        this.#dialogElement.classList.add("visible");
    }
    
    hide()
    {
        super.hide();
        this.#dialogElement.classList.remove("visible");
    }
    
    #initialize()
    {
        const riskCheckBox = document.getElementById("risk-checkbox");
        const acceptRiskButton = document.getElementById("accept-risk-button");
        const riskAcceptedAt = Number.parseInt(localStorage.getItem("digital-clock_risk-accepted-at") ?? "0");
        
        if (Number.isNaN(riskAcceptedAt) || riskAcceptedAt + 30 * 24 * 3600_000 < Date.now()) {
            // If the warning was not acknowledged, or was acknowledged more than 30 days ago, display it (again)
            riskCheckBox.checked = false;
            acceptRiskButton.disabled = true;
            this.show();
        } else {
            riskCheckBox.checked = true;
            acceptRiskButton.disabled = false;
        }

        riskCheckBox.addEventListener("change", (event) => {
            acceptRiskButton.disabled = !event.target.checked;
        });
        acceptRiskButton.addEventListener("click", (event) => {
            localStorage.setItem("digital-clock_risk-accepted-at", Date.now());
            this.hide();
        });
    }
}
