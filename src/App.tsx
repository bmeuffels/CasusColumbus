import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, RotateCcw, Lightbulb, Users, CheckCircle, XCircle, Compass, ArrowRight, Sparkles, Target, BookOpen, Brain, Eye, Shield, Scale, Leaf, AlertTriangle, Search, Globe, Gavel } from 'lucide-react';
import { playSelectSound, playDeselectSound, playConfirmSound, playNavigationSound } from './utils/soundEffects';

// Professional field definitions with Dutch translations
const PROFESSIONAL_FIELDS = [
  { id: 'education', name: 'Onderwijs', icon: BookOpen },
  { id: 'healthcare', name: 'Gezondheidszorg', icon: Brain },
  { id: 'business', name: 'Bedrijfsleven', icon: Target },
  { id: 'government', name: 'Overheid', icon: Scale },
  { id: 'legal', name: 'Juridisch', icon: Gavel },
  { id: 'media', name: 'Media & Communicatie', icon: Globe }
];

// Technology topics with Dutch translations
const TECH_TOPICS = [
  { id: 'ai', name: 'Kunstmatige Intelligentie', icon: Brain },
  { id: 'data-privacy', name: 'Data & Privacy', icon: Shield },
  { id: 'digital-transformation', name: 'Digitale Transformatie', icon: Sparkles },
  { id: 'cybersecurity', name: 'Cybersecurity', icon: Eye },
  { id: 'automation', name: 'Automatisering', icon: Target },
  { id: 'surveillance', name: 'Toezicht & Monitoring', icon: Search }
];

// Ethical dimensions with Dutch translations and descriptions
const ETHICAL_DIMENSIONS = [
  { 
    id: 'relationships', 
    name: 'Relatie tussen mensen', 
    description: 'Hoe technologie menselijke relaties en sociale verbindingen beïnvloedt',
    icon: Users 
  },
  { 
    id: 'privacy', 
    name: 'Privacy & gegevensbescherming', 
    description: 'Bescherming van persoonlijke informatie en digitale privacy',
    icon: Shield 
  },
  { 
    id: 'accessibility', 
    name: 'Toegankelijkheid & inclusiviteit', 
    description: 'Zorgen dat technologie voor iedereen toegankelijk en bruikbaar is',
    icon: Users 
  },
  { 
    id: 'autonomy', 
    name: 'Autonomie & manipulatie', 
    description: 'Behoud van menselijke keuzevrijheid en bescherming tegen manipulatie',
    icon: Brain 
  },
  { 
    id: 'responsibility', 
    name: 'Verantwoordelijkheid & aansprakelijkheid', 
    description: 'Wie is verantwoordelijk voor de gevolgen van technologische beslissingen',
    icon: Scale 
  },
  { 
    id: 'sustainability', 
    name: 'Duurzaamheid & milieu-impact', 
    description: 'Milieugevolgen en duurzaamheid van technologische ontwikkelingen',
    icon: Leaf 
  },
  { 
    id: 'bias', 
    name: 'Bias & discriminatie', 
    description: 'Voorkomen van vooroordelen en discriminatie in technologische systemen',
    icon: AlertTriangle 
  },
  { 
    id: 'transparency', 
    name: 'Transparantie & uitlegbaarheid', 
    description: 'Begrijpelijkheid en openheid over hoe technologie werkt en beslissingen neemt',
    icon: Eye 
  },
  { 
    id: 'oversight', 
    name: 'Menselijk toezicht & controle', 
    description: 'Behoud van menselijke controle over geautomatiseerde systemen',
    icon: Search 
  },
  { 
    id: 'wellbeing', 
    name: 'Sociaal welzijn & psychologie', 
    description: 'Impact op mentale gezondheid en maatschappelijk welzijn',
    icon: Brain 
  },
  { 
    id: 'culture', 
    name: 'Culturele & sociale impact', 
    description: 'Effecten op cultuur, tradities en sociale structuren',
    icon: Globe 
  },
  { 
    id: 'legal', 
    name: 'Internationale & juridische implicaties', 
    description: 'Juridische aspecten en internationale regelgeving',
    icon: Gavel 
  }
];

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

