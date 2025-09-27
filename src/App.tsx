import { ChevronRight, RotateCcw, Users, CheckCircle, AlertCircle, Lightbulb, ArrowLeft, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { playSelectSound, playDeselectSound, playConfirmSound, playNavigationSound } from './utils/soundEffects';
import { useState as useDebugState } from 'react';
import { 
  Brain, 
  Laptop, 
  Shield, 
  Heart, 
  GraduationCap, 
  Building, 
  Scale, 
  Briefcase,
  Zap,
  Globe,
  Database,
  Eye,
  ArrowRight,
  FileText,
  UserCheck,
  RefreshCw
} from 'lucide-react';
import { useState } from 'react';

interface WorkField {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

interface TechTopic {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

interface CaseResult {
  case: string;
  compactCase: string;
  expandedCase: string;
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

interface SelectedCaseTitle extends CaseTitle {
  index: number;
}
interface EthicalDimension {
  id: string;
  name: string;
  description: string;
  color: string;
}

const ETHICAL_DIMENSIONS: EthicalDimension[] = [
  {
    id: 'relationships',
    name: 'Relatie tussen mensen',
    description: 'Impact op werkrelaties en klantcontact',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'privacy',
    name: 'Privacy & gegevensbescherming',
    description: 'Verzameling en gebruik van persoonlijke data',
    color: 'from-red-500 to-red-600'
  },
  {
    id: 'accessibility',
    name: 'Toegankelijkheid & inclusiviteit',
    description: 'Gelijke toegang voor alle gebruikers',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'autonomy',
    name: 'Autonomie & manipulatie',
    description: 'Vrijheid van keuze en beïnvloeding',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'responsibility',
    name: 'Verantwoordelijkheid & aansprakelijkheid',
    description: 'Wie is verantwoordelijk bij fouten?',
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'sustainability',
    name: 'Duurzaamheid & milieu-impact',
    description: 'Ecologische voetafdruk van technologie',
    color: 'from-emerald-500 to-emerald-600'
  },
  {
    id: 'bias',
    name: 'Bias & discriminatie',
    description: 'Vooroordelen in algoritmes en data',
    color: 'from-pink-500 to-pink-600'
  },
  {
    id: 'transparency',
    name: 'Transparantie & uitlegbaarheid',
    description: 'Begrijpelijkheid van AI-beslissingen',
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 'oversight',
    name: 'Menselijk toezicht & controle',
    description: 'Mogelijkheid tot ingrijpen en overrulen',
    color: 'from-cyan-500 to-cyan-600'
  },
  {
    id: 'wellbeing',
    name: 'Sociaal welzijn & psychologie',
    description: 'Impact op mentale gezondheid',
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    id: 'culture',
    name: 'Culturele & sociale impact',
    description: 'Invloed op culturele diversiteit',
    color: 'from-teal-500 to-teal-600'
  },
  {
    id: 'legal',
    name: 'Internationale & juridische implicaties',
    description: 'Grensoverschrijdende regelgeving',
    color: 'from-slate-500 to-slate-600'
  }
];

const WORK_FIELDS: WorkField[] = [
  {
    id: 'primary-special-education',
    name: 'Basisonderwijs & Speciaal Onderwijs',
    icon: <GraduationCap className="w-6 h-6" />,
    color: 'from-blue-500 to-indigo-600',
    description: 'Basisscholen, speciale onderwijsinstellingen'
  },
  {
    id: 'secondary-vocational-education',
    name: 'Voortgezet & Middelbaar Beroepsonderwijs',
    icon: <GraduationCap className="w-6 h-6" />,
    color: 'from-blue-600 to-indigo-700',
    description: 'Middelbare scholen, ROC, MBO-instellingen'
  },
  {
    id: 'higher-adult-education',
    name: 'Hoger Onderwijs & Volwasseneneducatie',
    icon: <GraduationCap className="w-6 h-6" />,
    color: 'from-indigo-500 to-blue-600',
    description: 'Universiteiten, HBO, volwasseneneducatie'
  },
  {
    id: 'healthcare',
    name: 'Gezondheidszorg',
    icon: <Heart className="w-6 h-6" />,
    color: 'from-red-500 to-pink-600',
    description: 'Ziekenhuizen, klinieken, zorgverleners'
  },
  {
    id: 'business',
    name: 'Bedrijfsleven',
    icon: <Briefcase className="w-6 h-6" />,
    color: 'from-green-500 to-emerald-600',
    description: 'Corporaties, startups, consultancy'
  },
  {
    id: 'government',
    name: 'Overheid',
    icon: <Building className="w-6 h-6" />,
    color: 'from-purple-500 to-violet-600',
    description: 'Ministeries, gemeenten, publieke sector'
  },
  {
    id: 'legal',
    name: 'Juridisch',
    icon: <Scale className="w-6 h-6" />,
    color: 'from-amber-500 to-orange-600',
    description: 'Advocatuur, rechtspraak, compliance'
  },
  {
    id: 'media',
    name: 'Media & Communicatie',
    icon: <Globe className="w-6 h-6" />,
    color: 'from-cyan-500 to-teal-600',
    description: 'Journalistiek, PR, sociale media'
  },
  {
    id: 'science-innovation',
    name: 'Wetenschap & Innovatie',
    icon: <Brain className="w-6 h-6" />,
    color: 'from-emerald-500 to-teal-600',
    description: 'Onderzoeksinstituten, R&D, innovatiecentra'
  }
];

const TECH_TOPICS: TechTopic[] = [
  {
    id: 'ai',
    name: 'Kunstmatige Intelligentie',
    icon: <Brain className="w-6 h-6" />,
    color: 'from-violet-500 to-purple-600',
    description: 'Machine learning, algoritmes, automatisering'
  },
  {
    id: 'data',
    name: 'Data & Privacy',
    icon: <Database className="w-6 h-6" />,
    color: 'from-blue-500 to-cyan-600',
    description: 'Gegevensbescherming, surveillance, analytics'
  },
  {
    id: 'digital',
    name: 'Digitale Transformatie',
    icon: <Laptop className="w-6 h-6" />,
    color: 'from-indigo-500 to-blue-600',
    description: 'Digitalisering, platforms, cloud computing'
  },
  {
    id: 'security',
    name: 'Cybersecurity',
    icon: <Shield className="w-6 h-6" />,
    color: 'from-red-500 to-rose-600',
    description: 'Beveiliging, hacking, digitale veiligheid'
  },
  {
    id: 'automation',
    name: 'Automatisering',
    icon: <Zap className="w-6 h-6" />,
    color: 'from-yellow-500 to-orange-600',
    description: 'Robotica, IoT, slimme systemen'
  },
  {
    id: 'surveillance',
    name: 'Toezicht & Monitoring',
    icon: <Eye className="w-6 h-6" />,
    color: 'from-gray-500 to-slate-600',
    description: 'Bewaking, tracking, biometrie'
  }
];

function App() {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);
  const [caseTitles, setCaseTitles] = useState<CaseTitle[]>([]);
  const [selectedCaseTitle, setSelectedCaseTitle] = useState<SelectedCaseTitle | null>(null);
  const [isGeneratingTitles, setIsGeneratingTitles] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<CaseResult | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [debugResult, setDebugResult] = useState<string>('');
      }
    } catch (error) {
      setDebugInfo(`❌ Netwerk fout!\n\nDetails:\n${error.message}`);
    }
  };

  const [currentPage, setCurrentPage] = useState<'selection' | 'titles' | 'case' | 'stakeholders'>('selection');
  const [isExpandingCase, setIsExpandingCase] = useState(false);
  // Sync trigger - versie 1.1
  const [showFeedback, setShowFeedback] = useState(false);
  const [requiredSelections, setRequiredSelections] = useState(3);
  const [isMuted, setIsMuted] = useState(false);

  const toggleField = (fieldId: string) => {
    const wasSelected = selectedFields.includes(fieldId);
    setSelectedFields(prev => {
      if (prev.includes(fieldId)) {
        if (!isMuted) playDeselectSound();
        return prev.filter(id => id !== fieldId);
      } else if (prev.length < 2) {
        if (!isMuted) playSelectSound();
        return [...prev, fieldId];
      } else {
        return prev;
      }
    });
    
    // Don't play sound if no change occurred (when limit reached)
    if (!wasSelected && selectedFields.length >= 2) {
      // No sound for blocked selection
    }
  };

  const handleFieldToggle = (fieldId: string) => {
    const wasSelected = selectedFields.includes(fieldId);
    setSelectedFields(prev => {
      if (prev.includes(fieldId)) {
        return prev.filter(id => id !== fieldId);
      } else if (prev.length < 2) {
        return [...prev, fieldId];
      } else {
        return prev;
      }
    });
  };

  const toggleTopic = (topicId: string) => {
    setSelectedTopics(prev => {
      if (prev.includes(topicId)) {
        if (!isMuted) playDeselectSound();
        return prev.filter(id => id !== topicId);
      } else if (prev.length === 0) {
        if (!isMuted) playSelectSound();
        return [topicId];
      } else {
        if (!isMuted) playSelectSound();
        return [topicId];
      }
    });
  };

  const toggleDimension = (dimensionId: string) => {
    if (showFeedback) return; // Prevent changes after feedback is shown
    
    const wasSelected = selectedDimensions.includes(dimensionId);
    setSelectedDimensions(prev => {
      if (prev.includes(dimensionId)) {
        if (!isMuted) playDeselectSound();
        return prev.filter(id => id !== dimensionId);
      } else if (prev.length < requiredSelections) {
        if (!isMuted) playSelectSound();
        return [...prev, dimensionId];
      } else {
        return prev;
      }
    });
  };

  const retryDimensionSelection = () => {
    setSelectedDimensions([]);
    setShowFeedback(false);
  };

  const generateCase = async () => {
    if (selectedFields.length === 0 || selectedTopics.length === 0) return;

    if (!isMuted) playNavigationSound();
    setIsGeneratingTitles(true);

    const selectedFieldNames = selectedFields.map(id => 
      WORK_FIELDS.find(f => f.id === id)?.name
    ).join(', ');

    const selectedTopicNames = selectedTopics.map(id => 
      TECH_TOPICS.find(t => t.id === id)?.name
    ).join(', ');

    try {
      const response = await fetch('/api/generate-titles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          selectedFields: selectedFieldNames.split(', '),
          selectedTopics: selectedTopicNames.split(', '),
          allTopics: TECH_TOPICS.map(t => t.name)
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();
      setCaseTitles(result.caseTitles || []);
      setCurrentPage('titles');
    } catch (error) {
      console.error('Error generating titles:', error);
      // Fallback: go directly to case generation
      await generateCaseFromTitle('Algemene ethische casus', selectedTopicNames);
    } finally {
      setIsGeneratingTitles(false);
    }
  };

  const generateCaseFromTitle = async (selectedTitle: string, techTopic: string) => {
    if (selectedFields.length === 0 || selectedTopics.length === 0) return;

    if (!isMuted) playNavigationSound();
    // Reset compass state for new case
    setSelectedDimensions([]);
    setShowFeedback(false);
    setRequiredSelections(3);

    setIsGenerating(true);

    const selectedFieldNames = selectedFields.map(id => 
      WORK_FIELDS.find(f => f.id === id)?.name
    ).join(', ');

    try {
      const response = await fetch('/api/generate-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          selectedFields: selectedFieldNames.split(', '),
          selectedTopics: [techTopic],
          caseTitle: selectedTitle
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API Error: ${response.status}`);
      }

      const result = await response.json();
      setResult(result);
      setRequiredSelections(result.correctDimensions.length);
      setCurrentPage('case');
    } catch (error) {
      console.error('Error:', error);
      setResult({
        case: `Er is een fout opgetreden bij het genereren van de casus: ${error.message}. Probeer het opnieuw.`,
        compactCase: `Er is een fout opgetreden bij het genereren van de casus: ${error.message}. Probeer het opnieuw.`,
        expandedCase: '',
        correctDimensions: [],
        explanations: [],
        stakeholders: []
      });
      setCurrentPage('case');
    } finally {
      setIsGenerating(false);
    }
  };

  const expandCase = async () => {
    if (!result) return;

    if (!isMuted) playNavigationSound();
    setIsExpandingCase(true);

    // Use correct dimensions instead of user selections
    const correctDimensionNames = result.correctDimensions.map(id => 
      ETHICAL_DIMENSIONS.find(d => d.id === id)?.name
    ).filter(Boolean).join(', ');

    try {
      const response = await fetch('/api/expand-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          compactCase: result.compactCase,
          selectedDimensions: correctDimensionNames.split(', ')
        })
      });

      if (!response.ok) {
        console.error(`API Error: ${response.status}`);
        // Fallback: use original case and continue
        setResult(prev => prev ? {
          ...prev,
          expandedCase: prev.compactCase || prev.case
        } : null);
        setCurrentPage('stakeholders');
        return;
      }

      const expandedResult = await response.json();
      
      if (expandedResult.expandedCase && expandedResult.expandedCase.trim()) {
        setResult(prev => prev ? {
          ...prev,
          expandedCase: expandedResult.expandedCase
        } : null);
      } else {
        // Fallback: use original case if expansion fails
        console.warn('No expanded case received, using original case');
        setResult(prev => prev ? {
          ...prev,
          expandedCase: prev.compactCase || prev.case
        } : null);
      }
      
      setCurrentPage('stakeholders');
    } catch (error) {
      console.error('Error expanding case:', error);
      // Fallback: use original case and continue
      setResult(prev => prev ? {
        ...prev,
        expandedCase: prev.compactCase || prev.case
      } : null);
      setCurrentPage('stakeholders');
    } finally {
      setIsExpandingCase(false);
    }
  };

  const resetForm = () => {
    setSelectedFields([]);
    setSelectedTopics([]);
    setSelectedDimensions([]);
    setCaseTitles([]);
    setSelectedCaseTitle(null);
    setResult(null);
    setShowFeedback(false);
    setRequiredSelections(3);
    setCurrentPage('selection');
  };

  const handleReset = () => {
    if (!isMuted) playNavigationSound();
    resetForm();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="min-h-screen">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: 'url(https://ucb5ea564f8e92f3121e32939587.previews.dropboxusercontent.com/p/thumb/ACta83wQsHX0ZB7jyXRqlMaKWLHo439GXjcgXp7cnNmimOpqQ77W8aF2HbCDe34W9EzK3Wnb_XrMEWpHZYG_o4vWix6kaqN4WmlcLFNuz7pcgAMVq_uK5m9aEeZAFuGksDDCnASyuIBh8LF0_9LvY9dm423h1uqpjL_qqAlkexTRLGRG4tEApkVG4DklvLW5kjoeN4hRHzzG2Zs7eUCZMvgocTNraYpjOr-aIVnMEZEl1ikDioSOqGhKDqekt97dFYShwqp-upiBDrMYGMeWp8H1GQNnADDQuky7HJqmMU2KHFn2BnyZf9DnCUJzemGPryrtzWAZSiD0eVOqoxChqUKzGrpruPRoLDKyp8EFSMu5_REA-46_E3wIbwjtiOW9jn6_avlsDaPpQe8SQDKVdTzi51yT0g9Qs78ZeOLkYSUEMbA401iSmKlvBH7mKYxQJo8B6bwLse9EewH7ZR0ePFCF--VbXnreGGvBvpG-U-9G0hiDnyGfFv-l77eYM0Zl8IuJZOtuSuULDHguqn2tPpIxPKCUl5xLGw182hwlB51n6ScVtqZDt5LYQvF-QJux2emlzSFD7WGecBkJ6pdE2zZO/p.jpeg)'
          }}
        />
        {/* Gradient Overlay */}
        {/* Animated Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 backdrop-blur-xl bg-white/80 border-b border-blue-200/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src="/logo zonder ondertitel.svg"
                  alt="Casus Columbus Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Casus Columbus
                </h1>
                <p className="text-gray-600 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  Ethiek & Technologie Casus Generator voor professionals
                </p>
              </div>
            </div>
            
            {/* Header Buttons */}
            <div className="flex items-center space-x-3">
              {/* Opnieuw Button - Only when selections made */}
              {(selectedFields.length > 0 || selectedTopics.length > 0) && (
                <button
                  onClick={handleReset}
                  className="bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2"
                  title="Opnieuw beginnen"
                >
                  <RotateCcw className="w-4 h-4" />
                  Opnieuw
                </button>
              )}
              
              {/* Mute Button - Always visible */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`w-10 h-10 rounded-lg shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center ${
                  isMuted 
                    ? 'bg-gray-500 hover:bg-gray-600' 
                    : 'bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500'
                }`}
                title={isMuted ? "Geluid aanzetten" : "Geluid uitzetten"}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Debug knop - alleen zichtbaar op hoofdpagina */}
        {currentStep === 'selection' && (
          <div className="fixed bottom-4 right-4">
            <button
              onClick={testAPIKey}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium transition-colors"
            >
              🔧 Test API Key
            </button>
          </div>
        )}
        
        {/* Debug info popup */}
        {showDebugInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">API Key Test Resultaat</h3>
                <button
                  onClick={() => setShowDebugInfo(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ×
                </button>
              </div>
              <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap font-mono">
                {debugInfo}
              </pre>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {currentPage === 'selection' ? (
          <div className="space-y-8">
            {/* Work Fields Selection */}
            <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-lg border border-blue-200/50 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                  <Users className="w-7 h-7 text-blue-600" />
                  Selecteer je vakgebied(en)
                </h2>
                <p className="text-gray-600">Kies maximaal twee vakgebieden die relevant zijn voor je organisatie.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {WORK_FIELDS.map((field) => (
                  <button
                    key={field.id}
                    onClick={() => {
                      const wasSelected = selectedFields.includes(field.id);
                      handleFieldToggle(field.id);
                      
                      // Play appropriate sound based on current state
                      setTimeout(() => {
                        if (wasSelected) {
                          if (!isMuted) playDeselectSound(); // Was selected, now deselected
                        } else {
                          if (!isMuted) playSelectSound(); // Was not selected, now selected
                        }
                      }, 0);
                    }}
                    disabled={!selectedFields.includes(field.id) && selectedFields.length >= 2}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left group hover:scale-105 ${
                      selectedFields.includes(field.id)
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : !selectedFields.includes(field.id) && selectedFields.length >= 2
                        ? 'border-gray-200 bg-gray-100/50 opacity-50 cursor-not-allowed'
                        : 'border-gray-200 bg-white/80 hover:border-blue-300 hover:bg-blue-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${field.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                        {field.icon}
                      </div>
                      {selectedFields.includes(field.id) && (
                        <CheckCircle className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">{field.name}</h3>
                    <p className="text-sm text-gray-600">{field.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Technology Topics Selection */}
            <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-lg border border-blue-200/50 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                  <Laptop className="w-7 h-7 text-indigo-600" />
                  Selecteer technologie onderwerp
                </h2>
                <p className="text-gray-600">Kies één technologisch thema voor je ethische casus.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {TECH_TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => toggleTopic(topic.id)}
                    disabled={!selectedTopics.includes(topic.id) && selectedTopics.length >= 1}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left group hover:scale-105 ${
                      selectedTopics.includes(topic.id)
                        ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                        : !selectedTopics.includes(topic.id) && selectedTopics.length >= 1
                        ? 'border-gray-200 bg-gray-100/50 opacity-50 cursor-not-allowed'
                        : 'border-gray-200 bg-white/80 hover:border-indigo-300 hover:bg-indigo-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${topic.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                        {topic.icon}
                      </div>
                      {selectedTopics.includes(topic.id) && (
                        <CheckCircle className="w-6 h-6 text-indigo-600" />
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">{topic.name}</h3>
                    <p className="text-sm text-gray-600">{topic.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            {selectedFields.length > 0 && selectedTopics.length === 1 && (
              <div className="text-center">
                <button
                  onClick={generateCase}
                  disabled={isGeneratingTitles}
                  className={`inline-flex items-center space-x-3 px-8 py-4 rounded-2xl text-white font-semibold text-lg shadow-xl transition-all duration-300 transform hover:scale-105 ${
                    isGeneratingTitles
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-200'
                  }`}
                >
                  {isGeneratingTitles ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Casus opties worden geladen...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      <span>Toon Casus Opties</span>
                      <ArrowRight className="w-6 h-6" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ) : null}
        
        {currentPage === 'titles' && (
          <div className="space-y-8">
            {/* Case Titles Selection */}
            <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-lg border border-blue-200/50 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                  <FileText className="w-7 h-7 text-blue-600" />
                  Kies je Casus
                </h2>
                <p className="text-gray-600">Selecteer een casus die je interessant lijkt voor verdere uitwerking.</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedFields.map(fieldId => {
                    const field = WORK_FIELDS.find(f => f.id === fieldId);
                    return field ? (
                      <span key={fieldId} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {field.name}
                      </span>
                    ) : null;
                  })}
                  {selectedTopics.map(topicId => {
                    const topic = TECH_TOPICS.find(t => t.id === topicId);
                    return topic ? (
                      <span key={topicId} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                        {topic.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>

              {/* Primary Cases - From Selected Topic */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  Casussen uit jouw gekozen onderwerp
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {caseTitles.slice(0, 6).map((caseTitle, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        const wasSelected = selectedCaseTitle?.index === index;
                        if (wasSelected) {
                          if (!isMuted) playDeselectSound();
                          setSelectedCaseTitle(null);
                        } else {
                          if (!isMuted) playSelectSound();
                          setSelectedCaseTitle({ ...caseTitle, index });
                        }
                      }}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left group hover:scale-105 ${
                        selectedCaseTitle?.index === index
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 bg-white/80 hover:border-blue-300 hover:bg-blue-50/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg group-hover:scale-110 transition-transform">
                          <FileText className="w-6 h-6" />
                        </div>
                        {selectedCaseTitle?.index === index && (
                          <CheckCircle className="w-6 h-6 text-blue-600" />
                        )}
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                          {caseTitle.techTopic}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">{caseTitle.title}</h3>
                      <p className="text-sm text-gray-600">{caseTitle.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Alternative Cases - From Other Topics */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-600" />
                  Verrassende casussen uit andere onderwerpen
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {caseTitles.slice(6, 12).map((caseTitle, index) => (
                    <button
                      key={index + 6}
                      onClick={() => {
                        const wasSelected = selectedCaseTitle?.index === index + 6;
                        if (wasSelected) {
                          if (!isMuted) playDeselectSound();
                          setSelectedCaseTitle(null);
                        } else {
                          if (!isMuted) playSelectSound();
                          setSelectedCaseTitle({ ...caseTitle, index: index + 6 });
                        }
                      }}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left group hover:scale-105 ${
                        selectedCaseTitle?.index === index + 6
                          ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                          : 'border-gray-200 bg-white/80 hover:border-emerald-300 hover:bg-emerald-50/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg group-hover:scale-110 transition-transform">
                          <FileText className="w-6 h-6" />
                        </div>
                        {selectedCaseTitle?.index === index + 6 && (
                          <CheckCircle className="w-6 h-6 text-emerald-600" />
                        )}
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                          {caseTitle.techTopic}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">{caseTitle.title}</h3>
                      <p className="text-sm text-gray-600">{caseTitle.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Loading State */}

            {/* Back Button */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  if (!isMuted) playNavigationSound();
                  setCurrentPage('selection');
                }}
                disabled={isGenerating}
                className="flex items-center space-x-2 px-6 py-3 bg-white/80 hover:bg-white rounded-xl border border-gray-300 hover:border-gray-400 transition-all duration-300 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                <span>Terug naar Selectie</span>
              </button>
              
              {selectedCaseTitle && (
                <button
                  onClick={() => {
                    generateCaseFromTitle(selectedCaseTitle.title, selectedCaseTitle.techTopic);
                  }}
                  disabled={isGenerating}
                  className={`flex items-center space-x-3 px-8 py-4 rounded-2xl text-white font-semibold text-lg shadow-xl transition-all duration-300 transform hover:scale-105 ${
                    isGenerating
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-200'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Casus wordt gegenereerd...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      <span>Kies deze casus</span>
                      <ArrowRight className="w-6 h-6" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
        
        {currentPage === 'case' && (
          <div className="space-y-8">
            {/* Compact Case Description */}
            <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-lg border border-blue-200/50 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                  <FileText className="w-7 h-7 text-blue-600" />
                  Ethische Casus
                </h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedFields.map(fieldId => {
                    const field = WORK_FIELDS.find(f => f.id === fieldId);
                    return field ? (
                      <span key={fieldId} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {field.name}
                      </span>
                    ) : null;
                  })}
                  {selectedTopics.map(topicId => {
                    const topic = TECH_TOPICS.find(t => t.id === topicId);
                    return topic ? (
                      <span key={topicId} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                        {topic.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {result?.compactCase || result?.case}
                </p>
              </div>
            </div>

            {/* Ethical Compass Workflow */}
            <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-lg border border-blue-200/50 p-8 text-center">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
                  <Brain className="w-8 h-8 text-purple-600" />
                  Waar schommelt het morele kompas?
                </h2>
                <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                  Selecteer de <strong>{requiredSelections} ethische spanningsvelden</strong> die volgens jou het meest relevant zijn voor deze casus. 
                  Op basis van je keuze krijg je gerichte feedback en wordt de casus uitgebreid.
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">
                    {selectedDimensions.length}
                  </div>
                  van {requiredSelections} geselecteerd
                </span>
              </div>
            </div>

            {/* Ethical Dimensions Grid */}
            <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-lg border border-blue-200/50 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ETHICAL_DIMENSIONS.map((dimension) => (
                  <button
                    key={dimension.id}
                    onClick={() => toggleDimension(dimension.id)}
                    disabled={showFeedback || (!selectedDimensions.includes(dimension.id) && selectedDimensions.length >= requiredSelections)}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left group hover:scale-105 ${
                      selectedDimensions.includes(dimension.id)
                        ? 'border-purple-500 bg-purple-50 shadow-lg'
                        : showFeedback || (!selectedDimensions.includes(dimension.id) && selectedDimensions.length >= requiredSelections)
                        ? 'border-gray-200 bg-gray-100/50 opacity-50 cursor-not-allowed'
                        : 'border-gray-200 bg-white/80 hover:border-purple-300 hover:bg-purple-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${dimension.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                        <Brain className="w-6 h-6" />
                      </div>
                      {selectedDimensions.includes(dimension.id) && (
                        <CheckCircle className="w-6 h-6 text-purple-600" />
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2 text-sm">{dimension.name}</h3>
                    <p className="text-xs text-gray-600">{dimension.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Section */}
            {showFeedback && result && (
              <div className="backdrop-blur-xl bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl shadow-lg border border-green-200 p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                    <CheckCircle className="w-7 h-7 text-green-600" />
                    Feedback: De Juiste Ethische Spanningsvelden
                  </h2>
                  <p className="text-gray-600">Hier zijn de drie meest relevante ethische dimensies voor deze casus:</p>
                </div>
                
                <div className="space-y-4">
                  {result.correctDimensions.map((dimensionId, index) => {
                    const dimension = ETHICAL_DIMENSIONS.find(d => d.id === dimensionId);
                    const isUserCorrect = selectedDimensions.includes(dimensionId);
                    
                    return dimension ? (
                      <div key={dimensionId} className={`p-6 rounded-2xl border-2 ${
                        isUserCorrect 
                          ? 'border-green-400 bg-green-50' 
                          : 'border-orange-400 bg-orange-50'
                      }`}>
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${dimension.color} text-white shadow-lg`}>
                            {isUserCorrect ? (
                              <CheckCircle className="w-6 h-6" />
                            ) : (
                              <span className="font-bold">{index + 1}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-800">{dimension.name}</h3>
                              {isUserCorrect && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                  ✓ Correct gekozen
                                </span>
                              )}
                            </div>
                            <p className="text-gray-700 text-sm mb-3">{dimension.description}</p>
                            <div className="bg-white/80 p-4 rounded-xl">
                              <h4 className="font-medium text-gray-800 mb-2">Waarom dit relevant is voor deze casus:</h4>
                              <p className="text-gray-700 text-sm">
                                {result.explanations[index] || 'Uitleg wordt geladen...'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
                
                <div className="mt-6 p-4 bg-white/80 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-2">Jouw Score:</h3>
                  <p className="text-gray-700">
                    Je hebt <strong>{selectedDimensions.filter(id => result.correctDimensions.includes(id)).length} van de {requiredSelections}</strong> juiste ethische spanningsvelden geïdentificeerd.
                    {selectedDimensions.filter(id => result.correctDimensions.includes(id)).length === requiredSelections && (
                      <span className="text-green-600 font-medium"> Uitstekend werk! 🎉</span>
                    )}
                    {selectedDimensions.filter(id => result.correctDimensions.includes(id)).length >= Math.floor(requiredSelections * 0.6) && selectedDimensions.filter(id => result.correctDimensions.includes(id)).length < requiredSelections && (
                      <span className="text-orange-600 font-medium"> Goed gedaan! 👍</span>
                    )}
                    {selectedDimensions.filter(id => result.correctDimensions.includes(id)).length < Math.floor(requiredSelections * 0.6) && (
                      <span className="text-red-600 font-medium"> Probeer de casus nog eens goed door te lezen. 🤔</span>
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  if (!isMuted) playNavigationSound();
                  setCurrentPage('titles');
                }}
                className="flex items-center space-x-2 px-6 py-3 bg-white/80 hover:bg-white rounded-xl border border-gray-300 hover:border-gray-400 transition-all duration-300 text-gray-700 hover:text-gray-900"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                <span>Terug naar Casus Titels</span>
              </button>
              
              {selectedDimensions.length === requiredSelections && !showFeedback && (
                <button
                  onClick={() => {
                    if (!isMuted) playConfirmSound();
                    setShowFeedback(true);
                  }}
                  className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Toon Feedback</span>
                </button>
              )}
              
              {showFeedback && (
                <button
                  onClick={() => {
                    if (!isMuted) playSelectSound();
                    retryDimensionSelection();
                  }}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Opnieuw proberen</span>
                </button>
              )}
              
              {showFeedback && (
                <button
                  onClick={() => {
                    if (!isMuted) playNavigationSound();
                    expandCase();
                  }}
                  disabled={isExpandingCase}
                  className={`flex items-center space-x-2 px-8 py-3 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                    isExpandingCase
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                  }`}
                >
                  {isExpandingCase ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Wordt geladen...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Ga naar Belanghebbenden</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
        
        {currentPage === 'stakeholders' && (
          <div className="space-y-8">
            {/* Expanded Case Description */}
            {result && (
              <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-lg border border-blue-200/50 p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                    <FileText className="w-7 h-7 text-blue-600" />
                    Uitgebreide Casus Analyse
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {result?.correctDimensions?.map(dimensionId => {
                      const dimension = ETHICAL_DIMENSIONS.find(d => d.id === dimensionId);
                      return dimension ? (
                        <span key={dimensionId} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                          {dimension.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
                
                {(result.expandedCase || result.compactCase || result.case) ? (
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {result.expandedCase || result.compactCase || result.case}
                    </p>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <p className="text-yellow-800">
                      De casus wordt geladen... Als dit bericht blijft staan, ga dan terug naar de vorige pagina en probeer opnieuw.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Stakeholders */}
            {result?.stakeholders && result.stakeholders.length > 0 && (
              <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-lg border border-blue-200/50 p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                    <UserCheck className="w-7 h-7 text-indigo-600" />
                    Belanghebbenden & Rollen
                  </h2>
                  <p className="text-gray-600">Verschillende perspectieven voor een rijke discussie.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {result.stakeholders.map((stakeholder, index) => (
                    <div key={index} className="bg-white/80 rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 text-lg mb-2">{stakeholder.role}</h3>
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-sm font-medium text-gray-600 mb-1">Belangen:</h4>
                              <p className="text-gray-700 text-sm">{stakeholder.interests}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-600 mb-1">Perspectief:</h4>
                              <p className="text-gray-700 text-sm">{stakeholder.perspective}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  if (!isMuted) playNavigationSound();
                  setCurrentPage('case');
                }}
                className="flex items-center space-x-2 px-6 py-3 bg-white/80 hover:bg-white rounded-xl border border-gray-300 hover:border-gray-400 transition-all duration-300 text-gray-700 hover:text-gray-900"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                <span>Terug naar Casus</span>
              </button>
              <button
                onClick={() => {
                  if (!isMuted) playNavigationSound();
                  resetForm();
                }}
                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                <span>Terug naar Hoofdmenu</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;