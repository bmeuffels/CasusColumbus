import React, { useState } from 'react';
import { Sparkles, RotateCcw, Volume2 } from 'lucide-react';
import { playSelectSound, playDeselectSound, playNavigationSound } from './utils/soundEffects';

// Types
interface Case {
  id: string;
  title: string;
  description: string;
  ethicalDilemma: string;
  stakeholders: string[];
  technologies: string[];
  context: string;
}

interface Stakeholder {
  name: string;
  role: string;
  interests: string[];
  concerns: string[];
  influence: 'Hoog' | 'Gemiddeld' | 'Laag';
}

// Technology areas and their subcategories
const technologyAreas = {
  'Artificial Intelligence': [
    'Machine Learning', 'Deep Learning', 'Natural Language Processing', 
    'Computer Vision', 'Robotics', 'Expert Systems'
  ],
  'Data & Privacy': [
    'Big Data Analytics', 'Data Mining', 'Privacy Protection', 
    'Data Governance', 'Surveillance Technology', 'Biometric Systems'
  ],
  'Internet & Communication': [
    'Social Media Platforms', 'Internet of Things', 'Cloud Computing', 
    'Cybersecurity', 'Digital Identity', 'Online Communities'
  ],
  'Biotechnology': [
    'Genetic Engineering', 'CRISPR Technology', 'Synthetic Biology', 
    'Biomedical Devices', 'Pharmaceutical Technology', 'Personalized Medicine'
  ],
  'Emerging Technologies': [
    'Blockchain', 'Quantum Computing', 'Augmented Reality', 
    'Virtual Reality', 'Nanotechnology', '3D Printing'
  ],
  'Automation & Work': [
    'Industrial Automation', 'Autonomous Vehicles', 'Digital Platforms', 
    'Algorithmic Management', 'Remote Work Technology', 'Digital Labor'
  ]
};

