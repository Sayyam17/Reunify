

import React, { useState, useRef, useEffect } from 'react';

const RecordIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth={2} stroke="currentColor" fill="none" /><circle cx="12" cy="12" r="4" fill="currentColor" /></svg>;
const StopIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="6" y="6" width="12" height="12" rx="2" ry="2" strokeWidth={2} fill="currentColor" /></svg>;
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" /></svg>;
const RedoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4a12.94 12.94 0 0115.12 2.88M20 20a12.94 12.94 0 01-15.12-2.88" /></svg>;


interface AudioRecorderProps {
  onRecordingComplete: (audioDataUrl: string) => void;
}

type RecordingStatus = 'idle' | 'recording' | 'recorded' | 'error';

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete }) => {
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setStatus('recording');
      setError('');
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = event => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);

        const reader = new FileReader();
        reader.onloadend = () => {
          onRecordingComplete(reader.result as string);
        };
        reader.readAsDataURL(audioBlob);

        audioChunksRef.current = [];
        setStatus('recorded');
      };
      mediaRecorderRef.current.start();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Microphone access denied. Please enable it in your browser settings.');
      setStatus('error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && status === 'recording') {
      mediaRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach(track => track.stop()); // Stop the stream and microphone indicator
    }
  };

  const handleRetake = () => {
    setAudioURL(null);
    setStatus('idle');
    onRecordingComplete('');
  };
  
  // Cleanup stream on unmount
  useEffect(() => {
      return () => {
          streamRef.current?.getTracks().forEach(track => track.stop());
      }
  }, []);

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg animate-fade-in-up">
      <h3 className="text-lg font-bold text-gray-200 mb-2 text-left">Add Your Voice</h3>
      <p className="text-gray-400 mb-3 text-left text-xs">Record yourself reading the message to add a personal touch.</p>

      <div className="flex items-center justify-center gap-4">
        {status === 'idle' && (
          <button onClick={startRecording} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition-colors">
            <RecordIcon/> Record
          </button>
        )}
        {status === 'recording' && (
          <button onClick={stopRecording} className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-full transition-colors animate-pulse">
            <StopIcon/> Stop
          </button>
        )}
        {status === 'recorded' && audioURL && (
          <>
            <audio src={audioURL} controls className="flex-grow rounded-full"/>
            <button onClick={handleRetake} className="flex items-center gap-2 text-gray-300 hover:text-white font-bold py-2 px-4 rounded-full transition-colors">
              <RedoIcon/>
            </button>
          </>
        )}
      </div>
       {status === 'error' && (
         <div className="mt-3 p-2 bg-red-900/50 text-red-300 border border-red-500 rounded-lg text-center text-xs">
            <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;