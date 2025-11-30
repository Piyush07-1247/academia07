import React, { useState, useRef } from 'react';
import { GlassCard, Button } from '../components/UI';
import { PenTool, Download, Copy, FileText, ChevronRight, Info } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface Question {
  number: number;
  question: string;
  answer: string;
}

const AITutor = () => {
  const [activeTab, setActiveTab] = useState<'input' | 'preview'>('input');
  
  // Inputs
  const [jsonInput, setJsonInput] = useState('');
  
  // Output
  const [resultData, setResultData] = useState<{ questions: Question[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const SYSTEM_PROMPT = `You will receive:
1. The chapter notes or PDF content.
2. The assignment questions.

Your task:
- Answer each question in about half a page (approx 150 words).
- Please write for max marks in exam form.
- Return the result in strictly JSON format.

JSON structure:
{
  "questions": [
    {
      "number": 1,
      "question": "<question text>",
      "answer": "<answer text>"
    }
  ]
}

Do NOT add anything outside the JSON. No markdown code blocks.`;

  const copyPrompt = () => {
    navigator.clipboard.writeText(SYSTEM_PROMPT);
    alert("System Prompt copied! Paste this into Gemini/ChatGPT along with your files.");
  };

  const processManualJson = () => {
    try {
      if (!jsonInput.trim()) {
         alert("Please paste the JSON output from Gemini first.");
         return;
      }
      
      // Attempt to clean markdown code blocks if the user pastes raw markdown
      const cleanJson = jsonInput.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const parsed = JSON.parse(cleanJson);
      if (!parsed.questions || !Array.isArray(parsed.questions)) throw new Error("Invalid format");
      setResultData(parsed);
      setActiveTab('preview');
    } catch (e) {
      alert("Invalid JSON format. Please ensure it matches the required structure.");
      console.error(e);
    }
  };

  const downloadPDF = async () => {
    if (!previewRef.current) return;
    setLoading(true);
    
    try {
        const element = previewRef.current;
        const canvas = await html2canvas(element, {
            scale: 2, // High res
            backgroundColor: '#ffffff',
            useCORS: true
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 0.9);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        // Calculate dimensions to fit A4 width
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
          heightLeft -= pdfHeight;
        }
        
        pdf.save('assignment_solution.pdf');
    } catch (e) {
        console.error(e);
        alert("Failed to generate PDF");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 flex items-center gap-3">
             <PenTool className="text-blue-400" /> AI Assignment Solver
          </h1>
          <p className="text-gray-400">Convert AI-generated answers into handwritten-style PDFs.</p>
        </div>
        
        {/* Step Indicator */}
        <div className="hidden md:flex gap-4 items-center bg-white/5 px-4 py-2 rounded-xl">
           <div className={`flex items-center gap-2 ${activeTab === 'input' ? 'text-blue-400' : 'text-gray-500'}`}>
              <div className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold">1</div>
              <span>Prompt & JSON</span>
           </div>
           <ChevronRight size={16} className="text-gray-600" />
           <div className={`flex items-center gap-2 ${activeTab === 'preview' ? 'text-blue-400' : 'text-gray-500'}`}>
              <div className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold">2</div>
              <span>Render PDF</span>
           </div>
        </div>
      </div>

      {activeTab === 'input' && (
        <div className="grid lg:grid-cols-2 gap-8 animate-fade-in">
           {/* Step 1: Prompt */}
           <GlassCard className="h-full bg-gradient-to-br from-purple-900/10 to-blue-900/10 border-blue-500/20">
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                    <Info size={24} />
                 </div>
                 <h2 className="text-xl font-bold">Step 1: Generate Content</h2>
              </div>
              <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                 Use Google Gemini, ChatGPT, or Claude to generate your assignment answers. 
                 Simply copy the System Prompt below and paste it into your AI tool along with your questions/notes.
              </p>
              
              <div className="bg-black/40 rounded-xl p-4 border border-white/10 relative group">
                 <pre className="text-xs text-gray-400 whitespace-pre-wrap font-mono h-48 overflow-y-auto custom-scrollbar">
                    {SYSTEM_PROMPT}
                 </pre>
                 <button 
                   onClick={copyPrompt}
                   className="absolute top-2 right-2 p-2 bg-blue-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-500 shadow-lg"
                   title="Copy to Clipboard"
                 >
                    <Copy size={16} />
                 </button>
              </div>
              
              <div className="mt-6 flex gap-2">
                 <a 
                   href="https://gemini.google.com/" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-center text-sm font-medium transition-colors border border-white/10"
                 >
                   Open Gemini ↗
                 </a>
                 <button 
                    onClick={copyPrompt}
                    className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-center text-sm font-medium transition-colors text-white shadow-lg shadow-blue-500/20"
                 >
                    Copy Prompt
                 </button>
              </div>
           </GlassCard>

           {/* Step 2: Input */}
           <GlassCard className="h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                    <FileText size={24} />
                 </div>
                 <h2 className="text-xl font-bold">Step 2: Paste JSON</h2>
              </div>
              
              <p className="text-gray-300 text-sm mb-4">
                 Paste the JSON response from the AI tool below.
              </p>

              <textarea 
                 className="flex-1 w-full bg-black/30 border border-white/10 rounded-xl p-4 text-sm font-mono text-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none min-h-[250px] resize-none"
                 placeholder='{ "questions": [ ... ] }'
                 value={jsonInput}
                 onChange={(e) => setJsonInput(e.target.value)}
              />
              
              <div className="mt-6 flex justify-end">
                 <Button onClick={processManualJson} className="w-full md:w-auto" icon={<PenTool size={18} />}>
                    Render Handwriting
                 </Button>
              </div>
           </GlassCard>
        </div>
      )}

      {activeTab === 'preview' && resultData && (
        <div className="animate-fade-in flex flex-col items-center">
           <div className="w-full flex justify-between items-center mb-6">
              <Button variant="outline" onClick={() => setActiveTab('input')}>
                 ← Back to Input
              </Button>
              <Button variant="secondary" onClick={downloadPDF} disabled={loading} icon={<Download />}>
                 {loading ? 'Converting...' : 'Download PDF'}
              </Button>
           </div>

           {/* Paper Preview Container */}
           <div className="overflow-auto w-full flex justify-center bg-gray-900/50 p-4 md:p-8 rounded-xl border border-white/5">
              <div 
                 ref={previewRef}
                 className="bg-white text-blue-900 font-handwriting text-xl leading-relaxed relative shadow-2xl"
                 style={{
                    width: '210mm',
                    minHeight: '297mm',
                    padding: '20mm',
                    backgroundImage: 'repeating-linear-gradient(transparent, transparent 29px, #a3c2e0 30px)',
                    backgroundAttachment: 'local',
                    lineHeight: '30px'
                 }}
              >
                 {/* Red Margin Line */}
                 <div className="absolute top-0 left-[20mm] bottom-0 w-px bg-red-300 h-full"></div>

                 {/* Content */}
                 <div className="relative z-10">
                    <div className="text-right text-gray-500 text-base mb-8">
                       Date: {new Date().toLocaleDateString()}
                    </div>
                    
                    {resultData.questions.map((q, idx) => (
                       <div key={idx} className="mb-8 break-inside-avoid">
                          <div className="font-bold text-black mb-2 flex gap-2">
                             <span>Q{q.number}.</span>
                             <span>{q.question}</span>
                          </div>
                          <div className="text-blue-900 pl-4 whitespace-pre-wrap">
                             {q.answer}
                          </div>
                       </div>
                    ))}
                    
                    <div className="mt-12 text-center text-gray-400 text-sm">
                       -- End of Assignment --
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AITutor;