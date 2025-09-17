import React from 'react';
import Header from './components/Header';
import ChatHistory from './components/ChatHistory';
import ChatInput from './components/ChatInput';

import './App.css';

function App() {
  return (
    <div className="app-container">
      <Header />
      <ChatHistory />
      <ChatInput />
    </div>
  );
}

export default App;