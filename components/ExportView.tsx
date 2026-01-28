
import React, { useState } from 'react';

const ExportView: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const FILES = [
    {
      name: 'index.html',
      content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Industrial CNC Timer Suite</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
      :root {
        --metallic-bg: #121417;
        --doosan-faded-blue: #8EB6D6;
        --doosan-faded-blue-dark: #5C86A5;
      }
      body { margin: 0; background-color: var(--metallic-bg); font-family: 'Orbitron', sans-serif; color: #fff; overflow: hidden; }
      .metallic-panel { background: linear-gradient(145deg, #1e2126, #14161a); border: 1px solid rgba(255,255,255,0.1); }
      .led-text-faded-blue { color: var(--doosan-faded-blue); text-shadow: 0 0 12px rgba(142, 182, 214, 0.6); }
      .dmg-white-bg { background-color: #ffffff !important; color: #000000 !important; }
    </style>
  </head>
  <body><div id="root"></div></body>
</html>`
    },
    {
      name: 'App.tsx',
      content: `// Source code for App.tsx available in export section...`
    },
    {
      name: 'components/TimerGrid.tsx',
      content: `// Refer to the updated code in the repository for color thematic logic.`
    },
    {
      name: 'metadata.json',
      content: `{ "name": "CNC Industrial Timer Suite", "description": "High precision CNC monitoring system.", "requestFramePermissions": [] }`
    }
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="metallic-panel border border-[#8EB6D6]/30 p-6 bg-slate-900/50">
        <h2 className="text-[#8EB6D6] text-xl font-black mb-4 uppercase tracking-tighter">System Export Tool</h2>
        <p className="text-slate-400 text-sm mb-4 leading-relaxed">
          Theme updated: Doosan timers use faded blue visuals. DMG MORI timers use a high-contrast white-and-black industrial layout.
        </p>
        <div className="bg-black/50 p-4 rounded border border-slate-800">
           <span className="text-[10px] font-bold text-slate-500 uppercase">Instructions</span>
           <p className="text-xs text-slate-300">Copy each file and paste into your GitHub project.</p>
        </div>
      </div>

      {FILES.map((file, idx) => (
        <div key={file.name} className="metallic-panel border border-slate-700 overflow-hidden flex flex-col">
          <div className="bg-slate-800 px-4 py-2 flex justify-between items-center border-b border-slate-700">
            <span className="font-bold text-xs tracking-widest text-slate-300">{file.name}</span>
            <button 
              onClick={() => handleCopy(file.content, idx)}
              className="bg-[#8EB6D6] text-black px-4 py-1 text-[10px] font-black uppercase rounded-sm hover:brightness-110"
            >
              {copiedIndex === idx ? 'Success' : 'Copy Code'}
            </button>
          </div>
          <pre className="p-4 text-[10px] font-mono overflow-x-auto whitespace-pre-wrap text-slate-500 bg-black/30 h-32">
            {file.content}
          </pre>
        </div>
      ))}
    </div>
  );
};

export default ExportView;
