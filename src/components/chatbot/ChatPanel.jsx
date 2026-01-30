import React, { useState, useEffect } from 'react';
import { X, Minimize2, RotateCcw, Info } from 'lucide-react';
import { mockChatbotService } from '../../services/mockChatbotService';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatPanel = ({ isOpen, onClose, onMinimize }) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      startNewConversation();
      setUnreadCount(0);
    }
  }, [isOpen]);

  const startNewConversation = async () => {
    try {
      const result = await mockChatbotService.startConversation();
      if (result.success) {
        setConversationId(result.data.conversationId);
        setMessages([{
          id: 'welcome',
          sender: 'assistant',
          content: result.data.welcomeMessage,
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  const handleSendMessage = async (messageText) => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: messageText,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const result = await mockChatbotService.sendMessage(messageText, conversationId);
      
      if (result.success) {
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          content: result.data.message,
          timestamp: new Date().toISOString(),
          isOutOfScope: result.data.isOutOfScope
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setConversationId(result.data.conversationId);
        
        // Update unread count if panel is minimized
        if (!isOpen) {
          setUnreadCount(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    startNewConversation();
  };

  const handleMinimize = () => {
    onMinimize();
  };

  return (
    <div className={`fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-slate-200 flex flex-col z-50 transition-all duration-300 ${
      isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-hawaii-ocean text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <div>
            <h3 className="font-semibold">TVR/STR Assistant</h3>
            <p className="text-xs text-white/80">Hawaii County Compliance</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleNewChat}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            title="Start new chat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleMinimize}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            title="Minimize"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-700">
            I can only answer questions about TVR/STR topics in Hawaii County. Ask about registration, compliance, enforcement, or Ordinance 25-50.
          </p>
        </div>
      </div>

      {/* Messages */}
      <MessageList messages={messages} isTyping={isTyping} />

      {/* Input */}
      <MessageInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </div>
  );
};

export default ChatPanel;
