import React, { useState, useEffect } from 'react';
import { FileText, Users, Brain, Shield, Cog, Eye, Lightbulb, ChevronRight, ChevronLeft, RotateCcw, Sparkles, BookOpen, Target, AlertCircle, CheckCircle2, X, Volume2, VolumeX } from 'lucide-react';
import { playSelectSound, playDeselectSound, playConfirmSound, playNavigationSound, soundEffects } from './utils/soundEffects';

// Types
interface EthicalDimension {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
}

interface Stakeholder {
  role: string;
  interests: string;
  perspective: string;
}

interface GeneratedCase {
  case: string;
  compactCase: string;
  correctDimensions: string[];
  explanations: string[];
  stakeholders: Stakeholder[];
}

interface CaseTitle {
  title: string;
  description: string;
  techTopic: string;
}

// Configuration
const PROFESSIONAL_FIELDS = [
  'Onderwijs',
  'Gezondheidszorg', 
  'Bedrijfsleven',
  'Overheid',
  'Juridisch',
  'Media & Communicatie'
];

const TECH_TOPICS = [
  'Kunstmatige Intelligentie',
  'Data & Privacy',
  'Digitale Transformatie',
  'Cybersecurity',
  'Automatisering',
  'Toezicht & Monitoring'
];

const ETHICAL_DIMENSIONS: EthicalDimension[] = [
  {
    id: 'relationships',
    name: 'Relatie tussen mensen',
    description: 'Impact op menselijke verbindingen en sociale cohesie',
    icon: Users
  },
  {
    id: 'privacy',
    name: 'Privacy & gegevensbescherming',
    description: 'Bescherming van persoonlijke informatie en autonomie',
    icon: Shield
  },
  {
    id: 'accessibility',
    name: 'Toegankelijkheid & inclusiviteit',
    description: 'Gelijke toegang en participatie voor iedereen',
    icon: Target
  },
  {
    id: 'autonomy',
    name: 'Autonomie & manipulatie',
    description: 'Vrijheid van keuze en bescherming tegen beïnvloeding',
    icon: Brain
  },
  {
    id: 'responsibility',
    name: 'Verantwoordelijkheid & aansprakelijkheid',
    description: 'Wie is verantwoordelijk voor beslissingen en gevolgen',
    icon: AlertCircle
  },
  {
    id: 'sustainability',
    name: 'Duurzaamheid & milieu-impact',
    description: 'Langetermijneffecten op milieu en samenleving',
    icon: Lightbulb
  },
  {
    id: 'bias',
    name: 'Bias & discriminatie',
    description: 'Vooroordelen en ongelijke behandeling voorkomen',
    icon: Eye
  },
  {
    id: 'transparency',
    name: 'Transparantie & uitlegbaarheid',
    description: 'Begrijpelijkheid van processen en beslissingen',
    icon: BookOpen
  },
  {
    id: 'oversight',
    name: 'Menselijk toezicht & controle',
    description: 'Behoud van menselijke controle over technologie',
    icon: Cog
  },
  {
    id: 'wellbeing',
    name: 'Sociaal welzijn & psychologie',
    description: 'Impact op mentale gezondheid en welzijn',
    icon: CheckCircle2
  },
  {
    id: 'culture',
    name: 'Culturele & sociale impact',
    description: 'Effecten op cultuur, tradities en sociale normen',
    icon: Users
  },
  {
    id: 'legal',
    name: 'Internationale & juridische implicaties',
    description: 'Juridische aspecten en internationale regelgeving',
    icon: FileText
  }
];

