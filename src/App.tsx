import React, { useState, useEffect } from 'react';
import { Brain, Users, Building2, Shield, Gavel, Megaphone, Bot, Database, Zap, Eye, Cog, Leaf, AlertTriangle, Search, FileText, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { playSelectSound, playDeselectSound, playConfirmSound, playNavigationSound } from './utils/soundEffects';

// Types
interface EthicalCase {
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

// Configuration
const PROFESSIONAL_FIELDS = [
  { id: 'education', name: 'Onderwijs', icon: Brain },
  { id: 'healthcare', name: 'Gezondheidszorg', icon: Users },
  { id: 'business', name: 'Bedrijfsleven', icon: Building2 },
  { id: 'government', name: 'Overheid', icon: Shield },
  { id: 'legal', name: 'Juridisch', icon: Gavel },
  { id: 'media', name: 'Media & Communicatie', icon: Megaphone }
];

const TECH_TOPICS = [
  { id: 'ai', name: 'Kunstmatige Intelligentie', icon: Bot },
  { id: 'data', name: 'Data & Privacy', icon: Database },
  { id: 'digital', name: 'Digitale Transformatie', icon: Zap },
  { id: 'security', name: 'Cybersecurity', icon: Shield },
  { id: 'automation', name: 'Automatisering', icon: Cog },
  { id: 'monitoring', name: 'Toezicht & Monitoring', icon: Eye }
];

const ETHICAL_DIMENSIONS = [
  { id: 'relationships', name: 'Relatie tussen mensen', icon: Users },
  { id: 'privacy', name: 'Privacy & gegevensbescherming', icon: Shield },
  { id: 'accessibility', name: 'Toegankelijkheid & inclusiviteit', icon: Users },
  { id: 'autonomy', name: 'Autonomie & manipulatie', icon: Brain },
  { id: 'responsibility', name: 'Verantwoordelijkheid & aansprakelijkheid', icon: Gavel },
  { id: 'sustainability', name: 'Duurzaamheid & milieu-impact', icon: Leaf },
  { id: 'bias', name: 'Bias & discriminatie', icon: AlertTriangle },
  { id: 'transparency', name: 'Transparantie & uitlegbaarheid', icon: Search },
  { id: 'oversight', name: 'Menselijk toezicht & controle', icon: Eye },
  { id: 'wellbeing', name: 'Sociaal welzijn & psychologie', icon: Users },
  { id: 'culture', name: 'Culturele & sociale impact', icon: Users },
  { id: 'legal', name: 'Internationale & juridische implicaties', icon: Gavel }
];

export default function App() {
  // State management
  const [currentStep, setCurrentStep] = useState<'fields' | 'topics' | 'titles' | 'case' | 'dimensions' | 'results'>('fields');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedCase, setSelectedCase] = useState<EthicalCase | null>(null);
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);
  const [caseTitles, setCaseTitles] = useState<CaseTitle[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<string>('');
  const [expandedCase, setExpandedCase] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  // Sound effect handlers
  const handleSelect = async (callback: () => void) => {
    if (isSoundEnabled) {
      await playSelectSound();
    }
    callback();
  };

  const handleDeselect = async (callback: () => void) => {
    if (isSoundEnabled) {
      await playDeselectSound();
    }
    callback();
  };

  const handleConfirm = async (callback: () => void) => {
    if (isSoundEnabled) {
      await playConfirmSound();
    }
    callback();
  };

  const handleNavigation = async (callback: () => void) => {
    if (isSoundEnabled) {
      await playNavigationSound();
    }
    callback();
  };

  // Reset function
  const resetToStart = () => {
    setCurrentStep('fields');
    setSelectedFields([]);
    setSelectedTopics([]);
    setSelectedCase(null);
    setSelectedDimensions([]);
    setCaseTitles([]);
    setSelectedTitle('');
    setExpandedCase('');
    setError('');
  };

  // API calls
  const generateTitles = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/generate-titles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedFields: selectedFields.map(id => PROFESSIONAL_FIELDS.find(f => f.id === id)?.name),
          selectedTopics: selectedTopics.map(id => TECH_TOPICS.find(t => t.id === id)?.name),
          allTopics: TECH_TOPICS.map(t => t.name)
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCaseTitles(data.caseTitles || []);
      setCurrentStep('titles');
    } catch (error) {
      console.error('Error generating titles:', error);
      setError('Er is een fout opgetreden bij het genereren van de casus titels. Probeer het opnieuw.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateCase = async (caseTitle?: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/generate-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedFields: selectedFields.map(id => PROFESSIONAL_FIELDS.find(f => f.id === id)?.name),
          selectedTopics: selectedTopics.map(id => TECH_TOPICS.find(t => t.id === id)?.name),
          caseTitle: caseTitle || undefined
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSelectedCase(data);
      setCurrentStep('case');
    } catch (error) {
      console.error('Error generating case:', error);
      setError('Er is een fout opgetreden bij het genereren van de casus. Probeer het opnieuw.');
    } finally {
      setIsLoading(false);
    }
  };

  const expandCase = async () => {
    if (!selectedCase || selectedDimensions.length === 0) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/expand-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          compactCase: selectedCase.compactCase,
          selectedDimensions: selectedDimensions.map(id => 
            ETHICAL_DIMENSIONS.find(d => d.id === id)?.name
          )
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setExpandedCase(data.expandedCase);
      setCurrentStep('results');
    } catch (error) {
      console.error('Error expanding case:', error);
      setError('Er is een fout opgetreden bij het uitbreiden van de casus. Probeer het opnieuw.');
    } finally {
      setIsLoading(false);
    }
  };

  // Field selection handlers
  const toggleField = (fieldId: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldId) 
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const toggleTopic = (topicId: string) => {
    setSelectedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const toggleDimension = (dimensionId: string) => {
    setSelectedDimensions(prev => 
      prev.includes(dimensionId) 
        ? prev.filter(id => id !== dimensionId)
        : [...prev, dimensionId]
    );
  };

  // Render functions
  const renderFieldSelection = () => (
    <div className="animate-in slide-in-from-bottom-2">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Welk vakgebied past bij jou?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Selecteer één of meerdere vakgebieden waarin je werkzaam bent. Dit helpt ons relevante ethische casussen te genereren.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {PROFESSIONAL_FIELDS.map((field) => {
          const Icon = field.icon;
          const isSelected = selectedFields.includes(field.id);
          
          return (
            <button
              key={field.id}
              onClick={() => handleSelect(() => toggleField(field.id))}
              className={`p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                isSelected
                  ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-yellow-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md'
              }`}
            >
              <Icon className={`w-8 h-8 mx-auto mb-3 ${
                isSelected ? 'text-orange-600' : 'text-gray-600'
              }`} />
              <h3 className={`font-semibold ${
                isSelected ? 'text-orange-800' : 'text-gray-800'
              }`}>
                {field.name}
              </h3>
            </button>
          );
        })}
      </div>

      {selectedFields.length > 0 && (
        <div className="text-center animate-in slide-in-from-top-2">
          <button
            onClick={() => handleConfirm(() => setCurrentStep('topics'))}
            className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Doorgaan naar Technologie Onderwerpen
          </button>
        </div>
      )}
    </div>
  );

  const renderTopicSelection = () => (
    <div className="animate-in slide-in-from-bottom-2">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Welk technologie onderwerp interesseert je?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Kies één of meerdere technologie onderwerpen waar je meer over wilt leren in ethische context.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {TECH_TOPICS.map((topic) => {
          const Icon = topic.icon;
          const isSelected = selectedTopics.includes(topic.id);
          
          return (
            <button
              key={topic.id}
              onClick={() => handleSelect(() => toggleTopic(topic.id))}
              className={`p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                isSelected
                  ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-yellow-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md'
              }`}
            >
              <Icon className={`w-8 h-8 mx-auto mb-3 ${
                isSelected ? 'text-orange-600' : 'text-gray-600'
              }`} />
              <h3 className={`font-semibold ${
                isSelected ? 'text-orange-800' : 'text-gray-800'
              }`}>
                {topic.name}
              </h3>
            </button>
          );
        })}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => handleNavigation(() => setCurrentStep('fields'))}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          Terug
        </button>
        {selectedTopics.length > 0 && (
          <button
            onClick={() => handleConfirm(() => generateTitles())}
            disabled={isLoading}
            className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? 'Genereren...' : 'Genereer Casus Titels'}
          </button>
        )}
      </div>
    </div>
  );

  const renderTitleSelection = () => (
    <div className="animate-in slide-in-from-bottom-2">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Kies een Casus Titel
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Selecteer een titel die je interesseert, of genereer een willekeurige casus zonder specifieke titel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {caseTitles.map((caseTitle, index) => (
          <button
            key={index}
            onClick={() => handleSelect(() => {
              setSelectedTitle(caseTitle.title);
              generateCase(caseTitle.title);
            })}
            disabled={isLoading}
            className="p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-orange-300 hover:shadow-md transition-all duration-200 hover:scale-105 text-left disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <h3 className="font-semibold text-gray-800 mb-2">{caseTitle.title}</h3>
            <p className="text-gray-600 text-sm mb-2">{caseTitle.description}</p>
            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
              {caseTitle.techTopic}
            </span>
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => handleNavigation(() => setCurrentStep('topics'))}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          Terug
        </button>
        <button
          onClick={() => handleConfirm(() => generateCase())}
          disabled={isLoading}
          className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? 'Genereren...' : 'Genereer Willekeurige Casus'}
        </button>
      </div>
    </div>
  );

  const renderCase = () => (
    <div className="animate-in slide-in-from-bottom-2">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Ethische Casus
        </h2>
        {selectedTitle && (
          <h3 className="text-xl font-semibold text-orange-600 mb-4">
            "{selectedTitle}"
          </h3>
        )}
        <p className="text-gray-600 max-w-2xl mx-auto">
          Lees de casus door en ga naar de volgende stap om de ethische dimensies te verkennen.
        </p>
      </div>

      {selectedCase && (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {selectedCase.case}
            </div>
          </div>
          
          {selectedCase.stakeholders && selectedCase.stakeholders.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Belanghebbenden:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCase.stakeholders.map((stakeholder, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-800 mb-2">{stakeholder.role}</h5>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Belangen:</strong> {stakeholder.interests}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Perspectief:</strong> {stakeholder.perspective}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-center gap-4">
        <button
          onClick={() => handleNavigation(() => setCurrentStep('titles'))}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          Terug
        </button>
        <button
          onClick={() => handleConfirm(() => setCurrentStep('dimensions'))}
          className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Verken Ethische Dimensies
        </button>
      </div>
    </div>
  );

  const renderDimensionSelection = () => (
    <div className="animate-in slide-in-from-bottom-2">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Welke ethische dimensies zijn relevant?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Selecteer de ethische spanningsvelden die volgens jou het meest relevant zijn voor deze casus.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {ETHICAL_DIMENSIONS.map((dimension) => {
          const Icon = dimension.icon;
          const isSelected = selectedDimensions.includes(dimension.id);
          const isCorrect = selectedCase?.correctDimensions.includes(dimension.id);
          
          return (
            <button
              key={dimension.id}
              onClick={() => {
                if (isSelected) {
                  handleDeselect(() => toggleDimension(dimension.id));
                } else {
                  handleSelect(() => toggleDimension(dimension.id));
                }
              }}
              className={`p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                isSelected
                  ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-yellow-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md'
              }`}
            >
              <Icon className={`w-8 h-8 mx-auto mb-3 ${
                isSelected ? 'text-orange-600' : 'text-gray-600'
              }`} />
              <h3 className={`font-semibold text-sm ${
                isSelected ? 'text-orange-800' : 'text-gray-800'
              }`}>
                {dimension.name}
              </h3>
            </button>
          );
        })}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => handleNavigation(() => setCurrentStep('case'))}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          Terug
        </button>
        {selectedDimensions.length > 0 && (
          <button
            onClick={() => handleConfirm(() => expandCase())}
            disabled={isLoading}
            className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? 'Uitbreiden...' : 'Breid Casus Uit'}
          </button>
        )}
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="animate-in slide-in-from-bottom-2">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Uitgebreide Ethische Casus
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Hier is de uitgebreide versie van de casus, aangepast aan de door jou geselecteerde ethische dimensies.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-8 max-w-4xl mx-auto">
        <div className="prose prose-lg max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {expandedCase}
          </div>
        </div>
      </div>

      {selectedCase && (
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl shadow-lg p-8 mb-8 max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Jouw Analyse vs. Expert Analyse</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Jouw geselecteerde dimensies:</h4>
              <div className="space-y-2">
                {selectedDimensions.map(dimId => {
                  const dimension = ETHICAL_DIMENSIONS.find(d => d.id === dimId);
                  const isCorrect = selectedCase.correctDimensions.includes(dimId);
                  return (
                    <div key={dimId} className={`flex items-center gap-2 p-2 rounded ${
                      isCorrect ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        isCorrect ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                      {dimension?.name}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Expert analyse:</h4>
              <div className="space-y-2">
                {selectedCase.correctDimensions.map((dimId, index) => {
                  const dimension = ETHICAL_DIMENSIONS.find(d => d.id === dimId);
                  const wasSelected = selectedDimensions.includes(dimId);
                  return (
                    <div key={dimId} className="space-y-1">
                      <div className={`flex items-center gap-2 p-2 rounded ${
                        wasSelected ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          wasSelected ? 'bg-green-500' : 'bg-orange-500'
                        }`} />
                        {dimension?.name}
                      </div>
                      <p className="text-sm text-gray-600 ml-4">
                        {selectedCase.explanations[index]}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={() => handleConfirm(() => resetToStart())}
          className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Nieuwe Casus Genereren
        </button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'fields':
        return renderFieldSelection();
      case 'topics':
        return renderTopicSelection();
      case 'titles':
        return renderTitleSelection();
      case 'case':
        return renderCase();
      case 'dimensions':
        return renderDimensionSelection();
      case 'results':
        return renderResults();
      default:
        return renderFieldSelection();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-400 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Casus Columbus</h1>
                <p className="text-sm text-gray-600">Ethiek & Technologie Navigator</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {selectedCase && (
                <button
                  onClick={() => handleConfirm(() => resetToStart())}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <RotateCcw className="w-4 h-4" />
                  Opnieuw
                </button>
              )}
              
              <button
                onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                className="p-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                title={isSoundEnabled ? 'Geluid uitschakelen' : 'Geluid inschakelen'}
              >
                {isSoundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 animate-in slide-in-from-top-2">
            <p className="font-medium">Fout:</p>
            <p>{error}</p>
          </div>
        )}

        {renderCurrentStep()}
      </main>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-sm mx-4 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">Bezig met genereren...</p>
            <p className="text-gray-500 text-sm mt-2">Dit kan even duren</p>
          </div>
        </div>
      )}
    </div>
  );
}