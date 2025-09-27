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

  const { selectedFields, selectedTopics, caseTitle } = req.body;

  if (!selectedFields || !selectedTopics || selectedFields.length === 0 || selectedTopics.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key not configured' });
  }

  const prompt = `Genereer een realistische ethische casus voor professionals uit ${selectedFields.join(', ')} over ${selectedTopics.join(', ')}.

${caseTitle ? `CASUS TITEL: "${caseTitle}"
Baseer de casus op deze titel en zorg dat de inhoud aansluit bij wat de titel suggereert.

` : ''}BELANGRIJK: 
1. Maak de casus beschrijving compact maar wel inhoudelijk duidend genoeg zodat de belangrijkste ethische pijnpunten af te leiden zijn
2. Beschrijf de pijnpunten NIET expliciet - de gebruiker moet ze zelf kunnen identificeren
3. Analyseer de casus grondig en bepaal welke ethische dimensies ECHT het meest relevant zijn (minimaal 3, maximaal 5)
4. Selecteer alleen dimensies die duidelijk en ondubbelzinnig relevant zijn voor deze specifieke casus
5. Geef uitleg waarom elke geselecteerde dimensie relevant is

Kies uit deze 12 ethische dimensies:
- relationships (Relatie tussen mensen)
- privacy (Privacy & gegevensbescherming) 
- accessibility (Toegankelijkheid & inclusiviteit)
- autonomy (Autonomie & manipulatie)
- responsibility (Verantwoordelijkheid & aansprakelijkheid)
- sustainability (Duurzaamheid & milieu-impact)
- bias (Bias & discriminatie)
- transparency (Transparantie & uitlegbaarheid)
- oversight (Menselijk toezicht & controle)
- wellbeing (Sociaal welzijn & psychologie)
- culture (Culturele & sociale impact)
- legal (Internationale & juridische implicaties)

Geef de output in het volgende JSON formaat:
{
  "case": "Een compacte, levendige beschrijving van de ethische casus (ongeveer 200 woorden). Maak het realistisch en relevant voor de geselecteerde vakgebieden. Beschrijf de situatie en de betrokken partijen met voldoende detail zodat de ethische pijnpunten af te leiden zijn, maar beschrijf de dilemma's NIET expliciet.",
  "compactCase": "Dezelfde compacte beschrijving als hierboven",
  "correctDimensions": ["dimension1", "dimension2", "dimension3", "dimension4", "dimension5"],
  "explanations": [
    "Uitleg waarom dimension1 relevant is voor deze specifieke casus",
    "Uitleg waarom dimension2 relevant is voor deze specifieke casus", 
    "Uitleg waarom dimension3 relevant is voor deze specifieke casus",
    "Uitleg waarom dimension4 relevant is voor deze specifieke casus",
    "Uitleg waarom dimension5 relevant is voor deze specifieke casus"
  ],
  "stakeholders": [
    {
      "role": "Naam van de rol/functie",
      "interests": "Wat zijn de belangen van deze stakeholder",
      "perspective": "Welk standpunt neemt deze stakeholder waarschijnlijk in"
    }
  ]
}

BELANGRIJK: Het aantal correctDimensions moet tussen 3 en 5 liggen. Selecteer alleen dimensies die echt ondubbelzinnig relevant zijn. Het aantal explanations moet exact gelijk zijn aan het aantal correctDimensions.

Zorg voor minimaal 4-6 verschillende stakeholders met verschillende perspectieven. Maak de casus complex genoeg voor een goede discussie, maar wel begrijpelijk. Gebruik Nederlandse taal en zorg dat de casus relevant is voor de Nederlandse context.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
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
      const errorText = await response.text();
      console.error('Gemini API Error Details:', errorText);
      throw new Error(`Gemini API Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini API Response:', data);
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Onverwachte response structuur van Gemini API');
    }
    
    const content = data.candidates[0].content.parts[0].text;
    
    // Parse JSON from the response with better error handling
    try {
      // First try to find JSON in the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('No JSON found in response:', content);
        throw new Error('Geen geldige JSON gevonden in AI response');
      }
      
      const jsonString = jsonMatch[0];
      console.log('JSON string to parse:', jsonString);
      
      // Clean up common JSON issues
      const cleanedJson = jsonString
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
        .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
        .trim();
      
      const parsedResult = JSON.parse(cleanedJson);
      console.log('Successfully parsed result:', parsedResult);
      
      // Validate required fields
      if (!parsedResult.case || !parsedResult.correctDimensions || !parsedResult.stakeholders) {
        throw new Error('Ontbrekende vereiste velden in AI response');
      }
      
      return res.status(200).json(parsedResult);
      
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Original content:', content);
      
      // If JSON parsing fails, try to regenerate with a simpler prompt
      throw new Error(`Fout bij verwerken AI response: ${parseError.message}`);
    }
  } catch (error) {
    console.error('Error generating case:', error);
    return res.status(500).json({ 
      error: 'Er is een fout opgetreden bij het genereren van de casus',
      details: error.message 
    });
  }
}