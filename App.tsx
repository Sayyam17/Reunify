
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { reunifyImages } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import Spinner from './components/Spinner';
import HomePage from './components/HomePage';
import StyleSelector from './components/StyleSelector';
import LetterGenerator from './components/LetterGenerator';
import AudioRecorder from './components/AudioRecorder';
import LocketPage from './components/LocketPage';
import type { LocketData } from './components/LocketPage';

type AppState = 'idle' | 'loading' | 'success' | 'error';
type AppView = 'home' | 'editor';

const App: React.FC = () => {
  const [photoOne, setPhotoOne] = useState<string | null>(null);
  const [photoTwo, setPhotoTwo] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [appState, setAppState] = useState<AppState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [loadingMessage, setLoadingMessage] = useState('');

  const [selectedStyle, setSelectedStyle] = useState('natural');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  
  const [locketData, setLocketData] = useState<LocketData | null>(null);
  const hasGeneratedOnce = useRef(false);

  useEffect(() => {
    try {
      const hash = window.location.hash;
      if (hash.startsWith('#locket-')) {
        const encodedData = hash.substring(8);
        const decodedJson = atob(encodedData);
        const parsedData: LocketData = JSON.parse(decodedJson);
        setLocketData(parsedData);
      }
    } catch (e) {
      console.error("Failed to parse locket data from URL hash", e);
      window.location.hash = '';
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!photoOne || !photoTwo) {
      setErrorMessage('Please upload both photos before generating.');
      setAppState('error');
      return;
    }

    setAppState('loading');
    setErrorMessage('');

    try {
      setLoadingMessage('Bridging your photos...');
      const imageResult = await reunifyImages(photoOne, photoTwo, selectedStyle);
      setGeneratedImage(imageResult);
      setAppState('success');
      hasGeneratedOnce.current = true;
    } catch (error) {
      console.error('Error generating:', error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Failed to create a connection. Please try different images.'
      );
      setAppState('error');
    } finally {
      setLoadingMessage('');
    }
  }, [photoOne, photoTwo, selectedStyle]);
  
  useEffect(() => {
    if (hasGeneratedOnce.current) {
        handleGenerate();
    }
  }, [selectedStyle, handleGenerate]);


  const handleImageUpload = (
    file: File,
    setter: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setter(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setPhotoOne(null);
    setPhotoTwo(null);
    setGeneratedImage(null);
    setErrorMessage('');
    setAppState('idle');
    setSelectedStyle('natural');
    setGeneratedLetter('');
    setRecordedAudio(null);
    hasGeneratedOnce.current = false;
  };

  const navigateToEditor = () => {
    setCurrentView('editor');
    handleReset();
  }
  
  const navigateToHome = () => {
    setCurrentView('home');
  }

  const PhotoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const AnimatedLoadingText = () => (
     <p className="mt-4 text-lg text-gray-300 animate-pulse">
        {loadingMessage || 'Processing images...'}
      </p>
  );
  
  if (locketData) {
    return <LocketPage data={locketData} />;
  }

  const renderEditorContent = () => {
    switch (appState) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center text-center p-8 min-h-[400px]">
            <Spinner />
            <AnimatedLoadingText />
          </div>
        );
      case 'success':
        return (
          (generatedImage) && (
            <div id="result-section" className="text-center opacity-0 animate-pop-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                
                <div className="flex flex-col items-center gap-4">
                  <div className="w-full">
                    <h2 className="text-2xl font-bold text-brand-primary mb-3">Reunification Success</h2>
                    <div className="relative w-full max-w-2xl mx-auto rounded-lg overflow-hidden shadow-2xl bg-slate-900 aspect-square">
                      <img src={generatedImage} alt="Reunified moment" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap justify-center items-center gap-4 mt-2">
                    <button
                      onClick={handleReset}
                      className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-full text-base transition-all duration-300 transform hover:scale-105 shadow-md"
                    >
                      Start Over
                    </button>
                    <a
                      href={generatedImage}
                      download="reunify-moment.png"
                      className="inline-block bg-brand-secondary hover:bg-brand-secondary-hover text-white font-bold py-2 px-6 rounded-full text-base transition-all duration-300 transform hover:scale-105 shadow-md"
                    >
                      Download
                    </a>
                  </div>
                </div>

                <div className="w-full flex flex-col gap-4">
                  <LetterGenerator onLetterGenerated={setGeneratedLetter} />
                  {generatedLetter && <AudioRecorder onRecordingComplete={setRecordedAudio}/>}
                </div>
              </div>
              
              <div className="w-full mt-6">
                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-center text-gray-200">Change Style</h3>
                  <StyleSelector selectedStyle={selectedStyle} onStyleChange={setSelectedStyle} />
                </div>
              </div>
            </div>
          )
        );
      case 'idle':
      case 'error':
      default:
        return (
          <div id="upload-section">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <ImageUploader
                label="Person A"
                previewSrc={photoOne}
                onImageUpload={(file) => handleImageUpload(file, setPhotoOne)}
                icon={<PhotoIcon />}
              />
              <ImageUploader
                label="Person B"
                previewSrc={photoTwo}
                onImageUpload={(file) => handleImageUpload(file, setPhotoTwo)}
                icon={<PhotoIcon />}
              />
            </div>
            
            <div className="my-8 p-6 bg-slate-800/50 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-center text-gray-200">Reunification Style</h3>
                <StyleSelector selectedStyle={selectedStyle} onStyleChange={setSelectedStyle} />
            </div>

            <div className="text-center">
              <button
                onClick={handleGenerate}
                disabled={!photoOne || !photoTwo}
                className="bg-brand-primary hover:bg-brand-primary-hover disabled:bg-gray-600 text-white font-bold py-3 px-16 rounded-full text-xl transition-all duration-300 transform hover:scale-110 shadow-lg disabled:cursor-not-allowed disabled:transform-none"
              >
                Reunify
              </button>
            </div>

            {appState === 'error' && errorMessage && (
              <div className="mt-6 p-4 bg-red-900/50 text-red-300 border border-red-500 rounded-lg text-center animate-pop-in">
                <p><strong>Error:</strong> {errorMessage}</p>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-bg-start to-brand-bg-end text-brand-text flex flex-col items-center justify-center p-4 font-sans animate-background-pan" style={{backgroundSize: '400% 400%'}}>
      <div className="w-full max-w-6xl mx-auto group" style={{perspective: '1000px'}}>
        <header className="text-center mb-8 opacity-0 animate-fade-in-up relative" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-violet-400 to-indigo-300 text-transparent bg-clip-text">Reunify</h1>
          <p className="text-lg text-gray-300 mt-2">Connecting memories across time and space.</p>
           {currentView === 'editor' && (
             <button onClick={navigateToHome} className="absolute top-0 left-0 text-brand-primary hover:underline text-lg">&larr; Back Home</button>
           )}
        </header>

        <main className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-[1.01] opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          {currentView === 'home' ? <HomePage onStart={navigateToEditor} /> : renderEditorContent()}
        </main>
        <footer className="text-center mt-8 text-gray-400 text-sm opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <p>Powered by Gemini NanoBanana Model. &copy; 2024 Reunify</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
