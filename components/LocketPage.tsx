
import React, { useEffect, useState } from 'react';

export interface LocketData {
  mediaUrl: string;
  mediaType: 'image'; // Simplified, only image is supported now
  letter: string;
  audioUrl?: string;
}

interface LocketPageProps {
  data: LocketData | null;
}

const LocketPage: React.FC<LocketPageProps> = ({ data }) => {
  const [error, setError] = useState('');

  useEffect(() => {
    if (!data) {
      setError('Could not read locket data. The link may be corrupted or expired.');
    }
  }, [data]);
  
  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-bg-start to-brand-bg-end text-brand-text flex flex-col items-center justify-center p-4 font-sans">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-red-400">Error</h1>
            <p className="text-lg text-gray-300 mt-2">{error || 'This memory could not be retrieved.'}</p>
            <a href="/" className="mt-6 inline-block bg-brand-primary hover:bg-brand-primary-hover text-white font-bold py-2 px-6 rounded-full">Go Back</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-bg-start to-brand-bg-end text-brand-text flex flex-col items-center justify-center p-4 font-sans animate-background-pan" style={{ backgroundSize: '400% 400%' }}>
      <div className="w-full max-w-5xl mx-auto bg-slate-900/50 backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-lg animate-fade-in-up">
        <h1 className="text-4xl text-center font-bold tracking-tight bg-gradient-to-r from-violet-400 to-indigo-300 text-transparent bg-clip-text mb-6">Reunify Moment</h1>
        
        <div className="md:grid md:grid-cols-2 md:gap-8 items-start">
            <div className="mb-6 md:mb-0">
                 <div className="relative w-full mx-auto rounded-lg overflow-hidden shadow-2xl bg-slate-900 aspect-square">
                    <img src={data.mediaUrl} alt="Reunion moment" className="w-full h-full object-cover" />
                 </div>
            </div>
            
            <div className="flex flex-col gap-4">
                <div className="bg-slate-800/50 p-6 rounded-lg flex-grow">
                    <h3 className="text-xl font-bold text-gray-200 mb-4">A Message for the Recipient</h3>
                    <p className="text-gray-300 whitespace-pre-wrap font-serif leading-relaxed">{data.letter}</p>
                </div>
                {data.audioUrl && (
                    <div className="bg-slate-800/50 p-6 rounded-lg">
                        <h3 className="text-xl font-bold text-gray-200 mb-2">Voice Note</h3>
                        <audio src={data.audioUrl} controls className="w-full rounded-full"/>
                    </div>
                )}
            </div>
        </div>
      </div>
      <footer className="text-center mt-8 text-gray-400 text-sm">
        <p>Created with Reunify. <a href="/" className="text-brand-primary hover:underline">Create your own timeless moment.</a></p>
      </footer>
    </div>
  );
};

export default LocketPage;
