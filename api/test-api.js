export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Test endpoint om API key te controleren
  const apiKey = process.env.GEMINI_API_KEY;
  
  console.log('API Key check:', {
    exists: !!apiKey,
    length: apiKey ? apiKey.length : 0,
    firstChars: apiKey ? apiKey.substring(0, 10) + '...' : 'none',
    lastChars: apiKey ? '...' + apiKey.substring(apiKey.length - 10) : 'none'
  });

  if (!apiKey) {
    return res.status(500).json({ 
      error: 'GEMINI_API_KEY environment variable not found',
      debug: {
        allEnvVars: Object.keys(process.env).filter(key => key.includes('GEMINI')),
        nodeEnv: process.env.NODE_ENV
      }
    });
  }

  // Test een simpele API call
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Test: zeg alleen "API werkt!"'
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 10,
        }
      })
    });

    console.log('API Response status:', response.status);
    console.log('API Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error response:', errorText);
      
      return res.status(response.status).json({
        error: 'Gemini API Error',
        status: response.status,
        statusText: response.statusText,
        details: errorText,
        apiKeyInfo: {
          length: apiKey.length,
          format: apiKey.startsWith('AIza') ? 'Correct format' : 'Incorrect format - should start with AIza'
        }
      });
    }

    const data = await response.json();
    console.log('API Success response:', data);

    return res.status(200).json({
      success: true,
      message: 'API key werkt!',
      response: data,
      apiKeyInfo: {
        length: apiKey.length,
        format: 'Correct'
      }
    });

  } catch (error) {
    console.error('Test API call failed:', error);
    return res.status(500).json({
      error: 'Test API call failed',
      details: error.message,
      stack: error.stack
    });
  }
}