function App() {
  const [currentStep, setCurrentStep] = useState<'areas' | 'technologies' | 'case' | 'stakeholders'>('areas');
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [generatedCase, setGeneratedCase] = useState<Case | null>(null);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingStakeholders, setIsGeneratingStakeholders] = useState(false);

  const handleAreaToggle = (area: string) => {
    setSelectedAreas(prev => {
      const newAreas = prev.includes(area) 
        ? prev.filter(a => a !== area)
        : [...prev, area];
      
      if (prev.includes(area)) {
        playDeselectSound();
      } else {
        playSelectSound();
      }
      
      return newAreas;
    });
  };

  const handleTechnologyToggle = (tech: string) => {
    setSelectedTechnologies(prev => {
      const newTechs = prev.includes(tech) 
        ? prev.filter(t => t !== tech)
        : [...prev, tech];
      
      if (prev.includes(tech)) {
        playDeselectSound();
      } else {
        playSelectSound();
      }
      
      return newTechs;
    });
  };

  const getAvailableTechnologies = () => {
    return selectedAreas.flatMap(area => 
      technologyAreas[area as keyof typeof technologyAreas] || []
    );
  };

  const generateCase = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          areas: selectedAreas,
          technologies: selectedTechnologies
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate case');
      }

      const caseData = await response.json();
      setGeneratedCase(caseData);
      setCurrentStep('case');
    } catch (error) {
      console.error('Error generating case:', error);
      // Fallback case for demo purposes
      setGeneratedCase({
        id: 'demo-case',
        title: 'AI-gedreven Personeelsselectie',
        description: 'Een technologiebedrijf implementeert een AI-systeem voor het screenen van sollicitanten.',
        ethicalDilemma: 'Het AI-systeem toont onbewuste vooroordelen tegen bepaalde demografische groepen.',
        stakeholders: ['HR-afdeling', 'Sollicitanten', 'Management', 'Ontwikkelaars'],
        technologies: selectedTechnologies,
        context: 'Moderne werkomgeving met focus op efficiëntie en diversiteit.'
      });
      setCurrentStep('case');
    } finally {
      setIsGenerating(false);
    }
  };

  const selectCase = () => {
    playNavigationSound();
    setSelectedCase(generatedCase);
    generateStakeholders();
  };

  const generateStakeholders = async () => {
    if (!generatedCase) return;
    
    setIsGeneratingStakeholders(true);
    setCurrentStep('stakeholders');
    
    try {
      const response = await fetch('/api/expand-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          case: generatedCase
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate stakeholders');
      }

      const data = await response.json();
      setStakeholders(data.stakeholders);
    } catch (error) {
      console.error('Error generating stakeholders:', error);
      // Fallback stakeholders for demo purposes
      setStakeholders([
        {
          name: 'HR Manager',
          role: 'Personeelsmanager',
          interests: ['Efficiënte werving', 'Diverse workforce', 'Compliance'],
          concerns: ['Juridische risicos', 'Reputatieschade', 'Kandidaattevredenheid'],
          influence: 'Hoog'
        },
        {
          name: 'Sollicitant',
          role: 'Potentiële werknemer',
          interests: ['Eerlijke behandeling', 'Transparantie', 'Kansen'],
          concerns: ['Discriminatie', 'Privacy', 'Bias in algoritmes'],
          influence: 'Laag'
        }
      ]);
    } finally {
      setIsGeneratingStakeholders(false);
    }
  };

  const resetApp = () => {
    playNavigationSound();
    setCurrentStep('areas');
    setSelectedAreas([]);
    setSelectedTechnologies([]);
    setGeneratedCase(null);
    setSelectedCase(null);
    setStakeholders([]);
  };

  const canProceedFromAreas = selectedAreas.length > 0;
  const canProceedFromTechnologies = selectedTechnologies.length > 0;
  const availableTechnologies = getAvailableTechnologies();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Casus Columbus</h1>
                <p className="text-sm text-gray-600">⚓ Ethiek & Technologie Casus Generator voor professionals</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {(currentStep !== 'areas' || selectedAreas.length > 0) && (
                <button
                  onClick={resetApp}
                  className="order-1 flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 hover:scale-105"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Opnieuw</span>
                </button>
              )}
              
              <button
                className="order-2 p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 hover:scale-105 group"
                title="Geluid aan/uit"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: Select Technology Areas */}
        {currentStep === 'areas' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welke technologiegebieden interesseren je?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Selecteer een of meerdere gebieden om een relevante ethische casus te genereren.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.keys(technologyAreas).map((area) => (
                <div
                  key={area}
                  onClick={() => handleAreaToggle(area)}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                    selectedAreas.includes(area)
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{area}</h3>
                  <div className="flex flex-wrap gap-2">
                    {technologyAreas[area as keyof typeof technologyAreas].slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                    {technologyAreas[area as keyof typeof technologyAreas].length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{technologyAreas[area as keyof typeof technologyAreas].length - 3} meer
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {canProceedFromAreas && (
              <div className="text-center">
                <button
                  onClick={() => {
                    playNavigationSound();
                    setCurrentStep('technologies');
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  Ga naar specifieke technologieën →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Select Specific Technologies */}
        {currentStep === 'technologies' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welke specifieke technologieën?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Kies uit de technologieën binnen je geselecteerde gebieden.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Geselecteerde gebieden:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedAreas.map((area) => (
                  <span
                    key={area}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {availableTechnologies.map((tech) => (
                <div
                  key={tech}
                  onClick={() => handleTechnologyToggle(tech)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                    selectedTechnologies.includes(tech)
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <h4 className="font-medium text-gray-900">{tech}</h4>
                </div>
              ))}
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  playNavigationSound();
                  setCurrentStep('areas');
                }}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                ← Terug naar gebieden
              </button>
              
              {canProceedFromTechnologies && (
                <button
                  onClick={generateCase}
                  disabled={isGenerating}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? 'Genereren...' : 'Genereer casus →'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Generated Case */}
        {currentStep === 'case' && generatedCase && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Gegenereerde Casus
              </h2>
              <p className="text-lg text-gray-600">
                Hier is een ethische casus gebaseerd op je selecties.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                <h3 className="text-2xl font-bold text-white">{generatedCase.title}</h3>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Beschrijving</h4>
                  <p className="text-gray-700 leading-relaxed">{generatedCase.description}</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Ethisch Dilemma</h4>
                  <p className="text-gray-700 leading-relaxed">{generatedCase.ethicalDilemma}</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Context</h4>
                  <p className="text-gray-700 leading-relaxed">{generatedCase.context}</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Betrokken Technologieën</h4>
                  <div className="flex flex-wrap gap-2">
                    {generatedCase.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Belangrijkste Belanghebbenden</h4>
                  <div className="flex flex-wrap gap-2">
                    {generatedCase.stakeholders.map((stakeholder) => (
                      <span
                        key={stakeholder}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {stakeholder}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  playNavigationSound();
                  setCurrentStep('technologies');
                }}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                ← Andere technologieën
              </button>
              
              <button
                onClick={generateCase}
                disabled={isGenerating}
                className="px-6 py-3 bg-purple-100 text-purple-700 font-semibold rounded-lg hover:bg-purple-200 transition-all duration-200 disabled:opacity-50"
              >
                {isGenerating ? 'Genereren...' : '🎲 Nieuwe casus'}
              </button>
              
              <button
                onClick={selectCase}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 hover:scale-105 shadow-lg"
              >
                Kies deze casus →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Stakeholders Analysis */}
        {currentStep === 'stakeholders' && selectedCase && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Belanghebbenden Analyse
              </h2>
              <p className="text-lg text-gray-600">
                Gedetailleerde analyse van de belanghebbenden in deze casus.
              </p>
            </div>

            {/* Case Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedCase.title}</h3>
              <p className="text-gray-600">{selectedCase.description}</p>
            </div>

            {/* Stakeholders */}
            {isGeneratingStakeholders ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
                <p className="text-gray-600">Belanghebbenden worden geanalyseerd...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stakeholders.map((stakeholder, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold text-gray-900">{stakeholder.name}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        stakeholder.influence === 'Hoog' 
                          ? 'bg-red-100 text-red-800'
                          : stakeholder.influence === 'Gemiddeld'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {stakeholder.influence} invloed
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{stakeholder.role}</p>
                    
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Belangen</h5>
                        <ul className="space-y-1">
                          {stakeholder.interests.map((interest, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-center">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                              {interest}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Zorgen</h5>
                        <ul className="space-y-1">
                          {stakeholder.concerns.map((concern, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-center">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                              {concern}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="text-center">
              <button
                onClick={() => {
                  playNavigationSound();
                  setCurrentStep('case');
                }}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                ← Terug naar casus
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;