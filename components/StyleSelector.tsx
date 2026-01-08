
import React from 'react';

interface StyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
}

const styles = [
  { key: 'natural', name: 'Natural', description: 'Photorealistic and clean.' },
  { key: 'anime', name: 'Anime', description: 'Vibrant and cel-shaded.' },
  { key: 'sketch', name: 'Pencil Sketch', description: 'Hand-drawn and detailed.' },
  { key: 'ghibli', name: 'Ghibli Style', description: 'Painterly and whimsical.' },
];

const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onStyleChange }) => {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {styles.map((style) => (
          <button
            key={style.key}
            onClick={() => onStyleChange(style.key)}
            className={`p-3 text-center rounded-lg border-2 transition-all duration-200 ${
              selectedStyle === style.key
                ? 'bg-brand-primary border-brand-primary-hover shadow-md'
                : 'bg-slate-700/50 border-gray-600 hover:border-brand-primary'
            }`}
          >
            <span className="block font-semibold text-sm text-white">{style.name}</span>
            <span className="block text-xs text-gray-300">{style.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StyleSelector;
