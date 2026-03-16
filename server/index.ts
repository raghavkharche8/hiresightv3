import express from "express";
import cors from "cors";
import Groq from "groq-sdk";
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not configured");
  return new Groq({ apiKey });
}

function cleanJson(text: string): string {
  text = text.trim();
  const fenced = text.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
  if (fenced) return fenced[1].trim();
  return text;
}

app.post("/api/analyze-career", async (req, res) => {
  const { careerField, location = "India" } = req.body;

  if (!careerField) {
    return res.status(400).json({ error: "careerField is required" });
  }

  let groq: Groq;
  try {
    groq = getGroqClient();
  } catch {
    return res.status(500).json({ error: "GROQ_API_KEY is not configured" });
  }

  const prompt = `Analyze the job market for '${careerField}' in ${location}.

Return ONLY valid JSON with no extra text, in exactly this structure:
{
  "growthOutlook": {
    "trend": "Growing",
    "description": "detailed description string"
  },
  "salaryRanges": {
    "min": 400000,
    "avg": 700000,
    "max": 1200000,
    "currency": "INR"
  },
  "jobRoles": [
    {"title": "role name", "count": 5000}
  ],
  "technicalSkills": [
    {"skill": "skill name", "importance": "High"}
  ],
  "softSkills": [
    {"skill": "skill name", "importance": "High"}
  ],
  "topLocations": ["City1", "City2", "City3"],
  "marketDemand": "2-3 sentence description of current demand and future prospects"
}

Rules:
- trend must be exactly "Growing", "Stable", or "Declining"
- importance must be exactly "High", "Medium", or "Low"
- Include top 5 job roles with realistic opening counts
- Include top 8 technical skills
- Include top 5 soft skills
- Include top 3 hiring cities in ${location}
- Salary in INR per year for 2-5 years experience (2025 estimates)`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a job market analyst. Return only valid JSON, no markdown, no extra text." },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
    });

    const raw = completion.choices[0].message.content ?? "";
    const cleaned = cleanJson(raw);
    const insights = JSON.parse(cleaned);

    return res.json({ insights });
  } catch (error) {
    console.error("Error in analyze-career:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.post("/api/scrape-jobs", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "url is required" });
  }

  let groq: Groq;
  try {
    groq = getGroqClient();
  } catch {
    return res.status(500).json({ error: "GROQ_API_KEY is not configured" });
  }

  try {
    const websiteResponse = await fetch(url);
    const htmlContent = await websiteResponse.text();
    const truncatedContent = htmlContent.slice(0, 40000);

    const prompt = `Extract job listings from this HTML and return a JSON array of job objects.
For each job include: title, company, location, salary (if available), experience, skills (array), description.
If no jobs found, return [].
Return only valid JSON array, no markdown.

HTML:
${truncatedContent}`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a job data extraction specialist. Return only valid JSON arrays." },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
    });

    const raw = completion.choices[0].message.content ?? "[]";
    const cleaned = cleanJson(raw);

    let jobs = [];
    try {
      jobs = JSON.parse(cleaned);
    } catch {
      jobs = [{ rawData: cleaned }];
    }

    return res.json({ jobs, source: url });
  } catch (error) {
    console.error("Error in scrape-jobs:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
