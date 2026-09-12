class AbstractDialog
{
    #isVisible = false;
    
    constructor()
    {
        if (this.constructor === AbstractDialog) {
            throw new Error("Cannot instantiate an abstract class.");
        }
    }
    
    get isVisible()
    {
        return this.#isVisible;
    }
    
    show()
    {
        this.#isVisible = true;
    }
    
    hide()
    {
        this.#isVisible = false;
    }
}
