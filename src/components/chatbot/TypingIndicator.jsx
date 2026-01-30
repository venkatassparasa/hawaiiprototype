import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div className="flex-shrink-0 w-8 h-8 bg-hawaii-ocean rounded-full flex items-center justify-center">
        <div className="w-4 h-4 bg-white rounded-sm"></div>
      </div>
      
      <div className="flex-1">
        <div className="bg-slate-100 rounded-lg px-4 py-3 inline-block">
          <div className="flex items-center gap-1">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-sm text-slate-500 ml-2">Assistant is typing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
