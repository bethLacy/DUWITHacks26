const cors = require('cors');

const path = require("path");
const fs = require("fs");
const commitmentsDataFile = process.env.commitments_file || "STORAGE/commitments.json";
const commitmentsFilePath = path.join(__dirname, commitmentsDataFile);
const tasksDataFile = process.env.tasks_file || "STORAGE/tasks.json";
const tasksFilePath = path.join(__dirname, tasksDataFile);
const dayDataFile = process.env.day_file || "STORAGE/day.json";
const dayFilePath = path.join(__dirname, dayDataFile);
const endDataFile = process.env.end_file || "STORAGE/endDate.json";
const endFilePath = path.join(__dirname, endDataFile);
const timetableDataFile = process.env.timetable_file || "STORAGE/timetable.json";
const timetableFilePath = path.join(__dirname, timetableDataFile);

const express = require('express');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('client'));

app.post("/newTask", function(req, res){

    let newTask = req.body;

    try {
        const file = fs.readFileSync(tasksFilePath, "utf8");
        const tasks = JSON.parse(file);
        tasks.push(newTask);
        fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
        res.status(200).header("Content-Type", "text/plain").send("New task added");
    } 
    catch (e) 
    {
        res.status(500).header("Content-Type", "text/plain").send("The server encountered a problem");
    }
});

app.post("/newCommitment", function(req, res){

    let newCommitment = req.body;

    try {
        const file = fs.readFileSync(commitmentsFilePath, "utf8");
        const commitments = JSON.parse(file);
        commitments.push(newCommitment);
        fs.writeFileSync(commitmentsFilePath, JSON.stringify(commitments, null, 2));
        res.status(200).header("Content-Type", "text/plain").send("New commitment added");
    } 
    catch (e) 
    {
        res.status(500).header("Content-Type", "text/plain").send("The server encountered a problem");
    }
});

app.post("/newDayLimits", function(req, res){

    let newDayLimits = req.body;

    try {
        const file = fs.readFileSync(dayFilePath, "utf8");
        const days = JSON.parse(file);
        days.push(newDayLimits);
        fs.writeFileSync(dayFilePath, JSON.stringify(days, null, 2));
        res.status(200).header("Content-Type", "text/plain").send("New day limit added");
    } 
    catch (e) 
    {
        res.status(500).header("Content-Type", "text/plain").send("The server encountered a problem");
    }
});

app.post("/newEndDate", function(req, res){

    let newEndDate = req.body;

    try {
        const file = fs.readFileSync(endFilePath, "utf8");
        const days = JSON.parse(file);
        days.push(newEndDate);
        fs.writeFileSync(endFilePath, JSON.stringify(days, null, 2));
        res.status(200).header("Content-Type", "text/plain").send("New end date added");
    } 
    catch (e) 
    {
        res.status(500).header("Content-Type", "text/plain").send("The server encountered a problem");
    }
});

app.get('/reset', function(req, res){
    try {

        // reset task file
        fs.writeFileSync(tasksFilePath, JSON.stringify([], null, 2));

        // reset commitment file
        fs.writeFileSync(commitmentsFilePath, JSON.stringify([], null, 2));

        // reset day limit file
        fs.writeFileSync(dayFilePath, JSON.stringify([], null, 2));

        // reset end date file
        fs.writeFileSync(endFilePath, JSON.stringify([], null, 2));

        // reset timetable file
        fs.writeFileSync(timetableFilePath, JSON.stringify(null , null, 2));

        res.status(200).header("Content-Type", "text/plain").send("The storage files were reset successfully");
    } catch (e) {
        res.status(500).header("Content-Type", "text/plain").send("The server encountered a problem");
    }
});

app.post("/checkTime", function(req, res){

    let newTime = req.body;

    try {
        let available = true
        available = checkAvailable(newTime.date, newTime.startTime, newTime.endTime)

        if (available) {
            res.status(200).header("Content-Type", "text/plain").send("Available");
        }
        else {
            res.status(400).header("Content-Type", "text/plain").send("Busy");
        }
    } 
    catch (e) 
    {
        res.status(500).header("Content-Type", "text/plain").send("The server encountered a problem");
    }
});

app.get('/', function(req, resp){
   resp.send('Server is running')
})

app.get('/timetable', function(req, res){
    try {

        let result = generateTimetable();

        if(!result.success){
            res.status(400).header("Content-Type", "application/json").send(result);
        }

        fs.writeFileSync(timetableFilePath, JSON.stringify(result.commitments, null, 2));
        res.status(200).header("Content-Type", "application/json").send(result);

    } catch (e) {
        res.status(500).header("Content-Type", "text/plain").send("The server encountered a problem");
    }
});


