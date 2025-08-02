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

  const { selectedFields, selectedTopics } = req.body;

  if (!selectedFields || !selectedTopics || selectedFields.length === 0 || selectedTopics.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const prompt = `Genereer een realistische ethische casus voor professionals uit ${selectedFields.join(', ')} over ${selectedTopics.join(', ')}.

Geef de output in het volgende JSON formaat:
{
  "case": "Een gedetailleerde, levendige beschrijving van de ethische casus (minimaal 200 woorden). Maak het realistisch en relevant voor de geselecteerde vakgebieden. Beschrijf de situatie, de betrokken partijen, en de ethische dilemma's die zich voordoen.",
  "stakeholders": [
    {
      "role": "Naam van de rol/functie",
      "interests": "Wat zijn de belangen van deze stakeholder",
      "perspective": "Welk standpunt neemt deze stakeholder waarschijnlijk in"
    }
  ]
}

Zorg voor minimaal 4-6 verschillende stakeholders met verschillende perspectieven. Maak de casus complex genoeg voor een goede discussie, maar wel begrijpelijk. Gebruik Nederlandse taal en zorg dat de casus relevant is voor de Nederlandse context.`;

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
    console.error('Error generating case:', error);
    return res.status(500).json({ 
      error: 'Er is een fout opgetreden bij het genereren van de casus',
      details: error.message 
    });
  }
}