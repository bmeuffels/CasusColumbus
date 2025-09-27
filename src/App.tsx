import React, { useState } from 'react';
import { Brain, Users, Building2, Shield, Gavel, Megaphone, Database, Lock, Zap, Bot, Eye, Cog, AlertTriangle } from 'lucide-react';
import { playSelectSound, playDeselectSound, playConfirmSound } from './utils/soundEffects';

interface CaseData {
  title: string;
  description: string;
  context: string;
  dilemma: string;
  stakeholders: Array<{
    name: string;
    role: string;
    interests: string[];
    perspective: string;
  }>;
  questions: string[];
  considerations: string[];
}

const FIELDS = [
  { id: 'education', name: 'Onderwijs', icon: Brain, color: 'from-blue-500 to-blue-600' },
  { id: 'healthcare', name: 'Gezondheidszorg', icon: Users, color: 'from-green-500 to-green-600' },
  { id: 'business', name: 'Bedrijfsleven', icon: Building2, color: 'from-purple-500 to-purple-600' },
  { id: 'government', name: 'Overheid', icon: Shield, color: 'from-red-500 to-red-600' },
  { id: 'legal', name: 'Juridisch', icon: Gavel, color: 'from-yellow-500 to-yellow-600' },
  { id: 'media', name: 'Media & Communicatie', icon: Megaphone, color: 'from-pink-500 to-pink-600' }
];

const TECHNOLOGIES = [
  { id: 'ai', name: 'Kunstmatige Intelligentie', icon: Bot, color: 'from-indigo-500 to-indigo-600' },
  { id: 'data-privacy', name: 'Data & Privacy', icon: Lock, color: 'from-gray-500 to-gray-600' },
  { id: 'digital-transformation', name: 'Digitale Transformatie', icon: Zap, color: 'from-orange-500 to-orange-600' },
  { id: 'cybersecurity', name: 'Cybersecurity', icon: Shield, color: 'from-red-500 to-red-600' },
  { id: 'automation', name: 'Automatisering', icon: Cog, color: 'from-teal-500 to-teal-600' },
  { id: 'surveillance', name: 'Toezicht & Monitoring', icon: Eye, color: 'from-slate-500 to-slate-600' }
];

