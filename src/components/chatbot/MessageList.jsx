import React, { useRef, useEffect } from 'react';
import { User, Bot, AlertCircle } from 'lucide-react';

const MessageList = ({ messages, isTyping }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (messages.length === 0 && !isTyping) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-hawaii-ocean rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">
            TVR/STR Assistant
          </h3>
          <p className="text-slate-600 text-sm">
            I can help you with questions about TVR registration, compliance, enforcement, and Ordinance 25-50 in Hawaii County.
          </p>
          <div className="mt-4 text-xs text-slate-500">
            <p className="mb-2">I can answer questions about:</p>
            <ul className="text-left space-y-1">
              <li>• TVR registration process and requirements</li>
              <li>• Compliance rules and regulations</li>
              <li>• Enforcement actions and violations</li>
              <li>• Ordinance 25-50 and zoning codes</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex items-start gap-3 ${
            message.sender === 'user' ? 'flex-row-reverse' : ''
          }`}
        >
          {/* Avatar */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            message.sender === 'user' 
              ? 'bg-slate-600 text-white' 
              : 'bg-hawaii-ocean text-white'
          }`}>
            {message.sender === 'user' ? (
              <User className="w-4 h-4" />
            ) : (
              <Bot className="w-4 h-4" />
            )}
          </div>

          {/* Message Content */}
          <div className={`flex-1 max-w-xs md:max-w-md lg:max-w-lg ${
            message.sender === 'user' ? 'text-right' : ''
          }`}>
            <div className={`inline-block px-4 py-3 rounded-lg ${
              message.sender === 'user'
                ? 'bg-hawaii-ocean text-white'
                : message.isOutOfScope
                ? 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                : 'bg-slate-100 text-slate-800'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              
              {/* Out of scope indicator */}
              {message.isOutOfScope && (
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <AlertCircle className="w-3 h-3" />
                  <span>Limited to TVR/STR topics</span>
                </div>
              )}
            </div>
            
            {/* Timestamp */}
            <div className={`mt-1 text-xs text-slate-500 ${
              message.sender === 'user' ? 'text-right' : ''
            }`}>
              {formatTime(message.timestamp)}
            </div>
          </div>
        </div>
      ))}

      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-hawaii-ocean rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="bg-slate-100 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-sm text-slate-500">Assistant is typing</span>
            </div>
          </div>
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
