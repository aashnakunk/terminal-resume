// server.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve index.html at "/"
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Serve static assets in the same folder
app.use(express.static(__dirname));

// --- OpenAI proxy ---
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

app.post("/api/chat", async (req, res) => {
  try {
    const r = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });
    const data = await r.text();
    res.status(r.status).type("application/json").send(data);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

const port = process.env.PORT || 8787;
app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
