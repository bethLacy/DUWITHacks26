const timetableCheck = document.getElementById("timetableCheck");
const taskCheck = document.getElementById("taskCheck");
const timeCheck = document.getElementById("timeCheck");

const loadSpace = document.getElementById("loadSpace");

function checkAllBoxes() {
    if (timetableCheck.checked && taskCheck.checked && timeCheck.checked) {
        loadSpace.innerHTML = '<button id="generateButton">Generate timetable</button>'; 
        const generateButton = document.getElementById("generateButton");
        generateButton.addEventListener("click", generateButtonClicked);
    } 
}

timetableCheck.addEventListener("change", checkAllBoxes);
taskCheck.addEventListener("change", checkAllBoxes);
timeCheck.addEventListener("change", checkAllBoxes);



const timetableButton = document.getElementById("timetableButton");
const taskButton = document.getElementById("taskButton");
const timeButton = document.getElementById("timeButton");


function timetableButtonClicked() {
    loadSpace.innerHTML = `<p>Ask about existing commitments here</p>`;
}
function taskButtonClicked() {
    loadSpace.innerHTML = `<p>Ask about modifying tasks here</p>`;
}
function timeButtonClicked() {
    loadSpace.innerHTML = `<p>Ask about times willing to work here</p>`;
}

timetableButton.addEventListener("click", timetableButtonClicked);
taskButton.addEventListener("click", taskButtonClicked);
timeButton.addEventListener("click", timeButtonClicked);



function generateButtonClicked() {
    loadSpace.innerHTML = `<p>Generated timetable goes here</p>`;
}