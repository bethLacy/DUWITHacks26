import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import fs from "fs";

// ---------------- TYPES ----------------

interface Task {
  name: string;
  deadline: string;
  priority: "high" | "medium" | "low";
  timeToComplete: string;
  module?: string;
  category?: string;
}

interface Commitment {
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  module?: string;
  category?: string;
}

interface DayLimits {
  "start of day": string;
  "end of day": string;
}

interface EndDate {
  endDate: string;
}

// ---------------- FILE PATHS ----------------

const basePath = path.join(__dirname, "..");

const commitmentsFilePath = path.join(basePath, "STORAGE/commitments.json");
const tasksFilePath = path.join(basePath, "STORAGE/tasks.json");
const dayFilePath = path.join(basePath, "STORAGE/day.json");
const endFilePath = path.join(basePath, "STORAGE/endDate.json");
const timetableFilePath = path.join(basePath, "STORAGE/timetable.json");

// ---------------- APP ----------------

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("client"));

// ---------------- ROUTES ----------------

app.post("/newTask", (req: Request, res: Response) => {
  const newTask: Task = req.body;

  try {
    const tasks: Task[] = JSON.parse(fs.readFileSync(tasksFilePath, "utf8"));
    tasks.push(newTask);
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
    res.send("New task added");
  } catch {
    res.status(500).send("Server error");
  }
});

app.post("/newCommitment", (req: Request, res: Response) => {
  const newCommitment: Commitment = req.body;

  try {
    const commitments: Commitment[] = JSON.parse(
      fs.readFileSync(commitmentsFilePath, "utf8")
    );
    commitments.push(newCommitment);
    fs.writeFileSync(commitmentsFilePath, JSON.stringify(commitments, null, 2));
    res.send("New commitment added");
  } catch {
    res.status(500).send("Server error");
  }
});

app.post("/checkTime", (req: Request, res: Response) => {
  const { date, startTime, endTime } = req.body;

  try {
    const available = checkAvailable(date, startTime, endTime);
    res.status(available ? 200 : 400).send(available ? "Available" : "Busy");
  } catch {
    res.status(500).send("Server error");
  }
});

app.get('/', function(req: Request, resp: Response){
   resp.send('Server is running')
})

app.post("/newDayLimits", function(req: Request, res: Response){

    let newDayLimits = req.body;

    try {

        fs.writeFileSync(dayFilePath, JSON.stringify([newDayLimits], null, 2));

        res.status(200)
            .header("Content-Type", "text/plain")
            .send("New day limit added");

    } 
    catch (e) 
    {
        res.status(500)
            .header("Content-Type", "text/plain")
            .send("The server encountered a problem");
    }
});

app.post("/newEndDate", function(req: Request, res: Response){

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

app.get('/reset', function(req: Request, res: Response){
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
        fs.writeFileSync(timetableFilePath, JSON.stringify([] , null, 2));

        res.status(200).header("Content-Type", "text/plain").send("The storage files were reset successfully");
    } catch (e) {
        res.status(500).header("Content-Type", "text/plain").send("The server encountered a problem");
    }
});

app.get('/timetable', function(req: Request, res: Response){
    // reset timetable file
    fs.writeFileSync(timetableFilePath, JSON.stringify([] , null, 2));
    
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

app.get('/endDate', function(req: Request, res: Response){
    try {
        const file = fs.readFileSync(endFilePath, "utf8");
        const endDate = JSON.parse(file);
        res.status(200).header("Content-Type", "application/json").send(endDate);
    } catch (e) {
        res.status(500).header("Content-Type", "text/plain").send("The server encountered a problem");
    }
});

// ---------------- HELPERS ----------------

function checkAvailable(
  day: string,
  startTime: string,
  endTime: string
): boolean {
  const commitments: Commitment[] = JSON.parse(
    fs.readFileSync(commitmentsFilePath, "utf8")
  );

  for (const c of commitments) {
    if (c.date === day) {
      const start = toMinutes(startTime);
      const end = toMinutes(endTime);
      const existingStart = toMinutes(c.startTime);
      const existingEnd = toMinutes(c.endTime);

      if (start < existingEnd && end > existingStart) {
        return false;
      }
    }
  }

  return true;
}

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// ---------------- TIMETABLE ----------------

function generateTimetable() {
  const commitments: Commitment[] = JSON.parse(
    fs.readFileSync(commitmentsFilePath, "utf8")
  );

  const tasks: Task[] = JSON.parse(
    fs.readFileSync(tasksFilePath, "utf8")
  );

  const dayLimits: DayLimits = JSON.parse(
    fs.readFileSync(dayFilePath, "utf8")
  )[0];

  const endDateData: EndDate = JSON.parse(
    fs.readFileSync(endFilePath, "utf8")
  )[0];

  const startDay = toMinutes(dayLimits["start of day"]);
  const endDay = toMinutes(dayLimits["end of day"]);

  const today = new Date();
  const endDate = parseDate(endDateData.endDate);

  const priorityOrder = { high: 3, medium: 2, low: 1 };

  tasks.sort((a, b) => {
    if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }

    if (a.deadline === "none") return 1;
    if (b.deadline === "none") return -1;

    return parseDate(a.deadline).getTime() - parseDate(b.deadline).getTime();
  });

  let failedTasks: string[] = [];

  for (const task of tasks) {
    const duration = parseDuration(task.timeToComplete);
    let placed = false;

    const taskDeadline =
      task.deadline === "none"
        ? endDate
        : parseDate(task.deadline);

    for (
      let date = new Date(today);
      date <= taskDeadline;
      date.setDate(date.getDate() + 1)
    ) {
      const dateString = formatDate(date);
      const slots = getFreeSlots(dateString, commitments, startDay, endDay);

      for (const slot of slots) {
        if (slot.end - slot.start >= duration) {
          const start = slot.start;
          const end = start + duration;

          commitments.push({
            name: task.name,
            date: dateString,
            startTime: minutesToTime(start),
            endTime: minutesToTime(end),
            module: task.module,
            category: task.category,
          });

          placed = true;
          break;
        }
      }

      if (placed) break;
    }

    if (!placed) failedTasks.push(task.name);
  }

  return failedTasks.length
    ? { success: false, failedTasks }
    : { success: true, commitments };
}

// ---------------- UTIL ----------------

function getFreeSlots(
  date: string,
  commitments: Commitment[],
  startDay: number,
  endDay: number
) {
  const dayCommitments = commitments
    .filter((c) => c.date === date)
    .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));

  let slots: { start: number; end: number }[] = [];
  let current = startDay;

  for (const c of dayCommitments) {
    const cStart = toMinutes(c.startTime);

    if (cStart > current) {
      slots.push({ start: current, end: cStart });
    }

    current = toMinutes(c.endTime);
  }

  if (current < endDay) {
    slots.push({ start: current, end: endDay });
  }

  return slots;
}

function parseDuration(str: string) {
  return Math.round(parseFloat(str) * 60);
}

function parseDate(str: string) {
  const [d, m, y] = str.split(".");
  const year = 2000 + Number(y);

  return new Date(year, Number(m) - 1, Number(d));
}

function formatDate(date: Date) {
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear() % 100}`;
}

function minutesToTime(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// ---------------- EXPORT ----------------

export default app;