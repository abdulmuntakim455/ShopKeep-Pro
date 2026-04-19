import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Sparkles, Brain, TrendingUp, AlertTriangle, Lightbulb, RefreshCw, Zap } from 'lucide-react';

const AIAnalyst = ({ salesmanName }) => {
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState('');
    const [error, setError] = useState('');

    const generateAnalysis = async () => {
        setLoading(true);
        setError('');
        try {
            const url = salesmanName 
                ? `http://localhost:5000/api/ai/analysis?salesmanName=${encodeURIComponent(salesmanName)}`
                : 'http://localhost:5000/api/ai/analysis';
            const response = await fetch(url);
            const data = await response.json();
            if (data.analysis) {
                setAnalysis(data.analysis);
            } else {
                setError(data.message || 'Failed to get insights.');
            }
        } catch (err) {
            setError('Could not connect to the AI server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-20">
            {/* Hero Header */}
            <div className="relative bg-slate-900 rounded-[48px] p-8 md:p-12 overflow-hidden shadow-2xl shadow-indigo-200">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
                            <Zap size={14} className="text-indigo-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">{salesmanName ? 'AI Performance Coaching' : 'Advanced Business Intelligence'}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
                            Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-amber-400">{salesmanName ? 'Sales Coach' : 'Business Strategist'}</span>
                        </h1>
                        <p className="text-slate-400 font-medium text-lg leading-relaxed mb-8">
                            {salesmanName 
                                ? `Maximize your earnings, ${salesmanName}. The system analyzes your sales history and customers to help you hit your next commission target.`
                                : 'Experience next-generation "Vikaas Timber" analytics. Our AI scans your inventory, sales, and credit risks to generate specialized growth strategies.'}
                        </p>
                        <button 
                            onClick={generateAnalysis}
                            disabled={loading}
                            className={`group relative flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {loading ? <RefreshCw size={20} className="animate-spin" /> : <Brain size={20} className="group-hover:rotate-12 transition-transform" />}
                            {loading ? "Analyzing your shop..." : "Generate AI Insights"}
                        </button>
                    </div>

                    <div className="hidden md:block">
                        <div className="w-64 h-64 bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-[40px] flex items-center justify-center p-8 shadow-inner">
                            <div className={`p-8 bg-indigo-500/20 rounded-full ${loading ? 'animate-pulse' : ''}`}>
                                <Sparkles className="text-indigo-400" size={80} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl flex items-center gap-4 animate-in slide-in-from-top-2">
                    <AlertTriangle className="text-rose-500" />
                    <p className="font-bold text-rose-600 uppercase tracking-widest text-xs">{error}</p>
                </div>
            )}

            {/* Analysis Content */}
            {analysis && (
                <div className="bg-white rounded-[48px] border border-slate-100 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="p-8 md:p-12 prose prose-slate max-w-none">
                        <div className="flex items-center gap-3 mb-10 pb-6 border-b border-slate-50">
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Lightbulb size={24} /></div>
                            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight m-0">Strategic Intelligence Report</h2>
                        </div>
                        
                        <div className="ai-report-content font-medium text-slate-600 leading-loose">
                            <ReactMarkdown components={{
                                h1: ({node, ...props}) => <h1 className="text-3xl font-black text-slate-800 border-l-4 border-indigo-500 pl-4 mt-12 mb-6" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-xl font-black text-slate-700 uppercase tracking-widest mt-10 mb-4 bg-slate-50 px-4 py-3 rounded-xl inline-block" {...props} />,
                                h3: ({node, ...props}) => <h3 className="text-lg font-bold text-slate-800 mt-8 mb-2 flex items-center gap-2 before:content-['•'] before:text-amber-500" {...props} />,
                                p: ({node, ...props}) => <p className="mb-6 m-0" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-none space-y-3 mb-8 m-0 p-0" {...props} />,
                                li: ({node, ...props}) => <li className="flex items-start gap-3 m-0 bg-slate-50/50 p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors" {...props} />,
                                table: ({node, ...props}) => <div className="overflow-x-auto my-8 border border-slate-100 rounded-3xl"><table className="w-full text-left" {...props} /></div>,
                                th: ({node, ...props}) => <th className="bg-slate-50 p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100" {...props} />,
                                td: ({node, ...props}) => <td className="p-4 border-b border-slate-50 font-bold text-slate-800" {...props} />,
                                blockquote: ({node, ...props}) => <blockquote className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-3xl my-8 italic text-indigo-900" {...props} />
                            }}>
                                {analysis}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!analysis && !loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center text-center gap-4">
                        <div className="p-5 bg-amber-50 text-amber-500 rounded-[32px]"><TrendingUp size={32} /></div>
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-sm">Growth Analysis</h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-bold uppercase tracking-tight">Generate reports to understand your best products and categories.</p>
                    </div>
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center text-center gap-4">
                        <div className="p-5 bg-rose-50 text-rose-500 rounded-[32px]"><AlertTriangle size={32} /></div>
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-sm">Risk Assessment</h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-bold uppercase tracking-tight">Identify outstanding debts and high credit risks instantly.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIAnalyst;
