
import React, { useState, useCallback, useRef } from 'react';
import { GeminiService } from './services/geminiService';
import { LOGO_PROMPTS } from './constants';
import { LogoPrompt, GeneratedLogo } from './types';

const App: React.FC = () => {
  const [selectedPrompt, setSelectedPrompt] = useState<LogoPrompt>(LOGO_PROMPTS[0]);
  const [customPrompt, setCustomPrompt] = useState(LOGO_PROMPTS[0].prompt);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLogos, setGeneratedLogos] = useState<GeneratedLogo[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const service = GeminiService.getInstance();
      const imageUrl = await service.generateLogo(customPrompt);
      
      if (imageUrl) {
        const newLogo: GeneratedLogo = {
          id: Date.now().toString(),
          url: imageUrl,
          prompt: customPrompt,
          timestamp: Date.now(),
        };
        setGeneratedLogos(prev => [newLogo, ...prev]);
        
        // Scroll to results
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        setError("Failed to generate image. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePromptSelect = (prompt: LogoPrompt) => {
    setSelectedPrompt(prompt);
    setCustomPrompt(prompt.prompt);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Prompt copied to clipboard!");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-white/10 px-6 py-4 flex justify-between items-center sticky top-0 bg-black/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-lg flex items-center justify-center font-bold text-white text-xl">K</div>
          <span className="font-heading font-bold text-xl tracking-tight">Katlyst Studio</span>
        </div>
        <div className="hidden md:flex gap-6 text-sm text-gray-400 font-medium">
          <a href="#" className="hover:text-white transition-colors">Generator</a>
          <a href="#" className="hover:text-white transition-colors">Library</a>
          <a href="#" className="hover:text-white transition-colors">Case Studies</a>
        </div>
        <button className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-all">
          Contact Agency
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Controls Column */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">
                Sleek Logos for <span className="gradient-text">Modern Agencies.</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-lg">
                Create a genuine, non-cringy visual identity for Katlyst. Use our curated minimalist prompts or craft your own.
              </p>
            </div>

            {/* Prompt Selector */}
            <div className="space-y-4">
              <label className="text-sm font-semibold uppercase tracking-wider text-gray-500">Choose a Style Direction</label>
              <div className="grid grid-cols-2 gap-3">
                {LOGO_PROMPTS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handlePromptSelect(p)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedPrompt.id === p.id 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-white/10 bg-white/5 hover:border-white/30'
                    }`}
                  >
                    <div className="font-bold mb-1 capitalize">{p.title}</div>
                    <div className="text-xs text-gray-400 line-clamp-1">{p.category}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Editor */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-sm font-semibold uppercase tracking-wider text-gray-500">Refine Your Prompt</label>
                <button 
                  onClick={() => copyToClipboard(customPrompt)}
                  className="text-xs text-blue-400 hover:underline"
                >
                  Copy Prompt String
                </button>
              </div>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Describe your vision..."
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !customPrompt.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Brand Assets...
                  </>
                ) : 'Generate Concept Logo'}
              </button>
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Showcase Column */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>
            </div>

            {isGenerating ? (
              <div className="flex flex-col items-center gap-6 animate-pulse">
                <div className="w-64 h-64 bg-white/10 rounded-full border border-white/10"></div>
                <div className="space-y-2 text-center">
                  <p className="text-gray-300 font-medium">Refining minimalist vectors...</p>
                  <p className="text-gray-500 text-sm italic">"Simplicity is the ultimate sophistication."</p>
                </div>
              </div>
            ) : generatedLogos.length > 0 ? (
              <div className="w-full space-y-8" ref={resultsRef}>
                <div className="relative group">
                  <img 
                    src={generatedLogos[0].url} 
                    alt="Generated Logo" 
                    className="w-full aspect-square object-contain bg-white rounded-xl shadow-2xl transition-transform group-hover:scale-[1.02]"
                  />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = generatedLogos[0].url;
                        link.download = `katlyst-logo-${Date.now()}.png`;
                        link.click();
                      }}
                      className="p-2 bg-black/60 backdrop-blur rounded-lg text-white hover:bg-black/80"
                      title="Download PNG"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
                  <h4 className="text-sm font-bold text-gray-400">Used Prompt Context:</h4>
                  <p className="text-xs text-gray-500 italic leading-relaxed">
                    {generatedLogos[0].prompt}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-white/10 to-white/5 rounded-3xl flex items-center justify-center border border-white/10 rotate-12">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-heading font-semibold text-gray-300">Your Identity Starts Here</h3>
                  <p className="text-gray-500 text-sm mt-2">Pick a style on the left and click generate to begin.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Previous Results */}
        {generatedLogos.length > 1 && (
          <div className="mt-24 space-y-8">
            <h2 className="text-2xl font-heading font-bold flex items-center gap-3">
              <span className="w-8 h-1 bg-blue-500 rounded-full"></span>
              Recent Iterations
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {generatedLogos.slice(1).map((logo) => (
                <div key={logo.id} className="group relative bg-white/5 rounded-xl border border-white/10 aspect-square overflow-hidden hover:border-blue-500/50 transition-all">
                  <img src={logo.url} alt="Logo Variation" className="w-full h-full object-contain bg-white opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => setGeneratedLogos(prev => [logo, ...prev.filter(l => l.id !== logo.id)])}
                      className="text-xs bg-white text-black px-3 py-1.5 rounded-full font-bold"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Educational Content */}
        <section className="mt-32 grid md:grid-cols-3 gap-8 pb-12">
           <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Non-Cringy Design</h3>
              <p className="text-sm text-gray-500 leading-relaxed">We avoid cliché "agency" symbols. No puzzle pieces, no generic handshakes. Only pure geometric abstraction.</p>
           </div>
           <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Authentic Meaning</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Katlyst stands for acceleration. Our prompts are tuned to represent the literal physics of change and reaction.</p>
           </div>
           <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
              <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Fully Customizable</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Use the advanced prompt editor to tweak colors, line weights, and cultural influences to match your vibe.</p>
           </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-12 px-6 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center font-bold text-white text-xs">K</div>
              <span className="font-heading font-bold tracking-tight">Katlyst Studio</span>
            </div>
            <p className="text-gray-500 text-xs text-center md:text-left">
              Powered by Gemini 2.5 Flash Image. <br /> Built for high-growth agencies.
            </p>
          </div>
          <div className="flex gap-8 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
