// src/components/DateSeparator.tsx
import React from 'react';
import './DateSeparator.css';

interface DateSeparatorProps {
  date: string;
}

const DateSeparator: React.FC<DateSeparatorProps> = ({ date }) => {
  return (
    <div className="date-separator">
      <span className="date-separator-text">{date}</span>
    </div>
  );
};

export default DateSeparator;