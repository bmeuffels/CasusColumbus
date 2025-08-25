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

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key not configured' });
  }

  const prompt = `Gegeven deze compacte ethische casus:

"${compactCase}"

En de volgende geselecteerde ethische spanningsvelden: ${selectedDimensions.join(', ')}

Breid de casus uit tot een evenwichtige beschrijving die zowel de kansen als de risico's belicht van de geselecteerde ethische spanningsvelden. Maak het een genuanceerd verhaal dat tot discussie uitnodigt.

BELANGRIJK:
1. Houd de uitbreiding beknopt (300-400 woorden)
2. Toon ZOWEL positieve kansen ALS potentiële risico's
3. Maak het een echt dilemma: geen duidelijk "goed" of "fout" antwoord
4. Voeg concrete details toe die de ethische spanningsvelden illustreren
5. Creëer ruimte voor discussie over wenselijkheid van de ontwikkeling

Geef de output in het volgende JSON formaat:
{
  "expandedCase": "Een uitgebreide, evenwichtige versie van de casus (300-400 woorden) die zowel kansen als risico's belicht. Toon concrete voorbeelden van hoe de ethische spanningsvelden zich manifesteren, maar presenteer het als een genuanceerd dilemma zonder duidelijke 'goede' of 'foute' keuze. Maak het uitnodigend voor discussie over de wenselijkheid."
}

Gebruik Nederlandse taal en zorg dat de uitbreiding naadloos aansluit op de originele casus.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API Error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Onverwachte response structuur van Gemini API');
    }
    
    const content = data.candidates[0].content.parts[0].text;
    
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