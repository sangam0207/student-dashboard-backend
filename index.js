// server.js
import express from "express";
import fs from "fs";
import path from "path";
import { parse } from "json2csv";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const FILE = path.join(process.cwd(), "submissions.csv");

// Ensure CSV file exists with headers
if (!fs.existsSync(FILE)) {
  fs.writeFileSync(
    FILE,
    "id,submittedAt,name,roll,contact,email,course,semester,SEC1,SEC2,SEC3,VAC1,VAC2,VAC3,GE1,GE2,GE3\n"
  );
}

app.post("/submit", (req, res) => {
  const data = req.body;
  console.log("Received submission:", data);

  try {
    // Map uppercase snake_case → CSV columns
    const row = {
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      name: data.name || "",
      roll: data.roll || "",
      contact: data.contact || "",
      email: data.email || "",
      course: data.course || "",
      semester: data.semester || "",
      SEC1: data.selections?.SEC_1 || "",
      SEC2: data.selections?.SEC_2 || "",
      SEC3: data.selections?.SEC_3 || "",
      VAC1: data.selections?.VAC_1 || "",
      VAC2: data.selections?.VAC_2 || "",
      VAC3: data.selections?.VAC_3 || "",
      GE1: data.selections?.GE_1 || "",
      GE2: data.selections?.GE_2 || "",
      GE3: data.selections?.GE_3 || "",
    };

    const csv = parse([row], { header: false });
    fs.appendFileSync(FILE, "\n" + csv);

    res.json({ success: true, message: "Submission saved." });
  } catch (e) {
    console.error("Error saving submission:", e);
    res.status(500).json({ success: false, message: e.message });
  }
});

app.get("/export", (req, res) => {
  res.download(FILE, "submissions.csv");
});

app.listen(5000, () => console.log("Server running on 5000"));