function App() {
  const [selectedField, setSelectedField] = useState<string>('');
  const [selectedTechnology, setSelectedTechnology] = useState<string>('');
  const [showOptions, setShowOptions] = useState(false);
  const [generatedCase, setGeneratedCase] = useState<CaseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [expandedCase, setExpandedCase] = useState<CaseData | null>(null);
  const [isExpanding, setIsExpanding] = useState(false);

  const handleFieldSelect = (fieldId: string) => {
    if (selectedField === fieldId) {
      setSelectedField('');
      playDeselectSound();
    } else {
      setSelectedField(fieldId);
      playSelectSound();
    }
  };

  const handleTechnologySelect = (techId: string) => {
    if (selectedTechnology === techId) {
      setSelectedTechnology('');
      playDeselectSound();
    } else {
      setSelectedTechnology(techId);
      playSelectSound();
    }
  };

  const handleShowOptions = () => {
    setShowOptions(true);
    playConfirmSound();
  };

  const generateCase = async () => {
    if (!selectedField || !selectedTechnology) {
      setError('Selecteer eerst een vakgebied en technologie');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedCase(null);
    setExpandedCase(null);

    try {
      const response = await fetch('/api/generate-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          field: selectedField,
          technology: selectedTechnology
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setGeneratedCase(data);
      playConfirmSound();
    } catch (error) {
      console.error('Error generating case:', error);
      setError(`Er is een fout opgetreden bij het genereren van de casus: ${error instanceof Error ? error.message : 'Onbekende fout'}. Probeer het opnieuw.`);
    } finally {
      setIsLoading(false);
    }
  };

  const expandCase = async () => {
    if (!generatedCase) return;

    setIsExpanding(true);
    setError('');

    try {
      const response = await fetch('/api/expand-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caseData: generatedCase,
          field: selectedField,
          technology: selectedTechnology
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setExpandedCase(data);
      playConfirmSound();
    } catch (error) {
      console.error('Error expanding case:', error);
      setError(`Er is een fout opgetreden bij het uitbreiden van de casus: ${error instanceof Error ? error.message : 'Onbekende fout'}. Probeer het opnieuw.`);
    } finally {
      setIsExpanding(false);
    }
  };

  const resetApp = () => {
    setSelectedField('');
    setSelectedTechnology('');
    setShowOptions(false);
    setGeneratedCase(null);
    setExpandedCase(null);
    setError('');
    playDeselectSound();
  };

  // Debug function
  const testAPI = async () => {
    try {
      console.log('🔧 Starting API test...');
      
      const response = await fetch('/api/test-api', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('📄 Raw response:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
      }
      
      if (response.ok) {
        alert('✅ SUCCESS!\n\n' + JSON.stringify(data, null, 2));
      } else {
        alert('❌ API Error!\n\n' + JSON.stringify(data, null, 2));
      }
    } catch (error) {
      console.error('🚨 API Test Error:', error);
      alert('❌ Test Failed!\n\nError: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  if (!showOptions) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <img 
              src="/logo zonder ondertitel.svg" 
              alt="Casus Columbus Logo" 
              className="h-32 w-auto mx-auto mb-6"
            />
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
              Casus Columbus
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Ethiek & Technologie Casus Generator
            </p>
            <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
              Ontdek complexe ethische dilemma's op het snijvlak van technologie en maatschappij. 
              Speciaal ontwikkeld voor professionals uit verschillende vakgebieden.
            </p>
          </div>
          
          <button
            onClick={handleShowOptions}
            className="bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Toon casus opties
          </button>
        </div>
        
        {/* Debug button */}
        <button
          onClick={testAPI}
          className="fixed bottom-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium transition-colors"
          title="Test API Key"
        >
          🔧 Test API Key
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <img 
            src="/logo zonder ondertitel.svg" 
            alt="Casus Columbus Logo" 
            className="h-20 w-auto mx-auto mb-4"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Casus Columbus
          </h1>
          <p className="text-gray-600">Ethiek & Technologie Casus Generator</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Field Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Selecteer een vakgebied</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FIELDS.map((field) => {
              const Icon = field.icon;
              const isSelected = selectedField === field.id;
              return (
                <button
                  key={field.id}
                  onClick={() => handleFieldSelect(field.id)}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50 shadow-lg scale-105'
                      : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${field.color} flex items-center justify-center mb-3 mx-auto`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800">{field.name}</h3>
                </button>
              );
            })}
          </div>
        </div>

        {/* Technology Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Selecteer een technologie</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TECHNOLOGIES.map((tech) => {
              const Icon = tech.icon;
              const isSelected = selectedTechnology === tech.id;
              return (
                <button
                  key={tech.id}
                  onClick={() => handleTechnologySelect(tech.id)}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50 shadow-lg scale-105'
                      : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tech.color} flex items-center justify-center mb-3 mx-auto`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800">{tech.name}</h3>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <button
            onClick={generateCase}
            disabled={!selectedField || !selectedTechnology || isLoading}
            className="bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed"
          >
            {isLoading ? 'Genereren...' : 'Genereer Casus'}
          </button>
          
          <button
            onClick={resetApp}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Opnieuw beginnen
          </button>
        </div>

        {/* Generated Case */}
        {generatedCase && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 animate-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{generatedCase.title}</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Beschrijving</h3>
                <p className="text-gray-600 leading-relaxed">{generatedCase.description}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Context</h3>
                <p className="text-gray-600 leading-relaxed">{generatedCase.context}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Ethisch Dilemma</h3>
                <p className="text-gray-600 leading-relaxed">{generatedCase.dilemma}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Discussievragen</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {generatedCase.questions.map((question, index) => (
                    <li key={index}>{question}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={expandCase}
                disabled={isExpanding}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-2 px-4 rounded-lg shadow transform hover:scale-105 transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed"
              >
                {isExpanding ? 'Uitbreiden...' : 'Uitgebreide Analyse'}
              </button>
            </div>
          </div>
        )}

        {/* Expanded Case */}
        {expandedCase && (
          <div className="bg-white rounded-xl shadow-lg p-6 animate-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Uitgebreide Analyse</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Belanghebbenden</h3>
                <div className="grid gap-4">
                  {expandedCase.stakeholders.map((stakeholder, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800">{stakeholder.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{stakeholder.role}</p>
                      <div className="mb-2">
                        <span className="text-sm font-medium text-gray-700">Belangen: </span>
                        <span className="text-sm text-gray-600">{stakeholder.interests.join(', ')}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Perspectief: </span>
                        <span className="text-sm text-gray-600">{stakeholder.perspective}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Ethische Overwegingen</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {expandedCase.considerations.map((consideration, index) => (
                    <li key={index}>{consideration}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;