function App() {
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);
  const [generatedCase, setGeneratedCase] = useState<GeneratedCase | null>(null);
  const [expandedCase, setExpandedCase] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [error, setError] = useState<string>('');
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [showExplanations, setShowExplanations] = useState(false);
  const [caseTitles, setCaseTitles] = useState<CaseTitle[]>([]);
  const [selectedCaseTitle, setSelectedCaseTitle] = useState<string>('');
  const [showTitleSelection, setShowTitleSelection] = useState(false);
  const [isLoadingTitles, setIsLoadingTitles] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sound effect toggle
  useEffect(() => {
    soundEffects.toggleSounds(soundEnabled);
  }, [soundEnabled]);

  // Navigation functions
  const goToNextStep = async () => {
    if (soundEnabled) await playNavigationSound();
    
    if (currentStep === 2 && selectedFields.length > 0 && selectedTopics.length > 0) {
      // Generate case titles when moving from step 2 to 3
      await generateCaseTitles();
    }
    
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const goToPreviousStep = async () => {
    if (soundEnabled) await playNavigationSound();
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError('');
  };

  const resetToStart = async () => {
    if (soundEnabled) await playNavigationSound();
    setCurrentStep(1);
    setSelectedFields([]);
    setSelectedTopics([]);
    setSelectedDimensions([]);
    setGeneratedCase(null);
    setExpandedCase('');
    setError('');
    setShowResults(false);
    setScore(0);
    setMaxScore(0);
    setShowExplanations(false);
    setCaseTitles([]);
    setSelectedCaseTitle('');
    setShowTitleSelection(false);
  };

  // Selection handlers
  const toggleSelection = async (item: string, currentSelection: string[], setSelection: React.Dispatch<React.SetStateAction<string[]>>, maxSelections?: number) => {
    const isSelected = currentSelection.includes(item);
    
    if (isSelected) {
      if (soundEnabled) await playDeselectSound();
      setSelection(prev => prev.filter(i => i !== item));
    } else {
      if (maxSelections && currentSelection.length >= maxSelections) {
        return; // Don't allow more selections than the maximum
      }
      if (soundEnabled) await playSelectSound();
      setSelection(prev => [...prev, item]);
    }
  };

  // Generate case titles
  const generateCaseTitles = async () => {
    if (selectedFields.length === 0 || selectedTopics.length === 0) return;
    
    setIsLoadingTitles(true);
    setError('');
    
    try {
      const response = await fetch('/api/generate-titles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedFields,
          selectedTopics,
          allTopics: TECH_TOPICS
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCaseTitles(data.caseTitles || []);
    } catch (error) {
      console.error('Error generating titles:', error);
      setError(`Er is een fout opgetreden bij het genereren van casus titels: ${error instanceof Error ? error.message : 'Onbekende fout'}`);
    } finally {
      setIsLoadingTitles(false);
    }
  };

  // Generate case
  const generateCase = async () => {
    if (selectedFields.length === 0 || selectedTopics.length === 0) {
      setError('Selecteer eerst vakgebieden en technologie onderwerpen.');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedCase(null);
    setExpandedCase('');

    try {
      const response = await fetch('/api/generate-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedFields,
          selectedTopics,
          caseTitle: selectedCaseTitle || undefined
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Validate the response data
      if (!data.case || !data.correctDimensions || !Array.isArray(data.correctDimensions)) {
        throw new Error('Ongeldige response van de server');
      }

      setGeneratedCase(data);
      setMaxScore(data.correctDimensions.length);
      
      if (soundEnabled) await playConfirmSound();
      goToNextStep();
    } catch (error) {
      console.error('Error generating case:', error);
      setError(`Er is een fout opgetreden bij het genereren van de casus: ${error instanceof Error ? error.message : 'Onbekende fout'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Expand case
  const expandCase = async () => {
    if (!generatedCase || selectedDimensions.length === 0) {
      setError('Selecteer eerst ethische dimensies voordat je de casus uitbreidt.');
      return;
    }

    setIsExpanding(true);
    setError('');

    try {
      const response = await fetch('/api/expand-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          compactCase: generatedCase.compactCase,
          selectedDimensions: selectedDimensions.map(id => {
            const dimension = ETHICAL_DIMENSIONS.find(d => d.id === id);
            return dimension ? dimension.name : id;
          })
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.expandedCase) {
        throw new Error('Geen uitgebreide casus ontvangen van de server');
      }

      setExpandedCase(data.expandedCase);
      
      if (soundEnabled) await playConfirmSound();
      goToNextStep();
    } catch (error) {
      console.error('Error expanding case:', error);
      setError(`Er is een fout opgetreden bij het uitbreiden van de casus: ${error instanceof Error ? error.message : 'Onbekende fout'}`);
    } finally {
      setIsExpanding(false);
    }
  };

  // Check answers
  const checkAnswers = async () => {
    if (!generatedCase) return;

    const correctAnswers = generatedCase.correctDimensions;
    const userAnswers = selectedDimensions;
    
    const correctSelections = userAnswers.filter(answer => correctAnswers.includes(answer));
    const calculatedScore = correctSelections.length;
    
    setScore(calculatedScore);
    setShowResults(true);
    
    if (soundEnabled) await playConfirmSound();
  };

  // Render functions
  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4, 5].map((step, index) => (
        <React.Fragment key={step}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
            step === currentStep 
              ? 'bg-gradient-to-r from-orange-500 to-yellow-400 text-white shadow-lg' 
              : step < currentStep 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-600'
          }`}>
            {step < currentStep ? <CheckCircle2 className="w-5 h-5" /> : step}
          </div>
          {index < 4 && (
            <div className={`w-12 h-1 mx-2 transition-all duration-300 ${
              step < currentStep ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderFieldSelection = () => (
    <div className="animate-in slide-in-from-bottom-2">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Welkom bij Casus Columbus</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Ontdek ethische dilemma's in de technologie. Selecteer eerst je vakgebied(en) om relevante casussen te genereren.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {PROFESSIONAL_FIELDS.map((field) => (
          <button
            key={field}
            onClick={() => toggleSelection(field, selectedFields, setSelectedFields)}
            className={`p-6 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-lg transform hover:scale-105 ${
              selectedFields.includes(field)
                ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-yellow-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-orange-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                selectedFields.includes(field) ? 'bg-orange-500' : 'bg-gray-300'
              }`} />
              <span className="font-semibold text-gray-800">{field}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={goToNextStep}
          disabled={selectedFields.length === 0}
          className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
            selectedFields.length > 0
              ? 'bg-gradient-to-r from-orange-500 to-yellow-400 text-white hover:shadow-lg transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <span>Volgende Stap</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const renderTopicSelection = () => (
    <div className="animate-in slide-in-from-bottom-2">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Technologie Onderwerpen</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Selecteer de technologie onderwerpen die je interesseren voor je ethische casus.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {TECH_TOPICS.map((topic) => {
          const icons = {
            'Kunstmatige Intelligentie': Brain,
            'Data & Privacy': Shield,
            'Digitale Transformatie': Sparkles,
            'Cybersecurity': Eye,
            'Automatisering': Cog,
            'Toezicht & Monitoring': Target
          };
          const IconComponent = icons[topic as keyof typeof icons] || FileText;

          return (
            <button
              key={topic}
              onClick={() => toggleSelection(topic, selectedTopics, setSelectedTopics)}
              className={`p-6 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-lg transform hover:scale-105 ${
                selectedTopics.includes(topic)
                  ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-yellow-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-orange-300'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <IconComponent className={`w-6 h-6 ${
                  selectedTopics.includes(topic) ? 'text-orange-500' : 'text-gray-400'
                }`} />
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  selectedTopics.includes(topic) ? 'bg-orange-500' : 'bg-gray-300'
                }`} />
              </div>
              <span className="font-semibold text-gray-800">{topic}</span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between">
        <button
          onClick={goToPreviousStep}
          className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 flex items-center space-x-2"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Vorige</span>
        </button>
        
        <button
          onClick={goToNextStep}
          disabled={selectedTopics.length === 0}
          className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
            selectedTopics.length > 0
              ? 'bg-gradient-to-r from-orange-500 to-yellow-400 text-white hover:shadow-lg transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <span>Volgende Stap</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const renderCaseGeneration = () => (
    <div className="animate-in slide-in-from-bottom-2">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Casus Genereren</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Genereer een ethische casus gebaseerd op je selecties, of kies uit voorgestelde casus titels.
        </p>
      </div>

      {/* Selected fields and topics summary */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Geselecteerde Vakgebieden:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedFields.map(field => (
                <span key={field} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                  {field}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Geselecteerde Onderwerpen:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedTopics.map(topic => (
                <span key={topic} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Case title selection */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Casus Titels (Optioneel)</h3>
          <button
            onClick={() => setShowTitleSelection(!showTitleSelection)}
            className="text-orange-600 hover:text-orange-700 transition-colors duration-200"
          >
            {showTitleSelection ? 'Verberg titels' : 'Toon voorgestelde titels'}
          </button>
        </div>

        {showTitleSelection && (
          <div className="space-y-4">
            {isLoadingTitles ? (
              <div className="text-center py-8">
                <div className="animate-pulse flex space-x-4 justify-center items-center">
                  <div className="rounded-full bg-orange-300 h-4 w-4"></div>
                  <div className="rounded-full bg-yellow-300 h-4 w-4 delay-150"></div>
                  <div className="rounded-full bg-orange-300 h-4 w-4 delay-300"></div>
                </div>
                <p className="text-gray-600 mt-4">Casus titels worden gegenereerd...</p>
              </div>
            ) : caseTitles.length > 0 ? (
              <div className="grid gap-3 max-h-96 overflow-y-auto custom-scrollbar">
                <button
                  onClick={() => setSelectedCaseTitle('')}
                  className={`p-4 rounded-lg border-2 text-left transition-all duration-300 hover:shadow-md ${
                    selectedCaseTitle === ''
                      ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-yellow-50'
                      : 'border-gray-200 bg-white hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      selectedCaseTitle === '' ? 'bg-orange-500' : 'bg-gray-300'
                    }`} />
                    <div>
                      <h4 className="font-semibold text-gray-800">Geen specifieke titel</h4>
                      <p className="text-sm text-gray-600">Laat de AI een willekeurige casus genereren</p>
                    </div>
                  </div>
                </button>
                
                {caseTitles.map((caseTitle, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedCaseTitle(caseTitle.title)}
                    className={`p-4 rounded-lg border-2 text-left transition-all duration-300 hover:shadow-md ${
                      selectedCaseTitle === caseTitle.title
                        ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-yellow-50'
                        : 'border-gray-200 bg-white hover:border-orange-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-3 h-3 rounded-full mt-1 transition-all duration-300 ${
                        selectedCaseTitle === caseTitle.title ? 'bg-orange-500' : 'bg-gray-300'
                      }`} />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">{caseTitle.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{caseTitle.description}</p>
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {caseTitle.techTopic}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-600">Geen casus titels beschikbaar</p>
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={goToPreviousStep}
          className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 flex items-center space-x-2"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Vorige</span>
        </button>
        
        <button
          onClick={generateCase}
          disabled={isGenerating}
          className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
            isGenerating
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-orange-500 to-yellow-400 text-white hover:shadow-lg transform hover:scale-105'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Genereren...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Genereer Casus</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderDimensionSelection = () => (
    <div className="animate-in slide-in-from-bottom-2">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Ethische Dimensies</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Lees de casus en selecteer de ethische dimensies die volgens jou relevant zijn.
        </p>
      </div>

      {generatedCase && (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Ethische Casus</h3>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            {generatedCase.case.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Selecteer relevante ethische dimensies:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ETHICAL_DIMENSIONS.map((dimension) => {
            const IconComponent = dimension.icon;
            return (
              <button
                key={dimension.id}
                onClick={() => toggleSelection(dimension.id, selectedDimensions, setSelectedDimensions)}
                className={`p-6 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-lg transform hover:scale-105 ${
                  selectedDimensions.includes(dimension.id)
                    ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-yellow-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-orange-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <IconComponent className={`w-6 h-6 mt-1 flex-shrink-0 ${
                    selectedDimensions.includes(dimension.id) ? 'text-orange-500' : 'text-gray-400'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-2">{dimension.name}</h4>
                    <p className="text-sm text-gray-600">{dimension.description}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 transition-all duration-300 ${
                    selectedDimensions.includes(dimension.id) ? 'bg-orange-500' : 'bg-gray-300'
                  }`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={goToPreviousStep}
          className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 flex items-center space-x-2"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Vorige</span>
        </button>
        
        <div className="flex space-x-4">
          <button
            onClick={checkAnswers}
            disabled={selectedDimensions.length === 0}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
              selectedDimensions.length > 0
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Controleer Antwoorden</span>
          </button>
          
          <button
            onClick={expandCase}
            disabled={selectedDimensions.length === 0 || isExpanding}
            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
              selectedDimensions.length > 0 && !isExpanding
                ? 'bg-gradient-to-r from-orange-500 to-yellow-400 text-white hover:shadow-lg transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isExpanding ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Uitbreiden...</span>
              </>
            ) : (
              <>
                <span>Breid Casus Uit</span>
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Modal */}
      {showResults && generatedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Resultaten</h3>
                <button
                  onClick={() => setShowResults(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-8">
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-6">
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">Je Score</h4>
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl font-bold text-orange-600">
                      {score} / {maxScore}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-yellow-400 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(score / maxScore) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-lg font-semibold text-gray-700">
                      {Math.round((score / maxScore) * 100)}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Jouw Selecties</h4>
                  <div className="space-y-2">
                    {selectedDimensions.map(dimensionId => {
                      const dimension = ETHICAL_DIMENSIONS.find(d => d.id === dimensionId);
                      const isCorrect = generatedCase.correctDimensions.includes(dimensionId);
                      return (
                        <div key={dimensionId} className={`p-3 rounded-lg flex items-center space-x-3 ${
                          isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                        }`}>
                          {isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <X className="w-5 h-5 text-red-600" />
                          )}
                          <span className={isCorrect ? 'text-green-800' : 'text-red-800'}>
                            {dimension?.name || dimensionId}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Correcte Antwoorden</h4>
                  <div className="space-y-2">
                    {generatedCase.correctDimensions.map(dimensionId => {
                      const dimension = ETHICAL_DIMENSIONS.find(d => d.id === dimensionId);
                      const wasSelected = selectedDimensions.includes(dimensionId);
                      return (
                        <div key={dimensionId} className={`p-3 rounded-lg flex items-center space-x-3 ${
                          wasSelected ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
                        }`}>
                          <CheckCircle2 className={`w-5 h-5 ${wasSelected ? 'text-green-600' : 'text-yellow-600'}`} />
                          <span className={wasSelected ? 'text-green-800' : 'text-yellow-800'}>
                            {dimension?.name || dimensionId}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => setShowExplanations(!showExplanations)}
                  className="w-full p-4 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                >
                  {showExplanations ? 'Verberg Uitleg' : 'Toon Uitleg'}
                </button>

                {showExplanations && generatedCase.explanations && (
                  <div className="mt-6 space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800">Waarom deze dimensies relevant zijn:</h4>
                    {generatedCase.explanations.map((explanation, index) => {
                      const dimensionId = generatedCase.correctDimensions[index];
                      const dimension = ETHICAL_DIMENSIONS.find(d => d.id === dimensionId);
                      return (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <h5 className="font-semibold text-gray-800 mb-2">
                            {dimension?.name || `Dimensie ${index + 1}`}
                          </h5>
                          <p className="text-gray-700">{explanation}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setShowResults(false)}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
                >
                  Sluiten
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderExpandedCase = () => (
    <div className="animate-in slide-in-from-bottom-2">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Uitgebreide Casus</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Hier is de uitgebreide versie van je casus, inclusief stakeholder analyse.
        </p>
      </div>

      {expandedCase && (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Uitgebreide Ethische Casus</h3>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            {expandedCase.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </div>
      )}

      {generatedCase && generatedCase.stakeholders && generatedCase.stakeholders.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Stakeholder Analyse</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {generatedCase.stakeholders.map((stakeholder, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">{stakeholder.role}</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Belangen:</span>
                    <p className="text-gray-700 mt-1">{stakeholder.interests}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Perspectief:</span>
                    <p className="text-gray-700 mt-1">{stakeholder.perspective}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={goToPreviousStep}
          className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 flex items-center space-x-2"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Terug naar Dimensies</span>
        </button>
        
        <button
          onClick={resetToStart}
          className="px-8 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Nieuwe Casus</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Ethische Casus</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {selectedFields.length > 0 && (
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                    {selectedFields.join(', ')}
                  </span>
                )}
                {selectedTopics.length > 0 && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full ml-2">
                    {selectedTopics.join(', ')}
                  </span>
                )}
              </div>
              
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  soundEnabled 
                    ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' 
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
                title={soundEnabled ? 'Geluid uitschakelen' : 'Geluid inschakelen'}
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderStepIndicator()}
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {currentStep === 1 && renderFieldSelection()}
          {currentStep === 2 && renderTopicSelection()}
          {currentStep === 3 && renderCaseGeneration()}
          {currentStep === 4 && renderDimensionSelection()}
          {currentStep === 5 && renderExpandedCase()}
        </div>
      </main>
    </div>
  );
}

export default App;