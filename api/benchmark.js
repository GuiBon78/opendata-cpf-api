const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

export default async function handler(req, res) {
  // CORS complet
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (!N8N_WEBHOOK_URL) {
      return res.status(500).json({ error: "Missing N8N_WEBHOOK_URL" });
    }

    // Auth désactivée temporairement pour valider le flux
    const upstream = await fetch(N8N_WEBHOOK_URL, {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    });

    const text = await upstream.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(502).json({
        error: "n8n did not return valid JSON",
        raw: text
      });
    }

    if (!upstream.ok) {
      return res.status(502).json({
        error: "n8n webhook failed",
        status: upstream.status,
        data
      });
    }

    return res.status(200).json({
      ok: true,
      fetched_at: new Date().toISOString(),
      data
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Unknown error"
    });
  }
}
