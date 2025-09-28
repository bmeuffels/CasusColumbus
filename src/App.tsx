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
  const [currentPage, setCurrentPage] = useState<'selection' | 'titles' | 'compass' | 'stakeholders'>('selection');
  const [isExpandingCase, setIsExpandingCase] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [generatedFeedback, setGeneratedFeedback] = useState<{[key: string]: string}>({});
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

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
    if (showFeedback) return;
    
    setSelectedDimensions(prev => {
      if (prev.includes(dimensionId)) {
        if (!isMuted) playDeselectSound();
        return prev.filter(id => id !== dimensionId);
      } else {
        if (!isMuted) playSelectSound();
        return [...prev, dimensionId];
      }
    });
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
    } finally {
      setIsGeneratingTitles(false);
    }
  };

  const generateCaseFromTitle = async (selectedTitle: string, techTopic: string) => {
    if (selectedFields.length === 0 || selectedTopics.length === 0) return;

    if (!isMuted) playNavigationSound();
    setSelectedDimensions([]);
    setShowFeedback(false);
    setGeneratedFeedback({});

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
      setCurrentPage('compass');
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
      setCurrentPage('compass');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateReflectiveFeedback = async () => {
    if (!result || selectedDimensions.length === 0) return;
    
    setIsGeneratingFeedback(true);
    
    try {
      const response = await fetch('/api/generate-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caseContent: result.case,
          selectedDimensions: selectedDimensions,
          stakeholders: result.stakeholders
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGeneratedFeedback(data.feedback);
      setShowFeedback(true);
    } catch (error) {
      console.error('Error generating feedback:', error);
      setShowFeedback(true);
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const expandCase = async () => {
    if (!result) return;

    if (!isMuted) playNavigationSound();
    setIsExpandingCase(true);

    try {
      const response = await fetch('/api/expand-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          compactCase: result.case,
          selectedDimensions: selectedDimensions.map(id => 
            ETHICAL_DIMENSIONS.find(d => d.id === id)?.name
          ).filter(Boolean)
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(prev => prev ? {
        ...prev,
        expandedCase: data.expandedCase,
        stakeholders: data.stakeholders || prev.stakeholders
      } : null);
      setCurrentPage('stakeholders');
    } catch (error) {
      console.error('Error expanding case:', error);
    } finally {
      setIsExpandingCase(false);
    }
  };

  const resetApp = () => {
    setSelectedFields([]);
    setSelectedTopics([]);
    setSelectedDimensions([]);
    setCaseTitles([]);
    setSelectedCaseTitle(null);
    setResult(null);
    setCurrentPage('selection');
    setShowFeedback(false);
    setGeneratedFeedback({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Casus Columbus</h1>
                <p className="text-sm text-gray-300">Ethiek & Technologie Navigator</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                title={isMuted ? "Geluid aanzetten" : "Geluid uitzetten"}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              
              {currentPage !== 'selection' && (
                <button
                  onClick={resetApp}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Opnieuw</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'selection' && (
          <div className="space-y-12">
            {/* Work Fields Selection */}
            <div className="text-center space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-4">Kies je vakgebied</h2>
                <p className="text-gray-300 text-lg">Selecteer maximaal 2 vakgebieden die het beste bij je situatie passen</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {WORK_FIELDS.map((field) => (
                  <button
                    key={field.id}
                    onClick={() => toggleField(field.id)}
                    disabled={!selectedFields.includes(field.id) && selectedFields.length >= 2}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                      selectedFields.includes(field.id)
                        ? `bg-gradient-to-br ${field.color} border-white/30 shadow-lg scale-105`
                        : selectedFields.length >= 2
                        ? 'bg-white/5 border-gray-600 opacity-50 cursor-not-allowed'
                        : 'bg-white/10 border-gray-500 hover:border-white/50 hover:bg-white/15'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${selectedFields.includes(field.id) ? 'bg-white/20' : 'bg-white/10'}`}>
                        {field.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{field.name}</h3>
                        <p className="text-sm opacity-90">{field.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tech Topics Selection */}
            <div className="text-center space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-4">Kies een technologie onderwerp</h2>
                <p className="text-gray-300 text-lg">Selecteer het technologie onderwerp dat je wilt verkennen</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {TECH_TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => toggleTopic(topic.id)}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                      selectedTopics.includes(topic.id)
                        ? `bg-gradient-to-br ${topic.color} border-white/30 shadow-lg scale-105`
                        : 'bg-white/10 border-gray-500 hover:border-white/50 hover:bg-white/15'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${selectedTopics.includes(topic.id) ? 'bg-white/20' : 'bg-white/10'}`}>
                        {topic.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{topic.name}</h3>
                        <p className="text-sm opacity-90">{topic.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            {selectedFields.length > 0 && selectedTopics.length > 0 && (
              <div className="text-center">
                <button
                  onClick={generateCase}
                  disabled={isGeneratingTitles}
                  className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGeneratingTitles ? (
                    <>
                      <RefreshCw className="w-6 h-6 animate-spin" />
                      <span>Casussen genereren...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      <span>Genereer Casussen</span>
                      <ChevronRight className="w-6 h-6" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {currentPage === 'titles' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Kies een casus</h2>
              <p className="text-gray-300 text-lg">Selecteer de casus die je het meest interessant vindt</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {caseTitles.map((caseTitle, index) => (
                <button
                  key={index}
                  onClick={() => generateCaseFromTitle(caseTitle.title, caseTitle.techTopic)}
                  disabled={isGenerating}
                  className="p-6 bg-white/10 hover:bg-white/15 rounded-xl border border-gray-500 hover:border-white/50 transition-all duration-300 text-left group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full text-xs font-medium">
                          {caseTitle.techTopic}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-orange-300 transition-colors">
                        {caseTitle.title}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {caseTitle.description}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-300 transition-colors ml-4 flex-shrink-0" />
                  </div>
                </button>
              ))}
            </div>

            {isGenerating && (
              <div className="text-center py-8">
                <div className="inline-flex items-center space-x-3 px-6 py-3 bg-white/10 rounded-lg">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Casus wordt gegenereerd...</span>
                </div>
              </div>
            )}
          </div>
        )}

        {currentPage === 'compass' && result && (
          <div className="space-y-8">
            {/* Short Case Display */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-orange-400" />
                Korte casus
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-200 leading-relaxed text-lg">
                  {result.case}
                </p>
              </div>
            </div>

            {/* Moral Compass */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Brain className="w-6 h-6 mr-3 text-orange-400" />
                Moreel Kompas
              </h2>
              <p className="text-gray-300 mb-6">
                Selecteer de ethische spanningsvelden die volgens jou het meest relevant zijn voor deze casus:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {ETHICAL_DIMENSIONS.map((dimension) => (
                  <button
                    key={dimension.id}
                    onClick={() => toggleDimension(dimension.id)}
                    disabled={showFeedback}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                      selectedDimensions.includes(dimension.id)
                        ? `bg-gradient-to-br ${dimension.color} border-white/30 shadow-lg`
                        : showFeedback
                        ? 'bg-white/5 border-gray-600 opacity-50 cursor-not-allowed'
                        : 'bg-white/5 border-gray-500 hover:border-white/50 hover:bg-white/10'
                    }`}
                  >
                    <h3 className="font-semibold mb-2">{dimension.name}</h3>
                    <p className="text-sm opacity-90">{dimension.description}</p>
                  </button>
                ))}
              </div>

              {/* Show Feedback Button */}
              {selectedDimensions.length > 0 && !showFeedback && (
                <div className="text-center mb-6">
                  <button
                    onClick={generateReflectiveFeedback}
                    disabled={isGeneratingFeedback}
                    className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingFeedback ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Feedback genereren...</span>
                      </>
                    ) : (
                      <>
                        <Lightbulb className="w-5 h-5" />
                        <span>Toon feedback</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Feedback Display */}
              {showFeedback && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                    Reflectieve feedback
                  </h3>
                  
                  {selectedDimensions.map((dimensionId) => {
                    const dimension = ETHICAL_DIMENSIONS.find(d => d.id === dimensionId);
                    const feedback = generatedFeedback[dimensionId];
                    
                    return (
                      <div key={dimensionId} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h4 className="font-semibold text-orange-300 mb-2">
                          {dimension?.name}
                        </h4>
                        <p className="text-gray-200 leading-relaxed">
                          {feedback || "Feedback wordt geladen..."}
                        </p>
                      </div>
                    );
                  })}

                  <div className="text-center pt-6">
                    <button
                      onClick={expandCase}
                      disabled={isExpandingCase}
                      className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isExpandingCase ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          <span>Uitbreiden...</span>
                        </>
                      ) : (
                        <>
                          <Users className="w-5 h-5" />
                          <span>Naar belanghebbenden</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {currentPage === 'stakeholders' && result && (
          <div className="space-y-8">
            {/* Expanded Case */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-orange-400" />
                Uitgebreide casus
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-200 leading-relaxed text-lg">
                  {result.expandedCase || result.case}
                </p>
              </div>
            </div>

            {/* Stakeholders */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Users className="w-6 h-6 mr-3 text-orange-400" />
                Belanghebbenden
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result.stakeholders.map((stakeholder, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <UserCheck className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-orange-300 mb-2">
                          {stakeholder.role}
                        </h3>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium text-gray-300">Belangen:</span>
                            <p className="text-gray-200 text-sm">{stakeholder.interests}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-300">Perspectief:</span>
                            <p className="text-gray-200 text-sm">{stakeholder.perspective}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;