const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
const API_TOKEN = process.env.DASHBOARD_API_TOKEN;

export default async function handler(req, res) {

  // ✅ CORS fix
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (!N8N_WEBHOOK_URL) {
      return res.status(500).json({ error: "Missing N8N_WEBHOOK_URL" });
    }

    const auth = req.headers.authorization;
    if (API_TOKEN && auth !== `Bearer ${API_TOKEN}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const upstream = await fetch(N8N_WEBHOOK_URL);

    const data = await upstream.json();

    return res.status(200).json({
      ok: true,
      data
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
