const timetableCheck = document.getElementById("timetableCheck");
const taskCheck = document.getElementById("taskCheck");
const timeCheck = document.getElementById("timeCheck");
const finishCheck = document.getElementById("finishCheck");

const loadSpace = document.getElementById("loadSpace");

function checkAllBoxes() {
    if (timetableCheck.checked && taskCheck.checked && timeCheck.checked && finishCheck.checked) {
        loadSpace.innerHTML = '<button id="generateButton">Generate timetable</button>'; 
        const generateButton = document.getElementById("generateButton");
        generateButton.addEventListener("click", generateButtonClicked);
    } 
}

timetableCheck.addEventListener("change", checkAllBoxes);
taskCheck.addEventListener("change", checkAllBoxes);
timeCheck.addEventListener("change", checkAllBoxes);
finishCheck.addEventListener("change", checkAllBoxes);


const timetableButton = document.getElementById("timetableButton");
const taskButton = document.getElementById("taskButton");
const timeButton = document.getElementById("timeButton");
const finishButton = document.getElementById("finishButton");


function timetableButtonClicked() {
    loadSpace.innerHTML = `<p> Commitment name: <input type = "textbox"></p>
        <p> Date: <input type = "date"> Start Time: <input type = "time"> End Time: <input type = "time"> </p>
        <p> <select>
            <option value = "default_commitment"> Select a Type of Commitment</option>
            <option value = "lecture"> Lecture</option>
            <option value = "practical"> Practical</option>
            <option value = "meeting"> Meeting </option>
            <option value = "other_academic"> Other Academic</option>
            <option value = "societies"> Societies </option>
            <option value = "other"> Other Non Academic </option>
        </select></p>
        <p> Module (use "Other" for non academic commitments): <input type = "textbox"> </p>
        
        <p><button>Add this event</button></p>`;
}
function taskButtonClicked() {
    loadSpace.innerHTML = `<p> Task Name: <input type = "textbox"></p>
        <p> <input type = "datetime-local" id = "deadline"> </p> <!-- Make this appear if textbox above is checked -->
        <p>How long should this task take approximately? <br> <input type = "textbox"> Hours </p> 
        <p> Priority of task <select name = priority>
            <option value = "default_priority"> Select a Priority</option>
            <option value = "low"> Low </option>
            <option value = "medium"> Medium </option>
            <option value = "high"> High </option>
        </select></p>
        <p> Type of task <select>
            <option value = "default_task_type"> Select a Type of Task </option
            <option value = "lecture_catch_up"> Lecture Catch Up </option>
            <option value = "summative_coursework"> Summative Coursework </option>
            <option value = "summative_assignemnt"> Summative Assignment </option>
            <option value = "formative_assignment"> Formative Assignment </option>
            <option value = "revision"> Revision </option>
            <option value = "other"> Other </option>
        </select></p>
        <p> Module (use "Other" for non academic events): <input type = "textbox"> </p>
        <p><button>Add this task</button></p>`;
}
function timeButtonClicked() {
    loadSpace.innerHTML = `<p> This is to say what times within the day you would be happy to work on tasks so that they are not scheduled at inappropriate times </p>
        <p> Start Time: <input type = "time"></p>
        <p> End Time: <input type = "time"></p>
        <p><button>Confirm</button></p>`;
}
function finishButtonClicked() {
    loadSpace.innerHTML = `<p> This is to say what date you would like to schedule tasks until. You can think of this as an ideal end date for when you would like to be caught up</p>
        <p> End Date: <input type = "date"></p>
        <p><button>Confirm</button></p>`;
}

timetableButton.addEventListener("click", timetableButtonClicked);
taskButton.addEventListener("click", taskButtonClicked);
timeButton.addEventListener("click", timeButtonClicked);
finishButton.addEventListener("click", finishButtonClicked);



function generateButtonClicked() {
    loadSpace.innerHTML = `<p>Generated timetable goes here</p>`;
}

