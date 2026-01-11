import { put, list } from '@vercel/blob';

export default async function handler(req, res) {
  const key = req.query.key;

  if (!key) {
    return res.status(400).json({ error: 'Key required' });
  }

  // Sanitize key to be safe for filenames
  const safeKey = key.replace(/[^a-zA-Z0-9-_]/g, '');
  const filename = `aws-prep-${safeKey}.json`;

  try {
    if (req.method === 'POST') {
      const data = req.body;
      
      await put(filename, JSON.stringify(data), { 
        access: 'public', 
        addRandomSuffix: false,
        allowOverwrite: true,
        token: process.env.BLOB_READ_WRITE_TOKEN
      });

      return res.status(200).json({ success: true });
    } 
    else if (req.method === 'GET') {
      const { blobs } = await list({ 
          prefix: filename, 
          limit: 1,
          token: process.env.BLOB_READ_WRITE_TOKEN
      });
      
      if (!blobs.length) {
         return res.status(404).json({ error: 'No data found' });
      }

      const response = await fetch(blobs[0].url, { cache: 'no-store' });
      
      if (!response.ok) {
           return res.status(500).json({ error: 'Failed to fetch blob' });
      }
      
      const json = await response.json();

      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json(json);
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
