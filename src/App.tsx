import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  Building2, 
  Landmark, 
  Scale, 
  Newspaper,
  Brain,
  Shield,
  Zap,
  Lock,
  Cog,
  Eye,
  ChevronRight,
  ArrowLeft,
  Lightbulb,
  Target,
  MessageCircle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Compass,
  Play,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { playSelectSound, playDeselectSound, playConfirmSound, playNavigationSound } from './utils/soundEffects';

// Types
interface CaseData {
  case: string;
  compactCase: string;
  correctDimensions: string[];
  explanations: string[];
  stakeholders: Array<{
    role: string;
    interests: string;
    perspective: string;
  }>;
}

interface CaseTitle {
  title: string;
  description: string;
  techTopic: string;
}

interface ExpandedCase {
  expandedCase: string;
}

// Constants
const FIELDS = [
  { id: 'education', name: 'Onderwijs', icon: BookOpen },
  { id: 'healthcare', name: 'Gezondheidszorg', icon: Users },
  { id: 'business', name: 'Bedrijfsleven', icon: Building2 },
  { id: 'government', name: 'Overheid', icon: Landmark },
  { id: 'legal', name: 'Juridisch', icon: Scale },
  { id: 'media', name: 'Media & Communicatie', icon: Newspaper }
];

const TOPICS = [
  { id: 'ai', name: 'AI & Machine Learning', icon: Brain },
  { id: 'privacy', name: 'Data & Privacy', icon: Shield },
  { id: 'digital', name: 'Digitale Transformatie', icon: Zap },
  { id: 'security', name: 'Cybersecurity', icon: Lock },
  { id: 'automation', name: 'Automatisering', icon: Cog },
  { id: 'surveillance', name: 'Toezicht & Monitoring', icon: Eye }
];

const DIMENSIONS = [
  { id: 'relationships', name: 'Relatie tussen mensen', description: 'Impact op menselijke verbindingen en sociale cohesie' },
  { id: 'privacy', name: 'Privacy & gegevensbescherming', description: 'Bescherming van persoonlijke informatie en autonomie' },
  { id: 'accessibility', name: 'Toegankelijkheid & inclusiviteit', description: 'Gelijke toegang en participatie voor iedereen' },
  { id: 'autonomy', name: 'Autonomie & manipulatie', description: 'Vrijheid van keuze versus beïnvloeding' },
  { id: 'responsibility', name: 'Verantwoordelijkheid & aansprakelijkheid', description: 'Wie is verantwoordelijk voor de gevolgen?' },
  { id: 'sustainability', name: 'Duurzaamheid & milieu-impact', description: 'Langetermijneffecten op mens en milieu' },
  { id: 'bias', name: 'Bias & discriminatie', description: 'Eerlijkheid en gelijke behandeling' },
  { id: 'transparency', name: 'Transparantie & uitlegbaarheid', description: 'Begrijpelijkheid van processen en beslissingen' },
  { id: 'oversight', name: 'Menselijk toezicht & controle', description: 'Behoud van menselijke controle over technologie' },
  { id: 'wellbeing', name: 'Sociaal welzijn & psychologie', description: 'Impact op mentale gezondheid en welzijn' },
  { id: 'culture', name: 'Culturele & sociale impact', description: 'Effecten op cultuur en samenleving' },
  { id: 'legal', name: 'Internationale & juridische implicaties', description: 'Juridische en regelgevingskwesties' }
];

const REFLECTION_TEXTS = [
  "Interessante keuze. Wat zegt dit over jouw blik op de situatie?",
  "Je interpretatie geeft richting aan het gesprek. Hoe zou een ander dit kunnen zien?",
  "Deze invalshoek opent nieuwe perspectieven. Welke nuances zie je hier?",
  "Jouw perspectief brengt belangrijke aspecten naar voren. Wat zou dit betekenen voor de betrokkenen?",
  "Een doordachte interpretatie. Welke vragen roept dit bij je op?",
  "Deze dimensie raakt de kern van het dilemma. Hoe zou je dit verder willen verkennen?",
  "Jouw keuze laat zien hoe complex deze situatie is. Wat zijn de verschillende kanten?",
  "Een waardevolle invalshoek. Welke spanningen zie je tussen verschillende belangen?",
  "Deze interpretatie nodigt uit tot dieper nadenken. Wat zijn de langetermijngevolgen?",
  "Jouw perspectief verrijkt de discussie. Hoe zouden verschillende stakeholders hierop reageren?"
];

