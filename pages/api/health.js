export default async function handler(req, res) {
  try {
    const response = await fetch('http://172.25.234.163:8081/health')
    const data = await response.json()
    res.status(200).json({
      ...data,
      frontend: 'Connected to MountainShares Darwin Gödel Machine',
      deployment: 'Vercel + Custom Domain',
      creator: 'Carrie Ann Kidd'
    })
  } catch (error) {
    res.status(500).json({ 
      error: 'Could not connect to Ms. Jarvis',
      message: "Well sugar, the AI backend isn't responding right now, darlin'!"
    })
  }
}
