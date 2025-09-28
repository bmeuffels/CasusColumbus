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

  const { selectedFields, selectedTopics, allTopics } = req.body;

  if (!selectedFields || !selectedTopics || !allTopics || selectedFields.length === 0 || selectedTopics.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Mistral API key not configured' });
  }

  const prompt = `Genereer 12 verschillende casus titels voor ethische casussen in de technologie.

CONTEXT:
- Vakgebieden: ${selectedFields.join(', ')}
- Gekozen technologie onderwerp: ${selectedTopics.join(', ')}
- Alle beschikbare technologie onderwerpen: ${allTopics.join(', ')}

VEREISTEN:
1. Genereer 6 casus titels voor het gekozen technologie onderwerp: ${selectedTopics.join(', ')}
2. Genereer 6 casus titels verdeeld over de andere technologie onderwerpen (niet ${selectedTopics.join(', ')})
3. Elke casus titel moet:
   - Pakkend en uitnodigend zijn
   - Duidelijk verschillen van de andere titels
   - Relevant zijn voor de vakgebieden: ${selectedFields.join(', ')}
   - Een ethisch dilemma suggereren
   - Specifiek en concreet zijn (geen algemene termen)
4. Zorg voor variatie in:
   - Insteek (verschillende ethische invalshoeken)
   - Complexiteit
   - Stakeholders
   - Situaties

Geef de output in het volgende JSON formaat:
{
  "caseTitles": [
    {
      "title": "Pakkende, specifieke titel die nieuwsgierigheid wekt",
      "description": "Korte beschrijving (1-2 zinnen) die de kern van het ethische dilemma weergeeft zonder alles weg te geven",
      "techTopic": "Het exacte technologie onderwerp waar deze casus bij hoort"
    }
  ]
}

BELANGRIJK: 
- Maak de titels uitnodigend en gevarieerd
- Vermijd generieke termen zoals "AI systeem" - wees specifiek
- Zorg dat elke titel een ander ethisch spanningsveld suggereert
- De beschrijvingen moeten nieuwsgierigheid wekken, niet alles verklappen
- Gebruik Nederlandse taal en Nederlandse context`;

  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2048
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Mistral API Error Details:', errorText);
      return res.status(500).json({ 
        error: `Mistral API Error: ${response.status}`,
        details: errorText
      });
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Onverwachte response structuur van Mistral API');
    }
    
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
    console.error('Error generating titles:', error);
    return res.status(500).json({ 
      error: 'Er is een fout opgetreden bij het genereren van de casus titels',
      details: error.message 
    });
  }
}