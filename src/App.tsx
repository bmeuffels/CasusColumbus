import React, { useState, useEffect } from 'react';
import { Brain, Users, Building2, Shield, Gavel, Megaphone, Bot, Database, Zap, Lock, Cog, Eye, ChevronRight, ChevronLeft, Lightbulb, FileText, Play, RotateCcw, Volume2, VolumeX, Compass } from 'lucide-react';
import { playSelectSound, playDeselectSound, playConfirmSound, playNavigationSound, soundEffects } from './utils/soundEffects';

// Types
interface Field {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
}

interface Topic {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
}

interface EthicalDimension {
  id: string;
  name: string;
  description: string;
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

// Data
const fields: Field[] = [
  { id: 'education', name: 'Onderwijs', icon: Brain, description: 'Onderwijsinstellingen en educatieve technologie' },
  { id: 'healthcare', name: 'Gezondheidszorg', icon: Users, description: 'Medische sector en patiëntenzorg' },
  { id: 'business', name: 'Bedrijfsleven', icon: Building2, description: 'Commerciële organisaties en industrie' },
  { id: 'government', name: 'Overheid', icon: Shield, description: 'Publieke sector en overheidsinstanties' },
  { id: 'legal', name: 'Juridisch', icon: Gavel, description: 'Rechtspraak en juridische dienstverlening' },
  { id: 'media', name: 'Media & Communicatie', icon: Megaphone, description: 'Journalistiek en communicatie-industrie' }
];

const topics: Topic[] = [
  { id: 'ai', name: 'Kunstmatige Intelligentie', icon: Bot, description: 'Machine learning, algoritmes en AI-systemen' },
  { id: 'data', name: 'Data & Privacy', icon: Database, description: 'Gegevensbescherming en privacy-vraagstukken' },
  { id: 'digital', name: 'Digitale Transformatie', icon: Zap, description: 'Digitalisering en technologische verandering' },
  { id: 'security', name: 'Cybersecurity', icon: Lock, description: 'Informatiebeveiliging en digitale veiligheid' },
  { id: 'automation', name: 'Automatisering', icon: Cog, description: 'Robotisering en proces-automatisering' },
  { id: 'surveillance', name: 'Toezicht & Monitoring', icon: Eye, description: 'Surveillance technologie en monitoring systemen' }
];

const ethicalDimensions: EthicalDimension[] = [
  { id: 'relationships', name: 'Relatie tussen mensen', description: 'Impact op menselijke verbindingen en sociale cohesie' },
  { id: 'privacy', name: 'Privacy & gegevensbescherming', description: 'Bescherming van persoonlijke informatie en privacy' },
  { id: 'accessibility', name: 'Toegankelijkheid & inclusiviteit', description: 'Gelijke toegang en inclusie voor alle gebruikers' },
  { id: 'autonomy', name: 'Autonomie & manipulatie', description: 'Vrijheid van keuze en bescherming tegen manipulatie' },
  { id: 'responsibility', name: 'Verantwoordelijkheid & aansprakelijkheid', description: 'Wie is verantwoordelijk voor de gevolgen?' },
  { id: 'sustainability', name: 'Duurzaamheid & milieu-impact', description: 'Ecologische voetafdruk en duurzame ontwikkeling' },
  { id: 'bias', name: 'Bias & discriminatie', description: 'Vooroordelen en ongelijke behandeling voorkomen' },
  { id: 'transparency', name: 'Transparantie & uitlegbaarheid', description: 'Openheid over werking en besluitvorming' },
  { id: 'oversight', name: 'Menselijk toezicht & controle', description: 'Behoud van menselijke controle en toezicht' },
  { id: 'wellbeing', name: 'Sociaal welzijn & psychologie', description: 'Impact op mentale gezondheid en welzijn' },
  { id: 'culture', name: 'Culturele & sociale impact', description: 'Invloed op cultuur en maatschappelijke normen' },
  { id: 'legal', name: 'Internationale & juridische implicaties', description: 'Juridische aspecten en internationale regelgeving' }
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
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [caseTitles, setCaseTitles] = useState<CaseTitle[]>([]);
  const [selectedCaseTitle, setSelectedCaseTitle] = useState<string>('');
  const [isGeneratingTitles, setIsGeneratingTitles] = useState(false);
  const [showTitleSelection, setShowTitleSelection] = useState(false);

  // Sound effect toggle
  useEffect(() => {
    soundEffects.toggleSounds(soundEnabled);
  }, [soundEnabled]);

  // Navigation functions
  const goToNextStep = async () => {
    if (soundEnabled) await playNavigationSound();
    
    if (currentStep === 2 && selectedFields.length > 0 && selectedTopics.length > 0) {
      await generateCaseTitles();
    }
    
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const goToPreviousStep = async () => {
    if (soundEnabled) await playNavigationSound();
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setShowResults(false);
    setShowTitleSelection(false);
  };

  const resetApp = async () => {
    if (soundEnabled) await playNavigationSound();
    setCurrentStep(1);
    setSelectedFields([]);
    setSelectedTopics([]);
    setSelectedDimensions([]);
    setGeneratedCase(null);
    setExpandedCase('');
    setShowResults(false);
    setScore(0);
    setMaxScore(0);
    setCaseTitles([]);
    setSelectedCaseTitle('');
    setShowTitleSelection(false);
  };

  // Selection handlers
  const toggleFieldSelection = async (fieldId: string) => {
    if (selectedFields.includes(fieldId)) {
      if (soundEnabled) await playDeselectSound();
      setSelectedFields(prev => prev.filter(id => id !== fieldId));
    } else {
      if (soundEnabled) await playSelectSound();
      setSelectedFields(prev => [...prev, fieldId]);
    }
  };

  const toggleTopicSelection = async (topicId: string) => {
    if (selectedTopics.includes(topicId)) {
      if (soundEnabled) await playDeselectSound();
      setSelectedTopics(prev => prev.filter(id => id !== topicId));
    } else {
      if (soundEnabled) await playSelectSound();
      setSelectedTopics(prev => [...prev, topicId]);
    }
  };

  const toggleDimensionSelection = async (dimensionId: string) => {
    if (selectedDimensions.includes(dimensionId)) {
      if (soundEnabled) await playDeselectSound();
      setSelectedDimensions(prev => prev.filter(id => id !== dimensionId));
    } else {
      if (soundEnabled) await playSelectSound();
      setSelectedDimensions(prev => [...prev, dimensionId]);
    }
  };

  // API calls
  const generateCaseTitles = async () => {
    if (selectedFields.length === 0 || selectedTopics.length === 0) return;

    setIsGeneratingTitles(true);
    try {
      const response = await fetch('/api/generate-titles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedFields,
          selectedTopics,
          allTopics: topics.map(t => t.name)
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCaseTitles(data.caseTitles || []);
    } catch (error) {
      console.error('Error generating case titles:', error);
      setCaseTitles([]);
    } finally {
      setIsGeneratingTitles(false);
    }
  };

  const generateCase = async () => {
    if (selectedFields.length === 0 || selectedTopics.length === 0) {
      alert('Selecteer eerst vakgebieden en onderwerpen.');
      return;
    }

    setIsGenerating(true);
    setGeneratedCase(null);
    setExpandedCase('');
    setShowResults(false);

    try {
      const response = await fetch('/api/generate-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedFields,
          selectedTopics,
          caseTitle: selectedCaseTitle
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGeneratedCase(data);
      setMaxScore(data.correctDimensions?.length || 0);
      
      if (soundEnabled) await playConfirmSound();
      setCurrentStep(4);
    } catch (error) {
      console.error('Error generating case:', error);
      alert(`Er is een fout opgetreden bij het genereren van de casus: ${error instanceof Error ? error.message : 'Onbekende fout'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const expandCase = async () => {
    if (!generatedCase || selectedDimensions.length === 0) {
      alert('Selecteer eerst ethische dimensies.');
      return;
    }

    setIsExpanding(true);
    try {
      const response = await fetch('/api/expand-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          compactCase: generatedCase.compactCase,
          selectedDimensions: selectedDimensions.map(id => 
            ethicalDimensions.find(d => d.id === id)?.name || id
          )
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setExpandedCase(data.expandedCase);
      
      if (soundEnabled) await playConfirmSound();
      setCurrentStep(5);
    } catch (error) {
      console.error('Error expanding case:', error);
      alert(`Er is een fout opgetreden bij het uitbreiden van de casus: ${error instanceof Error ? error.message : 'Onbekende fout'}`);
    } finally {
      setIsExpanding(false);
    }
  };

  const checkAnswers = async () => {
    if (!generatedCase) return;

    const correctAnswers = generatedCase.correctDimensions || [];
    const userAnswers = selectedDimensions;
    
    const correctCount = userAnswers.filter(answer => 
      correctAnswers.includes(answer)
    ).length;
    
    setScore(correctCount);
    setShowResults(true);
    
    if (soundEnabled) await playConfirmSound();
  };

  // Render functions
  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8 space-x-4">
      {[1, 2, 3, 4, 5].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
            step === currentStep 
              ? 'bg-gradient-to-r from-orange-500 to-yellow-400 text-white shadow-lg' 
              : step < currentStep 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-600'
          }`}>
            {step}
          </div>
          {step < 5 && (
            <ChevronRight className={`w-5 h-5 mx-2 transition-colors duration-300 ${
              step < currentStep ? 'text-green-500' : 'text-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderFieldSelection = () => (
    <div className="animate-in slide-in-from-bottom-2">
      <div className="text-center mb-8">
        <Compass className="w-16 h-16 mx-auto mb-4 text-orange-500" />
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Welkom bij Casus Columbus</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Ontdek ethische dilemma's in de technologie. Selecteer eerst de vakgebieden die relevant zijn voor jouw situatie.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {fields.map((field) => {
          const Icon = field.icon;
          const isSelected = selectedFields.includes(field.id);
          
          return (
            <button
              key={field.id}
              onClick={() => toggleFieldSelection(field.id)}
              className={`p-6 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-lg transform hover:-translate-y-1 ${
                isSelected
                  ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-yellow-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-orange-300'
              }`}
            >
              <Icon className={`w-8 h-8 mb-3 transition-colors duration-300 ${
                isSelected ? 'text-orange-500' : 'text-gray-600'
              }`} />
              <h3 className="font-semibold text-gray-800 mb-2">{field.name}</h3>
              <p className="text-sm text-gray-600">{field.description}</p>
            </button>
          );
        })}
      </div>

      <div className="flex justify-center">
        <button
          onClick={goToNextStep}
          disabled={selectedFields.length === 0}
          className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
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
          Selecteer de technologie onderwerpen die je wilt verkennen in de ethische casus.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {topics.map((topic) => {
          const Icon = topic.icon;
          const isSelected = selectedTopics.includes(topic.id);
          
          return (
            <button
              key={topic.id}
              onClick={() => toggleTopicSelection(topic.id)}
              className={`p-6 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-lg transform hover:-translate-y-1 ${
                isSelected
                  ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-yellow-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-orange-300'
              }`}
            >
              <Icon className={`w-8 h-8 mb-3 transition-colors duration-300 ${
                isSelected ? 'text-orange-500' : 'text-gray-600'
              }`} />
              <h3 className="font-semibold text-gray-800 mb-2">{topic.name}</h3>
              <p className="text-sm text-gray-600">{topic.description}</p>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between">
        <button
          onClick={goToPreviousStep}
          className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors duration-300 flex items-center space-x-2"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Vorige</span>
        </button>
        
        <button
          onClick={goToNextStep}
          disabled={selectedTopics.length === 0}
          className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
        >
          <span>Volgende Stap</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const renderCaseTitleSelection = () => (
    <div className="animate-in slide-in-from-bottom-2">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Kies een Casus</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Selecteer een van de gegenereerde casus titels, of ga verder zonder specifieke titel voor een willekeurige casus.
        </p>
      </div>

      {isGeneratingTitles ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-600">Casus titels worden gegenereerd...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-h-96 overflow-y-auto custom-scrollbar">
            {caseTitles.map((caseTitle, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedCaseTitle(caseTitle.title);
                  if (soundEnabled) playSelectSound();
                }}
                className={`p-4 rounded-lg border-2 transition-all duration-300 text-left hover:shadow-md ${
                  selectedCaseTitle === caseTitle.title
                    ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-yellow-50'
                    : 'border-gray-200 bg-white hover:border-orange-300'
                }`}
              >
                <h3 className="font-semibold text-gray-800 mb-2">{caseTitle.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{caseTitle.description}</p>
                <span className="text-xs text-orange-600 font-medium">{caseTitle.techTopic}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={goToPreviousStep}
              className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors duration-300 flex items-center space-x-2"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Vorige</span>
            </button>
            
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setSelectedCaseTitle('');
                  generateCase();
                }}
                disabled={isGenerating}
                className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Willekeurige Casus</span>
              </button>
              
              <button
                onClick={generateCase}
                disabled={isGenerating || !selectedCaseTitle}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Genereren...</span>
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-5 h-5" />
                    <span>Genereer Casus</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderCaseAnalysis = () => (
    <div className="animate-in slide-in-from-bottom-2">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Analyseer de Casus</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Lees de casus zorgvuldig door en selecteer de ethische dimensies die volgens jou het meest relevant zijn.
        </p>
      </div>

      {generatedCase && (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <FileText className="w-6 h-6 text-orange-500 mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">Ethische Casus</h3>
          </div>
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            {generatedCase.case.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Selecteer relevante ethische dimensies:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ethicalDimensions.map((dimension) => {
            const isSelected = selectedDimensions.includes(dimension.id);
            
            return (
              <button
                key={dimension.id}
                onClick={() => toggleDimensionSelection(dimension.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 text-left hover:shadow-md ${
                  isSelected
                    ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-yellow-50'
                    : 'border-gray-200 bg-white hover:border-orange-300'
                }`}
              >
                <h4 className="font-semibold text-gray-800 mb-2">{dimension.name}</h4>
                <p className="text-sm text-gray-600">{dimension.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={goToPreviousStep}
          className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors duration-300 flex items-center space-x-2"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Vorige</span>
        </button>
        
        <div className="flex space-x-4">
          <button
            onClick={checkAnswers}
            disabled={selectedDimensions.length === 0}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <span>Controleer Antwoorden</span>
          </button>
          
          <button
            onClick={expandCase}
            disabled={selectedDimensions.length === 0 || isExpanding}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
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

      {showResults && generatedCase && (
        <div className="mt-8 bg-white rounded-xl shadow-lg p-8 animate-in slide-in-from-top-2">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Resultaten</h3>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">Jouw score:</span>
              <span className="text-2xl font-bold text-orange-500">{score} / {maxScore}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-orange-500 to-yellow-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${maxScore > 0 ? (score / maxScore) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Correcte ethische dimensies:</h4>
            {generatedCase.correctDimensions.map((dimensionId, index) => {
              const dimension = ethicalDimensions.find(d => d.id === dimensionId);
              const isUserSelected = selectedDimensions.includes(dimensionId);
              
              return (
                <div key={dimensionId} className={`p-4 rounded-lg border-2 ${
                  isUserSelected 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-orange-500 bg-orange-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-semibold text-gray-800">{dimension?.name}</h5>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      isUserSelected 
                        ? 'bg-green-500 text-white' 
                        : 'bg-orange-500 text-white'
                    }`}>
                      {isUserSelected ? 'Correct' : 'Gemist'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{dimension?.description}</p>
                  <p className="text-sm text-gray-700 italic">{generatedCase.explanations[index]}</p>
                </div>
              );
            })}
          </div>

          {generatedCase.stakeholders && generatedCase.stakeholders.length > 0 && (
            <div className="mt-8">
              <h4 className="font-semibold text-gray-800 mb-4">Belanghebbenden:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedCase.stakeholders.map((stakeholder, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-semibold text-gray-800 mb-2">{stakeholder.role}</h5>
                    <p className="text-sm text-gray-600 mb-2"><strong>Belangen:</strong> {stakeholder.interests}</p>
                    <p className="text-sm text-gray-600"><strong>Perspectief:</strong> {stakeholder.perspective}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderExpandedCase = () => (
    <div className="animate-in slide-in-from-bottom-2">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Uitgebreide Casus</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Hier is de uitgebreide versie van de casus, gebaseerd op de ethische dimensies die je hebt geselecteerd.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="flex items-center mb-6">
          <FileText className="w-6 h-6 text-orange-500 mr-3" />
          <h3 className="text-xl font-semibold text-gray-800">Uitgebreide Ethische Casus</h3>
        </div>
        <div className="prose max-w-none text-gray-700 leading-relaxed">
          {expandedCase.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={goToPreviousStep}
          className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors duration-300 flex items-center space-x-2"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Vorige</span>
        </button>
        
        <button
          onClick={resetApp}
          className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center space-x-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Nieuwe Casus</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      {/* Sound Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
          title={soundEnabled ? 'Geluid uitschakelen' : 'Geluid inschakelen'}
        >
          {soundEnabled ? (
            <Volume2 className="w-5 h-5 text-orange-500" />
          ) : (
            <VolumeX className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {renderStepIndicator()}
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
          {currentStep === 1 && renderFieldSelection()}
          {currentStep === 2 && renderTopicSelection()}
          {currentStep === 3 && renderCaseTitleSelection()}
          {currentStep === 4 && renderCaseAnalysis()}
          {currentStep === 5 && renderExpandedCase()}
        </div>
      </div>
    </div>
  );
}

export default App;