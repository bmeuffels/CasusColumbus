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
  const [currentPage, setCurrentPage] = useState<'selection' | 'titles' | 'case' | 'stakeholders'>('selection');
  const [isExpandingCase, setIsExpandingCase] = useState(false);
  // Sync trigger - versie 1.1
  const [showFeedback, setShowFeedback] = useState(false);
  const [requiredSelections, setRequiredSelections] = useState(3);
  const [isMuted, setIsMuted] = useState(false);
  const [reflectionTexts, setReflectionTexts] = useState<string[]>([]);
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
        // Remove reflection text for this dimension
        const dimensionIndex = ETHICAL_DIMENSIONS.findIndex(d => d.id === dimensionId);
        if (dimensionIndex !== -1) {
          const newReflections = [...reflectionTexts];
          newReflections[dimensionIndex] = '';
          setReflectionTexts(newReflections);
        }
        return prev.filter(id => id !== dimensionId);
      } else if (prev.length < requiredSelections) {
        if (!isMuted) playSelectSound();
        // Add reflection text for this dimension
        const dimensionIndex = ETHICAL_DIMENSIONS.findIndex(d => d.id === dimensionId);
        if (dimensionIndex !== -1) {
          const reflectionOptions = [
            "Interessante keuze. Wat zegt dit over jouw blik op de situatie?",
            "Je interpretatie geeft richting aan het gesprek. Hoe zou een ander dit kunnen zien?",
            "Deze invalshoek opent nieuwe perspectieven. Welke nuances zie je hier?",
            "Een waardevolle observatie. Wat maakt dit aspect zo relevant voor jou?",
            "Je keuze toont een specifieke focus. Welke ervaringen liggen hieraan ten grondslag?",
            "Dit perspectief brengt diepte in de discussie. Hoe zou dit doorwerken?",
            "Een doordachte selectie. Wat zou dit betekenen voor de betrokkenen?",
            "Je hebt oog voor dit dilemma. Welke spanning ervaar je hierbij?",
            "Deze dimensie raakt de kern. Hoe balanceer je verschillende belangen hier?",
            "Een relevante invalshoek. Wat zou de langetermijnimpact hiervan zijn?"
          ];
          const newReflections = [...reflectionTexts];
          newReflections[dimensionIndex] = reflectionOptions[Math.floor(Math.random() * reflectionOptions.length)];
          setReflectionTexts(newReflections);
        }
        return [...prev, dimensionId];
      } else {
        return prev;
      }
    });
  };

  const retryDimensionSelection = () => {
    setSelectedDimensions([]);
    setShowFeedback(false);
    setReflectionTexts([]);
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
      // Fallback to showing feedback anyway
      setShowFeedback(true);
    } finally {
      setIsGeneratingFeedback(false);
    }
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
    setReflectionTexts([]);

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

    try {
      const response = await fetch('/api/expand-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shortCase: result.case,
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
    
}