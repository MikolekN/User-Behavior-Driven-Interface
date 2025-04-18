import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router';
import ContextProviders from './context/ContextProviders';
import "./i18n";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ContextProviders>
            <RouterProvider
                router={router} 
            />
        </ContextProviders>
    </React.StrictMode>,
);
