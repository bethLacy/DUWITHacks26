// ---------------- Getting HTML Elements ----------------


const timetableCheck = document.getElementById("timetableCheck") as HTMLInputElement;
const taskCheck = document.getElementById("taskCheck") as HTMLInputElement;
const timeCheck = document.getElementById("timeCheck") as HTMLInputElement;
const finishCheck = document.getElementById("finishCheck") as HTMLInputElement;

const loadSpace = document.getElementById("loadSpace") as HTMLElement;

const timetableButton = document.getElementById("timetableButton") as HTMLButtonElement;
const taskButton = document.getElementById("taskButton") as HTMLButtonElement;
const timeButton = document.getElementById("timeButton") as HTMLButtonElement;
const finishButton = document.getElementById("finishButton") as HTMLButtonElement;


const resetButton = document.getElementById("resetButton") as HTMLButtonElement;
const helpButton = document.getElementById("helpButton") as HTMLButtonElement;


// ---------------- Adding Listeners ----------------


timetableCheck.addEventListener("change", checkAllBoxes);
taskCheck.addEventListener("change", checkAllBoxes);
timeCheck.addEventListener("change", checkAllBoxes);
finishCheck.addEventListener("change", checkAllBoxes);

timetableButton.addEventListener("click", timetableButtonClicked);
taskButton.addEventListener("click", taskButtonClicked);
timeButton.addEventListener("click", timeButtonClicked);
finishButton.addEventListener("click", finishButtonClicked);
resetButton.addEventListener("click", reset);
helpButton.addEventListener("click", helpButtonClicked);


// ---------------- Clicking buttons and stuff ----------------


function checkAllBoxes(): void {
    if (timetableCheck.checked && taskCheck.checked && timeCheck.checked && finishCheck.checked) {
        loadSpace.innerHTML = '<button id="generateButton">Generate timetable</button>'; 
        const generateButton = document.getElementById("generateButton") as HTMLButtonElement;
        generateButton.addEventListener("click", generateButtonClicked);
    } 
}

function timetableButtonClicked(): void {
    loadSpace.innerHTML = `<form id = "add_commitment_form" name = "add_commitment_form">
        <p> Commitment name: <input type = "textbox" id = "c0mmitment_name" name = "name"></p>
        <p> Date: <input type = "textbox" id = "commitment_date" name = "date"> Start Time: <input type = "textbox" id = "commitment_start_time" name = "startTime"> End Time: <input type = "textbox" id = "commitment_end_time" name = "endTime"> </p>
        <p> <select id = "commitment_type" name = "category">
            <option value = "default_commitment_type"> Select a Type of Commitment</option>
            <option value = "Lecture"> Lecture</option>
            <option value = "Practical"> Practical</option>
            <option value = "Meeting"> Meeting </option>
            <option value = "Other Academic"> Other Academic</option>
            <option value = "Societies"> Societies </option>
            <option value = "Other Non Academic"> Other Non Academic </option>
        </select></p>
        <p> Module (use "Other" for non academic events): <input type = "textbox" id = "commitment_module" name = "module"> </p>
        <p><input type = "submit" id = "commitment_submit_button" name = "commitment_submit_button" value = "Add this Commitment"></p>
        </form>`;

    const form = document.getElementById("add_commitment_form") as HTMLFormElement;

    form.addEventListener('submit', async function(event: Event){
        event.preventDefault();

        const formData = new FormData(form);
        let commitment = Object.fromEntries(formData.entries());
        const formJSON = JSON.stringify(commitment);

        if (await commitmentFormIsValid(formJSON)) {
            const response = await fetch('http://127.0.0.1:8090/newCommitment', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: formJSON
            });

            if(response.ok){
                alert("Your new commitment has been added successfully");
            } else {
                alert("There was a problem adding the new commitment");
            }

            form.reset();
        } else {
            alert("This time slot is not available for a new commitment, please try again");
        }
    });
}

