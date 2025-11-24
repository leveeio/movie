import React, { useState } from 'react';
import { MovieResource } from '../types';
import { GENRE_OPTIONS, COUNTRY_OPTIONS } from '../constants';

interface EditResourceModalProps {
  resource: MovieResource;
  onSave: (updatedResource: MovieResource) => void;
  onClose: () => void;
}

export const EditResourceModal: React.FC<EditResourceModalProps> = ({ resource, onSave, onClose }) => {
  const [formData, setFormData] = useState<MovieResource>({ ...resource });

  const handleChange = (field: keyof MovieResource, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleGenre = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genre: prev.genre.includes(genre)
        ? prev.genre.filter(g => g !== genre)
        : [...prev.genre, genre]
    }));
  };

  const handleStyleKeywordChange = (index: number, value: string) => {
      const newKeywords = [...formData.styleKeywords];
      newKeywords[index] = value;
      setFormData(prev => ({ ...prev, styleKeywords: newKeywords }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-black border border-archive-red shadow-[0_0_30px_rgba(204,26,26,0.2)] flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900/50">
            <h2 className="text-archive-red font-mono font-bold uppercase tracking-widest text-sm">
                编辑档案 // {resource.id}
            </h2>
            <button onClick={onClose} className="text-slate-500 hover:text-white font-mono text-xs uppercase">
                [取消]
            </button>
        </div>

        {/* Scrollable Form Area */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
            
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-[10px] text-slate-500 mb-1 uppercase">影片名称</label>
                    <input 
                        type="text" 
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 p-2 text-xs font-mono text-white focus:border-archive-red outline-none"
                    />
                </div>
                <div>
                    <label className="block text-[10px] text-slate-500 mb-1 uppercase">链接</label>
                    <input 
                        type="text" 
                        value={formData.link}
                        onChange={(e) => handleChange('link', e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 p-2 text-xs font-mono text-archive-red focus:border-archive-red outline-none"
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-[10px] text-slate-500 mb-1 uppercase">年份</label>
                    <input 
                        type="number" 
                        value={formData.year}
                        onChange={(e) => handleChange('year', e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 p-2 text-xs font-mono text-white focus:border-archive-red outline-none"
                    />
                </div>
                <div>
                    <label className="block text-[10px] text-slate-500 mb-1 uppercase">导演</label>
                    <input 
                        type="text" 
                        value={formData.director}
                        onChange={(e) => handleChange('director', e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 p-2 text-xs font-mono text-white focus:border-archive-red outline-none"
                    />
                </div>
                <div>
                    <label className="block text-[10px] text-slate-500 mb-1 uppercase">国家</label>
                    <select
                        value={formData.country || ''}
                        onChange={(e) => handleChange('country', e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 p-2 text-xs font-mono text-white focus:border-archive-red outline-none appearance-none"
                    >
                        <option value="">未知</option>
                        {COUNTRY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            {/* Genres */}
            <div>
                <label className="block text-[10px] text-slate-500 mb-2 uppercase">类型 (多选)</label>
                <div className="flex flex-wrap gap-2">
                    {GENRE_OPTIONS.map(g => (
                        <button
                            key={g}
                            onClick={() => toggleGenre(g)}
                            className={`px-2 py-1 text-[10px] font-mono border transition-all ${
                                formData.genre.includes(g) 
                                ? 'bg-archive-red text-white border-archive-red' 
                                : 'bg-transparent text-slate-500 border-slate-700 hover:border-slate-500'
                            }`}
                        >
                            {g}
                        </button>
                    ))}
                </div>
            </div>

            {/* Large Text Areas */}
            <div>
                <label className="block text-[10px] text-slate-500 mb-1 uppercase">简介</label>
                <textarea 
                    value={formData.synopsis}
                    onChange={(e) => handleChange('synopsis', e.target.value)}
                    rows={4}
                    className="w-full bg-slate-900/50 border border-slate-700 p-2 text-xs font-mono text-slate-300 focus:border-archive-red outline-none resize-none"
                />
            </div>

            <div>
                <label className="block text-[10px] text-slate-500 mb-1 uppercase">系统备注 (System Notes)</label>
                <textarea 
                    value={formData.systemNotes}
                    onChange={(e) => handleChange('systemNotes', e.target.value)}
                    rows={2}
                    className="w-full bg-slate-900/50 border border-slate-700 p-2 text-xs font-mono text-archive-red/80 focus:border-archive-red outline-none resize-none"
                />
            </div>

            {/* Visual Style Keywords */}
             <div>
                <label className="block text-[10px] text-slate-500 mb-1 uppercase">视觉风格关键词 (3个)</label>
                <div className="grid grid-cols-3 gap-4">
                    {[0, 1, 2].map(i => (
                        <input 
                            key={i}
                            type="text" 
                            value={formData.styleKeywords[i] || ''}
                            onChange={(e) => handleStyleKeywordChange(i, e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 p-2 text-xs font-mono text-slate-400 focus:border-archive-red outline-none"
                        />
                    ))}
                </div>
            </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-4">
            <button 
                onClick={onClose}
                className="px-6 py-2 border border-slate-700 text-xs font-mono text-slate-400 hover:text-white uppercase hover:border-white transition-colors"
            >
                放弃更改
            </button>
            <button 
                onClick={() => onSave(formData)}
                className="px-6 py-2 bg-archive-red text-white text-xs font-mono uppercase tracking-widest hover:bg-red-600 transition-colors shadow-lg shadow-red-900/20"
            >
                保存档案
            </button>
        </div>
      </div>
    </div>
  );
};