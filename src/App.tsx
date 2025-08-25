import React, { useState } from 'react';
import { FileText, Users, Brain, Shield, Zap, Eye, Lightbulb, ChevronRight, ChevronLeft, RotateCcw, Sparkles, BookOpen, Target, AlertCircle } from 'lucide-react';
import { playSelectSound, playDeselectSound, playConfirmSound, playNavigationSound } from './utils/soundEffects';

// Types
interface CaseTitle {
  title: string;
  description: string;
  techTopic: string;
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

interface ExpandedCase {
  expandedCase: string;
}

// Constants
const FIELDS = [
  { id: 'education', name: 'Onderwijs', icon: BookOpen },
  { id: 'healthcare', name: 'Gezondheidszorg', icon: Shield },
  { id: 'business', name: 'Bedrijfsleven', icon: Target },
  { id: 'government', name: 'Overheid', icon: Users },
  { id: 'legal', name: 'Juridisch', icon: FileText },
  { id: 'media', name: 'Media & Communicatie', icon: Eye }
];

const TOPICS = [
  { id: 'ai', name: 'Kunstmatige Intelligentie', icon: Brain },
  { id: 'privacy', name: 'Data & Privacy', icon: Shield },
  { id: 'digital', name: 'Digitale Transformatie', icon: Zap },
  { id: 'security', name: 'Cybersecurity', icon: Shield },
  { id: 'automation', name: 'Automatisering', icon: Zap },
  { id: 'surveillance', name: 'Toezicht & Monitoring', icon: Eye }
];

const DIMENSIONS = [
  { id: 'relationships', name: 'Relatie tussen mensen', description: 'Impact op menselijke verbindingen en sociale cohesie' },
  { id: 'privacy', name: 'Privacy & gegevensbescherming', description: 'Bescherming van persoonlijke informatie en autonomie' },
  { id: 'accessibility', name: 'Toegankelijkheid & inclusiviteit', description: 'Gelijke toegang en participatie voor iedereen' },
  { id: 'autonomy', name: 'Autonomie & manipulatie', description: 'Vrijheid van keuze versus beïnvloeding' },
  { id: 'responsibility', name: 'Verantwoordelijkheid & aansprakelijkheid', description: 'Wie is verantwoordelijk voor gevolgen?' },
  { id: 'sustainability', name: 'Duurzaamheid & milieu-impact', description: 'Lange termijn effecten op mens en milieu' },
  { id: 'bias', name: 'Bias & discriminatie', description: 'Oneerlijke behandeling en vooroordelen' },
  { id: 'transparency', name: 'Transparantie & uitlegbaarheid', description: 'Begrijpelijkheid van processen en beslissingen' },
  { id: 'oversight', name: 'Menselijk toezicht & controle', description: 'Behoud van menselijke controle over technologie' },
  { id: 'wellbeing', name: 'Sociaal welzijn & psychologie', description: 'Impact op mentale gezondheid en welzijn' },
  { id: 'culture', name: 'Culturele & sociale impact', description: 'Veranderingen in cultuur en samenleving' },
  { id: 'legal', name: 'Internationale & juridische implicaties', description: 'Juridische en regelgevingskwesties' }
];

const App: React.FC = () => {
  // State management
  const [currentStep, setCurrentStep] = useState<'selection' | 'titles' | 'case' | 'dimensions' | 'expanded'>('selection');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [caseTitles, setCaseTitles] = useState<CaseTitle[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<CaseTitle | null>(null);
  const [generatedCase, setGeneratedCase] = useState<GeneratedCase | null>(null);
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);
  const [expandedCase, setExpandedCase] = useState<ExpandedCase | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper functions
  const resetToStart = () => {
    setCurrentStep('selection');
    setSelectedFields([]);
    setSelectedTopics([]);
    setCaseTitles([]);
    setSelectedTitle(null);
    setGeneratedCase(null);
    setSelectedDimensions([]);
    setExpandedCase(null);
    setError(null);
    playNavigationSound();
  };

  const toggleField = (fieldId: string) => {
    setSelectedFields(prev => {
      const newFields = prev.includes(fieldId) 
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId];
      
      if (prev.includes(fieldId)) {
        playDeselectSound();
      } else {
        playSelectSound();
      }
      
      return newFields;
    });
  };