function taskButtonClicked(): void {
    loadSpace.innerHTML = `<form id = "add_task_form" name = "add_task_form">
        <p> Task Name: <input type = "textbox" id = "task_name" name = "name"></p>
        <p> Deadline Day: <input type = "textbox" id = "deadline_day" name = "deadline"> </p>
        <p>How long should this task take approximately? <br> <input type = "textbox" id = "time_for_task" name = "timeToComplete"> Hours </p> 
        <p> Priority of task <select id = "priority" name = "priority">
            <option value = "default_priority"> Select a Priority</option>
            <option value = "low"> Low </option>
            <option value = "medium"> Medium </option>
            <option value = "high"> High </option>
        </select></p>
        <p> Type of task <select id = "task_type" name = "category">
            <option value = "default_task_type"> Select a Type of Task </option>
            <option value = "Lecture Catch Up"> Lecture Catch Up </option>
            <option value = "Summative Coursework"> Summative Coursework </option>
            <option value = "Summative Assignment"> Summative Assignment </option>
            <option value = "Formative Assignment"> Formative Assignment </option>
            <option value = "Revision"> Revision </option>
            <option value = "Other"> Other </option>
        </select></p>
        <p> Module (use "Other" for non academic events): <input type = "textbox" id = "task_module" name = "module"> </p>
        <p><input type = "submit" value = "Add this task" id = task_submit_button name = task_submit_button></p>
        </form>`;

    const form = document.getElementById("add_task_form") as HTMLFormElement;

    form.addEventListener('submit', async function(event: Event){
        event.preventDefault();

        const formData = new FormData(form);
        let task = Object.fromEntries(formData.entries());
        const formJSON = JSON.stringify(task);

        const response = await fetch('http://127.0.0.1:8090/newTask', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: formJSON
        });

        if(response.ok){
            alert("Your new task has been added successfully");
        } else {
            alert("There was a problem adding the new task");
        }

        form.reset();
    });
}

function timeButtonClicked(): void {
    loadSpace.innerHTML = `<form id = "work_day_form" name = "work_day_form">
        <p> Start Time: <input type = "textbox" id = "work_start" name = "start of day"></p>
        <p> End Time: <input type = "textbox" id = "work_end" name = "end of day"></p>
        <p><input type = "submit" value = "Confirm" id = "work__day_submit" name = "work_day_submit"></p>
        </form>`;

    const form = document.getElementById("work_day_form") as HTMLFormElement;

    form.addEventListener('submit', async function(event: Event){
        event.preventDefault();

        const formData = new FormData(form);
        let day = Object.fromEntries(formData.entries());
        const formJSON = JSON.stringify(day);

        const response = await fetch('http://127.0.0.1:8090/newDayLimits', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: formJSON
        });

        if(response.ok){
            alert("Your day limit has been added successfully");
        } else {
            alert("There was a problem adding the day limit");
        }

        form.reset();
    });
}

function finishButtonClicked(): void {
    loadSpace.innerHTML = `<form id = "end_date_form" name = "endDate">
        <p> End Date: <input type = "textbox" id = "end_date" name = "endDate"></p>
        <p><input type = "submit" value = "Confirm" id = "end_date_submit" name = "end_date_submit"></p>
        </form>`;

    const form = document.getElementById("end_date_form") as HTMLFormElement;

    form.addEventListener('submit', async function(event: Event){
        event.preventDefault();

        const formData = new FormData(form);
        let date = Object.fromEntries(formData.entries());
        const formJSON = JSON.stringify(date);

        const response = await fetch('http://127.0.0.1:8090/newEndDate', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: formJSON
        });

        if(response.ok){
            alert("Your planning period has been added successfully");
        } else {
            alert("There was a problem adding the planning period");
        }

        form.reset();
    });
}

