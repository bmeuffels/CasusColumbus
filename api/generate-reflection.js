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

  const { selectedDimensions, caseContent } = req.body;

  if (!selectedDimensions || !caseContent || selectedDimensions.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Mistral API key not configured' });
  }

  const dimensionNames = {
    relationships: 'Relatie tussen mensen',
    privacy: 'Privacy & gegevensbescherming',
    accessibility: 'Toegankelijkheid & inclusiviteit',
    autonomy: 'Autonomie & manipulatie',
    responsibility: 'Verantwoordelijkheid & aansprakelijkheid',
    sustainability: 'Duurzaamheid & milieu-impact',
    bias: 'Bias & discriminatie',
    transparency: 'Transparantie & uitlegbaarheid',
    oversight: 'Menselijk toezicht & controle',
    wellbeing: 'Sociaal welzijn & psychologie',
    culture: 'Culturele & sociale impact',
    legal: 'Internationale & juridische implicaties'
  };

  const prompt = `Gegeven deze ethische casus:

"${caseContent}"

En de volgende door de gebruiker geselecteerde ethische spanningsvelden: ${selectedDimensions.map(dim => dimensionNames[dim] || dim).join(', ')}

Genereer voor elk geselecteerd spanningsveld een persoonlijke, reflectieve feedbacktekst die:

1. POSITIEF en NIEUWSGIERIG is (geen kritiek of correctie)
2. De gebruiker uitnodigt tot dieper nadenken
3. Erkent hun perspectief als waardevol
4. Stelt open vragen die tot discussie uitnodigen
5. Specifiek ingaat op hoe dit spanningsveld zich manifesteert in deze casus
6. Ongeveer 2-3 zinnen lang is

Voorbeelden van toon:
- "Interessante keuze. Wat zegt dit over jouw blik op de situatie?"
- "Je interpretatie geeft richting aan het gesprek. Hoe zou een ander dit kunnen zien?"
- "Dit spanningsveld raakt de kern van het dilemma. Welke afwegingen zie jij hier?"

BELANGRIJK: 
- Geen standaardteksten maar specifiek voor deze casus
- Altijd positief en uitnodigend
- Geen "goed" of "fout" benadering
- Focus op reflectie en perspectief

Geef de output in het volgende JSON formaat:
{
  "reflections": [
    {
      "dimension": "dimension_key",
      "dimensionName": "Nederlandse naam van het spanningsveld",
      "reflection": "Persoonlijke, reflectieve feedbacktekst specifiek voor dit spanningsveld in deze casus"
    }
  ]
}`;

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
        temperature: 0.8,
        max_tokens: 1500
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
    console.error('Error generating reflection:', error);
    return res.status(500).json({ 
      error: 'Er is een fout opgetreden bij het genereren van de reflectie',
      details: error.message 
    });
  }
}