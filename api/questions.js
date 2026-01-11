
import { put, list } from '@vercel/blob';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req) {
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
         return new Response(JSON.stringify({ error: 'Questions not found in DB' }), { 
             status: 404,
             headers: { 'Content-Type': 'application/json' }
         });
      }

      // Fetch the JSON content
      const response = await fetch(blobs[0].url, { 
          // Important: cache control to ensure we get updates
          headers: { 'Cache-Control': 'no-cache' } 
      });
      
      if (!response.ok) throw new Error('Failed to fetch blob');
      
      const json = await response.json();

      return new Response(JSON.stringify(json), { 
        status: 200,
        headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' 
        } 
      });
    } 
    // POST: Upload/Update questions to Blob
    else if (req.method === 'POST') {
      const data = await req.json(); // Expect { questionBank, examQuestionBank }
      
      // Basic validation
      if (!data.questionBank || !data.examQuestionBank) {
          return new Response(JSON.stringify({ error: 'Invalid data format' }), { status: 400 });
      }

      await put(filename, JSON.stringify(data), { 
        access: 'public', 
        addRandomSuffix: false, // Keep filename constant to act as a "database entry"
        token: process.env.BLOB_READ_WRITE_TOKEN
      });

      return new Response(JSON.stringify({ success: true, count: data.questionBank.length + data.examQuestionBank.length }), { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
    });
  }
}
