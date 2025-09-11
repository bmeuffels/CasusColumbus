import { ChevronRight, RotateCcw, Users, CheckCircle, AlertCircle, Lightbulb, ArrowLeft, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { playSelectSound, playDeselectSound, playConfirmSound, playNavigationSound } from './utils/soundEffects';
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

interface ExtraOption {
  type: 'random' | 'url' | 'custom';
  data?: string;
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
  const [currentPage, setCurrentPage] = useState<'selection' | 'titles' | 'case' | 'stakeholders'>('selection');
  const [isExpandingCase, setIsExpandingCase] = useState(false);
  // Sync trigger - versie 1.1
  const [showFeedback, setShowFeedback] = useState(false);
  const [requiredSelections, setRequiredSelections] = useState(3);
  const [isMuted, setIsMuted] = useState(false);
  const [showExtraOptions, setShowExtraOptions] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [customCaseInput, setCustomCaseInput] = useState('');
  const [isProcessingExtra, setIsProcessingExtra] = useState(false);

  const handleRandomCase = async () => {
    if (!caseTitles || caseTitles.length === 0) return;
    
    try {
      if (!isMuted) playSelectSound();
      
      // Select a random case from the generated titles
      const randomIndex = Math.floor(Math.random() * caseTitles.length);
      const randomCase = caseTitles[randomIndex];
      
      // Generate case using the random title
      await generateCaseFromTitle(randomCase.title, randomCase.techTopic);
    } catch (error) {
      console.error('Error selecting random case:', error);
    }
  };

  const handleExtraOption = async (option: ExtraOption) => {
    if (option.type === 'random') {
      await handleRandomCase();
      return;
    }

    setIsProcessingExtra(true);
    
    try {
      if (option.type === 'url' && option.data) {
        // Process URL
        const response = await fetch('/api/process-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: option.data })
        });
        
        if (!response.ok) throw new Error('Failed to process URL');
        
        const result = await response.json();
        await generateCaseFromTitle(result.title, result.techTopic || 'Algemeen');
        
      } else if (option.type === 'custom' && option.data) {
        // Process custom case
        const response = await fetch('/api/process-custom', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customCase: option.data })
        });
        
        if (!response.ok) throw new Error('Failed to process custom case');
        
        const result = await response.json();
        await generateCaseFromTitle(result.title, result.techTopic || 'Algemeen');
      }
    } catch (error) {
      console.error('Error processing extra option:', error);
      // Fallback: generate a general case
      await generateCaseFromTitle('Algemene ethische casus', 'Algemeen');
    } finally {
      setIsProcessingExtra(false);
    }
  };

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
        expandedCase: `Er is een fout opgetreden bij het genereren van de casus: ${error.message}. Probeer het opnieuw.`,
        correctDimensions: [],
        explanations: [],
        stakeholders: []
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: 'url(/Schutblad opening.jpg)' }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-blue-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img 
                  src="/logo zonder ondertitel.svg" 
                  alt="Logo" 
                  className="h-12 w-auto"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Ethiek Kompas</h1>
                  <p className="text-sm text-gray-600">Navigeer door ethische dilemma's in technologie</p>
                </div>
              </div>
              
              {/* Sound Toggle */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                title={isMuted ? "Geluid aanzetten" : "Geluid uitzetten"}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-gray-600" />
                ) : (
                  <Volume2 className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentPage === 'selection' && (
            <div className="space-y-12">
              {/* Hero Section */}
              <div className="text-center space-y-6">
                <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  <span>Interactieve Ethiek Training</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                  Ontdek Ethische Dilemma's in
                  <span className="text-blue-600 block">Jouw Werkveld</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Maak bewuste keuzes en leer navigeren door complexe ethische vraagstukken 
                  in de moderne technologie-gedreven wereld.
                </p>
              </div>

              {/* Work Fields Selection */}
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Kies je werkveld
                  </h3>
                  <p className="text-gray-600">
                    Selecteer maximaal 2 werkvelden die het beste bij jouw situatie passen
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {WORK_FIELDS.map((field) => (
                    <button
                      key={field.id}
                      onClick={() => toggleField(field.id)}
                      disabled={!selectedFields.includes(field.id) && selectedFields.length >= 2}
                      className={`
                        p-6 rounded-xl border-2 transition-all duration-200 text-left
                        ${selectedFields.includes(field.id)
                          ? `bg-gradient-to-r ${field.color} text-white border-transparent shadow-lg transform scale-105`
                          : selectedFields.length >= 2
                          ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-102'
                        }
                      `}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`
                          p-2 rounded-lg
                          ${selectedFields.includes(field.id)
                            ? 'bg-white/20'
                            : 'bg-gray-100'
                          }
                        `}>
                          {field.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-2">{field.name}</h4>
                          <p className={`text-sm ${
                            selectedFields.includes(field.id) ? 'text-white/80' : 'text-gray-600'
                          }`}>
                            {field.description}
                          </p>
                        </div>
                        {selectedFields.includes(field.id) && (
                          <CheckCircle className="w-6 h-6 text-white" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tech Topics Selection */}
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Kies een technologie onderwerp
                  </h3>
                  <p className="text-gray-600">
                    Selecteer het technologie onderwerp dat je wilt verkennen
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {TECH_TOPICS.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => toggleTopic(topic.id)}
                      className={`
                        p-6 rounded-xl border-2 transition-all duration-200 text-left
                        ${selectedTopics.includes(topic.id)
                          ? `bg-gradient-to-r ${topic.color} text-white border-transparent shadow-lg transform scale-105`
                          : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-102'
                        }
                      `}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`
                          p-2 rounded-lg
                          ${selectedTopics.includes(topic.id)
                            ? 'bg-white/20'
                            : 'bg-gray-100'
                          }
                        `}>
                          {topic.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-2">{topic.name}</h4>
                          <p className={`text-sm ${
                            selectedTopics.includes(topic.id) ? 'text-white/80' : 'text-gray-600'
                          }`}>
                            {topic.description}
                          </p>
                        </div>
                        {selectedTopics.includes(topic.id) && (
                          <CheckCircle className="w-6 h-6 text-white" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <div className="text-center">
                <button
                  onClick={generateCase}
                  disabled={selectedFields.length === 0 || selectedTopics.length === 0 || isGeneratingTitles}
                  className={`
                    inline-flex items-center space-x-3 px-8 py-4 rounded-xl text-lg font-semibold
                    transition-all duration-200 transform
                    ${selectedFields.length > 0 && selectedTopics.length > 0 && !isGeneratingTitles
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:scale-105 shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  {isGeneratingTitles ? (
                    <>
                      <RotateCcw className="w-6 h-6 animate-spin" />
                      <span>Casussen genereren...</span>
                    </>
                  ) : (
                    <>
                      <Lightbulb className="w-6 h-6" />
                      <span>Genereer Ethische Casussen</span>
                      <ChevronRight className="w-6 h-6" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {currentPage === 'titles' && (
            <div className="space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    if (!isMuted) playNavigationSound();
                    setCurrentPage('selection');
                  }}
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Terug naar selectie</span>
                </button>
                
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900">Kies je Casus</h2>
                  <p className="text-gray-600 mt-2">Selecteer een ethisch dilemma om te verkennen</p>
                </div>
                
                <div className="w-32"></div> {/* Spacer for centering */}
              </div>

              {/* Case Titles from Selected Topics */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                  <Lightbulb className="w-6 h-6 text-blue-600" />
                  <span>Casussen uit jouw gekozen onderwerp</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {caseTitles.slice(0, 6).map((caseTitle, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (!isMuted) playSelectSound();
                        setSelectedCaseTitle({ ...caseTitle, index });
                        generateCaseFromTitle(caseTitle.title, caseTitle.techTopic);
                      }}
                      className="p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 text-left group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            {caseTitle.techTopic}
                          </span>
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">
                          {caseTitle.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {caseTitle.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Surprising Cases from Other Topics */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  <span>Verrassende casussen uit andere onderwerpen</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {caseTitles.slice(6, 12).map((caseTitle, index) => (
                    <button
                      key={index + 6}
                      onClick={() => {
                        if (!isMuted) playSelectSound();
                        setSelectedCaseTitle({ ...caseTitle, index: index + 6 });
                        generateCaseFromTitle(caseTitle.title, caseTitle.techTopic);
                      }}
                      className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover:border-purple-300 hover:shadow-lg transition-all duration-200 text-left group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                            {caseTitle.techTopic}
                          </span>
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                        </div>
                        <h4 className="font-semibold text-gray-900 group-hover:text-purple-900 transition-colors">
                          {caseTitle.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {caseTitle.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Extra Options */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                  <Users className="w-6 h-6 text-green-600" />
                  <span>Extra mogelijkheden</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Random Case Button */}
                  <button
                    onClick={handleRandomCase}
                    disabled={!caseTitles || caseTitles.length === 0}
                    className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:border-green-300 hover:shadow-lg transition-all duration-200 text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <RefreshCw className="w-8 h-8 text-green-600" />
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                      </div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-green-900 transition-colors">
                        Kies een willekeurige casus
                      </h4>
                      <p className="text-sm text-gray-600">
                        Laat het systeem een casus voor je kiezen uit de gegenereerde opties
                      </p>
                    </div>
                  </button>

                  {/* URL Case Button */}
                  <button
                    onClick={() => setShowExtraOptions(showExtraOptions === 'url' ? false : 'url')}
                    className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 text-left group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Globe className="w-8 h-8 text-blue-600" />
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">
                        Casus uit de actualiteit
                      </h4>
                      <p className="text-sm text-gray-600">
                        Voer een URL in van een nieuwsartikel om een relevante casus te genereren
                      </p>
                    </div>
                  </button>

                  {/* Custom Case Button */}
                  <button
                    onClick={() => setShowExtraOptions(showExtraOptions === 'custom' ? false : 'custom')}
                    className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl border border-orange-200 hover:border-orange-300 hover:shadow-lg transition-all duration-200 text-left group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <FileText className="w-8 h-8 text-orange-600" />
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
                      </div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-orange-900 transition-colors">
                        Beschrijf zelf een casus
                      </h4>
                      <p className="text-sm text-gray-600">
                        Beschrijf je eigen praktijkcasus om een ethische analyse te krijgen
                      </p>
                    </div>
                  </button>
                </div>

                {/* URL Input Form */}
                {showExtraOptions === 'url' && (
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-4">Voer een URL in</h4>
                    <div className="space-y-4">
                      <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://example.com/nieuwsartikel"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleExtraOption({ type: 'url', data: urlInput })}
                          disabled={!urlInput.trim() || isProcessingExtra}
                          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {isProcessingExtra ? 'Verwerken...' : 'Genereer Casus'}
                        </button>
                        <button
                          onClick={() => setShowExtraOptions(false)}
                          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Annuleren
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Custom Case Input Form */}
                {showExtraOptions === 'custom' && (
                  <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                    <h4 className="font-semibold text-gray-900 mb-4">Beschrijf je eigen casus</h4>
                    <div className="space-y-4">
                      <textarea
                        value={customCaseInput}
                        onChange={(e) => setCustomCaseInput(e.target.value)}
                        placeholder="Beschrijf hier je eigen praktijkcasus. Bijvoorbeeld: 'In ons bedrijf willen we AI gebruiken voor het screenen van sollicitatiebrieven, maar we maken ons zorgen over mogelijke discriminatie...'"
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      />
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleExtraOption({ type: 'custom', data: customCaseInput })}
                          disabled={!customCaseInput.trim() || isProcessingExtra}
                          className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {isProcessingExtra ? 'Verwerken...' : 'Genereer Casus'}
                        </button>
                        <button
                          onClick={() => setShowExtraOptions(false)}
                          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Annuleren
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentPage === 'case' && result && (
            <div className="space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    if (!isMuted) playNavigationSound();
                    setCurrentPage('titles');
                  }}
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Terug naar casussen</span>
                </button>
                
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900">Ethische Casus</h2>
                  <p className="text-gray-600 mt-2">Analyseer het dilemma en maak je keuzes</p>
                </div>
                
                <div className="w-32"></div>
              </div>

              {/* Case Content */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-8">
                  <div className="prose prose-lg max-w-none">
                    <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                      {result.case}
                    </div>
                  </div>
                  
                  {/* Expand Case Button */}
                  {result.expandedCase && result.expandedCase !== result.case && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={async () => {
                          if (!isMuted) playSelectSound();
                          setIsExpandingCase(true);
                          
                          try {
                            const response = await fetch('/api/expand-case', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                originalCase: result.case,
                                expandedCase: result.expandedCase
                              })
                            });
                            
                            if (response.ok) {
                              const expandedResult = await response.json();
                              setResult(prev => prev ? { ...prev, case: expandedResult.expandedCase } : null);
                            }
                          } catch (error) {
                            console.error('Error expanding case:', error);
                            // Fallback: use the pre-generated expanded case
                            setResult(prev => prev ? { ...prev, case: result.expandedCase } : null);
                          } finally {
                            setIsExpandingCase(false);
                          }
                        }}
                        disabled={isExpandingCase}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
                      >
                        {isExpandingCase ? (
                          <>
                            <RotateCcw className="w-4 h-4 animate-spin" />
                            <span>Uitbreiden...</span>
                          </>
                        ) : (
                          <>
                            <ArrowRight className="w-4 h-4" />
                            <span>Meer details tonen</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Ethical Compass */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Ethiek Kompas</h3>
                  <p className="text-gray-600">
                    Selecteer {requiredSelections} ethische dimensies die het meest relevant zijn voor deze casus
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {ETHICAL_DIMENSIONS.map((dimension) => (
                    <button
                      key={dimension.id}
                      onClick={() => toggleDimension(dimension.id)}
                      disabled={showFeedback}
                      className={`
                        p-4 rounded-lg border-2 transition-all duration-200 text-left
                        ${selectedDimensions.includes(dimension.id)
                          ? `bg-gradient-to-r ${dimension.color} text-white border-transparent shadow-lg`
                          : showFeedback
                          ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                        }
                      `}
                    >
                      <h4 className="font-semibold mb-2">{dimension.name}</h4>
                      <p className={`text-sm ${
                        selectedDimensions.includes(dimension.id) ? 'text-white/80' : 'text-gray-600'
                      }`}>
                        {dimension.description}
                      </p>
                      {selectedDimensions.includes(dimension.id) && (
                        <CheckCircle className="w-5 h-5 text-white mt-2" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Submit Button */}
                {!showFeedback && (
                  <div className="text-center">
                    <button
                      onClick={() => {
                        if (!isMuted) playConfirmSound();
                        setShowFeedback(true);
                      }}
                      disabled={selectedDimensions.length !== requiredSelections}
                      className={`
                        inline-flex items-center space-x-2 px-8 py-3 rounded-lg font-semibold transition-all duration-200
                        ${selectedDimensions.length === requiredSelections
                          ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }
                      `}
                    >
                      <UserCheck className="w-5 h-5" />
                      <span>Controleer mijn keuzes</span>
                    </button>
                  </div>
                )}

                {/* Feedback */}
                {showFeedback && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="font-semibold text-blue-900 mb-4 flex items-center space-x-2">
                        <Lightbulb className="w-5 h-5" />
                        <span>Jouw analyse</span>
                      </h4>
                      
                      {/* Correct selections */}
                      <div className="space-y-3 mb-6">
                        {selectedDimensions.map((dimensionId, index) => {
                          const dimension = ETHICAL_DIMENSIONS.find(d => d.id === dimensionId);
                          const isCorrect = result.correctDimensions.includes(dimensionId);
                          const explanationIndex = result.correctDimensions.indexOf(dimensionId);
                          
                          return (
                            <div key={dimensionId} className={`
                              p-4 rounded-lg border-2 ${
                                isCorrect 
                                  ? 'bg-green-50 border-green-200' 
                                  : 'bg-red-50 border-red-200'
                              }
                            `}>
                              <div className="flex items-start space-x-3">
                                {isCorrect ? (
                                  <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                                ) : (
                                  <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
                                )}
                                <div className="flex-1">
                                  <h5 className={`font-semibold ${
                                    isCorrect ? 'text-green-900' : 'text-red-900'
                                  }`}>
                                    {dimension?.name}
                                  </h5>
                                  {isCorrect && explanationIndex >= 0 && result.explanations[explanationIndex] && (
                                    <p className="text-green-800 text-sm mt-2">
                                      {result.explanations[explanationIndex]}
                                    </p>
                                  )}
                                  {!isCorrect && (
                                    <p className="text-red-800 text-sm mt-2">
                                      Deze dimensie is minder relevant voor deze specifieke casus.
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Missed important dimensions */}
                      {result.correctDimensions.some(id => !selectedDimensions.includes(id)) && (
                        <div className="mb-6">
                          <h5 className="font-semibold text-orange-900 mb-3">Gemiste belangrijke dimensies:</h5>
                          <div className="space-y-3">
                            {result.correctDimensions
                              .filter(id => !selectedDimensions.includes(id))
                              .map((dimensionId, index) => {
                                const dimension = ETHICAL_DIMENSIONS.find(d => d.id === dimensionId);
                                const explanationIndex = result.correctDimensions.indexOf(dimensionId);
                                
                                return (
                                  <div key={dimensionId} className="p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
                                    <div className="flex items-start space-x-3">
                                      <AlertCircle className="w-6 h-6 text-orange-600 mt-0.5" />
                                      <div className="flex-1">
                                        <h6 className="font-semibold text-orange-900">{dimension?.name}</h6>
                                        {explanationIndex >= 0 && result.explanations[explanationIndex] && (
                                          <p className="text-orange-800 text-sm mt-2">
                                            {result.explanations[explanationIndex]}
                                          </p>
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

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={retryDimensionSelection}
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <RefreshCw className="w-5 h-5" />
                        <span>Probeer opnieuw</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          if (!isMuted) playNavigationSound();
                          setCurrentPage('stakeholders');
                        }}
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Users className="w-5 h-5" />
                        <span>Bekijk stakeholders</span>
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentPage === 'stakeholders' && result && (
            <div className="space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    if (!isMuted) playNavigationSound();
                    setCurrentPage('case');
                  }}
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Terug naar casus</span>
                </button>
                
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900">Stakeholder Analyse</h2>
                  <p className="text-gray-600 mt-2">Begrijp alle betrokken partijen en hun perspectieven</p>
                </div>
                
                <button
                  onClick={() => {
                    if (!isMuted) playNavigationSound();
                    setCurrentPage('selection');
                    setResult(null);
                    setSelectedFields([]);
                    setSelectedTopics([]);
                    setSelectedDimensions([]);
                    setShowFeedback(false);
                    setCaseTitles([]);
                  }}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Nieuwe casus</span>
                </button>
              </div>

              {/* Stakeholders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {result.stakeholders.map((stakeholder, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{stakeholder.role}</h3>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1">Belangen:</h4>
                          <p className="text-gray-600 text-sm">{stakeholder.interests}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1">Perspectief:</h4>
                          <p className="text-gray-600 text-sm">{stakeholder.perspective}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-8">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                    <Lightbulb className="w-4 h-4" />
                    <span>Ethische Reflectie Voltooid</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Je hebt alle perspectieven verkend
                  </h3>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Door de ethische dimensies en stakeholder perspectieven te analyseren, 
                    heb je een diepgaand begrip ontwikkeld van dit complexe dilemma. 
                    Deze holistische benadering helpt bij het maken van weloverwogen beslissingen.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;