  const toggleTopic = (topicId: string) => {
    setSelectedTopics(prev => {
      const newTopics = prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId];
      
      if (prev.includes(topicId)) {
        playDeselectSound();
      } else {
        playSelectSound();
      }
      
      return newTopics;
    });
  };

  const toggleDimension = (dimensionId: string) => {
    setSelectedDimensions(prev => {
      const newDimensions = prev.includes(dimensionId) 
        ? prev.filter(id => id !== dimensionId)
        : [...prev, dimensionId];
      
      if (prev.includes(dimensionId)) {
        playDeselectSound();
      } else {
        playSelectSound();
      }
      
      return newDimensions;
    });
  };

  // API calls
  const generateTitles = async () => {
    if (selectedFields.length === 0 || selectedTopics.length === 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate-titles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedFields,
          selectedTopics,
          allTopics: TOPICS.map(t => t.name)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCaseTitles(data.caseTitles || []);
      setCurrentStep('titles');
      playConfirmSound();
    } catch (error) {
      console.error('Error generating titles:', error);
      setError(error instanceof Error ? error.message : 'Er is een fout opgetreden bij het genereren van de casus titels');
    } finally {
      setIsLoading(false);
    }
  };

  const generateCase = async (title?: CaseTitle) => {
    const caseTitle = title || selectedTitle;
    if (!caseTitle) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedFields,
          selectedTopics,
          caseTitle: caseTitle.title
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGeneratedCase(data);
      setCurrentStep('case');
      playConfirmSound();
    } catch (error) {
      console.error('Error generating case:', error);
      setError(error instanceof Error ? error.message : 'Er is een fout opgetreden bij het genereren van de casus');
    } finally {
      setIsLoading(false);
    }
  };

  const expandCase = async () => {
    if (!generatedCase || selectedDimensions.length === 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/expand-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          compactCase: generatedCase.compactCase,
          selectedDimensions: selectedDimensions.map(id => {
            const dimension = DIMENSIONS.find(d => d.id === id);
            return dimension ? dimension.name : id;
          })
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setExpandedCase(data);
      setCurrentStep('expanded');
      playConfirmSound();
    } catch (error) {
      console.error('Error expanding case:', error);
      setError(error instanceof Error ? error.message : 'Er is een fout opgetreden bij het uitbreiden van de casus');
    } finally {
      setIsLoading(false);
    }
  };

  // Render functions
  const renderSelectionStep = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Ethiek & Technologie Casus Generator
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Genereer realistische ethische casussen voor professionals uit verschillende vakgebieden
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="w-6 h-6 mr-2 text-orange-500" />
            Selecteer Vakgebied(en)
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {FIELDS.map((field) => {
              const Icon = field.icon;
              const isSelected = selectedFields.includes(field.id);
              return (
                <button
                  key={field.id}
                  onClick={() => toggleField(field.id)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-2 ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{field.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
            <Brain className="w-6 h-6 mr-2 text-yellow-500" />
            Selecteer Technologie Onderwerp(en)
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {TOPICS.map((topic) => {
              const Icon = topic.icon;
              const isSelected = selectedTopics.includes(topic.id);
              return (
                <button
                  key={topic.id}
                  onClick={() => toggleTopic(topic.id)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-2 ${
                    isSelected
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                      : 'border-gray-200 hover:border-yellow-300 hover:bg-yellow-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{topic.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={generateTitles}
          disabled={selectedFields.length === 0 || selectedTopics.length === 0 || isLoading}
          className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Genereren...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Genereer Casus Titels
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderTitlesStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Kies een Casus Titel</h2>
        <p className="text-gray-600">Selecteer de casus die je wilt uitwerken</p>
      </div>

      <div className="grid gap-4">
        {caseTitles.map((title, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-orange-200"
            onClick={() => {
              setSelectedTitle(title);
              generateCase(title);
              playSelectSound();
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title.title}</h3>
                <p className="text-gray-600 mb-2">{title.description}</p>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {title.techTopic}
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => setCurrentStep('selection')}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Terug naar selectie
        </button>
      </div>
    </div>
  );

  const renderCaseStep = () => {
    if (!generatedCase) return null;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Ethische Casus</h2>
          <p className="text-gray-600">Identificeer de ethische spanningsvelden</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Casus Beschrijving</h3>
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            {generatedCase.case.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Belanghebbenden</h3>
          <div className="grid gap-4">
            {generatedCase.stakeholders.map((stakeholder, index) => (
              <div key={index} className="border-l-4 border-orange-500 pl-4 py-2">
                <h4 className="font-semibold text-gray-900">{stakeholder.role}</h4>
                <p className="text-sm text-gray-600 mb-1"><strong>Belangen:</strong> {stakeholder.interests}</p>
                <p className="text-sm text-gray-600"><strong>Perspectief:</strong> {stakeholder.perspective}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Selecteer Ethische Spanningsvelden
          </h3>
          <p className="text-gray-600 mb-6">
            Welke ethische dimensies zijn volgens jou het meest relevant voor deze casus?
          </p>
          
          <div className="grid gap-3">
            {DIMENSIONS.map((dimension) => {
              const isSelected = selectedDimensions.includes(dimension.id);
              const isCorrect = generatedCase.correctDimensions.includes(dimension.id);
              
              return (
                <button
                  key={dimension.id}
                  onClick={() => toggleDimension(dimension.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{dimension.name}</h4>
                      <p className="text-sm text-gray-600">{dimension.description}</p>
                    </div>
                    {isCorrect && (
                      <div className="ml-2 w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentStep('titles')}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Terug naar titels
          </button>
          
          <button
            onClick={() => setCurrentStep('dimensions')}
            disabled={selectedDimensions.length === 0}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Bekijk Resultaat
          </button>
        </div>
      </div>
    );
  };

  const renderDimensionsStep = () => {
    if (!generatedCase) return null;

    const correctCount = selectedDimensions.filter(id => 
      generatedCase.correctDimensions.includes(id)
    ).length;
    const totalCorrect = generatedCase.correctDimensions.length;
    const score = Math.round((correctCount / totalCorrect) * 100);

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Resultaat</h2>
          <p className="text-gray-600">Zie hoe goed je de ethische spanningsvelden hebt geïdentificeerd</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-4xl font-bold text-orange-500 mb-2">{score}%</div>
          <p className="text-gray-600">
            Je hebt {correctCount} van de {totalCorrect} belangrijkste ethische dimensies geïdentificeerd
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Belangrijkste Ethische Dimensies</h3>
          <div className="space-y-4">
            {generatedCase.correctDimensions.map((dimensionId, index) => {
              const dimension = DIMENSIONS.find(d => d.id === dimensionId);
              const wasSelected = selectedDimensions.includes(dimensionId);
              
              if (!dimension) return null;
              
              return (
                <div
                  key={dimensionId}
                  className={`p-4 rounded-lg border-2 ${
                    wasSelected 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-orange-500 bg-orange-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{dimension.name}</h4>
                    {wasSelected ? (
                      <span className="text-green-600 text-sm font-medium">✓ Geïdentificeerd</span>
                    ) : (
                      <span className="text-orange-600 text-sm font-medium">Gemist</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{dimension.description}</p>
                  <p className="text-sm text-gray-600 italic">
                    {generatedCase.explanations[index]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentStep('case')}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Terug naar casus
          </button>
          
          <button
            onClick={expandCase}
            disabled={isLoading}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uitbreiden...
              </>
            ) : (
              <>
                <Lightbulb className="w-4 h-4 mr-2" />
                Breid Casus Uit
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  const renderExpandedStep = () => {
    if (!expandedCase) return null;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Uitgebreide Casus</h2>
          <p className="text-gray-600">Een diepgaande analyse van de ethische spanningsvelden</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            {expandedCase.expandedCase.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentStep('dimensions')}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Terug naar resultaat
          </button>
          
          <button
            onClick={resetToStart}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 flex items-center"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Nieuwe Casus
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header with reset button */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <FileText className="w-8 h-8 text-orange-500" />
            <span className="text-2xl font-bold text-gray-900">Ethische Casus</span>
          </div>
          {currentStep !== 'selection' && (
            <button
              onClick={resetToStart}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Opnieuw beginnen
            </button>
          )}
        </div>

        {/* Error display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-800 font-semibold mb-1">Er is een fout opgetreden</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="max-w-6xl mx-auto">
          {currentStep === 'selection' && renderSelectionStep()}
          {currentStep === 'titles' && renderTitlesStep()}
          {currentStep === 'case' && renderCaseStep()}
          {currentStep === 'dimensions' && renderDimensionsStep()}
          {currentStep === 'expanded' && renderExpandedStep()}
        </div>
      </div>
    </div>
  );
};

export default App;