//check available slots when adding commitments, to avoid errors later
function checkAvailable(day, startTime, endTime){

    // read existing commitments
    const file = fs.readFileSync(commitmentsFilePath, "utf8");
    const commitments = JSON.parse(file);

    for (let commitment of commitments) {

        // only check the same day
        if (commitment.date === day) {

            const start = toMinutes(startTime);
            const end = toMinutes(endTime);
            const existingStart = toMinutes(commitment.startTime);
            const existingEnd = toMinutes(commitment.endTime);

            // check for overlap
            if (start < existingEnd && end > existingStart) {
                return false; // collision detected
            }
        }
    }

    return true; // no collisions
}

//convert times to minutes to allow comparison
function toMinutes(time){
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
}




//TIMETABLE ALGORITHM

//main scheduling algorithm
function generateTimetable(){

    //read all stored data
    const commitments = JSON.parse(fs.readFileSync(commitmentsFilePath, "utf8"));
    const tasks = JSON.parse(fs.readFileSync(tasksFilePath, "utf8"));
    const dayLimits = JSON.parse(fs.readFileSync(dayFilePath, "utf8"))[0];
    const endDateData = JSON.parse(fs.readFileSync(endFilePath, "utf8"))[0];

    const startDay = toMinutes(dayLimits["start of day"]);
    const endDay = toMinutes(dayLimits["end of day"]);

    const today = new Date();
    const endDate = parseDate(endDateData.endDate);


    //sort tasks by priority then deadline
    const priorityOrder = {high:3, medium:2, low:1};

    tasks.sort((a,b)=>{

        if(priorityOrder[b.priority] !== priorityOrder[a.priority]){
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        }

        if(a.deadline === "none") return 1;
        if(b.deadline === "none") return -1;

        return parseDate(a.deadline) - parseDate(b.deadline);
    });

    let failedTasks = [];

    //schedule each task
    for(let task of tasks){

        let duration = parseDuration(task.timeToComplete);
        let placed = false;

        let taskDeadline = task.deadline === "none"
            ? endDate
            : parseDate(task.deadline);

        for(let date = new Date(today); date <= taskDeadline; date.setDate(date.getDate()+1)){

            let dateString = formatDate(date);

            let slots = getFreeSlots(dateString, commitments, startDay, endDay);

            for(let slot of slots){

                if(slot.end - slot.start >= duration){

                    const start = slot.start;
                    const end = start + duration;

                    commitments.push({
                        name: task.name,
                        date: dateString,
                        startTime: minutesToTime(start),
                        endTime: minutesToTime(end),
                        module: task.module,
                        category: task.category
                    });


                    commitments.sort((a,b)=> {
                        if(a.date !== b.date) return parseDate(a.date) - parseDate(b.date);
                        return toMinutes(a.startTime) - toMinutes(b.startTime);
                    });

                    placed = true;
                    break;
                }
            }

            if(placed) break;
        }

        if(!placed){
            failedTasks.push(task.name);
        }
    }

    if (failedTasks.length > 0) {
        return {
            success: false,
            message: "Some tasks could not be scheduled due to insufficient time.",
            failedTasks: failedTasks
        };
    }

    return {
        success: true,
        commitments: commitments
    };
}

//find free time slots between commitments
function getFreeSlots(date, commitments, startDay, endDay){

    const dayCommitments = commitments
        .filter(c => c.date === date)
        .sort((a,b)=> toMinutes(a.startTime)-toMinutes(b.startTime));

    let slots = [];
    let current = startDay;

    for(let c of dayCommitments){

        const cStart = toMinutes(c.startTime);

        if(cStart > current){
            slots.push({start: current, end: cStart});
        }

        current = toMinutes(c.endTime);
    }

    if(current < endDay){
        slots.push({start: current, end: endDay});
    }

    return slots;
}

//convert task duration like "1" into minutes e.g. 60
function parseDuration(str){
    return Math.round(parseFloat(str) * 60);
}

//parse date "09.03.2026"
function parseDate(str){
    const [d,m,y] = str.split(".");
    return new Date(`20${y}`, m-1, d);
}

//convert Date into "9.3.26"
function formatDate(date){
    return `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()%100}`;
}

//convert minutes into "HH:MM"
function minutesToTime(min){

    const h = Math.floor(min/60);
    const m = min%60;

    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
}


module.exports = app;