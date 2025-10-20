// src/components/TypingIndicator/TypingIndicator.tsx
import React from 'react';
import './TypingIndicator.css';

const TypingIndicator: React.FC = () => {
  return (
    <div className="typing-indicator" role="status" aria-label="Digitando">
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
    </div>
  );
};

export default TypingIndicator;


