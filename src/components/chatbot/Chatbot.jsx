import React, { useState } from 'react';
import ChatButton from './ChatButton';
import ChatPanel from './ChatPanel';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      // When closing, reset unread count
      setUnreadCount(0);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setUnreadCount(0);
  };

  const handleMinimize = () => {
    setIsOpen(false);
    // Don't reset unread count when minimizing
  };

  return (
    <>
      <ChatButton 
        isOpen={isOpen} 
        onToggle={handleToggle} 
        unreadCount={unreadCount}
      />
      <ChatPanel 
        isOpen={isOpen} 
        onClose={handleClose} 
        onMinimize={handleMinimize}
      />
    </>
  );
};

export default Chatbot;
