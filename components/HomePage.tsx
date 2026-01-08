
import React from 'react';

interface HomePageProps {
  onStart: () => void;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
);

const StyleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
);

const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);


const HomePage: React.FC<HomePageProps> = ({ onStart }) => {
  return (
    <div className="text-center animate-fade-in-up">
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white/90 mb-4">A Moment of Connection</h2>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          Reunify uses advanced Gemini AI to bridge the gap between separate photos. Upload any two images, and we will create a seamless moment of togetherness, allowing you to visualize connections that transcend time and distance.
        </p>
      </section>

       <section className="mb-12">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <div className="flex gap-2">
                <div className="w-32 h-40 bg-slate-800 rounded-lg flex items-center justify-center text-gray-400 text-sm border border-slate-700 shadow-inner">Image A</div>
                 <div className="w-32 h-40 bg-slate-800 rounded-lg flex items-center justify-center text-gray-400 text-sm border border-slate-700 shadow-inner">Image B</div>
            </div>
            <div className="text-3xl text-brand-primary font-light mx-4 my-2 md:my-0">&rarr;</div>
            <div className="w-64 h-40 bg-slate-700/50 rounded-lg flex items-center justify-center text-gray-200 font-semibold border-2 border-dashed border-brand-primary/30">Reunify</div>
        </div>
      </section>

      <section className="mb-12">
        <h3 className="text-2xl font-bold text-white/90 mb-6">How it works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center p-6 bg-slate-800/50 rounded-lg transition-transform duration-300 hover:-translate-y-2 hover:scale-105">
            <UploadIcon />
            <h4 className="text-lg font-semibold">1. Upload</h4>
            <p className="text-gray-300 text-sm">Provide two photos of people you'd like to see together.</p>
          </div>
          <div className="flex flex-col items-center p-6 bg-slate-800/50 rounded-lg transition-transform duration-300 hover:-translate-y-2 hover:scale-105">
            <StyleIcon />
            <h4 className="text-lg font-semibold">2. Customize</h4>
            <p className="text-gray-300 text-sm">Select a style that captures the essence of your memory.</p>
          </div>
          <div className="flex flex-col items-center p-6 bg-slate-800/50 rounded-lg transition-transform duration-300 hover:-translate-y-2 hover:scale-105">
            <HeartIcon />
            <h4 className="text-lg font-semibold">3. Share</h4>
            <p className="text-gray-300 text-sm">Download your creation or share it via a unique link.</p>
          </div>
        </div>
      </section>

      <section>
        <button
          onClick={onStart}
          className="bg-brand-primary hover:bg-brand-primary-hover text-white font-bold py-4 px-16 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-primary/30"
        >
          Begin Reunification
        </button>
      </section>
    </div>
  );
};

export default HomePage;
