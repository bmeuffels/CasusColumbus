import React, { useState, useEffect } from 'react';
import { Compass, Users, Brain, Shield, Building, Scale, Newspaper, GraduationCap, Heart, Briefcase, Landmark, FileText, ChevronRight, ChevronLeft, RotateCcw, Lightbulb, CheckCircle, XCircle, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import { playSelectSound, playDeselectSound, playConfirmSound, playNavigationSound } from './utils/soundEffects';

// Define types
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

// Field and topic configurations
const fields = [
  { id: 'education', name: 'Onderwijs', icon: GraduationCap },
  { id: 'healthcare', name: 'Gezondheidszorg', icon: Heart },
  { id: 'business', name: 'Bedrijfsleven', icon: Briefcase },
  { id: 'government', name: 'Overheid', icon: Landmark },
  { id: 'legal', name: 'Juridisch', icon: Scale },
  { id: 'media', name: 'Media & Communicatie', icon: Newspaper }
];

const topics = [
  { id: 'ai', name: 'Kunstmatige Intelligentie', icon: Brain },
  { id: 'privacy', name: 'Data & Privacy', icon: Shield },
  { id: 'digital', name: 'Digitale Transformatie', icon: Building },
  { id: 'security', name: 'Cybersecurity', icon: Shield },
  { id: 'automation', name: 'Automatisering', icon: Brain },
  { id: 'surveillance', name: 'Toezicht & Monitoring', icon: Eye }
];

const dimensions = [
  { id: 'relationships', name: 'Relatie tussen mensen', description: 'Hoe technologie menselijke relaties beïnvloedt' },
  { id: 'privacy', name: 'Privacy & gegevensbescherming', description: 'Bescherming van persoonlijke informatie' },
  { id: 'accessibility', name: 'Toegankelijkheid & inclusiviteit', description: 'Gelijke toegang voor alle gebruikers' },
  { id: 'autonomy', name: 'Autonomie & manipulatie', description: 'Vrijheid van keuze en beïnvloeding' },
  { id: 'responsibility', name: 'Verantwoordelijkheid & aansprakelijkheid', description: 'Wie is verantwoordelijk voor gevolgen' },
  { id: 'sustainability', name: 'Duurzaamheid & milieu-impact', description: 'Ecologische gevolgen van technologie' },
  { id: 'bias', name: 'Bias & discriminatie', description: 'Vooroordelen in technologische systemen' },
  { id: 'transparency', name: 'Transparantie & uitlegbaarheid', description: 'Begrijpelijkheid van technologische processen' },
  { id: 'oversight', name: 'Menselijk toezicht & controle', description: 'Behoud van menselijke controle' },
  { id: 'wellbeing', name: 'Sociaal welzijn & psychologie', description: 'Impact op mentale gezondheid en welzijn' },
  { id: 'culture', name: 'Culturele & sociale impact', description: 'Veranderingen in samenleving en cultuur' },
  { id: 'legal', name: 'Internationale & juridische implicaties', description: 'Wettelijke en grensoverschrijdende aspecten' }
];

function App() {
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [expandedCase, setExpandedCase] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showExplanations, setShowExplanations] = useState(false);
  const [caseTitles, setCaseTitles] = useState<CaseTitle[]>([]);
  const [selectedCaseTitle, setSelectedCaseTitle] = useState<string>('');
  const [showTitleSelection, setShowTitleSelection] = useState(false);
  const [isLoadingTitles, setIsLoadingTitles] = useState(false);

  // Navigation functions
  const nextStep = () => {
    playNavigationSound();
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    playNavigationSound();
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const resetAll = () => {
    playNavigationSound();
    setCurrentStep(1);
    setSelectedFields([]);
    setSelectedTopics([]);
    setSelectedDimensions([]);
    setCaseData(null);
    setExpandedCase('');
    setShowResults(false);
    setShowExplanations(false);
    setCaseTitles([]);
    setSelectedCaseTitle('');
    setShowTitleSelection(false);
  };

  // Selection handlers
  const toggleField = (fieldId: string) => {
    setSelectedFields(prev => {
      const newSelection = prev.includes(fieldId) 
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId];
      
      if (prev.includes(fieldId)) {
        playDeselectSound();
      } else {
        playSelectSound();
      }
      
      return newSelection;
    });
  };

  const toggleTopic = (topicId: string) => {
    setSelectedTopics(prev => {
      const newSelection = prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId];
      
      if (prev.includes(topicId)) {
        playDeselectSound();
      } else {
        playSelectSound();
      }
      
      return newSelection;
    });
  };

  const toggleDimension = (dimensionId: string) => {
    setSelectedDimensions(prev => {
      const newSelection = prev.includes(dimensionId) 
        ? prev.filter(id => id !== dimensionId)
        : [...prev, dimensionId];
      
      if (prev.includes(dimensionId)) {
        playDeselectSound();
      } else {
        playSelectSound();
      }
      
      return newSelection;
    });
  };

  // API functions
  const generateTitles = async () => {
    if (selectedFields.length === 0 || selectedTopics.length === 0) return;
    
    setIsLoadingTitles(true);
    try {
      const response = await fetch('/api/generate-titles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedFields: selectedFields.map(id => fields.find(f => f.id === id)?.name).filter(Boolean),
          selectedTopics: selectedTopics.map(id => topics.find(t => t.id === id)?.name).filter(Boolean),
          allTopics: topics.map(t => t.name)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate titles');
      }

      const data = await response.json();
      setCaseTitles(data.caseTitles || []);
    } catch (error) {
      console.error('Error generating titles:', error);
      alert('Er is een fout opgetreden bij het genereren van casus titels. Probeer het opnieuw.');
    } finally {
      setIsLoadingTitles(false);
    }
  };

  const generateCase = async () => {
    if (selectedFields.length === 0 || selectedTopics.length === 0) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedFields: selectedFields.map(id => fields.find(f => f.id === id)?.name).filter(Boolean),
          selectedTopics: selectedTopics.map(id => topics.find(t => t.id === id)?.name).filter(Boolean),
          caseTitle: selectedCaseTitle
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate case');
      }

      const data = await response.json();
      setCaseData(data);
      nextStep();
    } catch (error) {
      console.error('Error generating case:', error);
      alert('Er is een fout opgetreden bij het genereren van de casus. Probeer het opnieuw.');
    } finally {
      setIsLoading(false);
    }
  };

  const expandCase = async () => {
    if (!caseData || selectedDimensions.length === 0) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/expand-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          compactCase: caseData.compactCase,
          selectedDimensions: selectedDimensions.map(id => dimensions.find(d => d.id === id)?.name).filter(Boolean)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to expand case');
      }

      const data = await response.json();
      setExpandedCase(data.expandedCase);
      nextStep();
    } catch (error) {
      console.error('Error expanding case:', error);
      alert('Er is een fout opgetreden bij het uitbreiden van de casus. Probeer het opnieuw.');
    } finally {
      setIsLoading(false);
    }
  };

  const checkAnswers = () => {
    playConfirmSound();
    setShowResults(true);
  };

  const toggleExplanations = () => {
    setShowExplanations(!showExplanations);
    if (!showExplanations) {
      playSelectSound();
    } else {
      playDeselectSound();
    }
  };

  // Auto-generate titles when fields and topics are selected
  useEffect(() => {
    if (selectedFields.length > 0 && selectedTopics.length > 0 && currentStep === 2) {
      generateTitles();
    }
  }, [selectedFields, selectedTopics, currentStep]);

  // Render functions
  const renderStep1 = () => (
    <div className="space-y-8 animate-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Stap 1: Selecteer Vakgebieden</h2>
        <p className="text-gray-600 mb-8">Kies de vakgebieden waarvoor je een ethische casus wilt genereren</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fields.map((field) => {
          const Icon = field.icon;
          const isSelected = selectedFields.includes(field.id);
          return (
            <button
              key={field.id}
              onClick={() => toggleField(field.id)}
              className={`p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                isSelected
                  ? 'border-orange-500 bg-orange-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md'
              }`}
            >
              <Icon className={`w-8 h-8 mx-auto mb-3 ${isSelected ? 'text-orange-600' : 'text-gray-600'}`} />
              <h3 className={`font-semibold ${isSelected ? 'text-orange-800' : 'text-gray-800'}`}>
                {field.name}
              </h3>
            </button>
          );
        })}
      </div>
      
      {selectedFields.length > 0 && (
        <div className="text-center">
          <button
            onClick={nextStep}
            className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-500 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center mx-auto"
          >
            Volgende Stap
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8 animate-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Stap 2: Selecteer Technologie Onderwerpen</h2>
        <p className="text-gray-600 mb-8">Kies de technologie onderwerpen die je wilt behandelen</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((topic) => {
          const Icon = topic.icon;
          const isSelected = selectedTopics.includes(topic.id);
          return (
            <button
              key={topic.id}
              onClick={() => toggleTopic(topic.id)}
              className={`p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                isSelected
                  ? 'border-orange-500 bg-orange-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md'
              }`}
            >
              <Icon className={`w-8 h-8 mx-auto mb-3 ${isSelected ? 'text-orange-600' : 'text-gray-600'}`} />
              <h3 className={`font-semibold ${isSelected ? 'text-orange-800' : 'text-gray-800'}`}>
                {topic.name}
              </h3>
            </button>
          );
        })}
      </div>

      {/* Case Title Selection */}
      {selectedTopics.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Kies een Casus Titel (Optioneel)</h3>
            <button
              onClick={() => setShowTitleSelection(!showTitleSelection)}
              className="text-orange-600 hover:text-orange-700 flex items-center"
            >
              {showTitleSelection ? <EyeOff className="w-5 h-5 mr-1" /> : <Eye className="w-5 h-5 mr-1" />}
              {showTitleSelection ? 'Verberg' : 'Toon'} Titels
            </button>
          </div>

          {showTitleSelection && (
            <div className="space-y-3">
              {isLoadingTitles ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-orange-500 mr-2" />
                  <span className="text-gray-600">Genereren van casus titels...</span>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setSelectedCaseTitle('')}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                      selectedCaseTitle === ''
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 bg-white hover:border-orange-300'
                    }`}
                  >
                    <div className="font-medium text-gray-800">Geen specifieke titel - Laat AI een casus genereren</div>
                    <div className="text-sm text-gray-600 mt-1">De AI genereert een volledig nieuwe casus</div>
                  </button>
                  
                  {caseTitles.map((caseTitle, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedCaseTitle(caseTitle.title)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                        selectedCaseTitle === caseTitle.title
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 bg-white hover:border-orange-300'
                      }`}
                    >
                      <div className="font-medium text-gray-800">{caseTitle.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{caseTitle.description}</div>
                      <div className="text-xs text-orange-600 mt-2 font-medium">
                        Onderwerp: {caseTitle.techTopic}
                      </div>
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      )}
      
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-200 flex items-center"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Vorige Stap
        </button>
        
        {selectedTopics.length > 0 && (
          <button
            onClick={generateCase}
            disabled={isLoading}
            className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-500 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Genereren...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Genereer Casus
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8 animate-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Stap 3: Analyseer de Casus</h2>
        <p className="text-gray-600 mb-8">Lees de casus en selecteer de ethische spanningsvelden die je herkent</p>
      </div>
      
      {caseData && (
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Ethische Casus</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{caseData.case}</p>
          </div>
        </div>
      )}
      
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Selecteer de Ethische Spanningsvelden</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dimensions.map((dimension) => {
            const isSelected = selectedDimensions.includes(dimension.id);
            return (
              <button
                key={dimension.id}
                onClick={() => toggleDimension(dimension.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all duration-200 hover:scale-[1.02] ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm'
                }`}
              >
                <h4 className={`font-semibold mb-2 ${isSelected ? 'text-orange-800' : 'text-gray-800'}`}>
                  {dimension.name}
                </h4>
                <p className={`text-sm ${isSelected ? 'text-orange-700' : 'text-gray-600'}`}>
                  {dimension.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-200 flex items-center"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Vorige Stap
        </button>
        
        <div className="flex space-x-4">
          {selectedDimensions.length > 0 && (
            <button
              onClick={checkAnswers}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-200 flex items-center"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Controleer Antwoorden
            </button>
          )}
          
          {selectedDimensions.length > 0 && (
            <button
              onClick={expandCase}
              disabled={isLoading}
              className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-500 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Uitbreiden...
                </>
              ) : (
                <>
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Breid Casus Uit
                </>
              )}
            </button>
          )}
        </div>
      </div>
      
      {/* Results Section */}
      {showResults && caseData && (
        <div className="mt-8 bg-white rounded-xl p-8 shadow-lg border border-gray-200 slide-in-from-bottom-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Resultaten</h3>
            <button
              onClick={toggleExplanations}
              className="text-orange-600 hover:text-orange-700 flex items-center"
            >
              {showExplanations ? <EyeOff className="w-5 h-5 mr-1" /> : <Eye className="w-5 h-5 mr-1" />}
              {showExplanations ? 'Verberg' : 'Toon'} Uitleg
            </button>
          </div>
          
          <div className="space-y-4">
            {dimensions.map((dimension) => {
              const isCorrect = caseData.correctDimensions.includes(dimension.id);
              const isSelected = selectedDimensions.includes(dimension.id);
              const correctIndex = caseData.correctDimensions.indexOf(dimension.id);
              
              if (!isCorrect && !isSelected) return null;
              
              return (
                <div
                  key={dimension.id}
                  className={`p-4 rounded-lg border-2 ${
                    isCorrect && isSelected
                      ? 'border-green-500 bg-green-50'
                      : isCorrect && !isSelected
                      ? 'border-yellow-500 bg-yellow-50'
                      : !isCorrect && isSelected
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        {isCorrect && isSelected ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        ) : isCorrect && !isSelected ? (
                          <XCircle className="w-5 h-5 text-yellow-600 mr-2" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 mr-2" />
                        )}
                        <h4 className="font-semibold text-gray-800">{dimension.name}</h4>
                      </div>
                      
                      {showExplanations && isCorrect && correctIndex >= 0 && caseData.explanations[correctIndex] && (
                        <p className="text-sm text-gray-700 mt-2 pl-7">
                          <strong>Uitleg:</strong> {caseData.explanations[correctIndex]}
                        </p>
                      )}
                    </div>
                    
                    <div className="ml-4 text-sm font-medium">
                      {isCorrect && isSelected ? (
                        <span className="text-green-600">Correct</span>
                      ) : isCorrect && !isSelected ? (
                        <span className="text-yellow-600">Gemist</span>
                      ) : (
                        <span className="text-red-600">Onjuist</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-8 animate-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Stap 4: Uitgebreide Casus</h2>
        <p className="text-gray-600 mb-8">Een uitgebreide versie van de casus met focus op de geselecteerde ethische spanningsvelden</p>
      </div>
      
      {expandedCase && (
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Uitgebreide Ethische Casus</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{expandedCase}</p>
          </div>
        </div>
      )}
      
      {caseData && caseData.stakeholders && caseData.stakeholders.length > 0 && (
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Belanghebbenden</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {caseData.stakeholders.map((stakeholder, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">{stakeholder.role}</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Belangen:</span>
                    <p className="text-gray-600">{stakeholder.interests}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Perspectief:</span>
                    <p className="text-gray-600">{stakeholder.perspective}</p>
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
          className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-200 flex items-center"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Vorige Stap
        </button>
        
        <button
          onClick={resetAll}
          className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-500 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Nieuwe Casus
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="/Avc.png" 
              alt="AVC Logo" 
              className="w-8 h-8 mr-3 object-contain"
            />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              Casus Columbus
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ontdek ethische dilemma's in de technologie. Navigeer door complexe vraagstukken 
            en ontwikkel je ethische kompas voor de digitale wereld.
          </p>
        </header>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <React.Fragment key={step}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-200 ${
                  step <= currentStep 
                    ? 'bg-gradient-to-r from-orange-500 to-yellow-400 text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-12 h-1 rounded transition-all duration-200 ${
                    step < currentStep ? 'bg-gradient-to-r from-orange-500 to-yellow-400' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </main>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-600">
          <p>© 2024 Casus Columbus - Ethiek & Technologie Generator</p>
        </footer>
      </div>
    </div>
  );
}

export default App;