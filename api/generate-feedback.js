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

  const { caseContent, selectedDimensions, stakeholders } = req.body;

  if (!caseContent || !selectedDimensions || selectedDimensions.length === 0) {
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

  const stakeholderInfo = stakeholders ? stakeholders.map(s => `${s.role}: ${s.interests}`).join('; ') : '';

  const prompt = `Gegeven deze ethische casus:

"${caseContent}"

${stakeholderInfo ? `Stakeholders: ${stakeholderInfo}` : ''}

Genereer voor elk van de volgende geselecteerde ethische spanningsvelden een specifieke, inhoudelijke reflectieve feedback van 2-3 zinnen die:

1. Direct ingaat op hoe dit spanningsveld zich manifesteert in deze specifieke casus
2. Concrete voorbeelden of aspecten uit de casus benoemt
3. Een reflectieve vraag of discussiepunt stelt die tot dieper nadenken aanzet
4. Genuanceerd is en verschillende perspectieven erkent

Geselecteerde spanningsvelden: ${selectedDimensions.map(d => dimensionNames[d] || d).join(', ')}

BELANGRIJK:
- Maak de feedback specifiek voor deze casus, geen algemene teksten
- Verwijs naar concrete elementen uit de casus
- Stel reflectieve vragen die tot discussie uitnodigen
- Houd het beknopt maar inhoudelijk waardevol
- Gebruik Nederlandse taal

Geef de output in het volgende JSON formaat:
{
  "feedback": {
    "${selectedDimensions[0]}": "Specifieke feedback voor dit spanningsveld in relatie tot de casus (2-3 zinnen)",
    ${selectedDimensions.slice(1).map(dim => `"${dim}": "Specifieke feedback voor dit spanningsveld in relatie tot de casus (2-3 zinnen)"`).join(',\n    ')}
  }
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
        temperature: 0.7,
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
    console.error('Error generating feedback:', error);
    return res.status(500).json({ 
      error: 'Er is een fout opgetreden bij het genereren van de feedback',
      details: error.message 
    });
  }
}