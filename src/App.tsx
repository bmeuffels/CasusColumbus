import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Building2, 
  Heart, 
  Scale, 
  Newspaper, 
  Users,
  Brain,
  Shield,
  Zap,
  Eye,
  Cog,
  Database,
  ChevronRight,
  Lightbulb,
  CheckCircle,
  XCircle,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  ArrowLeft,
  FileText,
  User,
  Lock,
  Accessibility,
  UserCheck,
  AlertTriangle,
  Leaf,
  Target,
  Search,
  Globe,
  Gavel
} from 'lucide-react';
import { playSelectSound, playDeselectSound, playConfirmSound, playNavigationSound } from './utils/soundEffects';

// Types
interface CaseResult {
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
  { id: 'onderwijs', name: 'Onderwijs', icon: GraduationCap },
  { id: 'gezondheidszorg', name: 'Gezondheidszorg', icon: Heart },
  { id: 'bedrijfsleven', name: 'Bedrijfsleven', icon: Building2 },
  { id: 'overheid', name: 'Overheid', icon: Scale },
  { id: 'juridisch', name: 'Juridisch', icon: Gavel },
  { id: 'media', name: 'Media & Communicatie', icon: Newspaper }
];

const TOPICS = [
  { id: 'ai', name: 'AI & Machine Learning', icon: Brain },
  { id: 'privacy', name: 'Data & Privacy', icon: Database },
  { id: 'digitaal', name: 'Digitale Transformatie', icon: Zap },
  { id: 'security', name: 'Cybersecurity', icon: Shield },
  { id: 'automatisering', name: 'Automatisering', icon: Cog },
  { id: 'toezicht', name: 'Toezicht & Monitoring', icon: Eye }
];

const DIMENSIONS = [
  { id: 'relationships', name: 'Relatie tussen mensen', icon: Users },
  { id: 'privacy', name: 'Privacy & gegevensbescherming', icon: Lock },
  { id: 'accessibility', name: 'Toegankelijkheid & inclusiviteit', icon: Accessibility },
  { id: 'autonomy', name: 'Autonomie & manipulatie', icon: UserCheck },
  { id: 'responsibility', name: 'Verantwoordelijkheid & aansprakelijkheid', icon: AlertTriangle },
  { id: 'sustainability', name: 'Duurzaamheid & milieu-impact', icon: Leaf },
  { id: 'bias', name: 'Bias & discriminatie', icon: Target },
  { id: 'transparency', name: 'Transparantie & uitlegbaarheid', icon: Search },
  { id: 'oversight', name: 'Menselijk toezicht & controle', icon: Eye },
  { id: 'wellbeing', name: 'Sociaal welzijn & psychologie', icon: Heart },
  { id: 'culture', name: 'Culturele & sociale impact', icon: Globe },
  { id: 'legal', name: 'Internationale & juridische implicaties', icon: Scale }
];

