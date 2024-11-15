import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

const supabase = createClient(
"https://qnoescggtknwrtnvtbzj.supabase.co",
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFub2VzY2dndGtud3J0bnZ0YnpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2NDMxMDQsImV4cCI6MjA0NzIxOTEwNH0.e2PBcxAUPSW1C3MnC1jT5nRCxAY4MwXtfn2V5j3W2VI"
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
    <App />
    </SessionContextProvider>
  </StrictMode>
);
