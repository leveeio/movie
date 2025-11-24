import React, { useState, useEffect } from 'react';
import { MovieResource, AnalysisResult } from '../types';
import { analyzeResource } from '../services/geminiService';

interface ResourceModalProps {
  resource: MovieResource;
  onClose: () => void;
}

export const ResourceModal: React.FC<ResourceModalProps> = ({ resource, onClose }) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reset analysis when resource changes
    setAnalysis(null);
  }, [resource]);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await analyzeResource(resource.title, resource.synopsis);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur and noise */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
        onClick={onClose}
      ></div>

      {/* Modal Content - Designed like a dossier/file */}
      <div className="relative w-full max-w-4xl bg-black/95 border border-slate-700 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh] group animate-in fade-in zoom-in-95 duration-300">
        
        {/* Top Right Close Button - Prominent */}
        <button 
            onClick={onClose}
            className="absolute top-0 right-0 z-50 p-4 text-slate-400 hover:text-archive-red transition-colors bg-black/50 backdrop-blur-sm border-b border-l border-slate-800"
        >
            <span className="font-mono text-xs uppercase tracking-widest">[关闭 X]</span>
        </button>

        {/* Left Side: Visual Data */}
        <div className="w-full md:w-1/3 relative border-b md:border-b-0 md:border-r border-slate-700 bg-slate-900/50">
          <img 
            src={resource.posterUrl} 
            alt={resource.title} 
            className="w-full h-full object-cover opacity-80 mix-blend-overlay grayscale hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black via-transparent to-transparent"></div>
          
          <div className="absolute bottom-4 left-4 p-2 border-l-2 border-archive-red z-10">
            <h2 className="font-mono text-2xl text-white tracking-widest uppercase break-words">{resource.title}</h2>
            <p className="font-mono text-archive-red text-xs mt-1">编号: {resource.id}</p>
          </div>
        </div>

        {/* Right Side: Text Data */}
        <div className="w-full md:w-2/3 p-8 overflow-y-auto font-mono relative flex flex-col">
          
          {/* Decorative scanner lines */}
          <div className="absolute top-0 right-0 p-4 opacity-50 pointer-events-none mt-8 mr-8">
             <div className="w-24 h-[1px] bg-archive-red mb-1"></div>
             <div className="w-16 h-[1px] bg-archive-red mb-1 ml-8"></div>
          </div>

          <div className="flex-1">
            <div className="mb-6">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">元数据 //</span>
                <div className="grid grid-cols-2 gap-4 mt-2 text-xs text-slate-300">
                <p><span className="text-slate-500">年份:</span> {resource.year}</p>
                <p><span className="text-slate-500">导演:</span> {resource.director}</p>
                {resource.country && (
                    <p><span className="text-slate-500">国家:</span> {resource.country}</p>
                )}
                <p className="col-span-2"><span className="text-slate-500">类型:</span> {resource.genre.join(' / ')}</p>
                {resource.link && (
                     <p className="col-span-2 overflow-hidden text-ellipsis whitespace-nowrap">
                         <span className="text-slate-500">来源:</span> 
                         <a href={resource.link} target="_blank" rel="noopener noreferrer" className="ml-2 text-archive-red hover:underline decoration-dashed underline-offset-4">
                            打开归档链接 [{resource.link.substring(0, 20)}...]
                         </a>
                     </p>
                )}
                </div>
            </div>

            <div className="mb-6">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">简介 //</span>
                <p className="mt-2 text-slate-200 font-serif text-base leading-relaxed italic border-l-2 border-slate-700 pl-3 py-1">
                "{resource.synopsis}"
                </p>
            </div>

            <div className="mb-6">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">系统备注 //</span>
                <p className="mt-2 text-archive-red font-mono text-[10px] animate-pulse">
                {">"} {resource.systemNotes}
                </p>
            </div>

            <div className="mb-8">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">视觉风格 //</span>
                <div className="flex flex-wrap gap-2 mt-2">
                {resource.styleKeywords.map(k => (
                    <span key={k} className="px-2 py-1 border border-slate-600 text-[10px] text-slate-400 uppercase">
                    {k}
                    </span>
                ))}
                </div>
            </div>

            {/* AI Analysis Section */}
            <div className="border-t border-slate-800 pt-6">
                {!analysis && !loading && (
                <button 
                    onClick={handleAnalyze}
                    className="group relative px-6 py-2 overflow-hidden bg-transparent border border-slate-500 hover:border-archive-red transition-colors w-full md:w-auto"
                >
                    <span className="absolute inset-0 w-full h-full bg-archive-red/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                    <span className="relative font-mono text-xs text-slate-300 group-hover:text-white uppercase tracking-widest">
                    深度分析 [AI]
                    </span>
                </button>
                )}

                {loading && (
                <div className="flex items-center space-x-2 text-archive-red font-mono text-xs">
                    <div className="w-2 h-2 bg-archive-red animate-ping rounded-full"></div>
                    <span>处理神经网络中...</span>
                </div>
                )}

                {analysis && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-slate-900/30 p-4 border border-slate-800/50">
                    <div className="flex items-baseline justify-between border-b border-archive-red/30 pb-2">
                    <h3 className="text-archive-red font-bold font-mono uppercase tracking-widest text-xs">分析报告</h3>
                    <span className="text-[10px] text-slate-500">置信度: 98.4%</span>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                    <div>
                        <h4 className="text-slate-500 text-[10px] uppercase mb-1">心理侧写</h4>
                        <p className="text-xs text-slate-200 font-mono leading-relaxed">
                        {analysis.psychologicalProfile}
                        </p>
                    </div>
                    
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="text-slate-500 text-[10px] uppercase mb-1">视觉母题</h4>
                            <ul className="text-[10px] font-mono text-slate-400 list-disc list-inside">
                            {analysis.visualMotifs.map(m => <li key={m}>{m}</li>)}
                            </ul>
                        </div>
                        <div className="text-right">
                            <h4 className="text-slate-500 text-[10px] uppercase mb-1">威胁等级</h4>
                            <span className={`text-lg font-bold font-mono ${
                            analysis.riskAssessment.includes('高') || analysis.riskAssessment.includes('High') ? 'text-red-500' : 'text-slate-300'
                            }`}>
                            {analysis.riskAssessment}
                            </span>
                        </div>
                    </div>
                    </div>
                </div>
                )}
            </div>
          </div>
            
          {/* Footer / Return Button */}
          <div className="mt-8 pt-4 border-t border-slate-800 flex justify-between items-center">
             <span className="text-[8px] text-slate-600 uppercase">仅限授权人员</span>
             <button 
                onClick={onClose}
                className="group flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-archive-red hover:text-white transition-all duration-300 text-slate-300 text-xs font-mono uppercase tracking-widest border border-slate-700 hover:border-archive-red shadow-lg"
             >
                <span>&lt; 返回列表</span>
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};