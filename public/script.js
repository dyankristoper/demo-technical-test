
// Flag to indicate if automation files have been downloaded
const fileDownloaded = false;

const twilioGetResultsButton = document.querySelector("#twilio-get-results");

const DEFAULT_ENDPOINT = "https://demo-technical-test.onrender.com";


/**
 * Define a function to navigate betweens form steps.
 * It accepts one parameter. That is - step number.
 */
const navigateToFormStep = (stepNumber) => {
    /**
     * Hide all form steps.
     */
    document.querySelectorAll(".form-step").forEach((formStepElement) => {
        formStepElement.classList.add("d-none");
    });
    /**
     * Mark all form steps as unfinished.
     */
    document.querySelectorAll(".form-stepper-list").forEach((formStepHeader) => {
        formStepHeader.classList.add("form-stepper-unfinished");
        formStepHeader.classList.remove("form-stepper-active", "form-stepper-completed");
    });
    /**
     * Show the current form step (as passed to the function).
     */
    document.querySelector("#step-" + stepNumber).classList.remove("d-none");
    /**
     * Select the form step circle (progress bar).
     */
    const formStepCircle = document.querySelector('li[step="' + stepNumber + '"]');
    /**
     * Mark the current form step as active.
     */
    formStepCircle.classList.remove("form-stepper-unfinished", "form-stepper-completed");
    formStepCircle.classList.add("form-stepper-active");
    /**
     * Loop through each form step circles.
     * This loop will continue up to the current step number.
     * Example: If the current step is 3,
     * then the loop will perform operations for step 1 and 2.
     */
    for (let index = 0; index < stepNumber; index++) {
        /**
         * Select the form step circle (progress bar).
         */
        const formStepCircle = document.querySelector('li[step="' + index + '"]');
        /**
         * Check if the element exist. If yes, then proceed.
         */
        if (formStepCircle) {
            /**
             * Mark the form step as completed.
             */
            formStepCircle.classList.remove("form-stepper-unfinished", "form-stepper-active");
            formStepCircle.classList.add("form-stepper-completed");
        }
    }
};
/**
 * Select all form navigation buttons, and loop through them.
 */
document.querySelectorAll(".btn-navigate-form-step").forEach((formNavigationBtn) => {
    /**
     * Add a click event listener to the button.
     */
    formNavigationBtn.addEventListener("click", () => {
        /**
         * Get the value of the step.
         */
        const stepNumber = parseInt(formNavigationBtn.getAttribute("step_number"));
        /**
         * Call the function to navigate to the target form step.
         */
        navigateToFormStep(stepNumber);
    });
});

const fetchTwilioResults = async (event) => {
    event.preventDefault();

    fetch(`${ DEFAULT_ENDPOINT }/scrape`)
    .then( res  => res.json() )
    .then( data => console.log(data));
}

/* 
    Fetch information inside the iFrame
    Look for Jitter and Packet Loss 
*/
const twilioSubmitBtn = document.querySelector('#twilio-submit-btn');
const SET_TIMEOUT = 120000; // Max time it takes for result to finish
const onTwilioTestSubmit = () => {
    setTimeout(() => {
        let iframe = document.querySelector('iframe');
        let logsArray = iframe.contentWindow.document.querySelectorAll("#logs > li");
        let jitterPacketLossResults = [];
        let stringConditions = ["Jitter", "Packet Loss"];
    
        logsArray.forEach((log) => {
            if( stringConditions.some( string => log.textContent.includes( string ) )){
                jitterPacketLossResults.push( log.textContent );
            } 
        });

        console.log('Results Jitter and Packet Loss:', jitterPacketLossResults );
    }, SET_TIMEOUT );
}

twilioSubmitBtn.addEventListener('click', onTwilioTestSubmit );
twilioGetResultsButton.addEventListener('click', (event) => fetchTwilioResults(event) );
