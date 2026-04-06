export default async function handler(req, res) {
  res.status(200).json({
    ok: true,
    service: "opendata-cpf-api",
    timestamp: new Date().toISOString()
  });
}
