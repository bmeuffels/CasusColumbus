import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Compass, Users, BookOpen, Building, Shield, Gavel, Newspaper, Brain, Database, Zap, Eye, Cog, Monitor, RotateCcw, Lightbulb, CheckCircle, AlertCircle, Clock, Target, MessageSquare, TrendingUp } from 'lucide-react';
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

// Professional field options
const PROFESSIONAL_FIELDS = [
  { id: 'education', label: 'Onderwijs', icon: BookOpen },
  { id: 'healthcare', label: 'Gezondheidszorg', icon: Users },
  { id: 'business', label: 'Bedrijfsleven', icon: Building },
  { id: 'government', label: 'Overheid', icon: Shield },
  { id: 'legal', label: 'Juridisch', icon: Gavel },
  { id: 'media', label: 'Media & Communicatie', icon: Newspaper }
];

// Technology topics
const TECH_TOPICS = [
  { id: 'ai', label: 'Kunstmatige Intelligentie', icon: Brain },
  { id: 'data-privacy', label: 'Data & Privacy', icon: Database },
  { id: 'digital-transformation', label: 'Digitale Transformatie', icon: Zap },
  { id: 'cybersecurity', label: 'Cybersecurity', icon: Shield },
  { id: 'automation', label: 'Automatisering', icon: Cog },
  { id: 'surveillance', label: 'Toezicht & Monitoring', icon: Monitor }
];

// Ethical dimensions with Dutch labels
const ETHICAL_DIMENSIONS = [
  { id: 'relationships', label: 'Relatie tussen mensen', icon: Users },
  { id: 'privacy', label: 'Privacy & gegevensbescherming', icon: Shield },
  { id: 'accessibility', label: 'Toegankelijkheid & inclusiviteit', icon: Users },
  { id: 'autonomy', label: 'Autonomie & manipulatie', icon: Brain },
  { id: 'responsibility', label: 'Verantwoordelijkheid & aansprakelijkheid', icon: Gavel },
  { id: 'sustainability', label: 'Duurzaamheid & milieu-impact', icon: TrendingUp },
  { id: 'bias', label: 'Bias & discriminatie', icon: AlertCircle },
  { id: 'transparency', label: 'Transparantie & uitlegbaarheid', icon: Eye },
  { id: 'oversight', label: 'Menselijk toezicht & controle', icon: Monitor },
  { id: 'wellbeing', label: 'Sociaal welzijn & psychologie', icon: Users },
  { id: 'culture', label: 'Culturele & sociale impact', icon: Users },
  { id: 'legal', label: 'Internationale & juridische implicaties', icon: Gavel }
];

