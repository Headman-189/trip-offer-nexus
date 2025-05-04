
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import i18n from './i18n/config.ts';

// Forcer le français comme langue par défaut
i18n.changeLanguage('fr');
document.documentElement.lang = 'fr';

// Log initialization for debugging
console.log("Application initializing...");
console.log("Language set to:", i18n.language);

// Format de date français
if (Intl && Intl.DateTimeFormat) {
  Intl.DateTimeFormat().resolvedOptions().timeZone = 'Europe/Paris';
}

const rootElement = document.getElementById("root");
if (rootElement) {
  console.log("Root element found, rendering app...");
  createRoot(rootElement).render(<App />);
} else {
  console.error("Root element not found! Cannot mount React application.");
}
