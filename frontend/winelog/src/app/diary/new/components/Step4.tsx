'use client';

import { WineFormData } from '@/lib/types/diary';
import Image from 'next/image';
import { useState } from 'react';

interface Step4Props {
  wineData: WineFormData;
  onUpdate: (data: Partial<WineFormData>) => void;
}

type LayoutTemplate = 'left-date' | 'right-date' | 'bottom-date';

export default function Step4({ wineData, onUpdate }: Step4Props) {
  const [selectedTemplate, setSelectedTemplate] = useState<LayoutTemplate>('right-date');

  const handleDateChange = (date: string) => {
    onUpdate({ drinkDate: date });
  };

  const taste = wineData.taste || {
    sweetness: 50,
    acidity: 50,
    tannin: 50,
    body: 50,
    alcohol: 50
  };

  const renderTasteInfo = () => (
    <div className="grid grid-cols-5 gap-4">
      {/* Sweetness */}
      <div className="flex flex-col items-center">
        <div className="w-full h-24 bg-white/10 rounded-lg relative overflow-hidden">
          <div
            className="absolute bottom-0 w-full bg-white/30"
            style={{ height: `${taste.sweetness}%` }}
          />
        </div>
        <span className="mt-2 text-sm">당도</span>
        <span className="text-xs">{taste.sweetness}%</span>
      </div>

      {/* Acidity */}
      <div className="flex flex-col items-center">
        <div className="w-full h-24 bg-white/10 rounded-lg relative overflow-hidden">
          <div
            className="absolute bottom-0 w-full bg-white/30"
            style={{ height: `${taste.acidity}%` }}
          />
        </div>
        <span className="mt-2 text-sm">산도</span>
        <span className="text-xs">{taste.acidity}%</span>
      </div>

      {/* Tannin */}
      <div className="flex flex-col items-center">
        <div className="w-full h-24 bg-white/10 rounded-lg relative overflow-hidden">
          <div
            className="absolute bottom-0 w-full bg-white/30"
            style={{ height: `${taste.tannin}%` }}
          />
        </div>
        <span className="mt-2 text-sm">탄닌</span>
        <span className="text-xs">{taste.tannin}%</span>
      </div>

      {/* Body */}
      <div className="flex flex-col items-center">
        <div className="w-full h-24 bg-white/10 rounded-lg relative overflow-hidden">
          <div
            className="absolute bottom-0 w-full bg-white/30"
            style={{ height: `${taste.body}%` }}
          />
        </div>
        <span className="mt-2 text-sm">바디</span>
        <span className="text-xs">{taste.body}%</span>
      </div>

      {/* Alcohol */}
      <div className="flex flex-col items-center">
        <div className="w-full h-24 bg-white/10 rounded-lg relative overflow-hidden">
          <div
            className="absolute bottom-0 w-full bg-white/30"
            style={{ height: `${taste.alcohol}%` }}
          />
        </div>
        <span className="mt-2 text-sm">알코올</span>
        <span className="text-xs">{taste.alcohol}%</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white relative">
      <div className="flex-1 relative">
        {/* Wine Image */}
        <div className="absolute inset-0">
          {wineData.thumbnailImage && (
            <Image
              src={wineData.thumbnailImage}
              alt="Wine"
              fill
              className="object-cover brightness-[0.85]"
            />
          )}
        </div>

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
          {/* Content based on selected template */}
          <div className={`flex ${selectedTemplate === 'left-date' ? 'flex-row' : 'flex-row-reverse'} justify-between items-start`}>
            {selectedTemplate !== 'bottom-date' && (
              <input
                type="date"
                value={wineData.drinkDate || ''}
                onChange={(e) => handleDateChange(e.target.value)}
                className="bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 text-white"
              />
            )}
          </div>

          {/* Bottom Section */}
          <div className="space-y-4">
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6">
              {renderTasteInfo()}
            </div>
            {selectedTemplate === 'bottom-date' && (
              <div className="flex justify-center">
                <input
                  type="date"
                  value={wineData.drinkDate || ''}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 text-white"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Template Selection */}
      <div className="fixed bottom-24 left-0 right-0 p-4 bg-white/10 backdrop-blur-sm">
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setSelectedTemplate('left-date')}
            className={`w-20 h-20 border-2 rounded-lg flex flex-col p-2 ${selectedTemplate === 'left-date' ? 'border-wine-dark bg-wine-dark/20' : 'border-gray-300'
              }`}
          >
            <div className="w-full h-3 bg-gray-300 mb-1" />
            <div className="w-full h-3 bg-gray-300 mb-1" />
            <div className="w-full h-3 bg-gray-300" />
          </button>

          <button
            onClick={() => setSelectedTemplate('right-date')}
            className={`w-20 h-20 border-2 rounded-lg flex flex-col p-2 ${selectedTemplate === 'right-date' ? 'border-wine-dark bg-wine-dark/20' : 'border-gray-300'
              }`}
          >
            <div className="w-full h-3 bg-gray-300 mb-1" />
            <div className="w-full h-3 bg-gray-300 mb-1" />
            <div className="w-full h-3 bg-gray-300" />
          </button>

          <button
            onClick={() => setSelectedTemplate('bottom-date')}
            className={`w-20 h-20 border-2 rounded-lg flex flex-col p-2 ${selectedTemplate === 'bottom-date' ? 'border-wine-dark bg-wine-dark/20' : 'border-gray-300'
              }`}
          >
            <div className="w-full h-3 bg-gray-300 mb-1" />
            <div className="w-full h-3 bg-gray-300 mb-1" />
            <div className="w-full h-3 bg-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
} 