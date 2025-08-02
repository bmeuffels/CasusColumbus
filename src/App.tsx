import React, { useState } from 'react';
import { 
  Users, 
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
  CheckCircle,
  ArrowRight,
  FileText,
  UserCheck,
  Sparkles,
  RefreshCw
} from 'lucide-react';

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
  stakeholders: Array<{
    role: string;
    interests: string;
    perspective: string;
  }>;
}

const WORK_FIELDS: WorkField[] = [
  {
    id: 'education',
    name: 'Onderwijs',
    icon: <GraduationCap className="w-6 h-6" />,
    color: 'from-blue-500 to-indigo-600',
    description: 'Scholen, universiteiten, trainingscentra'
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<CaseResult | null>(null);
  const [showResult, setShowResult] = useState(false);

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

  const generateCase = async () => {
    if (selectedFields.length === 0 || selectedTopics.length === 0) return;

    setIsGenerating(true);
    setShowResult(false);

    const selectedFieldNames = selectedFields.map(id => 
      WORK_FIELDS.find(f => f.id === id)?.name
    ).join(', ');

    const selectedTopicNames = selectedTopics.map(id => 
      TECH_TOPICS.find(t => t.id === id)?.name
    ).join(', ');


    try {
      const response = await fetch('/api/generate-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          selectedFields: selectedFieldNames.split(', '),
          selectedTopics: selectedTopicNames.split(', ')
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API Error: ${response.status}`);
      }

      const result = await response.json();
      setResult(result);
      setShowResult(true);
    } catch (error) {
      console.error('Error:', error);
      setResult({
        case: `Er is een fout opgetreden bij het genereren van de casus: ${error.message}. Probeer het opnieuw.`,
        stakeholders: []
      });
      setShowResult(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setSelectedFields([]);
    setSelectedTopics([]);
    setResult(null);
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/60 via-blue-50/50 to-indigo-50/60"></div>
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
                  src="https://uca40e2e7968751e358787b8514d.previews.dropboxusercontent.com/p/thumb/ACvvuRSMAx1PGgNAvH7JI6U6L7zJo-QsyKJfcIWEydCKrZWOb3ERhhF181olVeYRuoPb1aZvAjUjwhelQoDArC-4fe5DOj070I3-4PerbSgAWxhFjpe-LqKqGpCMQKvfKUdGwkX-m21TNclrkN9sUVgFkv9vVTIh4LB7e-T4h8-KBbpH8UK5hf-iqzQrvNJ1n2JT6t0oUhKBjqBiHCI2Ocfllh6V_1gtI3lbsmF0-j3Uo-KOoPHM8tAlnaXuKXrBhcmOgEkwydjF9EWsbPKnMlpBFwMv3eXoNQ7Ao-idF1weVCli9rRI926K6Sqi3l431vHF_nSGB0F7349V3f0l7MnRQNzSa_M_AP1ZKRwCd9mg4Q/p.jpeg"
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
            
            {(selectedFields.length > 0 || selectedTopics.length > 0 || result) && (
              <button
                onClick={resetForm}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-blue-50 rounded-xl transition-all duration-300 border border-blue-200 hover:border-blue-300"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm font-medium">Opnieuw</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {!showResult ? (
          <div className="space-y-8">
            {/* Work Fields Selection */}
            <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-lg border border-blue-200/50 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                  <Users className="w-7 h-7 text-blue-600" />
                  Selecteer je vakgebied(en)
                </h2>
                <p className="text-gray-600">Kies één of meerdere vakgebieden die relevant zijn voor je organisatie.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {WORK_FIELDS.map((field) => (
                  <button
                    key={field.id}
                    onClick={() => toggleField(field.id)}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left group hover:scale-105 ${
                      selectedFields.includes(field.id)
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
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
                  Selecteer technologie onderwerp(en)
                </h2>
                <p className="text-gray-600">Kies de technologische thema's voor je ethische casus.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {TECH_TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => toggleTopic(topic.id)}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left group hover:scale-105 ${
                      selectedTopics.includes(topic.id)
                        ? 'border-indigo-500 bg-indigo-50 shadow-lg'
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
            {selectedFields.length > 0 && selectedTopics.length > 0 && (
              <div className="text-center">
                <button
                  onClick={generateCase}
                  disabled={isGenerating}
                  className={`inline-flex items-center space-x-3 px-8 py-4 rounded-2xl text-white font-semibold text-lg shadow-xl transition-all duration-300 transform hover:scale-105 ${
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
                      <span>Genereer Ethische Casus</span>
                      <ArrowRight className="w-6 h-6" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Results Display */
          <div className="space-y-8">
            {/* Case Description */}
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
                  {result?.case}
                </p>
              </div>
            </div>

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
                onClick={() => setShowResult(false)}
                className="flex items-center space-x-2 px-6 py-3 bg-white/80 hover:bg-white rounded-xl border border-gray-300 hover:border-gray-400 transition-all duration-300 text-gray-700 hover:text-gray-900"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                <span>Terug naar Selectie</span>
              </button>
              <button
                onClick={generateCase}
                disabled={isGenerating}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Nieuwe Casus Genereren</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;