function App() {
  // State management
  const [currentStep, setCurrentStep] = useState<'selection' | 'titles' | 'case' | 'compass' | 'expanded'>('selection');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [caseTitles, setCaseTitles] = useState<CaseTitle[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<string>('');
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);
  const [expandedCase, setExpandedCase] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Handle field selection
  const handleFieldToggle = (fieldId: string) => {
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

  // Handle topic selection
  const handleTopicToggle = (topicId: string) => {
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

  // Generate case titles
  const generateTitles = async () => {
    if (selectedFields.length === 0 || selectedTopics.length === 0) {
      setError('Selecteer minimaal één vakgebied en één technologie onderwerp');
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
          selectedFields: selectedFields.map(id => PROFESSIONAL_FIELDS.find(f => f.id === id)?.label).filter(Boolean),
          selectedTopics: selectedTopics.map(id => TECH_TOPICS.find(t => t.id === id)?.label).filter(Boolean),
          allTopics: TECH_TOPICS.map(t => t.label)
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCaseTitles(data.caseTitles || []);
      setCurrentStep('titles');
      playNavigationSound();
    } catch (error) {
      console.error('Error generating titles:', error);
      setError('Er is een fout opgetreden bij het genereren van de casus titels. Probeer het opnieuw.');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate case from title
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
          selectedFields: selectedFields.map(id => PROFESSIONAL_FIELDS.find(f => f.id === id)?.label).filter(Boolean),
          selectedTopics: selectedTopics.map(id => TECH_TOPICS.find(t => t.id === id)?.label).filter(Boolean),
          caseTitle: caseTitle || selectedTitle
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCaseData(data);
      setCurrentStep('compass');
      playNavigationSound();
    } catch (error) {
      console.error('Error generating case:', error);
      setError('Er is een fout opgetreden bij het genereren van de casus. Probeer het opnieuw.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle title selection
  const handleTitleSelect = (title: string) => {
    setSelectedTitle(title);
    playSelectSound();
    generateCase(title);
  };

  // Handle dimension selection
  const handleDimensionToggle = (dimensionId: string) => {
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

  // Expand case
  const expandCase = async () => {
    if (!caseData || selectedDimensions.length === 0) {
      setError('Selecteer minimaal één ethisch spanningsveld');
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
            ETHICAL_DIMENSIONS.find(d => d.id === id)?.label
          ).filter(Boolean)
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setExpandedCase(data.expandedCase);
      setCurrentStep('expanded');
      playNavigationSound();
    } catch (error) {
      console.error('Error expanding case:', error);
      setError('Er is een fout opgetreden bij het uitbreiden van de casus. Probeer het opnieuw.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to start
  const resetToStart = () => {
    setCurrentStep('selection');
    setSelectedFields([]);
    setSelectedTopics([]);
    setCaseTitles([]);
    setSelectedTitle('');
    setCaseData(null);
    setSelectedDimensions([]);
    setExpandedCase('');
    setError('');
    playNavigationSound();
  };

  // Get correct dimensions for feedback
  const getCorrectDimensions = () => {
    if (!caseData) return [];
    return caseData.correctDimensions || [];
  };

  // Calculate feedback
  const calculateFeedback = () => {
    const correctDimensions = getCorrectDimensions();
    const selected = selectedDimensions;
    
    const correctlySelected = selected.filter(dim => correctDimensions.includes(dim));
    const incorrectlySelected = selected.filter(dim => !correctDimensions.includes(dim));
    const missed = correctDimensions.filter(dim => !selected.includes(dim));
    
    return {
      correctlySelected,
      incorrectlySelected,
      missed,
      totalCorrect: correctDimensions.length,
      totalSelected: selected.length
    };
  };

  // Render selection step
  const renderSelectionStep = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Compass className="w-12 h-12 text-orange-500 mr-4" />
            <h1 className="text-4xl font-bold text-gray-800">Casus Columbus</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ontdek ethische dilemma's in de technologie. Selecteer je vakgebied en technologie onderwerp om een gepersonaliseerde casus te genereren.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Professional Fields */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <Users className="w-6 h-6 mr-3 text-orange-500" />
              Vakgebied
            </h2>
            <div className="space-y-3">
              {PROFESSIONAL_FIELDS.map((field) => {
                const Icon = field.icon;
                const isSelected = selectedFields.includes(field.id);
                return (
                  <button
                    key={field.id}
                    onClick={() => handleFieldToggle(field.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{field.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Technology Topics */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <Brain className="w-6 h-6 mr-3 text-yellow-500" />
              Technologie Onderwerp
            </h2>
            <div className="space-y-3">
              {TECH_TOPICS.map((topic) => {
                const Icon = topic.icon;
                const isSelected = selectedTopics.includes(topic.id);
                return (
                  <button
                    key={topic.id}
                    onClick={() => handleTopicToggle(topic.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center ${
                      isSelected
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                        : 'border-gray-200 hover:border-yellow-300 hover:bg-yellow-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{topic.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={generateTitles}
            disabled={isLoading || selectedFields.length === 0 || selectedTopics.length === 0}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Genereren...
              </>
            ) : (
              <>
                Genereer Casus Titels
                <ChevronRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Render titles step
  const renderTitlesStep = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Kies een Casus</h1>
          <p className="text-lg text-gray-600">
            Selecteer een van de gegenereerde casussen of laat er willekeurig een genereren
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 mb-8">
          {caseTitles.map((caseTitle, index) => (
            <button
              key={index}
              onClick={() => handleTitleSelect(caseTitle.title)}
              disabled={isLoading}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-left border-2 border-transparent hover:border-orange-300 disabled:opacity-50"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{caseTitle.title}</h3>
              <p className="text-gray-600 mb-3">{caseTitle.description}</p>
              <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                {caseTitle.techTopic}
              </span>
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentStep('selection')}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Terug naar selectie
          </button>

          <button
            onClick={() => generateCase()}
            disabled={isLoading}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 disabled:opacity-50 flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Genereren...
              </>
            ) : (
              <>
                Willekeurige Casus
                <ChevronRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Render compass step
  const renderCompassStep = () => {
    if (!caseData) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Morele Kompas</h1>
            <p className="text-lg text-gray-600">
              Lees de casus en selecteer de ethische spanningsvelden die je herkent
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Case Description */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <BookOpen className="w-6 h-6 mr-3 text-orange-500" />
                Casus
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {caseData.case}
                </p>
              </div>
            </div>

            {/* Stakeholders */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <Users className="w-6 h-6 mr-3 text-yellow-500" />
                Belanghebbenden
              </h2>
              <div className="space-y-4">
                {caseData.stakeholders.map((stakeholder, index) => (
                  <div key={index} className="border-l-4 border-orange-300 pl-4">
                    <h3 className="font-semibold text-gray-800">{stakeholder.role}</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Belangen:</strong> {stakeholder.interests}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Perspectief:</strong> {stakeholder.perspective}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ethical Dimensions */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <Compass className="w-6 h-6 mr-3 text-orange-500" />
              Ethische Spanningsvelden
            </h2>
            <p className="text-gray-600 mb-6">
              Selecteer de ethische dimensies die volgens jou relevant zijn voor deze casus:
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ETHICAL_DIMENSIONS.map((dimension) => {
                const Icon = dimension.icon;
                const isSelected = selectedDimensions.includes(dimension.id);
                return (
                  <button
                    key={dimension.id}
                    onClick={() => handleDimensionToggle(dimension.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-2" />
                    <span className="font-medium text-sm">{dimension.label}</span>
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
              <ChevronLeft className="w-5 h-5 mr-2" />
              Terug naar titels
            </button>

            <button
              onClick={expandCase}
              disabled={isLoading || selectedDimensions.length === 0}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 disabled:opacity-50 flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Uitbreiden...
                </>
              ) : (
                <>
                  Bekijk Uitgebreide Casus
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render expanded step
  const renderExpandedStep = () => {
    const feedback = calculateFeedback();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Uitgebreide Casus & Reflectie</h1>
            <p className="text-lg text-gray-600">
              Bekijk de uitgebreide casus en reflecteer op je keuzes
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Expanded Case */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <BookOpen className="w-6 h-6 mr-3 text-orange-500" />
                Uitgebreide Casus
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {expandedCase}
                </p>
              </div>
            </div>

            {/* Reflection Feedback */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <MessageSquare className="w-6 h-6 mr-3 text-yellow-500" />
                Reflectieve Feedback
              </h2>
              
              <div className="space-y-6">
                {/* Correctly Selected */}
                {feedback.correctlySelected.length > 0 && (
                  <div className="border-l-4 border-green-400 pl-4">
                    <h3 className="font-semibold text-green-700 flex items-center mb-2">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Goed herkend ({feedback.correctlySelected.length})
                    </h3>
                    <div className="space-y-2">
                      {feedback.correctlySelected.map((dimId, index) => {
                        const dimension = ETHICAL_DIMENSIONS.find(d => d.id === dimId);
                        const explanationIndex = caseData?.correctDimensions.indexOf(dimId) || 0;
                        const explanation = caseData?.explanations[explanationIndex];
                        return (
                          <div key={dimId} className="bg-green-50 p-3 rounded-lg">
                            <p className="font-medium text-green-800">{dimension?.label}</p>
                            {explanation && (
                              <p className="text-sm text-green-700 mt-1">{explanation}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Missed Dimensions */}
                {feedback.missed.length > 0 && (
                  <div className="border-l-4 border-blue-400 pl-4">
                    <h3 className="font-semibold text-blue-700 flex items-center mb-2">
                      <Lightbulb className="w-5 h-5 mr-2" />
                      Overweeg ook ({feedback.missed.length})
                    </h3>
                    <div className="space-y-2">
                      {feedback.missed.map((dimId, index) => {
                        const dimension = ETHICAL_DIMENSIONS.find(d => d.id === dimId);
                        const explanationIndex = caseData?.correctDimensions.indexOf(dimId) || 0;
                        const explanation = caseData?.explanations[explanationIndex];
                        return (
                          <div key={dimId} className="bg-blue-50 p-3 rounded-lg">
                            <p className="font-medium text-blue-800">{dimension?.label}</p>
                            {explanation && (
                              <p className="text-sm text-blue-700 mt-1">{explanation}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Incorrectly Selected */}
                {feedback.incorrectlySelected.length > 0 && (
                  <div className="border-l-4 border-orange-400 pl-4">
                    <h3 className="font-semibold text-orange-700 flex items-center mb-2">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Minder relevant ({feedback.incorrectlySelected.length})
                    </h3>
                    <div className="space-y-2">
                      {feedback.incorrectlySelected.map((dimId) => {
                        const dimension = ETHICAL_DIMENSIONS.find(d => d.id === dimId);
                        return (
                          <div key={dimId} className="bg-orange-50 p-3 rounded-lg">
                            <p className="font-medium text-orange-800">{dimension?.label}</p>
                            <p className="text-sm text-orange-700 mt-1">
                              Deze dimensie is minder direct relevant voor deze specifieke casus.
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Reflection Questions */}
                <div className="border-l-4 border-purple-400 pl-4">
                  <h3 className="font-semibold text-purple-700 flex items-center mb-2">
                    <Target className="w-5 h-5 mr-2" />
                    Reflectievragen
                  </h3>
                  <div className="space-y-2 text-sm text-purple-700">
                    <p>• Welke ethische spanningsvelden vond je het moeilijkst te herkennen?</p>
                    <p>• Hoe zouden verschillende stakeholders deze dilemma's anders benaderen?</p>
                    <p>• Welke afwegingen zijn het belangrijkst in deze situatie?</p>
                    <p>• Hoe zou je deze ethische uitdagingen in de praktijk aanpakken?</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentStep('compass')}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Terug naar kompas
            </button>

            <button
              onClick={resetToStart}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 flex items-center"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Nieuwe Casus
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="min-h-screen">
      {currentStep === 'selection' && renderSelectionStep()}
      {currentStep === 'titles' && renderTitlesStep()}
      {currentStep === 'compass' && renderCompassStep()}
      {currentStep === 'expanded' && renderExpandedStep()}
    </div>
  );
}

export default App;