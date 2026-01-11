import { put, list } from '@vercel/blob';

export default async function handler(req, res) {
  const filename = 'aws-prep-questions-v1.json';

  try {
    // GET: Retrieve questions from Blob
    if (req.method === 'GET') {
      const { blobs } = await list({ 
          prefix: filename, 
          limit: 1, 
          token: process.env.BLOB_READ_WRITE_TOKEN
      });
      
      if (!blobs.length) {
         return res.status(404).json({ error: 'Questions not found in DB' });
      }

      // Fetch the JSON content
      const response = await fetch(blobs[0].url, { 
          headers: { 'Cache-Control': 'no-cache' } 
      });
      
      if (!response.ok) throw new Error('Failed to fetch blob');
      
      const json = await response.json();

      res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
      return res.status(200).json(json);
    } 
    // POST: Upload/Update questions to Blob
    else if (req.method === 'POST') {
      const data = req.body;
      
      // Basic validation
      if (!data.questionBank || !data.examQuestionBank) {
          return res.status(400).json({ error: 'Invalid data format' });
      }

      await put(filename, JSON.stringify(data), { 
        access: 'public', 
        addRandomSuffix: false,
        token: process.env.BLOB_READ_WRITE_TOKEN
      });

      return res.status(200).json({ success: true, count: data.questionBank.length + data.examQuestionBank.length });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
