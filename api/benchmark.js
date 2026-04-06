const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
const API_TOKEN = process.env.DASHBOARD_API_TOKEN;

export default async function handler(req, res) {
  try {
    if (!N8N_WEBHOOK_URL) {
      return res.status(500).json({ error: "Missing N8N_WEBHOOK_URL" });
    }

    const auth = req.headers.authorization;
    if (API_TOKEN && auth !== `Bearer ${API_TOKEN}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const upstream = await fetch(N8N_WEBHOOK_URL, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });

    if (!upstream.ok) {
      return res.status(502).json({
        error: "n8n webhook failed",
        status: upstream.status
      });
    }

    const data = await upstream.json();

    return res.status(200).json({
      ok: true,
      source: "n8n",
      fetched_at: new Date().toISOString(),
      data
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Unknown error"
    });
  }
}
