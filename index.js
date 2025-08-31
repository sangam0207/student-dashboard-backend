// server.js
import express from "express";
import fs from "fs";
import path from "path";
import { parse } from "json2csv";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors()); // allow frontend requests

const FILE = path.join(process.cwd(), "submissions.csv");

// Ensure CSV file exists with headers
if (!fs.existsSync(FILE)) {
  fs.writeFileSync(FILE, "id,submittedAt,name,roll,contact,email,course,semester,SEC,VAC,GE\n");
}

app.post("/submit", (req, res) => {
  const data = req.body;
  try {
    const row = {
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      name: data.name,
      roll: data.roll,
      contact: data.contact,
      email: data.email,
      course: data.course,
      semester: data.semester,
      SEC: data.selections.SEC || "",
      VAC: data.selections.VAC || "",
      GE: data.selections.GE || "",
    };

    const csv = parse([row], { header: false });
    fs.appendFileSync(FILE, "\n" + csv);

    res.json({ success: true, message: "Submission saved." });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

app.get("/export", (req, res) => {
  res.download(FILE, "submissions.csv");
});

app.listen(5000, () => console.log("✅ Server running on 5000"));
