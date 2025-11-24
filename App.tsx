import React, { useState, useMemo, useRef } from 'react';
import { INITIAL_RESOURCES, GENRE_OPTIONS, COUNTRY_OPTIONS } from './constants';
import { MovieResource } from './types';
import { ResourceModal } from './components/ResourceModal';
import { EditResourceModal } from './components/EditResourceModal';
import { generateMovieMetadata } from './services/geminiService';

export default function App() {
  const [resources, setResources] = useState<MovieResource[]>(INITIAL_RESOURCES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  
  // Viewing State
  const [selectedResource, setSelectedResource] = useState<MovieResource | null>(null);

  // Action State (Replaces Context Menu)
  const [activeResourceId, setActiveResourceId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingResource, setEditingResource] = useState<MovieResource | null>(null);
  
  // Long Press Refs
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressTriggered = useRef(false);

  // Ingest State
  const [inputTitle, setInputTitle] = useState('');
  const [inputLink, setInputLink] = useState('');
  const [inputGenres, setInputGenres] = useState<string[]>([]);
  const [inputCountry, setInputCountry] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Handlers ---

  const toggleGenre = (genre: string) => {
    setInputGenres(prev => 
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleIngest = async () => {
    if (!inputTitle.trim()) return;
    
    setIsProcessing(true);
    
    // 1. Generate ID
    const newId = `M${(resources.length + 1).toString().padStart(3, '0')}`;
    
    // 2. AI Generation
    const metadata = await generateMovieMetadata(inputTitle);
    
    // 3. Construct Resource
    const newResource: MovieResource = {
        id: newId,
        title: inputTitle,
        link: inputLink || '#',
        posterUrl: `https://picsum.photos/400/600?random=${newId}`, // Placeholder
        year: metadata.year || new Date().getFullYear(),
        director: metadata.director || "未知",
        // Use manual genre input if provided, otherwise fall back to AI
        genre: inputGenres.length > 0 ? inputGenres : (metadata.genre || ["未分类"]),
        country: inputCountry || "未知",
        synopsis: metadata.synopsis || "暂无数据。",
        styleKeywords: metadata.styleKeywords || ["原始"],
        systemNotes: metadata.systemNotes || "手动录入条目。"
    };

    setResources(prev => [...prev, newResource]);
    
    // Reset inputs
    setInputTitle('');
    setInputLink('');
    setInputGenres([]);
    setInputCountry('');
    setIsProcessing(false);
  };

  const handleUpdateResource = (updated: MovieResource) => {
      setResources(prev => prev.map(r => r.id === updated.id ? updated : r));
      setEditingResource(null);
  };

  const handleDeleteResource = (id: string) => {
      setResources(prev => prev.filter(r => r.id !== id));
      setActiveResourceId(null);
      setDeleteConfirmId(null);
  };

  // --- Long Press / Action Menu Logic ---

  const handleContextMenu = (e: React.MouseEvent, resource: MovieResource) => {
      e.preventDefault();
      setActiveResourceId(resource.id);
      setDeleteConfirmId(null);
  };

  const handleTouchStart = (e: React.TouchEvent, resource: MovieResource) => {
      isLongPressTriggered.current = false;
      
      longPressTimer.current = setTimeout(() => {
          isLongPressTriggered.current = true;
          setActiveResourceId(resource.id);
          setDeleteConfirmId(null);
      }, 600); // 600ms for long press
  };

  const handleTouchEnd = () => {
      if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
      }
  };

  const handleResourceClick = (resource: MovieResource) => {
      if (isLongPressTriggered.current) {
          isLongPressTriggered.current = false;
          return;
      }
      setSelectedResource(resource);
  };

  // --- Filtering ---

  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            resource.director.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesGenre = selectedGenre ? resource.genre.includes(selectedGenre) : true;

      return matchesSearch && matchesGenre;
    }).sort((a, b) => a.title.localeCompare(b.title));
  }, [searchQuery, selectedGenre, resources]);

  const groupedResources = useMemo(() => {
    const groups: { [key: string]: MovieResource[] } = {};
    filteredResources.forEach(res => {
      const letter = res.title[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(res);
    });
    return groups;
  }, [filteredResources]);

  const sortedKeys = Object.keys(groupedResources).sort();

  return (
    <div 
        className="min-h-screen bg-black text-slate-200 overflow-x-hidden font-mono selection:bg-archive-red selection:text-white"
        onClick={() => {
            // Close active overlay if clicking outside
            if (activeResourceId) setActiveResourceId(null);
        }} 
    >
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-archive-green/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-noise opacity-[0.03]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row min-h-screen">
        
        {/* Sidebar / Left Control Panel */}
        <aside className="w-full md:w-64 border-r border-slate-800 bg-black/50 backdrop-blur-sm md:fixed md:h-screen p-8 flex flex-col justify-between">
          <div>
            <div className="mb-12">
               <h1 className="font-mono text-2xl font-bold tracking-tighter text-white uppercase">
                 ARCHIVE 001
               </h1>
               <h2 className="text-archive-red font-mono text-xs tracking-[0.2em] mt-2 uppercase">
                 资源库
               </h2>
            </div>
          </div>
          
          <div className="mt-8 md:mt-0 font-mono text-[10px] text-slate-600">
            <p>系统状态: 稳定</p>
            <p>档案 ID: 99-XA-21</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 p-6 md:p-12">
          
          {/* Top Bar: Data Ingestion & Search */}
          <header className="mb-12 border-b border-slate-800 pb-8">
             <div className="flex flex-col xl:flex-row gap-12 justify-between items-start">
                
                {/* Ingest Section */}
                <div className="w-full xl:w-3/5 bg-slate-900/30 p-6 border border-slate-800/50">
                    <div className="flex items-center justify-between mb-6">
                        <label className="text-xs font-mono text-archive-red uppercase tracking-widest animate-pulse">
                        新数据录入 //
                        </label>
                        {isProcessing && <span className="text-xs font-mono text-archive-red">扫描中...</span>}
                    </div>
                    
                    <div className="space-y-6">
                        {/* Row 1: Title and Link */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group">
                                <span className="block text-[10px] text-slate-500 mb-1">资源名称 *</span>
                                <input
                                    type="text"
                                    value={inputTitle}
                                    onChange={(e) => setInputTitle(e.target.value)}
                                    placeholder="输入影片名称"
                                    className="w-full bg-transparent border-b border-slate-700 text-sm font-mono text-white placeholder-slate-800 focus:outline-none focus:border-archive-red transition-colors py-1"
                                />
                            </div>
                            <div className="group">
                                <span className="block text-[10px] text-slate-500 mb-1">网盘链接</span>
                                <input
                                    type="text"
                                    value={inputLink}
                                    onChange={(e) => setInputLink(e.target.value)}
                                    placeholder="HTTPS://"
                                    className="w-full bg-transparent border-b border-slate-700 text-sm font-mono text-white placeholder-slate-800 focus:outline-none focus:border-archive-red transition-colors py-1"
                                />
                            </div>
                        </div>

                        {/* Row 2: Country and Genre */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {/* Country Select */}
                            <div className="group md:col-span-1">
                                <span className="block text-[10px] text-slate-500 mb-1">国家/地区</span>
                                <select
                                    value={inputCountry}
                                    onChange={(e) => setInputCountry(e.target.value)}
                                    className="w-full bg-transparent border-b border-slate-700 text-sm font-mono text-slate-300 focus:outline-none focus:border-archive-red transition-colors py-1 appearance-none cursor-pointer"
                                >
                                    <option value="" className="bg-black">选择国家</option>
                                    {COUNTRY_OPTIONS.map(country => (
                                        <option key={country} value={country} className="bg-black">{country}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Genre Multi-Select */}
                            <div className="group md:col-span-3">
                                <span className="block text-[10px] text-slate-500 mb-2">类型 (多选)</span>
                                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto custom-scrollbar">
                                    {GENRE_OPTIONS.map(genre => (
                                        <button
                                            key={genre}
                                            onClick={() => toggleGenre(genre)}
                                            className={`px-3 py-1 text-[10px] border transition-all duration-200 uppercase tracking-wider ${
                                                inputGenres.includes(genre)
                                                ? 'bg-archive-red/20 border-archive-red text-white'
                                                : 'bg-transparent border-slate-700 text-slate-500 hover:border-slate-500'
                                            }`}
                                        >
                                            {inputGenres.includes(genre) ? '[x] ' : ''}{genre}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleIngest}
                            disabled={isProcessing || !inputTitle}
                            className="w-full mt-4 py-3 border border-slate-700 hover:border-archive-red hover:bg-archive-red/10 text-xs font-mono text-slate-400 hover:text-white uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed text-center shadow-lg"
                        >
                            {isProcessing ? '扫描数据库中...' : '归档资源 [保存]'}
                        </button>
                    </div>
                </div>

                {/* Search & Filter Section */}
                <div className="w-full xl:w-1/3 text-right space-y-6">
                    
                    {/* Genre Filter */}
                    <div>
                        <label className="block text-xs font-mono text-slate-500 mb-2 uppercase tracking-widest">
                        类型筛选
                        </label>
                        <div className="relative group inline-block w-full">
                            <select
                                value={selectedGenre}
                                onChange={(e) => setSelectedGenre(e.target.value)}
                                className="w-full bg-transparent border-b border-slate-700 text-sm font-mono text-slate-300 focus:outline-none focus:border-archive-red transition-colors py-2 text-right appearance-none cursor-pointer"
                            >
                                <option value="" className="bg-black text-slate-500">所有档案 // ALL</option>
                                {GENRE_OPTIONS.map(genre => (
                                    <option key={genre} value={genre} className="bg-black">{genre}</option>
                                ))}
                            </select>
                             <div className="absolute right-0 bottom-2 w-1 h-1 bg-slate-600 pointer-events-none opacity-50"></div>
                        </div>
                    </div>

                    {/* Text Search */}
                    <div>
                        <label className="block text-xs font-mono text-slate-500 mb-2 uppercase tracking-widest">
                        关键词搜索
                        </label>
                        <div className="relative group inline-block w-full">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="输入..."
                            className="w-full bg-transparent border-b border-slate-700 text-lg font-mono text-white placeholder-slate-800 focus:outline-none focus:border-archive-red transition-colors py-2 text-right"
                        />
                        <div className="absolute right-0 bottom-2 w-1 h-1 bg-archive-red opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-end gap-4 text-[10px] font-mono text-slate-600">
                        <p>已收录: <span className="text-slate-400">{filteredResources.length}</span></p>
                        <p>排序: <span className="text-archive-red">首字母</span></p>
                    </div>
                </div>
             </div>
          </header>

          {/* Alphabetical Grid */}
          <div className="space-y-16">
            {sortedKeys.map(letter => (
              <section key={letter} className="relative pl-8 md:pl-0">
                {/* Large background letter */}
                <h3 className="absolute -left-2 -top-8 text-[6rem] font-mono font-bold text-slate-800/20 pointer-events-none select-none">
                  {letter}
                </h3>
                
                {/* Grid */}
                <div className="relative z-10 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-x-4 gap-y-8">
                  {groupedResources[letter].map(movie => (
                    <div 
                      key={movie.id}
                      className="group relative select-none"
                      onContextMenu={(e) => handleContextMenu(e, movie)}
                      onTouchStart={(e) => handleTouchStart(e, movie)}
                      onTouchEnd={handleTouchEnd}
                    >
                      {/* ACTION OVERLAY (Visible only when Long Pressed / Right Clicked) */}
                      {activeResourceId === movie.id && (
                          <div 
                              className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3 border border-archive-red/30 animate-in fade-in duration-200"
                              onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveResourceId(null); // Dismiss on background click
                              }}
                          >
                                <div className="text-[9px] text-slate-500 font-mono tracking-widest uppercase mb-1">
                                    操作 ACTION
                                </div>
                                
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingResource(movie);
                                        setActiveResourceId(null);
                                    }}
                                    className="px-3 py-1.5 w-[85%] border border-slate-600 text-[10px] font-mono text-slate-300 hover:bg-slate-800 hover:text-white transition-colors uppercase tracking-widest"
                                >
                                    编辑 EDIT
                                </button>
                                
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (deleteConfirmId === movie.id) {
                                            handleDeleteResource(movie.id);
                                        } else {
                                            setDeleteConfirmId(movie.id);
                                        }
                                    }}
                                    className={`px-3 py-1.5 w-[85%] border text-[10px] font-mono uppercase tracking-widest transition-all ${
                                        deleteConfirmId === movie.id 
                                        ? 'bg-red-950 border-red-500 text-red-500 animate-pulse' 
                                        : 'bg-transparent border-slate-600 text-slate-300 hover:border-red-500 hover:text-red-500'
                                    }`}
                                >
                                    {deleteConfirmId === movie.id ? '确认? SURE?' : '删除 DELETE'}
                                </button>
                          </div>
                      )}

                      {/* Image Container - Clicking this opens the LINK directly */}
                      <a 
                        href={movie.link || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block relative aspect-[2/3] overflow-hidden mb-2 border border-slate-800 group-hover:border-archive-red transition-colors duration-500 bg-slate-900"
                      >
                        <img 
                          src={movie.posterUrl} 
                          alt={movie.title}
                          className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                        />
                        {/* Overlay scanlines */}
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        
                        {/* Hover Overlay Icon */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 pointer-events-none">
                           <span className="text-white text-[10px] font-mono tracking-widest border border-white/50 px-2 py-1 uppercase">打开链接 ↗</span>
                        </div>
                      </a>

                      {/* Metadata Container - Clicking this opens the MODAL */}
                      <div 
                        onClick={() => handleResourceClick(movie)}
                        className="flex flex-col border-t border-slate-800 pt-2 group-hover:border-slate-600 transition-colors cursor-pointer"
                      >
                        <h4 className="font-mono text-[10px] md:text-xs font-bold text-slate-300 group-hover:text-archive-red transition-colors truncate uppercase tracking-tight">
                            {movie.title}
                        </h4>
                        <div className="flex justify-between items-center mt-1">
                            <span className="font-mono text-[8px] text-slate-500 uppercase truncate max-w-[70%]">{movie.genre[0]}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {filteredResources.length === 0 && (
              <div className="text-center py-20 border border-dashed border-slate-800">
                <p className="font-mono text-slate-500">归档中未找到记录。</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* View Modal */}
      {selectedResource && (
        <ResourceModal 
          resource={selectedResource} 
          onClose={() => setSelectedResource(null)} 
        />
      )}

      {/* Edit Modal */}
      {editingResource && (
        <EditResourceModal 
          resource={editingResource} 
          onSave={handleUpdateResource}
          onClose={() => setEditingResource(null)} 
        />
      )}
    </div>
  );
}