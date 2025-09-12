import React, { useState, useEffect } from 'react';
import { Compass, Users, Brain, Shield, Zap, Eye, BookOpen, Building, Heart, Scale, Globe, Gavel, ChevronRight, ChevronLeft, RotateCcw, Sparkles, CheckCircle, XCircle, Clock, User, Target, Lightbulb, ArrowRight, Home, FileText, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { playSelectSound, playDeselectSound, playConfirmSound, playNavigationSound, soundEffects } from './utils/soundEffects';

// Types
interface Stakeholder {
  role: string;
  interests: string;
  perspective: string;
}

interface CaseData {
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

// Professional field options
const PROFESSIONAL_FIELDS = [
  { id: 'education', label: 'Onderwijs', icon: BookOpen },
  { id: 'healthcare', label: 'Gezondheidszorg', icon: Heart },
  { id: 'business', label: 'Bedrijfsleven', icon: Building },
  { id: 'government', label: 'Overheid', icon: Scale },
  { id: 'legal', label: 'Juridisch', icon: Gavel },
  { id: 'media', label: 'Media & Communicatie', icon: Globe }
];

// Technology topic options
const TECH_TOPICS = [
  { id: 'ai', label: 'Kunstmatige Intelligentie', icon: Brain },
  { id: 'data-privacy', label: 'Data & Privacy', icon: Shield },
  { id: 'digital-transformation', label: 'Digitale Transformatie', icon: Zap },
  { id: 'cybersecurity', label: 'Cybersecurity', icon: Shield },
  { id: 'automation', label: 'Automatisering', icon: Zap },
  { id: 'surveillance', label: 'Toezicht & Monitoring', icon: Eye }
];

// Ethical dimensions with Dutch labels and descriptions
const ETHICAL_DIMENSIONS = [
  { 
    id: 'relationships', 
    label: 'Relatie tussen mensen', 
    icon: Users,
    description: 'Hoe technologie menselijke relaties en sociale verbindingen beïnvloedt'
  },
  { 
    id: 'privacy', 
    label: 'Privacy & gegevensbescherming', 
    icon: Shield,
    description: 'Bescherming van persoonlijke informatie en privacy rechten'
  },
  { 
    id: 'accessibility', 
    label: 'Toegankelijkheid & inclusiviteit', 
    icon: Heart,
    description: 'Zorgen dat technologie voor iedereen toegankelijk en bruikbaar is'
  },
  { 
    id: 'autonomy', 
    label: 'Autonomie & manipulatie', 
    icon: User,
    description: 'Behoud van menselijke keuzevrijheid en bescherming tegen manipulatie'
  },
  { 
    id: 'responsibility', 
    label: 'Verantwoordelijkheid & aansprakelijkheid', 
    icon: Scale,
    description: 'Wie is verantwoordelijk wanneer technologie schade veroorzaakt'
  },
  { 
    id: 'sustainability', 
    label: 'Duurzaamheid & milieu-impact', 
    icon: Globe,
    description: 'Milieu-effecten en duurzaamheid van technologische oplossingen'
  },
  { 
    id: 'bias', 
    label: 'Bias & discriminatie', 
    icon: Target,
    description: 'Voorkomen van vooroordelen en discriminatie in technologische systemen'
  },
  { 
    id: 'transparency', 
    label: 'Transparantie & uitlegbaarheid', 
    icon: Eye,
    description: 'Begrijpelijkheid en openheid over hoe technologie werkt'
  },
  { 
    id: 'oversight', 
    label: 'Menselijk toezicht & controle', 
    icon: Users,
    description: 'Behoud van menselijke controle over geautomatiseerde systemen'
  },
  { 
    id: 'wellbeing', 
    label: 'Sociaal welzijn & psychologie', 
    icon: Heart,
    description: 'Impact op mentale gezondheid en maatschappelijk welzijn'
  },
  { 
    id: 'culture', 
    label: 'Culturele & sociale impact', 
    icon: Globe,
    description: 'Effecten op cultuur, tradities en sociale structuren'
  },
  { 
    id: 'legal', 
    label: 'Internationale & juridische implicaties', 
    icon: Gavel,
    description: 'Juridische aspecten en internationale regelgeving'
  }
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
  const [error, setError] = useState<string>('');
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [caseTitles, setCaseTitles] = useState<CaseTitle[]>([]);
  const [selectedCaseTitle, setSelectedCaseTitle] = useState<string>('');
  const [showTitles, setShowTitles] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sound toggle effect
  useEffect(() => {
    soundEffects.toggleSounds(soundEnabled);
  }, [soundEnabled]);

  // Navigation functions
  const goToStep = (step: number) => {
    if (soundEnabled) playNavigationSound();
    setCurrentStep(step);
    setError('');
  };

  const nextStep = () => {
    if (soundEnabled) playNavigationSound();
    setCurrentStep(prev => prev + 1);
    setError('');
  };

  const prevStep = () => {
    if (soundEnabled) playNavigationSound();
    setCurrentStep(prev => prev - 1);
    setError('');
  };

  const resetApp = () => {
    if (soundEnabled) playNavigationSound();
    setCurrentStep(1);
    setSelectedFields([]);
    setSelectedTopics([]);
    setSelectedDimensions([]);
    setCaseData(null);
    setExpandedCase('');
    setShowResults(false);
    setScore(0);
    setFeedback([]);
    setCaseTitles([]);
    setSelectedCaseTitle('');
    setShowTitles(false);
    setError('');
  };

  // Selection handlers
  const toggleField = (fieldId: string) => {
    if (soundEnabled) {
      if (selectedFields.includes(fieldId)) {
        playDeselectSound();
      } else {
        playSelectSound();
      }
    }
    setSelectedFields(prev => 
      prev.includes(fieldId) 
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const toggleTopic = (topicId: string) => {
    if (soundEnabled) {
      if (selectedTopics.includes(topicId)) {
        playDeselectSound();
      } else {
        playSelectSound();
      }
    }
    setSelectedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const toggleDimension = (dimensionId: string) => {
    if (soundEnabled) {
      if (selectedDimensions.includes(dimensionId)) {
        playDeselectSound();
      } else {
        playSelectSound();
      }
    }
    setSelectedDimensions(prev => 
      prev.includes(dimensionId) 
        ? prev.filter(id => id !== dimensionId)
        : [...prev, dimensionId]
    );
  };

  // API calls
  const generateTitles = async () => {
    if (selectedFields.length === 0 || selectedTopics.length === 0) {
      setError('Selecteer eerst vakgebieden en technologie onderwerpen');
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
          allTopics: TECH_TOPICS.map(t => t.label)
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCaseTitles(data.caseTitles || []);
      setShowTitles(true);
    } catch (error) {
      console.error('Error generating titles:', error);
      setError('Er is een fout opgetreden bij het genereren van casus titels. Probeer het opnieuw.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateCase = async () => {
    if (selectedFields.length === 0 || selectedTopics.length === 0) {
      setError('Selecteer eerst vakgebieden en technologie onderwerpen');
      return;
    }

    setIsLoading(true);
    setError('');

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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCaseData(data);
      nextStep();
    } catch (error) {
      console.error('Error generating case:', error);
      setError('Er is een fout opgetreden bij het genereren van de casus. Probeer het opnieuw.');
    } finally {
      setIsLoading(false);
    }
  };

  const expandCase = async () => {
    if (!caseData || selectedDimensions.length === 0) {
      setError('Selecteer eerst ethische dimensies');
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
            ETHICAL_DIMENSIONS.find(d => d.id === id)?.label || id
          )
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setExpandedCase(data.expandedCase);
      nextStep();
    } catch (error) {
      console.error('Error expanding case:', error);
      setError('Er is een fout opgetreden bij het uitbreiden van de casus. Probeer het opnieuw.');
    } finally {
      setIsLoading(false);
    }
  };

  const checkAnswers = () => {
    if (!caseData) return;

    if (soundEnabled) playConfirmSound();

    const correctAnswers = caseData.correctDimensions;
    const userAnswers = selectedDimensions;
    
    const correctSelections = userAnswers.filter(answer => correctAnswers.includes(answer));
    const incorrectSelections = userAnswers.filter(answer => !correctAnswers.includes(answer));
    const missedAnswers = correctAnswers.filter(answer => !userAnswers.includes(answer));
    
    const totalCorrect = correctAnswers.length;
    const userCorrect = correctSelections.length;
    const penalty = incorrectSelections.length;
    
    const calculatedScore = Math.max(0, Math.round(((userCorrect - penalty) / totalCorrect) * 100));
    
    setScore(calculatedScore);
    
    const newFeedback = [];
    if (correctSelections.length > 0) {
      newFeedback.push(`✅ Correct geïdentificeerd: ${correctSelections.map(id => 
        ETHICAL_DIMENSIONS.find(d => d.id === id)?.label || id
      ).join(', ')}`);
    }
    
    if (incorrectSelections.length > 0) {
      newFeedback.push(`❌ Niet relevant voor deze casus: ${incorrectSelections.map(id => 
        ETHICAL_DIMENSIONS.find(d => d.id === id)?.label || id
      ).join(', ')}`);
    }
    
    if (missedAnswers.length > 0) {
      newFeedback.push(`⚠️ Gemist: ${missedAnswers.map(id => 
        ETHICAL_DIMENSIONS.find(d => d.id === id)?.label || id
      ).join(', ')}`);
    }
    
    setFeedback(newFeedback);
    setShowResults(true);
  };

  // Render functions
  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8 space-x-2">
      {[1, 2, 3, 4, 5].map((step) => (
        <div key={step} className="flex items-center">
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
              step === currentStep 
                ? 'bg-gradient-to-r from-orange-500 to-yellow-400 text-white shadow-lg' 
                : step < currentStep 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white/20 text-white/60 backdrop-blur-sm'
            }`}
          >
            {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
          </div>
          {step < 5 && (
            <ChevronRight className={`w-4 h-4 mx-2 ${
              step < currentStep ? 'text-green-500' : 'text-white/40'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="animate-in">
      <div className="text-center mb-8">
        <Compass className="w-16 h-16 mx-auto mb-4 text-orange-500" />
        <h2 className="text-3xl font-bold text-white mb-4">Welkom bij Casus Columbus</h2>
        <p className="text-white/80 text-lg max-w-2xl mx-auto">
          Ontdek ethische dilemma's in de technologie. Selecteer eerst je vakgebied(en) om relevante casussen te genereren.
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Users className="w-6 h-6 mr-3 text-orange-500" />
          Selecteer je vakgebied(en)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {PROFESSIONAL_FIELDS.map((field) => {
            const Icon = field.icon;
            const isSelected = selectedFields.includes(field.id);
            
            return (
              <button
                key={field.id}
                onClick={() => toggleField(field.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-yellow-400 border-orange-400 text-white shadow-lg'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40'
                }`}
              >
                <Icon className="w-8 h-8 mx-auto mb-3" />
                <div className="font-medium">{field.label}</div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-white/60 text-sm">
            {selectedFields.length > 0 && `${selectedFields.length} vakgebied${selectedFields.length > 1 ? 'en' : ''} geselecteerd`}
          </div>
          <button
            onClick={nextStep}
            disabled={selectedFields.length === 0}
            className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            Volgende
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="animate-in">
      <div className="text-center mb-8">
        <Brain className="w-16 h-16 mx-auto mb-4 text-orange-500" />
        <h2 className="text-3xl font-bold text-white mb-4">Technologie Onderwerpen</h2>
        <p className="text-white/80 text-lg max-w-2xl mx-auto">
          Kies de technologie onderwerpen die je interesseren voor je ethische casus.
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Zap className="w-6 h-6 mr-3 text-orange-500" />
          Selecteer technologie onderwerp(en)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {TECH_TOPICS.map((topic) => {
            const Icon = topic.icon;
            const isSelected = selectedTopics.includes(topic.id);
            
            return (
              <button
                key={topic.id}
                onClick={() => toggleTopic(topic.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-yellow-400 border-orange-400 text-white shadow-lg'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40'
                }`}
              >
                <Icon className="w-8 h-8 mx-auto mb-3" />
                <div className="font-medium text-center">{topic.label}</div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={prevStep}
            className="bg-white/10 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition-all duration-300 flex items-center"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Vorige
          </button>
          
          <div className="text-white/60 text-sm">
            {selectedTopics.length > 0 && `${selectedTopics.length} onderwerp${selectedTopics.length > 1 ? 'en' : ''} geselecteerd`}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={generateTitles}
              disabled={selectedFields.length === 0 || selectedTopics.length === 0 || isLoading}
              className="bg-white/10 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Genereren...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Casus Titels
                </>
              )}
            </button>
            
            <button
              onClick={generateCase}
              disabled={selectedFields.length === 0 || selectedTopics.length === 0 || isLoading}
              className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Genereren...
                </>
              ) : (
                <>
                  Casus Genereren
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Case Titles Modal */}
      {showTitles && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Kies een Casus Titel</h3>
              <button
                onClick={() => setShowTitles(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid gap-4 mb-6">
              {caseTitles.map((caseTitle, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedCaseTitle(caseTitle.title);
                    if (soundEnabled) playSelectSound();
                  }}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-300 hover:scale-[1.02] ${
                    selectedCaseTitle === caseTitle.title
                      ? 'bg-gradient-to-r from-orange-500 to-yellow-400 border-orange-400 text-white shadow-lg'
                      : 'bg-white/50 border-gray-200 text-gray-800 hover:bg-white/70 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold mb-2">{caseTitle.title}</div>
                  <div className={`text-sm ${selectedCaseTitle === caseTitle.title ? 'text-white/90' : 'text-gray-600'}`}>
                    {caseTitle.description}
                  </div>
                  <div className={`text-xs mt-2 ${selectedCaseTitle === caseTitle.title ? 'text-white/70' : 'text-gray-500'}`}>
                    Onderwerp: {caseTitle.techTopic}
                  </div>
                </button>
              ))}
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => setShowTitles(false)}
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition-all duration-300"
              >
                Annuleren
              </button>
              
              <button
                onClick={() => {
                  setShowTitles(false);
                  generateCase();
                }}
                disabled={!selectedCaseTitle || isLoading}
                className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Genereren...
                  </>
                ) : (
                  <>
                    Genereer Casus
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200">
          {error}
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="animate-in">
      <div className="text-center mb-8">
        <FileText className="w-16 h-16 mx-auto mb-4 text-orange-500" />
        <h2 className="text-3xl font-bold text-white mb-4">Jouw Ethische Casus</h2>
        <p className="text-white/80 text-lg max-w-2xl mx-auto">
          Lees de casus aandachtig door en identificeer de ethische dimensies die relevant zijn.
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8">
        <div className="bg-white/20 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">Casus Beschrijving</h3>
          <div className="text-white/90 leading-relaxed whitespace-pre-wrap">
            {caseData?.case}
          </div>
        </div>

        {caseData?.stakeholders && caseData.stakeholders.length > 0 && (
          <div className="bg-white/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Users className="w-6 h-6 mr-3 text-orange-500" />
              Belanghebbenden
            </h3>
            <div className="grid gap-4">
              {caseData.stakeholders.map((stakeholder, index) => (
                <div key={index} className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">{stakeholder.role}</h4>
                  <p className="text-white/80 text-sm mb-2">
                    <strong>Belangen:</strong> {stakeholder.interests}
                  </p>
                  <p className="text-white/80 text-sm">
                    <strong>Perspectief:</strong> {stakeholder.perspective}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={prevStep}
          className="bg-white/10 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition-all duration-300 flex items-center"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Vorige
        </button>
        
        <button
          onClick={nextStep}
          className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center"
        >
          Ethische Dimensies
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="animate-in">
      <div className="text-center mb-8">
        <Target className="w-16 h-16 mx-auto mb-4 text-orange-500" />
        <h2 className="text-3xl font-bold text-white mb-4">Ethische Dimensies</h2>
        <p className="text-white/80 text-lg max-w-2xl mx-auto">
          Selecteer de ethische dimensies die volgens jou relevant zijn voor deze casus.
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Lightbulb className="w-6 h-6 mr-3 text-orange-500" />
          Selecteer relevante ethische dimensies
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {ETHICAL_DIMENSIONS.map((dimension) => {
            const Icon = dimension.icon;
            const isSelected = selectedDimensions.includes(dimension.id);
            
            return (
              <button
                key={dimension.id}
                onClick={() => toggleDimension(dimension.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 text-left ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-yellow-400 border-orange-400 text-white shadow-lg'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40'
                }`}
              >
                <Icon className="w-6 h-6 mb-3 text-current" />
                <div className="font-medium mb-2">{dimension.label}</div>
                <div className={`text-sm ${isSelected ? 'text-white/90' : 'text-white/70'}`}>
                  {dimension.description}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={prevStep}
            className="bg-white/10 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition-all duration-300 flex items-center"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Vorige
          </button>
          
          <div className="text-white/60 text-sm">
            {selectedDimensions.length > 0 && `${selectedDimensions.length} dimensie${selectedDimensions.length > 1 ? 's' : ''} geselecteerd`}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={checkAnswers}
              disabled={selectedDimensions.length === 0}
              className="bg-white/10 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Controleer Antwoorden
            </button>
            
            <button
              onClick={expandCase}
              disabled={selectedDimensions.length === 0 || isLoading}
              className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uitbreiden...
                </>
              ) : (
                <>
                  Casus Uitbreiden
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results Modal */}
      {showResults && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto custom-scrollbar">
            <div className="text-center mb-6">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}>
                <span className="text-3xl font-bold text-white">{score}%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Jouw Score</h3>
              <p className="text-gray-600">
                {score >= 80 ? 'Uitstekend! Je hebt de ethische dimensies goed geïdentificeerd.' :
                 score >= 60 ? 'Goed gedaan! Er zijn nog enkele dimensies die je gemist hebt.' :
                 'Er is ruimte voor verbetering. Bekijk de feedback hieronder.'}
              </p>
            </div>
            
            <div className="space-y-4 mb-6">
              {feedback.map((item, index) => (
                <div key={index} className="p-4 bg-gray-100 rounded-lg">
                  <p className="text-gray-800">{item}</p>
                </div>
              ))}
            </div>

            {caseData && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-800 mb-3">Uitleg van de correcte dimensies:</h4>
                <div className="space-y-2">
                  {caseData.explanations.map((explanation, index) => (
                    <div key={index} className="text-blue-700 text-sm">
                      <strong>{ETHICAL_DIMENSIONS.find(d => d.id === caseData.correctDimensions[index])?.label}:</strong> {explanation}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowResults(false)}
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition-all duration-300"
              >
                Sluiten
              </button>
              
              <button
                onClick={() => {
                  setShowResults(false);
                  expandCase();
                }}
                disabled={isLoading}
                className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uitbreiden...
                  </>
                ) : (
                  <>
                    Casus Uitbreiden
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200">
          {error}
        </div>
      )}
    </div>
  );

  const renderStep5 = () => (
    <div className="animate-in">
      <div className="text-center mb-8">
        <Sparkles className="w-16 h-16 mx-auto mb-4 text-orange-500" />
        <h2 className="text-3xl font-bold text-white mb-4">Uitgebreide Casus</h2>
        <p className="text-white/80 text-lg max-w-2xl mx-auto">
          Hier is je uitgebreide ethische casus, klaar voor discussie en analyse.
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8">
        <div className="bg-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Uitgebreide Casus</h3>
          <div className="text-white/90 leading-relaxed whitespace-pre-wrap">
            {expandedCase}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={prevStep}
          className="bg-white/10 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition-all duration-300 flex items-center"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Vorige
        </button>
        
        <button
          onClick={resetApp}
          className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Nieuwe Casus
        </button>
      </div>
    </div>
  );

  return (
    <div 
      className="min-h-screen w-full"
      style={{
        backgroundImage: 'url(/schutblad-opening.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="min-h-screen bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Compass className="w-12 h-12 text-orange-500 mr-4" />
              <h1 className="text-4xl font-bold text-white">Casus Columbus</h1>
            </div>
            <p className="text-white/80 text-lg">Ethiek & Technologie Casus Generator</p>
            
            {/* Sound Toggle */}
            <div className="flex items-center justify-center mt-4">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span className="text-sm">{soundEnabled ? 'Geluid aan' : 'Geluid uit'}</span>
              </button>
            </div>
          </div>

          {/* Step Indicator */}
          {renderStepIndicator()}

          {/* Main Content */}
          <div className="max-w-6xl mx-auto">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            {currentStep === 5 && renderStep5()}
          </div>

          {/* Footer */}
          <div className="text-center mt-16 text-white/60">
            <p className="text-sm">
              Ontwikkeld voor ethische reflectie op technologische ontwikkelingen
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;