function App() {
  // State management
  const [currentStep, setCurrentStep] = useState<'fields' | 'topics' | 'titles' | 'case' | 'dimensions' | 'results' | 'expanded'>('fields');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<string>('');
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);
  const [caseResult, setCaseResult] = useState<CaseResult | null>(null);
  const [expandedCase, setExpandedCase] = useState<ExpandedCase | null>(null);
  const [caseTitles, setCaseTitles] = useState<CaseTitle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Logo component with fallback
  const Logo = () => {
    const [logoError, setLogoError] = useState(false);
    
    if (logoError) {
      // Fallback logo
      return (
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-logo-red-500 to-logo-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
          CC
        </div>
      );
    }
    
    return (
      <img 
        src="/AiVanColumbus.png" 
        alt="AI van Columbus Logo"
        className="w-12 h-12 object-contain"
        onError={() => {
          console.error('Logo failed to load: /AiVanColumbus.png');
          setLogoError(true);
        }}
        onLoad={() => console.log('Logo loaded successfully')}
      />
    );
  };

  // Sound toggle
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    if (soundEnabled) {
      playDeselectSound();
    } else {
      playSelectSound();
    }
  };

  // Selection handlers
  const handleFieldToggle = (fieldId: string) => {
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

  const handleTopicToggle = (topicId: string) => {
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

  const handleDimensionToggle = (dimensionId: string) => {
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
    if (selectedFields.length === 0 || selectedTopics.length === 0) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/generate-titles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedFields,
          selectedTopics,
          allTopics: TOPICS.map(t => t.name)
        })
      });
      
      if (!response.ok) throw new Error('Failed to generate titles');
      
      const data = await response.json();
      setCaseTitles(data.caseTitles || []);
      setCurrentStep('titles');
      if (soundEnabled) playNavigationSound();
    } catch (err) {
      setError('Er is een fout opgetreden bij het genereren van casus titels');
      console.error('Error generating titles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateCase = async () => {
    if (selectedFields.length === 0 || selectedTopics.length === 0) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/generate-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedFields,
          selectedTopics,
          caseTitle: selectedTitle
        })
      });
      
      if (!response.ok) throw new Error('Failed to generate case');
      
      const data = await response.json();
      setCaseResult(data);
      setCurrentStep('case');
      if (soundEnabled) playNavigationSound();
    } catch (err) {
      setError('Er is een fout opgetreden bij het genereren van de casus');
      console.error('Error generating case:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const expandCase = async () => {
    if (!caseResult || selectedDimensions.length === 0) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/expand-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          compactCase: caseResult.compactCase,
          selectedDimensions: selectedDimensions.map(id => 
            DIMENSIONS.find(d => d.id === id)?.name || id
          )
        })
      });
      
      if (!response.ok) throw new Error('Failed to expand case');
      
      const data = await response.json();
      setExpandedCase(data);
      setCurrentStep('expanded');
      if (soundEnabled) playNavigationSound();
    } catch (err) {
      setError('Er is een fout opgetreden bij het uitbreiden van de casus');
      console.error('Error expanding case:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAnswers = () => {
    if (!caseResult) return;
    setCurrentStep('results');
    if (soundEnabled) playConfirmSound();
  };

  const resetApp = () => {
    setCurrentStep('fields');
    setSelectedFields([]);
    setSelectedTopics([]);
    setSelectedTitle('');
    setSelectedDimensions([]);
    setCaseResult(null);
    setExpandedCase(null);
    setCaseTitles([]);
    setError('');
    if (soundEnabled) playNavigationSound();
  };

  const goBack = () => {
    if (soundEnabled) playNavigationSound();
    
    switch (currentStep) {
      case 'topics':
        setCurrentStep('fields');
        break;
      case 'titles':
        setCurrentStep('topics');
        break;
      case 'case':
        setCurrentStep('titles');
        break;
      case 'dimensions':
        setCurrentStep('case');
        break;
      case 'results':
        setCurrentStep('dimensions');
        break;
      case 'expanded':
        setCurrentStep('results');
        break;
    }
  };

  // Auto-generate titles when fields and topics are selected
  useEffect(() => {
    if (selectedFields.length > 0 && selectedTopics.length > 0 && currentStep === 'topics') {
      generateTitles();
    }
  }, [selectedFields, selectedTopics, currentStep]);

  // Render functions
  const renderHeader = () => (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-4 mb-6">
        <Logo />
        <div className="text-left">
          <h1 className="text-3xl font-bold text-gray-800">Casus Columbus</h1>
          <p className="text-lg text-gray-600 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Ethiek & Technologie
          </p>
        </div>
        <button
          onClick={toggleSound}
          className={`p-3 rounded-full transition-all duration-300 ${
            soundEnabled 
              ? 'bg-gradient-to-r from-logo-red-500 to-logo-blue-500 text-white shadow-lg' 
              : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
          }`}
          title={soundEnabled ? 'Geluid uitschakelen' : 'Geluid inschakelen'}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );

  const renderStepIndicator = () => {
    const steps = [
      { id: 'fields', name: 'Vakgebieden', icon: Users },
      { id: 'topics', name: 'Onderwerpen', icon: Brain },
      { id: 'titles', name: 'Casus Keuze', icon: FileText },
      { id: 'case', name: 'Casus', icon: Lightbulb },
      { id: 'dimensions', name: 'Ethiek', icon: Scale },
      { id: 'results', name: 'Resultaten', icon: CheckCircle }
    ];

    const currentIndex = steps.findIndex(step => step.id === currentStep);

    return (
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-2">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = index < currentIndex;
            const isAccessible = index <= currentIndex;

            return (
              <React.Fragment key={step.id}>
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-logo-red-500 to-logo-blue-500 text-white shadow-lg' 
                    : isCompleted 
                      ? 'bg-green-100 text-green-700' 
                      : isAccessible 
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                        : 'bg-gray-50 text-gray-400'
                }`}>
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium hidden sm:inline">{step.name}</span>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  const renderFieldSelection = () => (
    <div className="animate-in">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Selecteer je vakgebied(en)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {FIELDS.map(field => {
          const Icon = field.icon;
          const isSelected = selectedFields.includes(field.id);
          
          return (
            <button
              key={field.id}
              onClick={() => handleFieldToggle(field.id)}
              className={`p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                isSelected
                  ? 'border-logo-red-500 bg-gradient-to-br from-logo-red-50 to-logo-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-logo-red-300 hover:shadow-md'
              }`}
            >
              <Icon className={`w-8 h-8 mx-auto mb-3 ${
                isSelected ? 'text-logo-red-600' : 'text-gray-600'
              }`} />
              <h3 className={`font-semibold ${
                isSelected ? 'text-logo-red-700' : 'text-gray-700'
              }`}>
                {field.name}
              </h3>
            </button>
          );
        })}
      </div>
      
      {selectedFields.length > 0 && (
        <div className="text-center">
          <button
            onClick={() => {
              setCurrentStep('topics');
              if (soundEnabled) playNavigationSound();
            }}
            className="bg-gradient-to-r from-logo-red-500 to-logo-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-logo-red-600 hover:to-logo-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Volgende: Kies Onderwerpen
            <ChevronRight className="w-5 h-5 inline ml-2" />
          </button>
        </div>
      )}
    </div>
  );

  const renderTopicSelection = () => (
    <div className="animate-in">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Terug
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          Selecteer technologie onderwerp(en)
        </h2>
        <div className="w-20"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {TOPICS.map(topic => {
          const Icon = topic.icon;
          const isSelected = selectedTopics.includes(topic.id);
          
          return (
            <button
              key={topic.id}
              onClick={() => handleTopicToggle(topic.id)}
              className={`p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                isSelected
                  ? 'border-logo-blue-500 bg-gradient-to-br from-logo-blue-50 to-logo-teal-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-logo-blue-300 hover:shadow-md'
              }`}
            >
              <Icon className={`w-8 h-8 mx-auto mb-3 ${
                isSelected ? 'text-logo-blue-600' : 'text-gray-600'
              }`} />
              <h3 className={`font-semibold ${
                isSelected ? 'text-logo-blue-700' : 'text-gray-700'
              }`}>
                {topic.name}
              </h3>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderTitleSelection = () => (
    <div className="animate-in">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Terug
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          Kies een casus titel
        </h2>
        <div className="w-20"></div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-logo-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Casus titels worden gegenereerd...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 mb-8">
            {caseTitles.map((caseTitle, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedTitle(caseTitle.title);
                  if (soundEnabled) playSelectSound();
                }}
                className={`p-6 rounded-xl border-2 text-left transition-all duration-300 transform hover:scale-[1.02] ${
                  selectedTitle === caseTitle.title
                    ? 'border-logo-blue-500 bg-gradient-to-br from-logo-blue-50 to-logo-teal-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-logo-blue-300 hover:shadow-md'
                }`}
              >
                <h3 className={`font-bold text-lg mb-2 ${
                  selectedTitle === caseTitle.title ? 'text-logo-blue-700' : 'text-gray-800'
                }`}>
                  {caseTitle.title}
                </h3>
                <p className="text-gray-600 mb-2">{caseTitle.description}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  selectedTitle === caseTitle.title 
                    ? 'bg-logo-blue-100 text-logo-blue-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {caseTitle.techTopic}
                </span>
              </button>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setSelectedTitle('');
                generateCase();
              }}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg"
            >
              Genereer Willekeurige Casus
            </button>
            
            {selectedTitle && (
              <button
                onClick={generateCase}
                className="bg-gradient-to-r from-logo-red-500 to-logo-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-logo-red-600 hover:to-logo-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Genereer Gekozen Casus
                <ChevronRight className="w-5 h-5 inline ml-2" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );

  const renderCase = () => (
    <div className="animate-in">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Terug
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Ethische Casus</h2>
        <div className="w-20"></div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-logo-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Casus wordt gegenereerd...</p>
        </div>
      ) : caseResult ? (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Casus Beschrijving</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {caseResult.case}
            </p>
          </div>

          <div className="bg-gradient-to-br from-logo-blue-50 to-logo-teal-50 p-8 rounded-xl border border-logo-blue-200">
            <h3 className="text-xl font-bold mb-4 text-logo-blue-800">Belanghebbenden</h3>
            <div className="grid gap-4">
              {caseResult.stakeholders.map((stakeholder, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-logo-blue-700 mb-2">{stakeholder.role}</h4>
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

          <div className="text-center">
            <button
              onClick={() => {
                setCurrentStep('dimensions');
                if (soundEnabled) playNavigationSound();
              }}
              className="bg-gradient-to-r from-logo-red-500 to-logo-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-logo-red-600 hover:to-logo-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Identificeer Ethische Dimensies
              <ChevronRight className="w-5 h-5 inline ml-2" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );

  const renderDimensionSelection = () => (
    <div className="animate-in">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Terug
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          Welke ethische dimensies zijn relevant?
        </h2>
        <div className="w-20"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {DIMENSIONS.map(dimension => {
          const Icon = dimension.icon;
          const isSelected = selectedDimensions.includes(dimension.id);
          
          return (
            <button
              key={dimension.id}
              onClick={() => handleDimensionToggle(dimension.id)}
              className={`p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                isSelected
                  ? 'border-logo-red-500 bg-gradient-to-br from-logo-red-50 to-logo-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-logo-red-300 hover:shadow-md'
              }`}
            >
              <Icon className={`w-8 h-8 mx-auto mb-3 ${
                isSelected ? 'text-logo-red-600' : 'text-gray-600'
              }`} />
              <h3 className={`font-semibold text-center ${
                isSelected ? 'text-logo-red-700' : 'text-gray-700'
              }`}>
                {dimension.name}
              </h3>
            </button>
          );
        })}
      </div>

      {selectedDimensions.length > 0 && (
        <div className="text-center">
          <button
            onClick={checkAnswers}
            className="bg-gradient-to-r from-logo-red-500 to-logo-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-logo-red-600 hover:to-logo-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Controleer Antwoorden
            <CheckCircle className="w-5 h-5 inline ml-2" />
          </button>
        </div>
      )}
    </div>
  );

  const renderResults = () => {
    if (!caseResult) return null;

    const correctAnswers = selectedDimensions.filter(dim => 
      caseResult.correctDimensions.includes(dim)
    );
    const incorrectAnswers = selectedDimensions.filter(dim => 
      !caseResult.correctDimensions.includes(dim)
    );
    const missedAnswers = caseResult.correctDimensions.filter(dim => 
      !selectedDimensions.includes(dim)
    );

    const score = Math.round((correctAnswers.length / caseResult.correctDimensions.length) * 100);

    return (
      <div className="animate-in">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Terug
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Resultaten</h2>
          <div className="w-20"></div>
        </div>

        <div className="space-y-6">
          {/* Score */}
          <div className="bg-gradient-to-br from-logo-blue-50 to-logo-teal-50 p-8 rounded-xl border border-logo-blue-200 text-center">
            <h3 className="text-3xl font-bold text-logo-blue-800 mb-2">
              Score: {score}%
            </h3>
            <p className="text-logo-blue-600">
              {correctAnswers.length} van {caseResult.correctDimensions.length} correct geïdentificeerd
            </p>
          </div>

          {/* Correct answers */}
          {correctAnswers.length > 0 && (
            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6" />
                Correct Geïdentificeerd ({correctAnswers.length})
              </h3>
              <div className="space-y-3">
                {correctAnswers.map(dimId => {
                  const dimension = DIMENSIONS.find(d => d.id === dimId);
                  const explanationIndex = caseResult.correctDimensions.indexOf(dimId);
                  const explanation = caseResult.explanations[explanationIndex];
                  
                  return (
                    <div key={dimId} className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-semibold text-green-700 mb-2">
                        {dimension?.name}
                      </h4>
                      <p className="text-sm text-gray-600">{explanation}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Incorrect answers */}
          {incorrectAnswers.length > 0 && (
            <div className="bg-red-50 p-6 rounded-xl border border-red-200">
              <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                <XCircle className="w-6 h-6" />
                Niet Relevant ({incorrectAnswers.length})
              </h3>
              <div className="space-y-2">
                {incorrectAnswers.map(dimId => {
                  const dimension = DIMENSIONS.find(d => d.id === dimId);
                  return (
                    <div key={dimId} className="bg-white p-3 rounded-lg shadow-sm">
                      <span className="font-medium text-red-700">{dimension?.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Missed answers */}
          {missedAnswers.length > 0 && (
            <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
              <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6" />
                Gemist ({missedAnswers.length})
              </h3>
              <div className="space-y-3">
                {missedAnswers.map(dimId => {
                  const dimension = DIMENSIONS.find(d => d.id === dimId);
                  const explanationIndex = caseResult.correctDimensions.indexOf(dimId);
                  const explanation = caseResult.explanations[explanationIndex];
                  
                  return (
                    <div key={dimId} className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-semibold text-yellow-700 mb-2">
                        {dimension?.name}
                      </h4>
                      <p className="text-sm text-gray-600">{explanation}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-center gap-4 pt-6">
            <button
              onClick={() => {
                setSelectedDimensions([...caseResult.correctDimensions]);
                expandCase();
              }}
              className="bg-gradient-to-r from-logo-blue-500 to-logo-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-logo-blue-600 hover:to-logo-teal-600 transition-all duration-300 shadow-lg"
            >
              Uitgebreide Casus Bekijken
            </button>
            
            <button
              onClick={resetApp}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Nieuwe Casus
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderExpandedCase = () => (
    <div className="animate-in">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Terug
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Uitgebreide Casus</h2>
        <div className="w-20"></div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-logo-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Casus wordt uitgebreid...</p>
        </div>
      ) : expandedCase ? (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Uitgebreide Casus Beschrijving</h3>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {expandedCase.expandedCase}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-logo-blue-50 to-logo-teal-50 p-6 rounded-xl border border-logo-blue-200">
            <h3 className="text-lg font-bold text-logo-blue-800 mb-3">Relevante Ethische Dimensies</h3>
            <div className="flex flex-wrap gap-2">
              {selectedDimensions.map(dimId => {
                const dimension = DIMENSIONS.find(d => d.id === dimId);
                return (
                  <span key={dimId} className="bg-logo-blue-100 text-logo-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {dimension?.name}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={resetApp}
              className="bg-gradient-to-r from-logo-red-500 to-logo-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-logo-red-600 hover:to-logo-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 mx-auto"
            >
              <RotateCcw className="w-5 h-5" />
              Nieuwe Casus Starten
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );

  // Error display
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Er is een fout opgetreden</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => {
              setError('');
              resetApp();
            }}
            className="bg-gradient-to-r from-logo-red-500 to-logo-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-logo-red-600 hover:to-logo-blue-600 transition-all duration-300"
          >
            Opnieuw Proberen
          </button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {renderHeader()}
        {renderStepIndicator()}
        
        <div className="bg-white rounded-2xl shadow-xl p-8 custom-scrollbar">
          {currentStep === 'fields' && renderFieldSelection()}
          {currentStep === 'topics' && renderTopicSelection()}
          {currentStep === 'titles' && renderTitleSelection()}
          {currentStep === 'case' && renderCase()}
          {currentStep === 'dimensions' && renderDimensionSelection()}
          {currentStep === 'results' && renderResults()}
          {currentStep === 'expanded' && renderExpandedCase()}
        </div>
      </div>
    </div>
  );
}

export default App;