function App() {
  // State management
  const [currentStep, setCurrentStep] = useState<'selection' | 'titles' | 'case' | 'compass' | 'expanded'>('selection');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [caseTitles, setCaseTitles] = useState<CaseTitle[]>([]);
  const [selectedCaseTitle, setSelectedCaseTitle] = useState<string>('');
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);
  const [expandedCase, setExpandedCase] = useState<ExpandedCase | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showReflections, setShowReflections] = useState(false);

  // Helper functions
  const toggleSelection = (items: string[], setItems: (items: string[]) => void, id: string, maxSelections?: number) => {
    const isSelected = items.includes(id);
    
    if (isSelected) {
      playDeselectSound();
      setItems(items.filter(item => item !== id));
    } else {
      if (maxSelections && items.length >= maxSelections) {
        return; // Don't allow more selections
      }
      playSelectSound();
      setItems([...items, id]);
    }
  };

  const generateCaseTitles = async () => {
    if (selectedFields.length === 0 || selectedTopics.length === 0) {
      setError('Selecteer minimaal één vakgebied en één technologie onderwerp.');
      return;
    }

    setIsLoading(true);
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
          allTopics: TOPICS.map(t => t.name)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCaseTitles(data.caseTitles || []);
      setCurrentStep('titles');
      playNavigationSound();
    } catch (error) {
      console.error('Error generating titles:', error);
      setError(`Er is een fout opgetreden bij het genereren van de casus titels: ${error instanceof Error ? error.message : 'Onbekende fout'}. Probeer het opnieuw.`);
    } finally {
      setIsLoading(false);
    }
  };

  const generateCase = async (caseTitle?: string) => {
    if (selectedFields.length === 0 || selectedTopics.length === 0) {
      setError('Selecteer minimaal één vakgebied en één technologie onderwerp.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      console.log('Generating case with:', { selectedFields, selectedTopics, caseTitle });
      
      const response = await fetch('/api/generate-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedFields,
          selectedTopics,
          caseTitle: caseTitle || selectedCaseTitle
        }),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Generated case data:', data);
      
      if (!data.case || !data.correctDimensions) {
        throw new Error('Onvolledige data ontvangen van de server');
      }
      
      setCaseData(data);
      setCurrentStep('compass');
      playNavigationSound();
    } catch (error) {
      console.error('Error generating case:', error);
      setError(`Er is een fout opgetreden bij het genereren van de casus: ${error instanceof Error ? error.message : 'Onbekende fout'}. Probeer het opnieuw.`);
    } finally {
      setIsLoading(false);
    }
  };

  const expandCase = async () => {
    if (!caseData || selectedDimensions.length === 0) {
      setError('Selecteer minimaal één ethische dimensie.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/expand-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          compactCase: caseData.compactCase,
          selectedDimensions: selectedDimensions.map(id => 
            DIMENSIONS.find(d => d.id === id)?.name || id
          )
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setExpandedCase(data);
      setCurrentStep('expanded');
      playNavigationSound();
    } catch (error) {
      console.error('Error expanding case:', error);
      setError(`Er is een fout opgetreden bij het uitbreiden van de casus: ${error instanceof Error ? error.message : 'Onbekende fout'}. Probeer het opnieuw.`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetApp = () => {
    setCurrentStep('selection');
    setSelectedFields([]);
    setSelectedTopics([]);
    setCaseTitles([]);
    setSelectedCaseTitle('');
    setCaseData(null);
    setSelectedDimensions([]);
    setExpandedCase(null);
    setError('');
    setShowReflections(false);
    playNavigationSound();
  };

  const goBack = () => {
    switch (currentStep) {
      case 'titles':
        setCurrentStep('selection');
        setCaseTitles([]);
        break;
      case 'case':
        setCurrentStep('titles');
        setCaseData(null);
        break;
      case 'compass':
        setCurrentStep('selection');
        setCaseData(null);
        setSelectedDimensions([]);
        setShowReflections(false);
        break;
      case 'expanded':
        setCurrentStep('compass');
        setExpandedCase(null);
        break;
    }
    playNavigationSound();
  };

  // Render functions
  const renderSelectionStep = () => (
    <div className="space-y-8 animate-in">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Compass className="w-8 h-8 text-orange-500" />
          <h1 className="text-3xl font-bold text-gray-800">Ethiek & Technologie</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Genereer realistische ethische casussen voor professionals uit verschillende vakgebieden. 
          Verken complexe dilemma's rond technologie en ethiek.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Users className="w-5 h-5 mr-2 text-orange-500" />
            Vakgebied (minimaal 1)
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {FIELDS.map((field) => {
              const Icon = field.icon;
              const isSelected = selectedFields.includes(field.id);
              return (
                <button
                  key={field.id}
                  onClick={() => toggleSelection(selectedFields, setSelectedFields, field.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left flex items-center space-x-3 hover:shadow-md ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-orange-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-orange-600' : 'text-gray-500'}`} />
                  <span className={`font-medium ${isSelected ? 'text-orange-800' : 'text-gray-700'}`}>
                    {field.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-yellow-500" />
            Technologie Onderwerp (minimaal 1)
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {TOPICS.map((topic) => {
              const Icon = topic.icon;
              const isSelected = selectedTopics.includes(topic.id);
              return (
                <button
                  key={topic.id}
                  onClick={() => toggleSelection(selectedTopics, setSelectedTopics, topic.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left flex items-center space-x-3 hover:shadow-md ${
                    isSelected
                      ? 'border-yellow-500 bg-yellow-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-yellow-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-yellow-600' : 'text-gray-500'}`} />
                  <span className={`font-medium ${isSelected ? 'text-yellow-800' : 'text-gray-700'}`}>
                    {topic.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 animate-in">
          {error}
        </div>
      )}

      <div className="flex justify-center pt-6">
        <button
          onClick={generateCaseTitles}
          disabled={isLoading || selectedFields.length === 0 || selectedTopics.length === 0}
          className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg hover:shadow-xl"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Genereren...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Genereer Casus Titels</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderTitlesStep = () => (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <button
          onClick={goBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Terug naar selectie</span>
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Kies een Casus</h2>
        <div className="w-24"></div>
      </div>

      <div className="grid gap-4">
        {caseTitles.map((caseTitle, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-orange-300"
            onClick={() => {
              setSelectedCaseTitle(caseTitle.title);
              generateCase(caseTitle.title);
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{caseTitle.title}</h3>
                <p className="text-gray-600 mb-3">{caseTitle.description}</p>
                <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {caseTitle.techTopic}
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={() => generateCase()}
          disabled={isLoading}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Genereren...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Genereer Willekeurige Casus</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 animate-in">
          {error}
        </div>
      )}
    </div>
  );

  const renderCompassStep = () => (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <button
          onClick={goBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Terug</span>
        </button>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Compass className="w-6 h-6 mr-2 text-orange-500" />
          Waar schommelt het morele kompas?
        </h2>
        <div className="w-16"></div>
      </div>

      {caseData && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">De Casus</h3>
          <p className="text-gray-700 leading-relaxed">{caseData.case}</p>
        </div>
      )}

      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Instructie
        </h3>
        <p className="text-blue-700 leading-relaxed">
          Welke ethische spanningsvelden herken je in deze casus? Selecteer de dimensies die volgens jou 
          het meest relevant zijn. Er zijn geen foute antwoorden - het gaat om jouw interpretatie en reflectie.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DIMENSIONS.map((dimension) => {
          const isSelected = selectedDimensions.includes(dimension.id);
          return (
            <button
              key={dimension.id}
              onClick={() => toggleSelection(selectedDimensions, setSelectedDimensions, dimension.id)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${
                isSelected
                  ? 'border-orange-500 bg-orange-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-orange-300'
              }`}
            >
              <h4 className={`font-semibold mb-2 ${isSelected ? 'text-orange-800' : 'text-gray-800'}`}>
                {dimension.name}
              </h4>
              <p className={`text-sm ${isSelected ? 'text-orange-600' : 'text-gray-600'}`}>
                {dimension.description}
              </p>
            </button>
          );
        })}
      </div>

      {selectedDimensions.length > 0 && (
        <div className="space-y-4">
          <button
            onClick={() => {
              setShowReflections(true);
              playConfirmSound();
            }}
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Bekijk Jouw Interpretatie</span>
          </button>

          {showReflections && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm animate-in">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                Jouw Interpretatie
              </h3>
              <div className="space-y-4">
                {selectedDimensions.map((dimensionId, index) => {
                  const dimension = DIMENSIONS.find(d => d.id === dimensionId);
                  const reflectionText = REFLECTION_TEXTS[index % REFLECTION_TEXTS.length];
                  
                  return (
                    <div key={dimensionId} className="border-l-4 border-orange-500 pl-4 py-2">
                      <h4 className="font-medium text-gray-800 mb-1">{dimension?.name}</h4>
                      <p className="text-gray-600 text-sm italic">{reflectionText}</p>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-700 text-sm">
                  <strong>Reflectie:</strong> Elke interpretatie is waardevol en biedt een uniek perspectief op de ethische complexiteit van deze situatie. 
                  Deze dimensies kunnen als uitgangspunt dienen voor verdere discussie en verdieping.
                </p>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  onClick={expandCase}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Uitbreiden...</span>
                    </>
                  ) : (
                    <>
                      <ChevronRight className="w-5 h-5" />
                      <span>Ga naar Uitgebreide Casus</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 animate-in">
          {error}
        </div>
      )}
    </div>
  );

  const renderExpandedStep = () => (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <button
          onClick={goBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Terug naar kompas</span>
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Uitgebreide Casus</h2>
        <button
          onClick={resetApp}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Nieuwe casus</span>
        </button>
      </div>

      {expandedCase && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Uitgebreide Beschrijving</h3>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {expandedCase.expandedCase}
            </p>
          </div>
        </div>
      )}

      {caseData && caseData.stakeholders && caseData.stakeholders.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-500" />
            Belanghebbenden
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {caseData.stakeholders.map((stakeholder, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">{stakeholder.role}</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Belangen:</span>
                    <p className="text-gray-700">{stakeholder.interests}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Perspectief:</span>
                    <p className="text-gray-700">{stakeholder.perspective}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-green-50 rounded-lg p-6 border border-green-200">
        <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          Discussievragen
        </h3>
        <ul className="space-y-2 text-green-700">
          <li>• Welke ethische principes staan hier tegenover elkaar?</li>
          <li>• Hoe zouden verschillende stakeholders deze situatie beoordelen?</li>
          <li>• Welke langetermijngevolgen kunnen we voorzien?</li>
          <li>• Zijn er alternatieve oplossingen die meer partijen tevreden stellen?</li>
          <li>• Welke rol speelt context en cultuur in dit dilemma?</li>
        </ul>
      </div>
    </div>
  );

  // Main render
  return (
    <div className="min-h-screen bg-transparent">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {currentStep === 'selection' && renderSelectionStep()}
        {currentStep === 'titles' && renderTitlesStep()}
        {currentStep === 'compass' && renderCompassStep()}
        {currentStep === 'expanded' && renderExpandedStep()}
      </div>
    </div>
  );
}

export default App;