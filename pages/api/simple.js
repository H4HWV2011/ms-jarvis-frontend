export default function handler(req, res) {
  res.status(200).json({
    success: true,
    message: "Simple API working!",
    timestamp: new Date().toISOString(),
    method: req.method
  });
}
