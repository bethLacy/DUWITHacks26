const cors = require('cors');

const path = require("path");
const fs = require("fs");
const commitmentsDataFile = process.env.commitments_file || "STORAGE/commitments.json";
const commitmentsFilePath = path.join(__dirname, commitmentsDataFile);
const tasksDataFile = process.env.tasks_file || "STORAGE/tasks.json";
const tasksFilePath = path.join(__dirname, tasksDataFile);
const dayDataFile = process.env.tasks_file || "STORAGE/day.json";
const dayFilePath = path.join(__dirname, dayDataFile);
const endDataFile = process.env.tasks_file || "STORAGE/endDate.json";
const endFilePath = path.join(__dirname, endDataFile);

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
        games.push(newTask);
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

        res.status(200).header("Content-Type", "text/plain").send("The storage files were reset successfully");
    } catch (e) {
        res.status(500).header("Content-Type", "text/plain").send("The server encountered a problem");
    }
});

app.post("/checkTime", function(req, res){

    let newTime = req.body;

    try {
        let available = true
        //check if time slot is available

        if (available) {
            res.status(200).header("Content-Type", "text/plain").send("Available");
        }
        else {
            res.status(200).header("Content-Type", "text/plain").send("Busy");
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




module.exports = app;