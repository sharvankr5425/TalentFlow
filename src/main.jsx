import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { seedDatabase } from './lib/db.js';

// Create a client
const queryClient = new QueryClient();

async function enableMocking() {
 
  const { worker } = await import('./mocks/browser');
 
  // THE FIX IS HERE: We are telling MSW to bypass any requests
  // that do not have a matching handler. This prevents it from
  // blocking the main HTML page request.
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

// Seed the database, then enable mocking, then render the app.
seedDatabase().then(() => {
    enableMocking().then(() => {
        ReactDOM.createRoot(document.getElementById('root')).render(
            <React.StrictMode>
                <QueryClientProvider client={queryClient}>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </QueryClientProvider>
            </React.StrictMode>,
        );
    });
});