function App() {
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);
  const [generatedCase, setGeneratedCase] = useState<GeneratedCase | null>(null);
  const [expandedCase, setExpandedCase] = useState<ExpandedCase | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [showExplanations, setShowExplanations] = useState(false);
  const [caseTitles, setCaseTitles] = useState<CaseTitle[]>([]);
  const [selectedCaseTitle, setSelectedCaseTitle] = useState<string>('');
  const [isGeneratingTitles, setIsGeneratingTitles] = useState(false);
  const [showTitleSelection, setShowTitleSelection] = useState(false);

  // Navigation functions
  const nextStep = () => {
    playNavigationSound();
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    playNavigationSound();
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetApp = () => {
    playNavigationSound();
    setCurrentStep(1);
    setSelectedFields([]);
    setSelectedTopics([]);
    setSelectedDimensions([]);
    setGeneratedCase(null);
    setExpandedCase(null);
    setIsGenerating(false);
    setIsExpanding(false);
    setShowResults(false);
    setScore(0);
    setMaxScore(0);
    setShowExplanations(false);
    setCaseTitles([]);
    setSelectedCaseTitle('');
    setIsGeneratingTitles(false);
    setShowTitleSelection(false);
  };

  // Selection handlers
  const toggleField = (fieldId: string) => {
    if (selectedFields.includes(fieldId)) {
      playDeselectSound();
      setSelectedFields(selectedFields.filter(id => id !== fieldId));
    } else {
      playSelectSound();
      setSelectedFields([...selectedFields, fieldId]);
    }
  };

  const toggleTopic = (topicId: string) => {
    if (selectedTopics.includes(topicId)) {
      playDeselectSound();
      setSelectedTopics(selectedTopics.filter(id => id !== topicId));
    } else {
      playSelectSound();
      setSelectedTopics([...selectedTopics, topicId]);
    }
  };

  const toggleDimension = (dimensionId: string) => {
    if (selectedDimensions.includes(dimensionId)) {
      playDeselectSound();
      setSelectedDimensions(selectedDimensions.filter(id => id !== dimensionId));
    } else {
      playSelectSound();
      setSelectedDimensions([...selectedDimensions, dimensionId]);
    }
  };

  // Case generation functions
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
          allTopics: TECH_TOPICS.map(t => t.name)
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCaseTitles(data.caseTitles || []);
      setShowTitleSelection(true);
    } catch (error) {
      console.error('Error generating case titles:', error);
      alert('Er is een fout opgetreden bij het genereren van de casus titels. Probeer het opnieuw.');
    } finally {
      setIsGeneratingTitles(false);
    }
  };

  const generateCase = async (useTitle: boolean = false) => {
    if (selectedFields.length === 0 || selectedTopics.length === 0) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedFields,
          selectedTopics,
          caseTitle: useTitle ? selectedCaseTitle : undefined
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGeneratedCase(data);
      setMaxScore(data.correctDimensions?.length || 0);
      setShowTitleSelection(false);
      nextStep();
    } catch (error) {
      console.error('Error generating case:', error);
      alert('Er is een fout opgetreden bij het genereren van de casus. Probeer het opnieuw.');
    } finally {
      setIsGenerating(false);
    }
  };

  const expandCase = async () => {
    if (!generatedCase || selectedDimensions.length === 0) return;

    setIsExpanding(true);
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setExpandedCase(data);
      nextStep();
    } catch (error) {
      console.error('Error expanding case:', error);
      alert('Er is een fout opgetreden bij het uitbreiden van de casus. Probeer het opnieuw.');
    } finally {
      setIsExpanding(false);
    }
  };

  const checkAnswers = () => {
    if (!generatedCase) return;

    playConfirmSound();
    const correctAnswers = generatedCase.correctDimensions || [];
    const userAnswers = selectedDimensions;
    
    const correctCount = userAnswers.filter(answer => 
      correctAnswers.includes(answer)
    ).length;
    
    setScore(correctCount);
    setShowResults(true);
  };

  const showCorrectAnswers = () => {
    playNavigationSound();
    setShowExplanations(true);
  };

  // Auto-generate titles when fields and topics are selected
  useEffect(() => {
    if (selectedFields.length > 0 && selectedTopics.length > 0 && currentStep === 2) {
      generateCaseTitles();
    }
  }, [selectedFields, selectedTopics, currentStep]);

  // Render functions
  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
              currentStep >= step 
                ? 'bg-gradient-to-r from-orange-500 to-yellow-400 text-white shadow-lg' 
                : 'bg-white/20 text-white/60 border border-white/30'
            }`}>
              {step}
            </div>
            {step < 4 && (
              <ChevronRight className={`w-5 h-5 mx-2 transition-colors duration-300 ${
                currentStep > step ? 'text-orange-400' : 'text-white/40'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="animate-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Selecteer je vakgebied(en)</h2>
        <p className="text-white/80 text-lg">Kies één of meerdere vakgebieden die relevant zijn voor jouw situatie</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {PROFESSIONAL_FIELDS.map((field) => {
          const Icon = field.icon;
          const isSelected = selectedFields.includes(field.id);
          
          return (
            <button
              key={field.id}
              onClick={() => toggleField(field.id)}
              className={`p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                isSelected
                  ? 'bg-gradient-to-br from-orange-500/20 to-yellow-400/20 border-orange-400 shadow-lg shadow-orange-500/25'
                  : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40'
              }`}
            >
              <Icon className={`w-8 h-8 mx-auto mb-3 ${isSelected ? 'text-orange-400' : 'text-white/70'}`} />
              <h3 className={`font-semibold text-lg ${isSelected ? 'text-white' : 'text-white/80'}`}>
                {field.name}
              </h3>
            </button>
          );
        })}
      </div>

      <div className="flex justify-center">
        <button
          onClick={nextStep}
          disabled={selectedFields.length === 0}
          className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center space-x-2 ${
            selectedFields.length > 0
              ? 'bg-gradient-to-r from-orange-500 to-yellow-400 text-white hover:from-orange-600 hover:to-yellow-500 shadow-lg hover:shadow-xl transform hover:scale-105'
              : 'bg-white/20 text-white/50 cursor-not-allowed'
          }`}
        >
          <span>Volgende stap</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="animate-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Kies een technologie onderwerp</h2>
        <p className="text-white/80 text-lg">Selecteer het technologie gebied dat je wilt verkennen</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {TECH_TOPICS.map((topic) => {
          const Icon = topic.icon;
          const isSelected = selectedTopics.includes(topic.id);
          
          return (
            <button
              key={topic.id}
              onClick={() => toggleTopic(topic.id)}
              className={`p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                isSelected
                  ? 'bg-gradient-to-br from-orange-500/20 to-yellow-400/20 border-orange-400 shadow-lg shadow-orange-500/25'
                  : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40'
              }`}
            >
              <Icon className={`w-8 h-8 mx-auto mb-3 ${isSelected ? 'text-orange-400' : 'text-white/70'}`} />
              <h3 className={`font-semibold text-lg ${isSelected ? 'text-white' : 'text-white/80'}`}>
                {topic.name}
              </h3>
            </button>
          );
        })}
      </div>

      {/* Case Title Selection */}
      {showTitleSelection && caseTitles.length > 0 && (
        <div className="mb-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">Kies een casus titel (optioneel)</h3>
            <p className="text-white/80">Of sla over voor een willekeurige casus</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {caseTitles.map((caseTitle, index) => (
              <button
                key={index}
                onClick={() => {
                  playSelectSound();
                  setSelectedCaseTitle(caseTitle.title);
                }}
                className={`p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                  selectedCaseTitle === caseTitle.title
                    ? 'bg-gradient-to-br from-orange-500/20 to-yellow-400/20 border-orange-400'
                    : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40'
                }`}
              >
                <h4 className="font-semibold text-white mb-2">{caseTitle.title}</h4>
                <p className="text-white/70 text-sm mb-2">{caseTitle.description}</p>
                <span className="text-orange-400 text-xs font-medium">{caseTitle.techTopic}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {isGeneratingTitles && (
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 bg-white/10 px-6 py-3 rounded-lg">
            <div className="animate-pulse w-2 h-2 bg-orange-400 rounded-full"></div>
            <div className="animate-pulse w-2 h-2 bg-orange-400 rounded-full delay-150"></div>
            <div className="animate-pulse w-2 h-2 bg-orange-400 rounded-full delay-300"></div>
            <span className="text-white/80 ml-3">Casus titels genereren...</span>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="px-6 py-3 rounded-xl font-semibold bg-white/20 text-white hover:bg-white/30 transition-all duration-300 flex items-center space-x-2"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Vorige</span>
        </button>
        
        <div className="flex space-x-4">
          {showTitleSelection && (
            <button
              onClick={() => generateCase(false)}
              disabled={selectedTopics.length === 0 || isGenerating}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                selectedTopics.length > 0 && !isGenerating
                  ? 'bg-white/20 text-white hover:bg-white/30'
                  : 'bg-white/10 text-white/50 cursor-not-allowed'
              }`}
            >
              <span>Willekeurige casus</span>
            </button>
          )}
          
          <button
            onClick={() => generateCase(true)}
            disabled={selectedTopics.length === 0 || isGenerating || (showTitleSelection && !selectedCaseTitle)}
            className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center space-x-2 ${
              selectedTopics.length > 0 && !isGenerating && (!showTitleSelection || selectedCaseTitle)
                ? 'bg-gradient-to-r from-orange-500 to-yellow-400 text-white hover:from-orange-600 hover:to-yellow-500 shadow-lg hover:shadow-xl transform hover:scale-105'
                : 'bg-white/20 text-white/50 cursor-not-allowed'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="animate-pulse w-2 h-2 bg-white rounded-full"></div>
                <div className="animate-pulse w-2 h-2 bg-white rounded-full delay-150"></div>
                <div className="animate-pulse w-2 h-2 bg-white rounded-full delay-300"></div>
                <span className="ml-2">Genereren...</span>
              </>
            ) : (
              <>
                <span>{showTitleSelection && selectedCaseTitle ? 'Genereer gekozen casus' : 'Genereer casus'}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="animate-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Ethische Casus</h2>
        <p className="text-white/80 text-lg">Lees de casus en identificeer de relevante ethische spanningsvelden</p>
      </div>

      {generatedCase && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8 border border-white/20">
          <div className="prose prose-lg max-w-none">
            <div className="text-white/90 leading-relaxed whitespace-pre-wrap">
              {generatedCase.case}
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">
          Selecteer de relevante ethische spanningsvelden
        </h3>
        <p className="text-white/70 text-center mb-6">
          Kies de ethische dimensies die volgens jou het meest relevant zijn voor deze casus
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ETHICAL_DIMENSIONS.map((dimension) => {
            const Icon = dimension.icon;
            const isSelected = selectedDimensions.includes(dimension.id);
            
            return (
              <button
                key={dimension.id}
                onClick={() => toggleDimension(dimension.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 text-left ${
                  isSelected
                    ? 'bg-gradient-to-br from-orange-500/20 to-yellow-400/20 border-orange-400 shadow-lg shadow-orange-500/25'
                    : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Icon className={`w-6 h-6 mt-1 flex-shrink-0 ${isSelected ? 'text-orange-400' : 'text-white/70'}`} />
                  <div>
                    <h4 className={`font-semibold mb-2 ${isSelected ? 'text-white' : 'text-white/80'}`}>
                      {dimension.name}
                    </h4>
                    <p className={`text-sm ${isSelected ? 'text-white/80' : 'text-white/60'}`}>
                      {dimension.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="px-6 py-3 rounded-xl font-semibold bg-white/20 text-white hover:bg-white/30 transition-all duration-300 flex items-center space-x-2"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Vorige</span>
        </button>
        
        <div className="flex space-x-4">
          <button
            onClick={checkAnswers}
            disabled={selectedDimensions.length === 0}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
              selectedDimensions.length > 0
                ? 'bg-white/20 text-white hover:bg-white/30'
                : 'bg-white/10 text-white/50 cursor-not-allowed'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            <span>Controleer antwoorden</span>
          </button>
          
          <button
            onClick={expandCase}
            disabled={selectedDimensions.length === 0 || isExpanding}
            className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center space-x-2 ${
              selectedDimensions.length > 0 && !isExpanding
                ? 'bg-gradient-to-r from-orange-500 to-yellow-400 text-white hover:from-orange-600 hover:to-yellow-500 shadow-lg hover:shadow-xl transform hover:scale-105'
                : 'bg-white/20 text-white/50 cursor-not-allowed'
            }`}
          >
            {isExpanding ? (
              <>
                <div className="animate-pulse w-2 h-2 bg-white rounded-full"></div>
                <div className="animate-pulse w-2 h-2 bg-white rounded-full delay-150"></div>
                <div className="animate-pulse w-2 h-2 bg-white rounded-full delay-300"></div>
                <span className="ml-2">Uitbreiden...</span>
              </>
            ) : (
              <>
                <span>Breid casus uit</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Modal */}
      {showResults && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="text-center mb-6">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                score === maxScore ? 'bg-green-100' : score >= maxScore * 0.7 ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                {score === maxScore ? (
                  <CheckCircle className="w-10 h-10 text-green-600" />
                ) : score >= maxScore * 0.7 ? (
                  <Lightbulb className="w-10 h-10 text-yellow-600" />
                ) : (
                  <XCircle className="w-10 h-10 text-red-600" />
                )}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Je score: {score} van {maxScore}
              </h3>
              
              <p className="text-gray-600">
                {score === maxScore 
                  ? 'Uitstekend! Je hebt alle relevante ethische spanningsvelden geïdentificeerd.'
                  : score >= maxScore * 0.7
                  ? 'Goed gedaan! Je hebt de meeste relevante aspecten herkend.'
                  : 'Er zijn nog enkele belangrijke ethische aspecten die je gemist hebt.'
                }
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={showCorrectAnswers}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-2"
              >
                <Eye className="w-5 h-5" />
                <span>Toon uitleg</span>
              </button>
              
              <button
                onClick={() => setShowResults(false)}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
              >
                Sluiten
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Explanations Modal */}
      {showExplanations && generatedCase && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Relevante ethische spanningsvelden
            </h3>
            
            <div className="space-y-6">
              {generatedCase.correctDimensions.map((dimensionId, index) => {
                const dimension = ETHICAL_DIMENSIONS.find(d => d.id === dimensionId);
                const wasSelected = selectedDimensions.includes(dimensionId);
                const Icon = dimension?.icon || AlertTriangle;
                
                return (
                  <div key={dimensionId} className={`p-4 rounded-lg border-2 ${
                    wasSelected ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${wasSelected ? 'bg-green-100' : 'bg-red-100'}`}>
                        <Icon className={`w-6 h-6 ${wasSelected ? 'text-green-600' : 'text-red-600'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-gray-800">
                            {dimension?.name || dimensionId}
                          </h4>
                          {wasSelected ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <p className="text-gray-700 mb-2">{dimension?.description}</p>
                        <div className="bg-white/70 p-3 rounded border-l-4 border-blue-400">
                          <p className="text-gray-800 font-medium">Waarom relevant voor deze casus:</p>
                          <p className="text-gray-700 mt-1">{generatedCase.explanations[index]}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {generatedCase.stakeholders && generatedCase.stakeholders.length > 0 && (
              <div className="mt-8">
                <h4 className="text-xl font-bold text-gray-800 mb-4">Belanghebbenden</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedCase.stakeholders.map((stakeholder, index) => (
                    <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h5 className="font-semibold text-blue-800 mb-2">{stakeholder.role}</h5>
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Belangen:</strong> {stakeholder.interests}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Perspectief:</strong> {stakeholder.perspective}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setShowExplanations(false)}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
              >
                Sluiten
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="animate-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Uitgebreide Casus</h2>
        <p className="text-white/80 text-lg">Een diepgaande analyse van de ethische aspecten</p>
      </div>

      {expandedCase && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8 border border-white/20">
          <div className="prose prose-lg max-w-none">
            <div className="text-white/90 leading-relaxed whitespace-pre-wrap">
              {expandedCase.expandedCase}
            </div>
          </div>
        </div>
      )}

      {generatedCase && generatedCase.stakeholders && generatedCase.stakeholders.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8 border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-6">Belanghebbenden</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {generatedCase.stakeholders.map((stakeholder, index) => (
              <div key={index} className="bg-white/10 p-6 rounded-lg border border-white/20">
                <h4 className="font-semibold text-orange-400 mb-3 text-lg">{stakeholder.role}</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-white/70 text-sm font-medium mb-1">Belangen:</p>
                    <p className="text-white/90 text-sm">{stakeholder.interests}</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm font-medium mb-1">Perspectief:</p>
                    <p className="text-white/90 text-sm">{stakeholder.perspective}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="px-6 py-3 rounded-xl font-semibold bg-white/20 text-white hover:bg-white/30 transition-all duration-300 flex items-center space-x-2"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Vorige</span>
        </button>
        
        <button
          onClick={resetApp}
          className="px-8 py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-orange-500 to-yellow-400 text-white hover:from-orange-600 hover:to-yellow-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Nieuwe casus</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <img 
                src="/logo zonder ondertitel.svg" 
                alt="Logo" 
                className="h-12 w-auto"
                onError={(e) => {
                  console.error('Logo failed to load');
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div>
                <h1 className="text-2xl font-bold text-white">Casus Columbus</h1>
                <p className="text-white/70 text-sm">Ethiek & Technologie Navigator</p>
              </div>
            </div>
            
            <button
              onClick={resetApp}
              className="px-4 py-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all duration-300 flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {renderStepIndicator()}
        
        <div className="max-w-4xl mx-auto">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>
      </main>
    </div>
  );
}

export default App;