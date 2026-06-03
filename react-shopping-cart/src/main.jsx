import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Optional global styles
import './index.css';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
