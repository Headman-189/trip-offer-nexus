
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Log initialization for debugging
console.log("Application initializing...");

const rootElement = document.getElementById("root");
if (rootElement) {
  console.log("Root element found, rendering app...");
  createRoot(rootElement).render(<App />);
} else {
  console.error("Root element not found! Cannot mount React application.");
}
