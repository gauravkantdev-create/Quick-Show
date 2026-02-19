import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'

// Suppress development key warning in console
if (import.meta.env.DEV) {
  const originalWarn = console.warn
  console.warn = (...args) => {
    if (args[0]?.includes?.('Clerk: Clerk has been loaded with development keys')) return
    originalWarn(...args)
  }
}

// Import your Publishable Key for clerk for login 
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

createRoot(document.getElementById('root')).render(
  <ClerkProvider 
    publishableKey={PUBLISHABLE_KEY}
    appearance={{
      elements: {
        formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
        card: 'shadow-lg',
      }
    }}
    localization={{
      phoneInputPlaceholder: '+91 98765 43210'
    }}
    telemetry={false}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>
)
