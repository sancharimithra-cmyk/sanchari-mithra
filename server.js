/**
 * =============================================================================
 * SANCHARI MITHRA REBOOT — Backend RAG API Server
 * =============================================================================
 * Provides POST /api/chat with semantic retrieval over website-knowledge.json
 * and AI model grounding via Google Gemini API.
 *
 * Usage:
 *   node server/server.js
 * =============================================================================
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Load environment variables from .env if present
const envPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [k, ...v] = trimmed.split('=');
      if (k && v.length > 0) process.env[k.trim()] = v.join('=').trim();
    }
  });
}

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.AI_API_KEY || '';
const AI_MODEL = process.env.AI_MODEL || 'gemini-1.5-flash';

// Load Knowledge Base
const KNOWLEDGE_PATH = path.resolve(__dirname, '..', 'data', 'website-knowledge.json');
let knowledge = { chunks: [] };
try {
  if (fs.existsSync(KNOWLEDGE_PATH)) {
    knowledge = JSON.parse(fs.readFileSync(KNOWLEDGE_PATH, 'utf8'));
    console.log(`[RAG] Loaded ${knowledge.chunks.length} knowledge chunks.`);
  }
} catch (e) {
  console.error('[RAG] Failed to load knowledge base:', e.message);
}

// Helper: Semantic similarity and relevance scoring
function scoreChunk(chunk, queryTokens) {
  let score = 0;
  const titleTokens = (chunk.title || '').toLowerCase();
  const categoryTokens = (chunk.category || '').toLowerCase();
  const keywords = (chunk.keywords || []).map(k => k.toLowerCase());
  const contentLower = (chunk.content || '').toLowerCase();

  for (const token of queryTokens) {
    if (titleTokens.includes(token)) score += 10;
    if (categoryTokens.includes(token)) score += 6;
    for (const kw of keywords) {
      if (kw.includes(token) || token.includes(kw)) score += 8;
    }
    if (contentLower.includes(token)) score += 3;
  }
  return score;
}

// Helper: Retrieve best matching chunks
function retrieveContext(query, topN = 4) {
  const tokens = query.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2 && !['the', 'and', 'for', 'about', 'our', 'what', 'where', 'tell', 'show'].includes(t));

  const scored = knowledge.chunks.map(chunk => ({
    chunk,
    score: scoreChunk(chunk, tokens)
  })).filter(item => item.score > 0);

  scored.sort((a, b) => b.score - a.score);
  const selected = scored.slice(0, topN).map(s => s.chunk);
  return selected.length > 0 ? selected : knowledge.chunks.slice(0, 2);
}

// Real-time Daily Routine Checker
function getCurrentRoutine() {
  // IST is UTC + 5:30
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const ist = new Date(utc + (3600000 * 5.5));
  const hours = ist.getHours();
  const mins = ist.getMinutes();
  const totalMins = hours * 60 + mins;

  let currentSlot = "Rest & Rejuvenation";
  if (totalMins >= 270 && totalMins < 300) currentSlot = "Wake-up & Morning Ablutions (4:30 AM)";
  else if (totalMins >= 300 && totalMins < 345) currentSlot = "Suprabhatam, Morning Prayers & Vedic Chanting (5:00 AM)";
  else if (totalMins >= 345 && totalMins < 450) currentSlot = "Morning Jogging & Physical Fitness (5:45 AM)";
  else if (totalMins >= 450 && totalMins < 495) currentSlot = "Breakfast at Annapoorna Dining Hall (7:30 AM)";
  else if (totalMins >= 495 && totalMins < 735) currentSlot = "Morning Academic Sessions & Classes (8:15 AM - 12:15 PM)";
  else if (totalMins >= 735 && totalMins < 825) currentSlot = "Nourishing Lunch & Afternoon Rest (12:15 PM)";
  else if (totalMins >= 825 && totalMins < 960) currentSlot = "Self Study & Remedial Academic Classes (1:45 PM - 4:00 PM)";
  else if (totalMins >= 960 && totalMins < 1055) currentSlot = "Outdoor Games, Sports & Evening Snacks (4:00 PM - 5:15 PM)";
  else if (totalMins >= 1055 && totalMins < 1125) currentSlot = "Evening Spiritual Bhajans & Mangala Arati (5:35 PM - 6:45 PM)";
  else if (totalMins >= 1125 && totalMins < 1185) currentSlot = "Sattvic Dinner (7:00 PM)";
  else if (totalMins >= 1185 && totalMins < 1260) currentSlot = "Paravidya (Spiritual Learning & Character Education) (7:45 PM - 9:00 PM)";
  else currentSlot = "Night Prayers & Peaceful Rest (9:30 PM)";

  return { timeStr: ist.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), slot: currentSlot };
}

// Call Google Gemini API
function callGemini(systemPrompt, userQuery, contextText) {
  return new Promise((resolve, reject) => {
    if (!GEMINI_API_KEY) {
      return reject(new Error('GEMINI_API_KEY is not configured.'));
    }

    const postData = JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            { text: `${systemPrompt}\n\n[OFFICIAL GURUKULAM KNOWLEDGE CONTEXT]:\n${contextText}\n\n[USER QUESTION]:\n${userQuery}` }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 600,
        topP: 0.8
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/${AI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.candidates && json.candidates[0] && json.candidates[0].content) {
            const text = json.candidates[0].content.parts[0].text;
            resolve(text);
          } else {
            reject(new Error(json.error ? json.error.message : 'Invalid model response'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Create HTTP Server
const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Health check
  if (req.method === 'GET' && req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'healthy', companion: 'SANCHARI MITHRA REBOOT', chunksLoaded: knowledge.chunks.length }));
    return;
  }

  // Knowledge Endpoint
  if (req.method === 'GET' && req.url === '/api/knowledge') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(knowledge));
    return;
  }

  // Chat Endpoint
  if (req.method === 'POST' && req.url === '/api/chat') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 20000) {
        req.destroy();
      }
    });

    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const userMessage = (payload.message || '').trim();

        if (!userMessage) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Message cannot be empty.' }));
          return;
        }

        const lower = userMessage.toLowerCase();

        // 1. Smart Greeting handling
        if (/^(hi|hello|hey|sai ram|namaste|who are you|pranams)[\s!.]*$/i.test(lower)) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            answer: "🙏 <strong>Sai Ram!</strong> I am <strong>SANCHARI MITHRA REBOOT</strong>, your official AI Campus Guide & Companion. Ask me anything about our campus buildings, spiritual sanctums, daily routine, admissions, or yearly activities!",
            sources: ["Official Portal Guide"],
            category: "General"
          }));
          return;
        }

        // 2. Real-time timetable query handling
        if (lower.includes('today') || lower.includes('now') || lower.includes('current activity') || lower.includes('schedule right now')) {
          const routine = getCurrentRoutine();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            answer: `🙏 <strong>Sai Ram!</strong> According to our official campus schedule, the current time is <strong>${routine.timeStr} IST</strong> and students are engaged in: <strong>${routine.slot}</strong>.<br><br>Our full daily schedule begins at 4:30 AM with Suprabhatam and prayers, followed by fitness, morning academics (8:15 AM - 12:15 PM), study sessions, evening sports, bhajans (5:35 PM), and Paravidya spiritual learning (7:45 PM).`,
            sources: ["Daily Routine & Timetable"],
            category: "Routine"
          }));
          return;
        }

        // 3. Retrieve relevant chunks
        const retrieved = retrieveContext(userMessage, 4);
        const contextText = retrieved.map(c => `[Section: ${c.title} (${c.source})]\n${c.content}`).join('\n\n');
        const sources = Array.from(new Set(retrieved.map(c => c.source)));

        const systemPrompt = `You are SANCHARI MITHRA REBOOT, the official AI Digital Campus Guide for Sri Sathya Sai Sharadaniketanam Gurukulam, Mandya.
STRICT ANTI-HALLUCINATION RULES:
1. Answer ONLY from the official Gurukulam knowledge context provided below.
2. Never invent campus facts, names, dates, facilities, schedules, policies, people, events, or contact info.
3. If sufficient information is not found in the context, respond politely:
"Sai Ram! I could not find verified information about that in the official Gurukulam portal. Please contact the Gurukulam administration for confirmation."
4. Tone: Warm, respectful, knowledgeable, concise, and educational.
5. In campus temples, only mention Dhyana Mantapa, Sri Gavisiddeshwara Temple, and Sri Maramma Temple. Never mention Sri Sharada or Venugopala temples.`;

        // 4. Call Gemini if key exists, otherwise provide grounded synthesized response
        let finalAnswer = '';
        if (GEMINI_API_KEY) {
          try {
            finalAnswer = await callGemini(systemPrompt, userMessage, contextText);
          } catch (err) {
            console.warn('[RAG] Gemini call failed, falling back to local synthesis:', err.message);
          }
        }

        // Fallback local grounded answer if no key or API failed
        if (!finalAnswer) {
          const topChunk = retrieved[0];
          finalAnswer = `🙏 <strong>Sai Ram!</strong> ${topChunk.content}`;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          answer: finalAnswer,
          sources: sources,
          category: retrieved[0] ? retrieved[0].category : 'General'
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          answer: "Sai Ram! SANCHARI is temporarily unable to connect to the AI service. Please try again shortly.",
          sources: []
        }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found.' }));
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`SANCHARI MITHRA REBOOT Backend API listening on port ${PORT}`);
  console.log(`Gemini Key configured: ${GEMINI_API_KEY ? 'YES (Live AI active)' : 'NO (Grounded Local Fallback active)'}`);
  console.log(`=======================================================`);
});
