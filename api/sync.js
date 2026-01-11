
import { put, list } from '@vercel/blob';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const url = new URL(req.url);
  const key = url.searchParams.get('key');

  if (!key) {
    return new Response(JSON.stringify({ error: 'Key required' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
    });
  }

  // Sanitize key to be safe for filenames
  const safeKey = key.replace(/[^a-zA-Z0-9-_]/g, '');
  const filename = `aws-prep-${safeKey}.json`;

  try {
    if (req.method === 'POST') {
      const data = await req.json();
      
      // Upload new state. addRandomSuffix: false allows us to maintain a predictable filename
      // though the internal URL might handle versioning.
      await put(filename, JSON.stringify(data), { 
        access: 'public', 
        addRandomSuffix: false,
        token: process.env.BLOB_READ_WRITE_TOKEN // Automatically available on Vercel
      });

      return new Response(JSON.stringify({ success: true }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' } 
      });
    } 
    else if (req.method === 'GET') {
      // List to find the file
      const { blobs } = await list({ 
          prefix: filename, 
          limit: 1,
          token: process.env.BLOB_READ_WRITE_TOKEN
      });
      
      if (!blobs.length) {
         return new Response(JSON.stringify({ error: 'No data found' }), { 
             status: 404,
             headers: { 'Content-Type': 'application/json' }
         });
      }

      // Fetch the content with no-store to avoid stale data
      const response = await fetch(blobs[0].url, { cache: 'no-store' });
      
      if (!response.ok) {
           return new Response(JSON.stringify({ error: 'Failed to fetch blob' }), { status: 500 });
      }
      
      const json = await response.json();

      return new Response(JSON.stringify(json), { 
        status: 200,
        headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store' 
        } 
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
    });
  }
}
