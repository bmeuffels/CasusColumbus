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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { compactCase, selectedDimensions } = req.body;

  if (!compactCase || !selectedDimensions || selectedDimensions.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const prompt = `Gegeven deze compacte ethische casus:

"${compactCase}"

En de volgende geselecteerde ethische spanningsvelden: ${selectedDimensions.join(', ')}

Breid de casus uit met specifieke details en voorbeelden die deze ethische spanningsvelden belichten. Voeg concrete situaties, dilemma's en uitdagingen toe die relevant zijn voor de geselecteerde dimensies.

Geef de output in het volgende JSON formaat:
{
  "expandedCase": "Een uitgebreide versie van de casus (300-400 woorden) die specifiek ingaat op de geselecteerde ethische spanningsvelden. Maak de dilemma's nu WEL expliciet en geef concrete voorbeelden van hoe deze ethische uitdagingen zich manifesteren in de praktijk."
}

Gebruik Nederlandse taal en zorg dat de uitbreiding naadloos aansluit op de originele casus.`;

  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8
      })
    });

    if (!response.ok) {
      throw new Error(`Mistral API Error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsedResult = JSON.parse(jsonMatch[0]);
      return res.status(200).json(parsedResult);
    } else {
      throw new Error('Geen geldige JSON gevonden in response');
    }
  } catch (error) {
    console.error('Error expanding case:', error);
    return res.status(500).json({ 
      error: 'Er is een fout opgetreden bij het uitbreiden van de casus',
      details: error.message 
    });
  }
}