function helpButtonClicked(): void {
    //explain the app
    loadSpace.innerHTML = "<p><em>Introduction</em></p>"
    loadSpace.innerHTML += "<p>Welcome to our project: Rein It In, the Rosie the Reindeer Planner</p>";
    loadSpace.innerHTML += "<p>Note: Please give all time slots in intervals of 15 minutes</p>";
    loadSpace.innerHTML += "<p>In order to use this planner, you will need to complete the 4 steps in our checklist</p>"
    loadSpace.innerHTML += "<p><em>1. Adding commitments:</em></p>"
    loadSpace.innerHTML += "<p>This is where you will need to upload all of your existing commitments, such as lectures, meetings and societies</p>"
    loadSpace.innerHTML += "<p>You should add all commitments between the start and end of your day, and until the end of the planning period  (you will define these later)</p>"
    loadSpace.innerHTML += "<p>Note: you should format the date input as DD.MM.YYYY</p>"
    loadSpace.innerHTML += "<p>Note: you should format times as HH:MM (24 hour time)</p>"
    loadSpace.innerHTML += "<p><em>2. Adding tasks:</em></p>"
    loadSpace.innerHTML += "<p>This is where you should add tasks you need to complete</p>"
    loadSpace.innerHTML += "<p>You should add all the tasks you'd like to schedule in the planning period (even non academics!)</p>"
    loadSpace.innerHTML += "<p>Note: you should format the date input as DD.MM.YY or D.M.YY etc (there shouldn't be any leading zeroes)</p>"
    loadSpace.innerHTML += "<p>Note: you should format times as HH:MM (24 hour time)</p>"
    loadSpace.innerHTML += "<p>Note: you should format the duration of the tasks as a number of hours</p>"
    loadSpace.innerHTML += "<p><em>3. Setting working times:</em></p>"
    loadSpace.innerHTML += "<p>This is where you should tell us what time you are willing to start working each morning, and how late you are willing to finish</p>"
    loadSpace.innerHTML += "<p>Note: you should format times as HH:MM (24 hour time)</p>"
    loadSpace.innerHTML += "<p><em>4. Setting the planning period:</em></p>"
    loadSpace.innerHTML += "<p>This is where you should tell us how long you want us to schedule for</p>"
    loadSpace.innerHTML += "<p>We will schedule your tasks between the current day, and the day you choose here</p>"
    loadSpace.innerHTML += "<p>Note: you should format the date input as DD.MM.YY or D.M.YY etc (there shouldn't be any leading zeroes)</p>"
    loadSpace.innerHTML += "<p><em>Final notes</em></p>"
    loadSpace.innerHTML += "<p>Thank you for using our planner</p>"
    loadSpace.innerHTML += "<p>We hope it can help you make the greatest academic comeback of the century</p>"
}


// ---------------- DO STUFF IDK ----------------


async function reset(): Promise<void> {
    let response = await fetch ('http://127.0.0.1:8090/reset');

    if (response.ok) {
        alert("Information reset successfully");
    } else {
        alert("There was an issue reseting our information");
    }
}

async function generateButtonClicked(): Promise<void>{
    let timetable = await getTimetable();
    let end = await getEndDate();

    if(timetable === null || end === null){
        alert("Couldn't generate timetable :(");
        return;
    }

    let today = new Date();
    let endDate = parseDate(end);

    loadSpace.innerHTML = "";

    for (let date = new Date(today); date <= endDate; date.setDate(date.getDate()+1)) {

        let dateString = formatDate(date);
        let dailyCommitments: any[] = [];

        for (let commitment of timetable) {
            if (commitment.date === dateString) {
                dailyCommitments.push(commitment);
            }
        }

        dailyCommitments.sort((a, b) => {
            return toMinutes(a.startTime) - toMinutes(b.startTime);
        });

        let html = `<p><b>${dateString}</b></p>`;

        html += `<table>
            <tr>
                <th>Time slot</th>
                <th>Activity name</th>
                <th>Module</th>
                <th>Category</th>
            </tr>`;

        if (dailyCommitments.length === 0) {
            html += `<tr><td colspan="4">No commitments</td></tr>`;
        } else {
            for (let c of dailyCommitments) {
                html += `<tr>
                    <td>${c.startTime} - ${c.endTime}</td>
                    <td>${c.name}</td>
                    <td>${c.module}</td>
                    <td>${c.category}</td>
                </tr>`;
            }
        }

        html += `</table>`;
        loadSpace.innerHTML += html;
    }
}

async function commitmentFormIsValid(formJSON: string): Promise<boolean> {
    const response = await fetch('http://127.0.0.1:8090/checkTime', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: formJSON
    });

    return response.ok;
}


// ---------------- Get Info from Back end ----------------


async function getTimetable(): Promise<any[] | null> {
    try{
        let response = await fetch('http://127.0.0.1:8090/timetable');
        let data = await response.json();
        return data.commitments;
    } catch(e){
        alert("Did not have sufficient information to generate timetable");
        return null;
    }
}

async function getEndDate(): Promise<string | null> {
    try{
        let response = await fetch('http://127.0.0.1:8090/endDate');
        let data = await response.json();
        return data[0].endDate;
    } catch(e){
        alert("No end date found");
        return null;
    }
}


// ---------------- Helpers ----------------


function parseDate(str: string): Date {
    const [d,m,y] = str.split(".");
    return new Date(Number(y), Number(m)-1, Number(d));
}

function formatDate(date: Date): string {
    return `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()%100}`;
}

function toMinutes(time: string): number {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
}
