// src/pages/AreaRestrita.tsx
import React from 'react';
import './AreaRestrita.css';

const AreaRestrita: React.FC = () => {
  return (
    <div className="area-restrita-container">
      <header className="area-restrita-header">
        <img
          src="/logo.svg"
          alt="Purpura Logo"
          className="area-restrita-logo"
        />
        <h1 className="area-restrita-title">Purpura BI Dashboard</h1>
      </header>
      <main className="area-restrita-main">
        <iframe
          src="https://app.powerbi.com/view?r=eyJrIjoiYjIxY2ZmZDEtN2Y3ZS00YzFjLWE3NGYtMGQ1MmZhNTUyMDUzIiwidCI6ImIxNDhmMTRjLTIzOTctNDAyYy1hYjZhLTFiNDcxMTE3N2FjMCJ9"
          title="Dashboard BI Purpura"
          className="area-restrita-iframe"
          frameBorder="0"
          allowFullScreen
        />
      </main>
    </div>
  );
};

export default AreaRestrita;
