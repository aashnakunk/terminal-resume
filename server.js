// server.js — super tiny OpenAI proxy (DO NOT expose this key publicly)
import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // set in your shell
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

app.post("/api/chat", async (req, res) => {
  try {
    const body = req.body;
    const r = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    const data = await r.text();
    res.status(r.status).type("application/json").send(data);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

const port = process.env.PORT || 8787;
app.listen(port, () => console.log("Proxy listening on http://localhost:"+port));
