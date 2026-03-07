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
    loadSpace.innerHTML = `<form>
        <p> Commitment name: <input type = "textbox"></p>
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
        <p> Module (use "Other" for non academic events): <input type = "textbox"> </p>
        <p><input type = "submit" value = "Add this Commitment"></p>
        </form>`;
}
function taskButtonClicked() {
    loadSpace.innerHTML = `<form>
        <p> Task Name: <input type = "textbox"></p>
        <p> Deadline: <input type = "datetime-local" id = "deadline"> </p> <!-- Make this appear if textbox above is checked -->
        <p>How long should this task take approximately? <br> <input type = "textbox"> Hours </p> 
        <p> Priority of task <select name = priority>
            <option value = "default_priority"> Select a Priority</option>
            <option value = "low"> Low </option>
            <option value = "medium"> Medium </option>
            <option value = "high"> High </option>
        </select></p>
        <p> Type of task <select>
            <option value = "default_task_type"> Select a Type of Task </option>
            <option value = "lecture_catch_up"> Lecture Catch Up </option>
            <option value = "summative_coursework"> Summative Coursework </option>
            <option value = "summative_assignemnt"> Summative Assignment </option>
            <option value = "formative_assignment"> Formative Assignment </option>
            <option value = "revision"> Revision </option>
            <option value = "other"> Other </option>
        </select></p>
        <p> Module (use "Other" for non academic events): <input type = "textbox"> </p>
        <p><input type = "submit" value = "Add this task"></p>
        </form>`;
}
function timeButtonClicked() {
    loadSpace.innerHTML = `<form>
        <p> This is to say what times within the day you would be happy to work on tasks so that they are not scheduled at inappropriate times </p>
        <p> Start Time: <input type = "time"></p>
        <p> End Time: <input type = "time"></p>
        <p><input type = "submit" value = "Confirm"></button></p>
        </form>`;
}
function finishButtonClicked() {
    loadSpace.innerHTML = `<form>
        <p> This is to say what date you would like to schedule tasks until. You can think of this as an ideal end date for when you would like to be caught up</p>
        <p> End Date: <input type = "date"></p>
        <p><input type = "submit" value = "Confirm"></p>
        </form>`;
}

timetableButton.addEventListener("click", timetableButtonClicked);
taskButton.addEventListener("click", taskButtonClicked);
timeButton.addEventListener("click", timeButtonClicked);
finishButton.addEventListener("click", finishButtonClicked);



function generateButtonClicked() {
    loadSpace.innerHTML = `<p>Generated timetable goes here</p>`;
}


const helpButton = document.getElementById("helpButton");
helpButton.addEventListener("click", helpButtonClicked);

function helpButtonClicked() {
    //explain the app
    loadSpace.innerHTML = "<p><em>Introduction</em></p>"
    loadSpace.innerHTML += "<p>Welcome to our project: Rein It In, the Rosie the Reindeer Planner</p>";
    loadSpace.innerHTML += "<p>In order to use this planner, you will need to complete the 4 steps in our checklist</p>"
    loadSpace.innerHTML += "<p><em>1. Adding commitments:</em></p>"
    loadSpace.innerHTML += "<p>This is where you will need to upload all of your existing commitments, such as lectures, meetings and societies</p>"
    loadSpace.innerHTML += "<p>You should add all commitments between the start and end of your day, and until the end of the planning period  (you will define these later)</p>"
    loadSpace.innerHTML += "<p>Note: you should format the date input as DD.MM.YYYY</p>"
    loadSpace.innerHTML += "<p>Note: you should format times as HH:MM (24 hour time)</p>"
    loadSpace.innerHTML += "<p><em>2. Adding tasks:</em></p>"
    loadSpace.innerHTML += "<p>This is where you should add tasks you need to complete</p>"
    loadSpace.innerHTML += "<p>You should add all the tasks you'd like to schedule in the planning period (even non academics!)</p>"
    loadSpace.innerHTML += "<p>Note: you should format the date input as DD.MM.YYYY</p>"
    loadSpace.innerHTML += "<p>Note: you should format times as HH:MM (24 hour time)</p>"
    loadSpace.innerHTML += "<p>Note: you should format the duration of the tasks as a number of hours</p>"
    loadSpace.innerHTML += "<p><em>3. Setting working times:</em></p>"
    loadSpace.innerHTML += "<p>This is where you should tell us what time you are willing to start working each morning, and how late you are willing to finish</p>"
    loadSpace.innerHTML += "<p>Note: you should format times as HH:MM (24 hour time)</p>"
    loadSpace.innerHTML += "<p><em>4. Setting the planning period:</em></p>"
    loadSpace.innerHTML += "<p>This is where you should tell us how long you want us to schedule for</p>"
    loadSpace.innerHTML += "<p>We will schedule your tasks between the current day, and the day you choose here</p>"
    loadSpace.innerHTML += "<p>Note: you should format the date input as DD.MM.YYYY</p>"
    loadSpace.innerHTML += "<p><em>Final notes</em></p>"
    loadSpace.innerHTML += "<p>Thank you for using our planner</p>"
    loadSpace.innerHTML += "<p>We hope it can help you make the greatest academic comeback of the century</p>"
}

