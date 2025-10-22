// src/pages/AreaRestrita/AreaRestrita.tsx
import React, { useState } from 'react';
import './AreaRestrita.css';

const validarCnpj = (cnpj: string): boolean => {
  cnpj = cnpj.replace(/[^\d]+/g, '');
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  const calcDigito = (base: string, pesos: number[]): number => {
    let soma = 0;
    for(let i = 0; i < pesos.length; i++) {
      soma += parseInt(base.charAt(i)) * pesos[i];
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  }

  const base = cnpj.substr(0, 12);
  const digito1 = calcDigito(base, [5,4,3,2,9,8,7,6,5,4,3,2]);
  const digito2 = calcDigito(base + digito1, [6,5,4,3,2,9,8,7,6,5,4,3,2]);

  return cnpj === base + digito1.toString() + digito2.toString();
}

const AreaRestrita: React.FC = () => {
  const [cnpj, setCnpj] = useState('');
  const [isValidCnpj, setIsValidCnpj] = useState(false);
  const [showBI, setShowBI] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    value = value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18);

    setCnpj(value);
    setIsValidCnpj(validarCnpj(value));
    setTouched(true);
  };

  const handleConfirm = () => {
    if (isValidCnpj) {
      setShowBI(true);
    } else {
      alert('Por favor, digite um CNPJ válido.');
    }
  };

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
        {!showBI ? (
          <div className="cnpj-input-container">
            <label htmlFor="cnpj-input" className="cnpj-label">Digite seu CNPJ</label>
            <input
              type="text"
              id="cnpj-input"
              value={cnpj}
              onChange={handleCnpjChange}
              placeholder="00.000.000/0000-00"
              maxLength={18}
              className={`cnpj-input ${touched && !isValidCnpj ? 'input-error' : ''}`}
            />
            {touched && !cnpj && (
              <span className="error-message">Por favor, digite seu CNPJ</span>
            )}
            {touched && !isValidCnpj && cnpj && (
              <span className="error-message">CNPJ inválido</span>
            )}
            <button
              onClick={handleConfirm}
              className="confirm-btn"
              disabled={!isValidCnpj}
            >
              Confirmar
            </button>
          </div>
        ) : (
          <iframe
            src="https://app.powerbi.com/view?r=eyJrIjoiYjIxY2ZmZDEtN2Y3ZS00YzFjLWE3NGYtMGQ1MmZhNTUyMDUzIiwidCI6ImIxNDhmMTRjLTIzOTctNDAyYy1hYjZhLTFiNDcxMTE3N2FjMCJ9"
            title="Dashboard BI Purpura"
            className="area-restrita-iframe"
            frameBorder="0"
            allowFullScreen
          />
        )}
      </main>
    </div>
  );
};

export default AreaRestrita;
