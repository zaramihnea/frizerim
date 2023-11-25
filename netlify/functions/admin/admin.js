// netlify/functions/upload-photos.js

const { parse } = require('querystring');

exports.handler = async function(event, context) {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const body = await parseBody(event);
    const photos = event.isBase64Encoded ? Buffer.from(body, 'base64') : body;

    // Here, you would typically store the photos (e.g., in a cloud storage service).
    // For simplicity, we're just logging the file names in this example.
    const fileNames = photos.map(photo => photo.originalname);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Uploaded ${fileNames.length} photos: ${fileNames.join(', ')}` }),
    };
  } catch (error) {
    console.error('Error handling request:', error);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};

async function parseBody(event) {
  return new Promise((resolve, reject) => {
    let body = '';
    event.on('data', chunk => {
      body += chunk;
    });
    event.on('end', () => {
      resolve(parse(body));
    });
    event.on('error', error => {
      reject(error);
    });
  });
}
